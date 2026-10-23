const { v4: uuidv4 } = require('uuid');
const store = require('../config/db');

// 1. Get Conversation Messages
exports.getMessages = (req, res) => {
  const user = req.user;
  const { patientId, doctorId } = req.query;

  let messages = [...store.data.messages];

  if (user.role === 'patient') {
    messages = messages.filter(m => m.patientId === user.patientId);
  } else if (user.role === 'doctor') {
    if (patientId) {
      messages = messages.filter(m => m.patientId === patientId && (m.doctorId === user.id || !m.doctorId));
    } else {
      messages = messages.filter(m => m.doctorId === user.id);
    }
  } else if (user.role === 'admin') {
    if (patientId) messages = messages.filter(m => m.patientId === patientId);
    if (doctorId) messages = messages.filter(m => m.doctorId === doctorId);
  }

  messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return res.json({ total: messages.length, messages });
};

// 2. Send Message
exports.sendMessage = (req, res) => {
  const user = req.user;
  const { text, patientId, doctorId } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message text cannot be empty' });
  }

  const cleanText = text.trim();
  const targetPatientId = user.role === 'patient' ? user.patientId : patientId;
  const targetDoctorId = user.role === 'doctor' ? user.id : (doctorId || 'doc-1');

  if (!targetPatientId) {
    return res.status(400).json({ error: 'Patient ID is required for messaging' });
  }

  const newMsg = {
    messageId: 'msg-' + uuidv4().slice(0, 8),
    patientId: targetPatientId,
    doctorId: targetDoctorId,
    senderRole: user.role,
    senderName: user.name,
    text: cleanText,
    timestamp: new Date().toISOString(),
    read: false
  };

  store.data.messages.push(newMsg);
  store.save();

  return res.status(201).json({ message: 'Message sent', data: newMsg });
};
