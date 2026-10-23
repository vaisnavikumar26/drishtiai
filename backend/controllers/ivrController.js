exports.triggerIvrFollowup = (req, res) => {
  const { mobile, patientName, riskLevel, language = 'ta' } = req.body;
  const msgEn = `Hello ${patientName || 'Patient'}, DrishtiAI eye screening indicates ${riskLevel || 'follow-up recommended'}. Please visit your nearest eye doctor or primary health centre.`;
  const msgTa = `வணக்கம் ${patientName || 'அன்புள்ள நோயாளி'}, உங்கள் கண் பரிசோதனை முடிவில் மருத்துவ ஆலோசனை பரிந்துரைக்கப்படுகிறது. அருகிலுள்ள கண் மருத்துவரை அணுகவும்.`;

  res.json({
    status: 'DISPATCHED_TO_GATEWAY',
    provider: 'DrishtiAI Mock Twilio / Exotel Telephony Gateway',
    recipient: mobile,
    dispatchedMessage: language === 'ta' ? msgTa : msgEn,
    timestamp: new Date().toISOString()
  });
};