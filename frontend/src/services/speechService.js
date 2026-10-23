export class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;

    if (typeof window !== 'undefined') {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  speak(text, lang = 'ta-IN') {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Search for matching voice
    const voices = this.synth.getVoices();
    const voice = voices.find(v => v.lang.includes(lang.slice(0, 2))) || voices[0];
    if (voice) utterance.voice = voice;

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) this.synth.cancel();
  }

  listen(onResult, onError, lang = 'ta-IN') {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use text input.');
      return;
    }

    this.recognition.lang = lang;
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      console.warn('[Speech Error]', event.error);
      if (onError) onError(event.error);
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn('Recognition already started:', err.message);
    }
  }

  stopListening() {
    if (this.recognition) {
      try { this.recognition.stop(); } catch(e){}
    }
  }
}

export const speechService = new SpeechService();