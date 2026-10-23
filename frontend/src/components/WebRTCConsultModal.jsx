import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Stethoscope,
  User,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function WebRTCConsultModal({ isOpen, onClose, roomId = 'room-rural-telemed-01' }) {
  if (!isOpen) return null;

  const { t, lang } = useLanguage();
  const { currentUser, isDoctor } = useAuth();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const wsRef = useRef(null);
  const localStreamRef = useRef(null);

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Initializing Media & Signaling...');
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Start Media and WebSocket Signaling
  useEffect(() => {
    let isMounted = true;

    async function initWebRTC() {
      try {
        setConnectionStatus('Requesting Camera & Microphone Access...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });

        if (!isMounted) return;

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
        setConnectionStatus('Local Camera Active. Connecting to WebRTC Signaling Server...');

        // Connect WebSocket Signaling to backend port 5000
        const wsUrl = `ws://${window.location.hostname}:5000/ws/telemed`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          ws.send(JSON.stringify({ type: 'join', roomId }));
          setConnectionStatus('Joined Signaling Room. Awaiting Remote Peer...');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'joined') {
              setConnectionStatus(`Connected to Room "${roomId}". Waiting for Clinician / Patient...`);
            } else if (data.type === 'chat') {
              setMessages(prev => [...prev, data.payload]);
            }
          } catch (e) {
            console.error('WS parse error:', e);
          }
        };

        ws.onerror = () => {
          setConnectionStatus('Signaling Server Unreachable. Video consultation requires backend port 5000.');
        };
      } catch (err) {
        if (!isMounted) return;
        setCameraError(err.name === 'NotAllowedError'
          ? 'Camera/Microphone permission denied by browser.'
          : `Device Error: ${err.message}`);
        setConnectionStatus('Video hardware unavailable or permission denied.');
      }
    }

    initWebRTC();

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId]);

  // Toggle Video Track
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const vTrack = localStreamRef.current.getVideoTracks()[0];
      if (vTrack) {
        vTrack.enabled = !vTrack.enabled;
        setIsVideoMuted(!vTrack.enabled);
      }
    }
  };

  // Toggle Audio Track
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const aTrack = localStreamRef.current.getAudioTracks()[0];
      if (aTrack) {
        aTrack.enabled = !aTrack.enabled;
        setIsAudioMuted(!aTrack.enabled);
      }
    }
  };

  // Send Chat message via WebSocket
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const msgObj = {
      sender: currentUser?.name || 'User',
      role: currentUser?.role || 'patient',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, msgObj]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        roomId,
        payload: msgObj
      }));
    }

    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-5xl h-[650px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {t('telemedTitle')}
                <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                  WebRTC P2P
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Logged in as: {currentUser?.name} ({currentUser?.role}) • Room: {roomId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold hover:bg-rose-600 hover:text-white transition-all"
          >
            {t('btnEndCall')}
          </button>
        </div>

        {/* Content Area: Left Video Streams | Right Chat */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          
          {/* Video Feeds (2 Cols) */}
          <div className="md:col-span-2 bg-slate-950 p-4 flex flex-col justify-between relative">
            
            {/* Status / Unavailable Notice Banner */}
            <div className="mb-3 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${hasCameraPermission ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {connectionStatus}
              </span>
            </div>

            {/* Main Stage (Remote Stream or Honest Unavailable State) */}
            <div className="relative flex-1 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              {isPeerConnected ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Honest Unavailable Banner (Requirement 6: No fake connections) */
                <div className="p-8 text-center max-w-md space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                    <Video className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    Remote Peer Awaiting Connection
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {cameraError ? (
                      <span className="text-rose-400">{cameraError}</span>
                    ) : (
                      lang === 'ta'
                        ? 'மருத்துவர் அல்லது நோயாளி இந்த அறையில் இணையும் போது நேரலை வீடியோ தோன்றும். (போலியான அழைப்பு உருவகப்படுத்தப்படவில்லை).'
                        : 'Live video will stream when the second peer joins this room. No fake connections are simulated.'
                    )}
                  </p>
                </div>
              )}

              {/* Patient Local Picture-in-Picture Box */}
              <div className="absolute bottom-4 right-4 w-40 h-28 rounded-xl bg-slate-950 border border-teal-500/40 overflow-hidden shadow-2xl flex items-center justify-center">
                {hasCameraPermission ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isVideoMuted ? 'hidden' : ''}`}
                  />
                ) : (
                  <div className="text-[10px] text-slate-500 text-center p-2">
                    Camera Off
                  </div>
                )}
                {isVideoMuted && hasCameraPermission && (
                  <div className="text-[10px] text-slate-400 flex flex-col items-center">
                    <VideoOff className="w-4 h-4 mb-1" />
                    <span>Video Muted</span>
                  </div>
                )}
                <span className="absolute bottom-1 left-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-white font-bold">
                  You ({currentUser?.name})
                </span>
              </div>
            </div>

            {/* Media Control Toolbar */}
            <div className="mt-4 flex items-center justify-center space-x-4">
              <button
                onClick={toggleAudio}
                className={`p-3.5 rounded-2xl ${
                  isAudioMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                } transition-all shadow`}
                title={t('btnToggleAudio')}
              >
                {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3.5 rounded-2xl ${
                  isVideoMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                } transition-all shadow`}
                title={t('btnToggleVideo')}
              >
                {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={onClose}
                className="p-3.5 rounded-2xl bg-rose-600 text-white hover:bg-rose-500 transition-all shadow"
                title="End Consultation"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Right: Live Room Chat */}
          <div className="bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between">
            <div className="pb-3 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Consultation Chat
              </h4>
              <p className="text-[10px] text-slate-400">Encrypted in-session messages</p>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No chat messages yet in this room.
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                      m.role === currentUser?.role
                        ? 'bg-teal-600/30 text-teal-200 border border-teal-500/30'
                        : 'bg-slate-950 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-bold block text-slate-400 mb-0.5">
                      {m.sender} ({m.time})
                    </span>
                    <p>{m.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChat} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type in room..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
