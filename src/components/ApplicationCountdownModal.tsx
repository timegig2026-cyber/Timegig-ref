import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Clock, Zap, MapPin } from 'lucide-react';
import { Gig } from '../types';

interface ApplicationCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: Gig | null;
  onAccepted: (gig: Gig) => void;
}

export const ApplicationCountdownModal: React.FC<ApplicationCountdownModalProps> = ({
  isOpen,
  onClose,
  gig,
  onAccepted,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAccepted, setIsAccepted] = useState(false);

  // Reset countdown whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(60);
      setIsAccepted(false);
    }
  }, [isOpen]);

  // 60-second timer countdown
  useEffect(() => {
    if (!isOpen || isAccepted) return;

    if (timeLeft <= 0) {
      // Auto accept when countdown finishes or prompt
      handleAccept();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAccept();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, isAccepted]);

  const handleAccept = () => {
    if (!gig) return;
    setIsAccepted(true);
    setTimeout(() => {
      onAccepted(gig);
      onClose();
    }, 1200);
  };

  if (!isOpen || !gig) return null;

  // Circular progress calculations (Radius = 58, Circumference ≈ 364.4)
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 60) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="countdown-title"
        className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center text-slate-900 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isAccepted ? (
          <div className="py-8 flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-black text-slate-950 mb-1">
              GiG Accepted!
            </h2>
            <p className="text-xs text-slate-600 max-w-xs mb-3">
              The owner accepted your request. Starting GPS navigation to destination...
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 fill-emerald-600" />
              <span>Routing navigation now</span>
            </div>
          </div>
        ) : (
          <>
            <h2 id="countdown-title" className="text-base font-bold text-slate-950 mb-1">
              Waiting for Gig Owner to Accept
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Owner has been alerted. Waiting for confirmation...
            </p>

            {/* Circular SVG 60-Second Countdown Loader */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-6">
              {/* Outer pulsing halo */}
              <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping opacity-60" />

              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 136 136">
                {/* Background Track Circle */}
                <circle
                  cx="68"
                  cy="68"
                  r={radius}
                  stroke="#f1f5f9"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="68"
                  cy="68"
                  r={radius}
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              {/* Center Countdown Display */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-950 font-mono tracking-tight">
                  {timeLeft}s
                </span>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Remaining
                </span>
              </div>
            </div>

            {/* Gig Info Summary */}
            <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl mb-4 text-left">
              <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                Target GiG
              </div>
              <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                {gig.title}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                <span className="truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                  <span className="truncate">{gig.locationName}</span>
                </span>
                <span className="font-mono font-bold text-emerald-700 shrink-0 ml-2">
                  R{gig.payRate}
                </span>
              </div>
            </div>

            {/* Action Buttons: Instant Simulation & Cancel */}
            <div className="w-full space-y-2">
              <button
                type="button"
                onClick={handleAccept}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate Owner Accept (Instant)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel Application
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
