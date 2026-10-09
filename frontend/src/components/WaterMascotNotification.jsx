import React, { useState, useEffect } from 'react';
import { Droplet, AlertTriangle, CheckCircle, Info, Sparkles, X, Volume2, VolumeX } from 'lucide-react';
import axios from 'axios';

// Web Audio API water droplet chime sound effect (no external mp3 file needed!)
const playWaterDropSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency slide mimicking a water droplet "bloop"
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {
    // Ignore audio permission restrictions
  }
};

export const DroppyCartoonSVG = ({ mood = 'happy', size = 96 }) => {
  const isAlert = mood === 'alert';
  const isWarning = mood === 'warning';
  const isCelebrate = mood === 'celebrate';

  return (
    <div className="relative inline-block select-none" style={{ width: size, height: size * 1.15 }}>
      {/* Expanding water ripple rings behind mascot */}
      <div className={`absolute inset-0 rounded-full scale-125 opacity-40 animate-ping pointer-events-none ${
        isAlert ? 'bg-rose-400' : isWarning ? 'bg-amber-400' : 'bg-cyan-300'
      }`} style={{ animationDuration: '2.5s' }} />

      {/* Water droplet SVG body */}
      <svg
        viewBox="0 0 120 140"
        className="w-full h-full filter drop-shadow-lg transition-transform duration-300 animate-droplet"
      >
        <defs>
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="alertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          <linearGradient id="warningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <linearGradient id="waterHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Droplet Outline Shape */}
        <path
          d="M 60 12 
             C 60 12, 98 62, 102 88 
             C 106 114, 86 132, 60 132 
             C 34 132, 14 114, 18 88 
             C 22 62, 60 12, 60 12 Z"
          fill={isAlert ? 'url(#alertGrad)' : isWarning ? 'url(#warningGrad)' : 'url(#waterGrad)'}
          stroke="#ffffff"
          strokeWidth="3.5"
        />

        {/* Glossy top-left light sheen reflection */}
        <path
          d="M 54 26 
             C 54 26, 32 60, 29 82 
             C 28 89, 32 94, 34 90 
             C 38 72, 54 44, 56 32 
             C 57 27, 55 24, 54 26 Z"
          fill="url(#waterHighlight)"
        />

        {/* Cartoon Eyes */}
        {isAlert ? (
          // Alert / Shocked eyes
          <g>
            <circle cx="44" cy="78" r="9" fill="#ffffff" />
            <circle cx="44" cy="78" r="5" fill="#0f172a" />
            <circle cx="42" cy="75" r="2" fill="#ffffff" />

            <circle cx="76" cy="78" r="9" fill="#ffffff" />
            <circle cx="76" cy="78" r="5" fill="#0f172a" />
            <circle cx="74" cy="75" r="2" fill="#ffffff" />

            {/* Sweat bead */}
            <path d="M 88 56 C 88 56, 92 64, 91 68 C 90 71, 87 71, 86 68 Z" fill="#93c5fd" />
          </g>
        ) : (
          // Cheerful blinking eyes
          <g className="animate-blink">
            <ellipse cx="44" cy="78" rx="7.5" ry="9" fill="#0f172a" />
            <circle cx="41.5" cy="74.5" r="3.2" fill="#ffffff" />
            <circle cx="46" cy="81.5" r="1.5" fill="#ffffff" />

            <ellipse cx="76" cy="78" rx="7.5" ry="9" fill="#0f172a" />
            <circle cx="73.5" cy="74.5" r="3.2" fill="#ffffff" />
            <circle cx="78" cy="81.5" r="1.5" fill="#ffffff" />
          </g>
        )}

        {/* Blush Cheeks */}
        <circle cx="33" cy="91" r="7" fill="url(#cheekGlow)" />
        <circle cx="87" cy="91" r="7" fill="url(#cheekGlow)" />

        {/* Cartoon Smile or O-Mouth */}
        {isAlert ? (
          <ellipse cx="60" cy="96" rx="6" ry="8" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
        ) : isCelebrate ? (
          <path
            d="M 48 91 Q 60 108 72 91 Z"
            fill="#dc2626"
            stroke="#0f172a"
            strokeWidth="2.5"
          />
        ) : (
          <path
            d="M 49 90 Q 60 102 71 90"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        )}

        {/* Tiny waving droplet hands */}
        <path
          d="M 17 84 Q 7 80 13 94 Q 18 90 17 84 Z"
          fill="#38bdf8"
          stroke="#ffffff"
          strokeWidth="1.5"
          className="animate-wiggle origin-right"
        />
        <path
          d="M 103 84 Q 113 80 107 94 Q 102 90 103 84 Z"
          fill="#38bdf8"
          stroke="#ffffff"
          strokeWidth="1.5"
          className="animate-wiggle origin-left"
        />

        {/* Party Hat if celebrating */}
        {isCelebrate && (
          <path d="M 60 12 L 50 35 L 70 35 Z" fill="#facc15" stroke="#f59e0b" strokeWidth="2" />
        )}
      </svg>

      {/* Floating mini water bubble */}
      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-200/80 border border-white animate-float" />
    </div>
  );
};

