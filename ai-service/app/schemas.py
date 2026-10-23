from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ImagePayload(BaseModel):
    image_base64: Optional[str] = None
    sample_id: Optional[str] = None

class QualityResponse(BaseModel):
    quality_score: int
    quality_status: str
    is_gradable: bool
    sharpness: float
    illumination: float
    contrast: float
    fov: float
    noise: float
    recapture_guidance: List[str]

class PreprocessResponse(BaseModel):
    processed_image_base64: str
    clahe_metrics: Dict[str, float]

class EvidenceItem(BaseModel):
    type: str
    count: int
    severity: str
    description: str

class CrossCheckResponse(BaseModel):
    consistency: str
    consistency_score: float
    is_consistent: bool
    clinical_note: str

class FullScreeningResponse(BaseModel):
    quality: QualityResponse
    prediction: str
    prediction_level: int
    risk_level: str
    confidence: float
    evidence_findings: List[EvidenceItem]
    cross_check: CrossCheckResponse
    original_image_base64: Optional[str] = None
    clahe_image_base64: Optional[str] = None
    gradcam_heatmap_base64: Optional[str] = None
    gradcam_overlay_base64: Optional[str] = None
    timestamp: str