export const WELLNESS_DATA = {
  safetyNotice: {
    title: 'Clinical Safety Boundary Notice',
    statement: 'Traditional wellness, herbal information, and dietary practices provided here are strictly for educational and general health awareness. They DO NOT diagnose, treat, or cure diabetic retinopathy. Diabetic Retinopathy requires prompt clinical evaluation and management by a qualified ophthalmologist. Wellness practices must never replace or delay professional medical care.',
    highRiskAlert: 'Your screening indicates a higher-risk retinal finding. Please consult an ophthalmologist promptly. Wellness information cannot replace medical treatment.'
  },
  lifestyleGuidelines: [
    {
      title: 'Optimal Glycemic & HbA1c Management',
      icon: 'Activity',
      summary: 'Consistent blood sugar control is the most scientifically proven method to decelerate retinal microvascular damage.',
      recommendations: [
        'Target HbA1c under 7.0% (as advised by your treating physician).',
        'Check fasting and post-meal glucose regularly at your local Primary Health Centre (PHC).',
        'Avoid sudden extreme glucose spikes by consuming balanced low-glycemic traditional foods.'
      ],
      reference: 'UK Prospective Diabetes Study (UKPDS 33) & DCCT Clinical Trials'
    },
    {
      title: 'Blood Pressure & Lipid Regulation',
      icon: 'Heart',
      summary: 'Hypertension accelerates retinal capillary leakage, flame hemorrhages, and macular edema.',
      recommendations: [
        'Maintain blood pressure target below 130/80 mmHg.',
        'Reduce dietary sodium by minimizing processed salt and salty pickles.',
        'Incorporate daily moderate walking (30 minutes) suited for rural routine.'
      ],
      reference: 'American Academy of Ophthalmology (AAO) Preferred Practice Patterns'
    },
    {
      title: 'Eye Hygiene & Visual Protection',
      icon: 'Eye',
      summary: 'Protecting the ocular surface from UV damage and excessive oxidative strain.',
      recommendations: [
        'Wear wide-brim hats or UV-protective sunglasses when working outdoors under direct sunlight.',
        'Practice 20-20-20 visual relaxation during intense close tasks.',
        'Never rub eyes vigorously; wash gently with clean potable water.'
      ],
      reference: 'National Eye Institute (NEI) & All India Ophthalmological Society (AIOS)'
    }
  ],
  herbalEducationalCards: [
    {
      id: 'karela',
      name: 'Bitter Gourd (Momordica charantia / பாகற்காய் / Karela)',
      category: 'Dietary Botanical',
      traditionalUse: 'Widely used in Siddha and Ayurveda as an adjunct dietary vegetable for balancing blood glucose.',
      scientificEvidence: 'Contains polypeptide-p (insulin-like protein) and charantin, shown in preliminary studies to assist peripheral glucose uptake. Does NOT repair damaged retinal capillaries.',
      safetyNote: 'Excessive consumption may cause hypoglycemia when taken alongside prescription insulin or sulfonylureas. Inform your physician.',
      reference: 'Journal of Ethnopharmacology & ICMR Traditional Medicine Division',
      suitableFor: 'General dietary inclusion in diabetes management.'
    },
    {
      id: 'amla',
      name: 'Indian Gooseberry (Phyllanthus emblica / நெல்லிக்காய் / Amla)',
      category: 'Antioxidant Rich Fruit',
      traditionalUse: 'Key component of traditional Rasayana formulations for vitality and ocular nourishment (Chakshushya).',
      scientificEvidence: 'High natural concentration of Ascorbic Acid (Vitamin C), ellagitannins, and flavonoids that reduce systemic oxidative stress. Supports general vascular health.',
      safetyNote: 'Safe in standard dietary amounts. Does not substitute for clinical antioxidant therapies or laser photocoagulation.',
      reference: 'Phytotherapy Research & PubMed ID: 29557436',
      suitableFor: 'Nutritional antioxidant support.'
    },
    {
      id: 'methi',
      name: 'Fenugreek Seeds (Trigonella foenum-graecum / வெந்தயம் / Methi)',
      category: 'Soluble Fiber Botanical',
      traditionalUse: 'Traditional South Indian culinary staple used to support digestion and metabolic balance.',
      scientificEvidence: 'High galactomannan soluble fiber content slows intestinal glucose absorption and improves post-prandial glycemic response.',
      safetyNote: 'May interact with anticoagulant medications. Moderate intake as part of balanced meals.',
      reference: 'International Journal of Vitamin and Nutrition Research',
      suitableFor: 'Post-meal blood sugar stabilization.'
    },
    {
      id: 'moringa',
      name: 'Drumstick Leaves (Moringa oleifera / முருங்கைக்கீரை)',
      category: 'Micronutrient Botanical',
      traditionalUse: 'Traditional South Indian greens celebrated for general stamina, iron, and ocular health.',
      scientificEvidence: 'Rich in lutein, zeaxanthin, beta-carotene, and quercetin. Lutein and zeaxanthin accumulate in macular pigments, filtering blue light.',
      safetyNote: 'Nutritious dietary leafy vegetable. Not a medicine for advanced proliferative retinopathy or macular edema.',
      reference: 'Food & Function (Royal Society of Chemistry) / ICMR Food Composition Tables',
      suitableFor: 'Macular carotenoid nutritional intake.'
    },
    {
      id: 'triphala',
      name: 'Triphala (Three Myrobalans / திரிபலா)',
      category: 'Classical Polyherbal Formulation',
      traditionalUse: 'Formulation of Haritaki, Bibhitaki, and Amalaki used in Ayurveda for systemic balance.',
      scientificEvidence: 'Demonstrates in vitro free radical scavenging and aldose reductase inhibitory activity in laboratory assays.',
      safetyNote: 'Commercial preparations vary in purity. Consult an AYUSH physician before taking standardized extracts. Never use as eye drops without sterile ophthalmic certification.',
      reference: 'Ayu Journal (AYUSH Ministry) & PubMed ID: 26862215',
      suitableFor: 'General wellness education.'
    }
  ]
};