export const WaterMascotNotification = () => {
  const [currentNotif, setCurrentNotif] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  // Poll or fetch notifications
  useEffect(() => {
    fetchLatestNotification();
    const interval = setInterval(fetchLatestNotification, 12000);
    return () => clearInterval(interval);
  }, []);

  const fetchLatestNotification = async () => {
    try {
      const res = await axios.get('/api/notifications');
      const unread = res.data.notifications?.filter(n => !n.read) || [];
      if (unread.length > 0) {
        const latest = unread[0];
        // Trigger if new or not already showing
        if (!currentNotif || currentNotif._id !== latest._id) {
          setCurrentNotif(latest);
          setIsMinimized(false);
          if (soundEnabled) playWaterDropSound();
        }
      }
    } catch (e) {
      // Ignore if offline
    }
  };

  const markAsRead = async () => {
    if (currentNotif) {
      try {
        await axios.put(`/api/notifications/${currentNotif._id}/read`);
      } catch (e) {}
      setCurrentNotif(null);
    }
  };

  // Trigger demo cartoon animation on demand
  const triggerDemoAlert = async (type = 'leak') => {
    try {
      const res = await axios.post('/api/notifications/trigger-demo', { type });
      setCurrentNotif(res.data.notification);
      setIsMinimized(false);
      setIsOpenMenu(false);
      if (soundEnabled) playWaterDropSound();
    } catch (e) {
      // Local fallback preview
      const fallbacks = {
        leak: {
          title: '🚨 Pipe Anomaly Flagged in Block C!',
          message: 'Droppy noticed sudden surge of 480 L/hr. 91% leak probability calculated by Isolation Forest.',
          droppyMood: 'alert',
          priority: 'critical'
        },
        shortage: {
          title: '⚠️ Water Shortage Alert!',
          message: 'Expected shortage tomorrow is 4,300 Litres. Please schedule pump reservoir refill!',
          droppyMood: 'warning',
          priority: 'high'
        },
        tip: {
          title: '💧 Droppy\'s Conservation Tip',
          message: 'Fixing a dripping tap can save over 5,000 litres of fresh water each year!',
          droppyMood: 'happy',
          priority: 'low'
        },
        resolved: {
          title: '🎉 Issue Resolved!',
          message: 'Maintenance work on Main Riser CMP-2026-1048 successfully completed!',
          droppyMood: 'celebrate',
          priority: 'medium'
        }
      };
      setCurrentNotif({
        _id: 'demo-' + Date.now(),
        ...fallbacks[type]
      });
      setIsMinimized(false);
      setIsOpenMenu(false);
      if (soundEnabled) playWaterDropSound();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Cartoon Notification Card Pop Up */}
      {currentNotif && !isMinimized && (
        <div className="pointer-events-auto mb-3 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-cyan-200 overflow-hidden animate-pop-in transition-all duration-300">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-4 py-2 flex items-center justify-between text-white">
            <div className="flex items-center space-x-1.5 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin" style={{ animationDuration: '4s' }} />
              <span>HydroSense Smart Alert</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
                className="p-1 hover:bg-white/20 rounded transition"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize Droppy"
                className="p-1 hover:bg-white/20 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Mascot Body & Speech Bubble */}
          <div className="p-4 flex items-start space-x-3.5">
            {/* Animated Droppy Cartoon Mascot */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => triggerDemoAlert('happy')}>
              <DroppyCartoonSVG mood={currentNotif.droppyMood || 'happy'} size={76} />
            </div>

            {/* Notification Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  currentNotif.priority === 'critical'
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : currentNotif.priority === 'high'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                }`}>
                  {currentNotif.priority || 'Normal'}
                </span>
                <span className="text-[11px] text-slate-400">Just now</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {currentNotif.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {currentNotif.message}
              </p>

              <div className="mt-3 flex items-center space-x-2">
                <button
                  onClick={markAsRead}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95"
                >
                  Got It!
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Snooze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mascot Summoner Button (Always reachable in corner) */}
      <div className="pointer-events-auto relative">
        {isOpenMenu && (
          <div className="absolute bottom-16 right-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-cyan-200 p-3 mb-2 animate-pop-in z-50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <div className="flex items-center space-x-1.5">
                <Droplet className="w-4 h-4 text-sky-500 fill-sky-500" />
                <span className="text-xs font-bold text-slate-800">Droppy Alert Center</span>
              </div>
              <button onClick={() => setIsOpenMenu(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mb-2.5">
              Test animated water cartoon notification popups:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => triggerDemoAlert('leak')}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-medium text-left border border-rose-200 flex items-center space-x-1.5"
              >
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>AI Leak Alert</span>
              </button>
              <button
                onClick={() => triggerDemoAlert('shortage')}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-medium text-left border border-amber-200 flex items-center space-x-1.5"
              >
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Shortage Risk</span>
              </button>
              <button
                onClick={() => triggerDemoAlert('tip')}
                className="px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-xs font-medium text-left border border-cyan-200 flex items-center space-x-1.5"
              >
                <Droplet className="w-3 h-3 text-cyan-600" />
                <span>Water Tip</span>
              </button>
              <button
                onClick={() => triggerDemoAlert('resolved')}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-medium text-left border border-emerald-200 flex items-center space-x-1.5"
              >
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>Resolved Ticket</span>
              </button>
            </div>
          </div>
        )}

        {/* Mascot Avatar Trigger Button */}
        <button
          onClick={() => {
            if (isMinimized && currentNotif) {
              setIsMinimized(false);
            } else {
              setIsOpenMenu(!isOpenMenu);
            }
          }}
          className="group relative flex items-center bg-gradient-to-r from-sky-500 to-cyan-600 text-white pl-2 pr-4 py-1.5 rounded-full shadow-lg hover:shadow-cyan-500/40 border-2 border-white transition-all transform hover:scale-105 active:scale-95"
          title="Meet Droppy - AI Water Mascot"
        >
          {/* Animated Water Droplet Icon Avatar */}
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-2 relative">
            <DroppyCartoonSVG mood={currentNotif?.droppyMood || 'happy'} size={32} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-sky-600 rounded-full animate-ping" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-extrabold leading-none tracking-wide text-white flex items-center space-x-1">
              <span>Droppy Mascot</span>
            </div>
            <div className="text-[9px] text-cyan-100 leading-none mt-0.5">
              {currentNotif ? 'Alert Pending' : 'Live Assistant'}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default WaterMascotNotification;
