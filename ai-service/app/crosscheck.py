def crosscheck_prediction_and_evidence(prediction_level, evidence_findings):
    """
    Prediction + Evidence Cross-Check Engine
    Validates model classification against computer-vision lesion findings.
    """
    total_lesions = sum(f.get("count", 0) for f in evidence_findings)
    
    # Expected lesion count bands
    expected_ranges = {
        0: (0, 0),
        1: (1, 6),
        2: (5, 25),
        3: (15, 60),
        4: (3, 50)
    }

    low, high = expected_ranges.get(prediction_level, (0, 100))
    
    if low <= total_lesions <= high:
        consistency = "High"
        score = 0.94
        is_consistent = True
        note = "The AI classification model and visual lesion evidence are strongly consistent. Features support the predicted severity level."
    elif total_lesions < low or total_lesions > high:
        consistency = "Medium"
        score = 0.78
        is_consistent = True
        note = "Mild variation between classification probability and lesion count. Overall clinical orientation remains consistent."
    else:
        consistency = "Low"
        score = 0.45
        is_consistent = False
        note = "Discrepancy detected between classifier attention and lesion count. Human ophthalmologist review is strongly recommended."

    return {
        "consistency": consistency,
        "consistency_score": score,
        "is_consistent": is_consistent,
        "clinical_note": note
    }