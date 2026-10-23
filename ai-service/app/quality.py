import cv2
import numpy as np

def assess_image_quality(image_bgr):
    """
    Weighted Image Quality Assessment formula:
    Quality Score = 0.30*Sharpness + 0.25*Illumination + 0.20*Contrast + 0.15*FoV + 0.10*Noise
    All normalized to 0-100 scale.
    """
    if image_bgr is None or image_bgr.size == 0:
        return {
            "quality_score": 0,
            "quality_status": "Invalid Image",
            "is_gradable": False,
            "sharpness": 0, "illumination": 0, "contrast": 0, "fov": 0, "noise": 0,
            "recapture_guidance": ["Ensure camera is properly connected and image file is valid."]
        }

    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape

    # 1. Sharpness (Laplacian variance)
    lap = cv2.Laplacian(gray, cv2.CV_64F)
    lap_var = lap.var()
    # Typical sharp retinal image has lap_var > 150
    sharpness_score = min(100.0, max(0.0, (lap_var / 250.0) * 100.0))

    # 2. Illumination (Mean brightness of non-background retina)
    _, mask = cv2.threshold(gray, 20, 255, cv2.THRESH_BINARY)
    retina_pixels = gray[mask > 0]
    if len(retina_pixels) > 0:
        mean_illum = np.mean(retina_pixels)
        # Optimal illumination is between 90 and 160
        illum_score = max(0.0, 100.0 - (abs(mean_illum - 125.0) * 1.2))
    else:
        illum_score = 10.0

    # 3. Contrast (RMS contrast / standard deviation)
    if len(retina_pixels) > 0:
        std_contrast = np.std(retina_pixels)
        contrast_score = min(100.0, (std_contrast / 55.0) * 100.0)
    else:
        contrast_score = 10.0

    # 4. Field of View (FoV circular aperture coverage)
    retina_area_ratio = len(retina_pixels) / float(h * w) if (h * w) > 0 else 0
    # Expected circular retina occupies ~45% to 75% of rectangular sensor frame
    fov_score = min(100.0, max(20.0, (retina_area_ratio / 0.60) * 100.0))

    # 5. Noise (High-frequency residual variance)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    noise_diff = cv2.absdiff(gray, blurred)
    mean_noise = np.mean(noise_diff)
    noise_score = max(0.0, 100.0 - (mean_noise * 6.0))

    # Weighted composite score
    total_score = int(round(
        0.30 * sharpness_score +
        0.25 * illum_score +
        0.20 * contrast_score +
        0.15 * fov_score +
        0.10 * noise_score
    ))
    total_score = max(5, min(99, total_score))

    recapture_tips = []
    if sharpness_score < 55:
        recapture_tips.append("Focus is blurred. Please steady the fundus scope and refocus on the retinal vessels.")
    if illum_score < 55:
        recapture_tips.append("Retinal illumination is uneven or dark. Adjust illumination LED intensity.")
    if fov_score < 45:
        recapture_tips.append("Retina is partially cut off. Center the optic disc and macula inside the frame.")
    if contrast_score < 50:
        recapture_tips.append("Low contrast detected. Avoid stray ambient light entering the eyepiece.")

    if total_score >= 70:
        status = "Good – Suitable for screening"
        is_gradable = True
    elif total_score >= 50:
        status = "Fair – Borderline quality (Screening with caution)"
        is_gradable = True
    else:
        status = "Ungradeable – Recapture Required"
        is_gradable = False
        if not recapture_tips:
            recapture_tips.append("Image quality insufficient for reliable AI screening. Please capture another image.")

    return {
        "quality_score": total_score,
        "quality_status": status,
        "is_gradable": is_gradable,
        "sharpness": round(sharpness_score, 1),
        "illumination": round(illum_score, 1),
        "contrast": round(contrast_score, 1),
        "fov": round(fov_score, 1),
        "noise": round(noise_score, 1),
        "recapture_guidance": recapture_tips
    }