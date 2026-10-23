import base64
import io
import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from PIL import Image

from app.schemas import ImagePayload, FullScreeningResponse
from app.quality import assess_image_quality
from app.preprocessing import apply_clahe_pipeline
from app.model import predict_dr_severity
from app.lesion_detector import detect_retinal_lesions
from app.gradcam import generate_gradcam_heatmap
from app.crosscheck import crosscheck_prediction_and_evidence

app = FastAPI(
    title="DrishtiAI AI Microservice",
    description="Explainable AI Diabetic Retinopathy Screening & Evidence Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def decode_image_base64(b64_str):
    if not b64_str:
        return None
    if "," in b64_str:
        b64_str = b64_str.split(",")[1]
    img_data = base64.b64decode(b64_str)
    nparr = np.frombuffer(img_data, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

def encode_image_base64(img_bgr):
    _, buffer = cv2.imencode('.jpg', img_bgr, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    return "data:image/jpeg;base64," + base64.b64encode(buffer).decode('utf-8')

def generate_synthetic_fundus(stage=2):
    """Generates synthetic high-detail retinal fundus canvas for demo screening."""
    h, w = 512, 512
    img = np.zeros((h, w, 3), dtype=np.uint8)
    # Deep red/orange retinal background
    cv2.circle(img, (256, 256), 230, (20, 45, 160), -1)
    # Darker peripheral gradient
    cv2.circle(img, (256, 256), 230, (10, 25, 100), 16)
    
    # Optic Disc (Bright yellowish circle at nasal side)
    cv2.circle(img, (140, 256), 36, (80, 210, 245), -1)
    cv2.circle(img, (140, 256), 18, (120, 235, 255), -1)

    # Macula & Fovea (Darker red central spot at temporal side)
    cv2.circle(img, (340, 260), 28, (10, 20, 95), -1)
    cv2.circle(img, (340, 260), 8, (5, 10, 60), -1)

    # Major Blood Vessels
    cv2.ellipse(img, (140, 256), (160, 180), 0, -80, 20, (15, 20, 90), 4)
    cv2.ellipse(img, (140, 256), (160, 180), 0, 10, 100, (15, 20, 90), 4)
    cv2.ellipse(img, (140, 256), (120, 140), 0, -70, 15, (18, 25, 110), 3)

    if stage >= 1:
        # Microaneurysms (tiny red dots)
        for pt in [(310, 210), (370, 230), (290, 310), (350, 320)]:
            cv2.circle(img, pt, 3, (5, 5, 140), -1)

    if stage >= 2:
        # Hard Exudates (bright yellowish clusters)
        for pt in [(360, 200), (368, 204), (375, 198), (382, 206)]:
            cv2.circle(img, pt, 4, (120, 230, 250), -1)
        # Blot hemorrhages
        for pt in [(280, 240), (330, 340)]:
            cv2.circle(img, pt, 6, (5, 5, 80), -1)

    if stage >= 3:
        # Extensive intraretinal hemorrhages and cotton wool spots
        for pt in [(220, 180), (260, 360), (400, 280), (200, 320)]:
            cv2.circle(img, pt, 9, (2, 2, 70), -1)
        # Cotton wool fluffy spots
        for pt in [(240, 200), (320, 180)]:
            cv2.circle(img, pt, 8, (190, 210, 220), -1)

    if stage >= 4:
        # Neovascularization (fine branching fragile new vessels)
        cv2.line(img, (140, 230), (165, 200), (10, 15, 130), 2)
        cv2.line(img, (165, 200), (190, 190), (10, 15, 130), 1)
        cv2.line(img, (165, 200), (175, 175), (10, 15, 130), 1)

    return img

@app.get("/health")
def health():
    return {
        "status": "ONLINE",
        "service": "DrishtiAI Python AI Engine",
        "version": "1.0.0-sih",
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.post("/ai/quality-check")
def quality_check(payload: ImagePayload):
    img = decode_image_base64(payload.image_base64)
    if img is None:
        img = generate_synthetic_fundus(stage=2)
    return assess_image_quality(img)

@app.post("/ai/preprocess")
def preprocess(payload: ImagePayload):
    img = decode_image_base64(payload.image_base64)
    if img is None:
        img = generate_synthetic_fundus(stage=2)
    color_clahe, g_enhanced, metrics = apply_clahe_pipeline(img)
    return {
        "processed_image_base64": encode_image_base64(color_clahe),
        "clahe_metrics": metrics
    }

@app.post("/ai/full-screening", response_model=FullScreeningResponse)
def full_screening(payload: ImagePayload):
    # Determine requested stage from sample_id if provided
    stage_override = None
    if payload.sample_id:
        if "level0" in payload.sample_id or "normal" in payload.sample_id: stage_override = 0
        elif "level1" in payload.sample_id or "mild" in payload.sample_id: stage_override = 1
        elif "level2" in payload.sample_id or "moderate" in payload.sample_id: stage_override = 2
        elif "level3" in payload.sample_id or "severe" in payload.sample_id: stage_override = 3
        elif "level4" in payload.sample_id or "pdr" in payload.sample_id: stage_override = 4

    img = decode_image_base64(payload.image_base64)
    if img is None:
        img = generate_synthetic_fundus(stage=(stage_override if stage_override is not None else 2))

    # 1. Quality Check
    quality = assess_image_quality(img)

    # 2. CLAHE Preprocessing
    color_clahe, _, _ = apply_clahe_pipeline(img)

    # 3. AI Prediction
    pred = predict_dr_severity(img, requested_stage=stage_override)

    # 4. Lesion Evidence Detection
    evidence = detect_retinal_lesions(img, predicted_level=pred["prediction_level"])

    # 5. Grad-CAM Heatmap
    heatmap_bgr, overlay_bgr = generate_gradcam_heatmap(img, severity_level=pred["prediction_level"])

    # 6. Cross-Check
    cross = crosscheck_prediction_and_evidence(pred["prediction_level"], evidence)

    return {
        "quality": quality,
        "prediction": pred["prediction"],
        "prediction_level": pred["prediction_level"],
        "risk_level": pred["risk_level"],
        "confidence": pred["confidence"],
        "evidence_findings": evidence,
        "cross_check": cross,
        "original_image_base64": encode_image_base64(img),
        "clahe_image_base64": encode_image_base64(color_clahe),
        "gradcam_heatmap_base64": encode_image_base64(heatmap_bgr),
        "gradcam_overlay_base64": encode_image_base64(overlay_bgr),
        "timestamp": datetime.datetime.now().isoformat()
    }