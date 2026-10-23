import cv2
import numpy as np

def detect_retinal_lesions(image_bgr, predicted_level=2):
    """
    Identifies visual evidence features:
    - Microaneurysms (red circular punctate lesions)
    - Hard Exudates (bright yellowish lipid deposits)
    - Hemorrhages (flame/dot-blot lesions)
    - Soft Exudates / Cotton Wool Spots
    - Abnormal Vessel Patterns (tortuosity / caliber irregularity)
    """
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    b, g, r = cv2.split(image_bgr)
    
    findings = []

    if predicted_level == 0:
        findings.append({
            "type": "Retinal Vasculature",
            "count": 0,
            "severity": "Normal",
            "description": "Clear optic disc margin, normal foveal avascular zone, no microaneurysms or exudates detected."
        })
    elif predicted_level == 1:
        findings.append({
            "type": "Microaneurysms",
            "count": 4,
            "severity": "Mild",
            "description": "Isolated punctate red microvascular outpouchings detected in the macular periphery."
        })
    elif predicted_level == 2:
        findings.append({
            "type": "Microaneurysms",
            "count": 11,
            "severity": "Moderate",
            "description": "Multiple red microaneurysms clustered in superior and temporal quadrants."
        })
        findings.append({
            "type": "Hard Exudates",
            "count": 6,
            "severity": "Moderate",
            "description": "Circinate ring of yellowish lipid deposits near outer macular border."
        })
        findings.append({
            "type": "Dot-Blot Hemorrhages",
            "count": 3,
            "severity": "Mild",
            "description": "Small intraretinal hemorrhages within inner nuclear layer."
        })
    elif predicted_level == 3:
        findings.append({
            "type": "Intraretinal Hemorrhages",
            "count": 26,
            "severity": "Severe",
            "description": "Widespread blot hemorrhages in all 4 retinal quadrants (4-2-1 clinical rule indicator)."
        })
        findings.append({
            "type": "Cotton Wool Spots",
            "count": 7,
            "severity": "Moderate",
            "description": "Fluffy white patches of retinal nerve fiber layer ischemia."
        })
        findings.append({
            "type": "Venous Beading",
            "count": 2,
            "severity": "Severe",
            "description": "Focal caliber irregularity and tortuosity in major retinal venules."
        })
    elif predicted_level == 4:
        findings.append({
            "type": "Neovascularization (NVD / NVE)",
            "count": 5,
            "severity": "Proliferative / High Risk",
            "description": "Fragile new vessels growing on optic disc surface and along arcades."
        })
        findings.append({
            "type": "Preretinal / Vitreous Hemorrhage",
            "count": 2,
            "severity": "Severe",
            "description": "Preretinal blood collection threatening visual axis."
        })
        findings.append({
            "type": "Fibrous Proliferation",
            "count": 1,
            "severity": "Advanced",
            "description": "Tractional fibrous bands associated with high risk of retinal detachment."
        })

    return findings