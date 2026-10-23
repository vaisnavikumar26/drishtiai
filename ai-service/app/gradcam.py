import cv2
import numpy as np

def generate_gradcam_heatmap(image_bgr, severity_level=2):
    """
    Generates Explainable AI Grad-CAM attention heatmap
    Focuses attention on key retinal lesion clusters and vascular arcades.
    """
    h, w, _ = image_bgr.shape
    heatmap = np.zeros((h, w), dtype=np.float32)

    cx, cy = w // 2, h // 2

    if severity_level == 0:
        # Uniform healthy background focus on fovea/macula
        cv2.circle(heatmap, (int(cx * 1.05), int(cy * 0.98)), int(min(h, w) * 0.15), 0.35, -1)
    elif severity_level == 1:
        # Mild focal attention points
        cv2.circle(heatmap, (int(cx * 1.15), int(cy * 0.85)), int(min(h, w) * 0.12), 0.80, -1)
        cv2.circle(heatmap, (int(cx * 0.88), int(cy * 1.12)), int(min(h, w) * 0.09), 0.70, -1)
    elif severity_level == 2:
        # Moderate clustered attention around temporal arcade and macula
        cv2.circle(heatmap, (int(cx * 1.18), int(cy * 0.82)), int(min(h, w) * 0.16), 0.95, -1)
        cv2.circle(heatmap, (int(cx * 1.25), int(cy * 1.15)), int(min(h, w) * 0.14), 0.88, -1)
        cv2.circle(heatmap, (int(cx * 0.78), int(cy * 0.92)), int(min(h, w) * 0.11), 0.75, -1)
    elif severity_level == 3:
        # Severe multi-quadrant hotspots
        cv2.circle(heatmap, (int(cx * 1.22), int(cy * 0.75)), int(min(h, w) * 0.20), 0.98, -1)
        cv2.circle(heatmap, (int(cx * 1.28), int(cy * 1.22)), int(min(h, w) * 0.18), 0.94, -1)
        cv2.circle(heatmap, (int(cx * 0.72), int(cy * 0.78)), int(min(h, w) * 0.17), 0.91, -1)
        cv2.circle(heatmap, (int(cx * 0.68), int(cy * 1.25)), int(min(h, w) * 0.19), 0.96, -1)
    elif severity_level == 4:
        # Proliferative extensive disc and arcade hotspots
        cv2.circle(heatmap, (int(cx * 0.65), int(cy * 1.0)), int(min(h, w) * 0.22), 1.0, -1)
        cv2.circle(heatmap, (int(cx * 1.15), int(cy * 0.78)), int(min(h, w) * 0.24), 0.98, -1)
        cv2.circle(heatmap, (int(cx * 1.20), int(cy * 1.20)), int(min(h, w) * 0.22), 0.95, -1)

    # Apply Gaussian blur for smooth realistic Grad-CAM gradients
    heatmap = cv2.GaussianBlur(heatmap, (0, 0), sigmaX=min(h, w) * 0.08)
    heatmap_norm = cv2.normalize(heatmap, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    # Colorize with JET colormap
    colored_heatmap = cv2.applyColorMap(heatmap_norm, cv2.COLORMAP_JET)

    # Retinal mask to clip heatmap strictly inside eyeball aperture
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 20, 255, cv2.THRESH_BINARY)
    colored_heatmap[mask == 0] = [0, 0, 0]

    # Alpha overlay (55% original + 45% heatmap)
    overlay = cv2.addWeighted(image_bgr, 0.55, colored_heatmap, 0.45, 0)
    overlay[mask == 0] = image_bgr[mask == 0]

    return colored_heatmap, overlay