import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, X, MessageSquare } from 'lucide-react';
import { speechService } from '../services/speechService.js';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function VoiceAssistant() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      textEn: 'Hello! I am DrishtiAI Assistant. You can ask me about Diabetic Retinopathy, your screening results, what Mild or Severe means, or find nearby eye doctors in Tamil or English.',
      textTa: 'வணக்கம்! நான் திருஷ்டி AI உதவியாளர். கண் விழித்திரை பாதிப்பு, உங்கள் பரிசோதனை முடிவுகள், மற்றும் அருகிலுள்ள கண் மருத்துவர்கள் பற்றி தமிழில் கேட்கலாம்.'
    }
  ]);

  const quickQuestions = lang === 'ta' ? [
    'விழித்திரை பாதிப்பு (DR) என்றால் என்ன?',
    'மிதமான (Moderate) முடிவு என்றால் என்ன?',
    'அருகிலுள்ள கண் மருத்துவர் எங்கே உள்ளார்?',
    'கண் பரிசோதனை அறிக்கை எவ்வாறு பதிவிறக்குவது?'
  ] : [
    'What is Diabetic Retinopathy?',
    'What does Moderate DR mean?',
    'Where is the nearest eye hospital?',
    'How do I consult an ophthalmologist?'
  ];

  const handleSend = (textToSend = query) => {
    const q = (textToSend || '').trim();
    if (!q) return;

    // Add user query
    const userMsg = { sender: 'user', textEn: q, textTa: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    // Formulate AI response
    let replyEn = '';
    let replyTa = '';
    const lower = q.toLowerCase();

    if (lower.includes('what is') || lower.includes('retinopathy') || lower.includes('விழித்திரை') || lower.includes('என்ன')) {
      replyEn = 'Diabetic Retinopathy (DR) is a complication of diabetes where prolonged high blood sugar damages delicate retinal blood vessels. Early screening detects it before vision loss occurs.';
      replyTa = 'சர்க்கரை நோய் விழித்திரை பாதிப்பு (DR) என்பது நீரிழிவு நோயால் கண்ணின் விழித்திரை இரத்தக் குழாய்கள் சேதமடைவதாகும். ஆரம்பக் கட்ட பரிசோதனை பார்வை இழப்பைத் தடுக்கிறது.';
    } else if (lower.includes('moderate') || lower.includes('mild') || lower.includes('severe') || lower.includes('முடிவு') || lower.includes('மிதமான')) {
      replyEn = 'Screening levels range from Level 0 (No DR) to Level 4 (Proliferative). Moderate or Severe means early microaneurysms or hemorrhages were detected. You should consult an ophthalmologist promptly.';
      replyTa = 'பரிசோதனை நிலைகள் 0 முதல் 4 வரை உள்ளன. மிதமான அல்லது தீவிர பாதிப்பு எனில் சிறிய இரத்தக் கசிவுகள் உள்ளதாக AI கண்டறிந்துள்ளது. உடனடியாக கண் மருத்துவரை அணுக வேண்டும்.';
    } else if (lower.includes('hospital') || lower.includes('doctor') || lower.includes('clinic') || lower.includes('மருத்துவர்') || lower.includes('எங்கே')) {
      replyEn = 'You can find tertiary eye hospitals like Aravind Eye Hospital in Madurai/Coimbatore and Sankara Nethralaya in Chennai on our "Find Eye Care" page with direct consultation booking.';
      replyTa = 'எங்கள் "அருகிலுள்ள மருத்துவர்கள்" பக்கத்தில் அரவிந்த் கண் மருத்துவமனை மற்றும் சங்கர நேத்ராலயா போன்ற சிறப்பு மையங்களை எளிதில் கண்டறிந்து ஆலோசனை பதிவு செய்யலாம்.';
    } else {
      replyEn = 'Thank you for your question. DrishtiAI recommends keeping your blood sugar in check and getting an annual retinal screening. For direct clinical decisions, please consult an ophthalmologist.';
      replyTa = 'உங்கள் கேள்விக்கு நன்றி. இரத்த சர்க்கரை அளவை கட்டுப்பாட்டில் வைத்து வருடாந்திர கண் பரிசோதனை செய்ய பரிந்துரைக்கப்படுகிறது. நேரடி மருத்துவ முடிவுகளுக்கு மருத்துவரை அணுகவும்.';
    }

    const aiMsg = { sender: 'ai', textEn: replyEn, textTa: replyTa };
    setMessages(prev => [...prev, aiMsg]);

    // Speak AI response automatically
    const spokenText = lang === 'ta' ? replyTa : replyEn;
    const voiceLang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    speechService.speak(spokenText, voiceLang);
    setIsSpeaking(true);
  };

  const toggleMic = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const voiceLang = lang === 'ta' ? 'ta-IN' : 'en-IN';
      speechService.listen(
        (transcript) => {
          setIsListening(false);
          setQuery(transcript);
          handleSend(transcript);
        },
        (err) => {
          setIsListening(false);
          console.warn('Voice recognition error:', err);
        },
        voiceLang
      );
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-full shadow-2xl transition-all ${
          isOpen ? 'hidden' : 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white hover:scale-105 shadow-sky-500/30'
        }`}
      >
        <Sparkles className="w-5 h-5 animate-spin-slow" />
        <span className="text-xs font-bold tracking-wide">
          {lang === 'ta' ? 'AI குரல் உதவியாளர்' : 'AI Voice Assistant'}
        </span>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
      </button>

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-32px)] h-[520px] bg-slate-900 border border-sky-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border-b border-sky-900/40 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">{t('voice_assistant_title')}</h3>
                <p className="text-[10px] text-sky-400">Tamil (தமிழ்) & English Voice AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {isSpeaking ? (
                <button onClick={() => { speechService.stopSpeaking(); setIsSpeaking(false); }} className="p-1.5 text-sky-400 hover:text-white" title="Mute voice">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                </button>
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-sky-600 text-white rounded-br-none shadow' 
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                }`}>
                  <p>{lang === 'ta' ? m.textTa : m.textEn}</p>
                </div>
              </div>
            ))}

            {isListening && (
              <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-sky-950/60 border border-sky-500/30 text-sky-300 text-xs animate-pulse">
                <Mic className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>{t('voice_listening')}</span>
              </div>
            )}
          </div>

          {/* Quick Questions Chips */}
          <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800 flex overflow-x-auto space-x-1.5 no-scrollbar">
            {quickQuestions.map((qText, i) => (
              <button
                key={i}
                onClick={() => handleSend(qText)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] bg-slate-800/90 text-sky-300 hover:bg-sky-900/60 border border-slate-700/50 transition-colors"
              >
                {qText}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center space-x-2">
            <button
              onClick={toggleMic}
              className={`p-2.5 rounded-xl transition-all ${
                isListening 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-slate-800 text-sky-400 hover:bg-slate-700'
              }`}
              title="Click to Speak"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'ta' ? 'கேள்வி கேட்கவும்...' : 'Type your question...'}
              className="flex-1 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 rounded-xl bg-sky-600 text-white hover:bg-sky-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}