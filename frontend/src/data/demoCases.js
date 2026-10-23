export const DEMO_CASES = [
  {
    id: 'demo-level0',
    name: 'Normal Healthy Retina',
    subtitle: 'Level 0 – No Diabetic Retinopathy',
    stage: 0,
    risk: 'Low Risk',
    badge: '🟢',
    description: 'Crisp optic disc margin, clear macula, normal branching retinal vessels, no microaneurysms or hemorrhages.',
    qualityScore: 94,
    confidence: 0.98,
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><circle cx="200" cy="200" r="180" fill="%238a2416"/><circle cx="120" cy="200" r="28" fill="%23fcd34d"/><circle cx="260" cy="200" r="20" fill="%235a140b"/><path d="M120 200 Q 160 140 260 130 M120 200 Q 170 260 270 270 M120 200 Q 80 140 50 120" stroke="%23450a0a" stroke-width="4" fill="none"/></svg>'
  },
  {
    id: 'demo-level1',
    name: 'Mild Non-Proliferative DR',
    subtitle: 'Level 1 – Mild NPDR',
    stage: 1,
    risk: 'Mild Risk',
    badge: '🟡',
    description: 'Early microvascular changes: isolated red microaneurysms detected in macular periphery.',
    qualityScore: 91,
    confidence: 0.93,
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><circle cx="200" cy="200" r="180" fill="%238a2416"/><circle cx="120" cy="200" r="28" fill="%23fcd34d"/><circle cx="260" cy="200" r="20" fill="%235a140b"/><path d="M120 200 Q 160 140 260 130 M120 200 Q 170 260 270 270" stroke="%23450a0a" stroke-width="4" fill="none"/><circle cx="230" cy="170" r="3" fill="%23dc2626"/><circle cx="280" cy="180" r="3" fill="%23dc2626"/><circle cx="240" cy="235" r="3" fill="%23dc2626"/></svg>'
  },
  {
    id: 'demo-level2',
    name: 'Moderate Non-Proliferative DR',
    subtitle: 'Level 2 – Moderate NPDR (Referable)',
    stage: 2,
    risk: 'Moderate / Referable Risk',
    badge: '🟠',
    description: 'Multiple microaneurysms, dot-blot intraretinal hemorrhages, and yellowish hard exudate clusters.',
    qualityScore: 88,
    confidence: 0.92,
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><circle cx="200" cy="200" r="180" fill="%238a2416"/><circle cx="120" cy="200" r="28" fill="%23fcd34d"/><circle cx="260" cy="200" r="20" fill="%235a140b"/><path d="M120 200 Q 160 140 260 130 M120 200 Q 170 260 270 270" stroke="%23450a0a" stroke-width="4" fill="none"/><circle cx="230" cy="165" r="4" fill="%23fef08a"/><circle cx="240" cy="170" r="4" fill="%23fef08a"/><circle cx="250" cy="160" r="4" fill="%23fef08a"/><circle cx="210" cy="240" r="5" fill="%23991b1b"/><circle cx="290" cy="230" r="5" fill="%23991b1b"/><circle cx="180" cy="170" r="3" fill="%23dc2626"/></svg>'
  },
  {
    id: 'demo-level3',
    name: 'Severe Non-Proliferative DR',
    subtitle: 'Level 3 – Severe NPDR',
    stage: 3,
    risk: 'High / Advanced Risk',
    badge: '🔴',
    description: '4-2-1 rule features: severe intraretinal blot hemorrhages across quadrants, venous beading, cotton wool ischemic spots.',
    qualityScore: 84,
    confidence: 0.95,
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><circle cx="200" cy="200" r="180" fill="%238a2416"/><circle cx="120" cy="200" r="28" fill="%23fcd34d"/><circle cx="260" cy="200" r="20" fill="%235a140b"/><circle cx="180" cy="130" r="7" fill="%237f1d1d"/><circle cx="210" cy="270" r="8" fill="%237f1d1d"/><circle cx="310" cy="200" r="7" fill="%237f1d1d"/><circle cx="150" cy="250" r="8" fill="%237f1d1d"/><circle cx="190" cy="160" r="6" fill="%23e2e8f0"/><circle cx="240" cy="140" r="7" fill="%23e2e8f0"/></svg>'
  },
  {
    id: 'demo-level4',
    name: 'Proliferative Diabetic Retinopathy',
    subtitle: 'Level 4 – Proliferative DR (Sight-Threatening)',
    stage: 4,
    risk: 'High / Advanced Risk',
    badge: '🔴',
    description: 'Neovascularization on optic disc (NVD) and elsewhere (NVE), preretinal/vitreous hemorrhage, fibrous proliferation.',
    qualityScore: 89,
    confidence: 0.98,
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><circle cx="200" cy="200" r="180" fill="%238a2416"/><circle cx="120" cy="200" r="28" fill="%23fcd34d"/><path d="M120 180 L 145 150 L 165 140 M120 220 L 150 250 L 175 260" stroke="%23dc2626" stroke-width="3" fill="none"/><path d="M220 220 Q 260 270 300 240 Z" fill="%23450a0a"/></svg>'
  },
  {
    id: 'demo-poor-quality',
    name: 'Low Quality Blur/Dark Artifact',
    subtitle: 'Ungradeable Image (< 50 Score)',
    stage: -1,
    risk: 'Ungradeable',
    badge: '⚠️',
    description: 'Severe camera motion blur, underexposed illumination. Triggers automated recapture guidance.',
    qualityScore: 42,
    confidence: 0.0,
    sampleImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><circle cx="200" cy="200" r="180" fill="%231e1b18"/><circle cx="120" cy="200" r="18" fill="%23453b20" opacity="0.3"/></svg>'
  }
];