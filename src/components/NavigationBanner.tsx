import React, { useState, useEffect } from 'react';
import { Navigation, CheckCircle2, Lock, X, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { ActiveNavigation } from '../types';

interface NavigationBannerProps {
  navigation: ActiveNavigation;
  onCompleteGig: () => void;
  onCancelNavigation: () => void;
  onToggleOwnerMode?: (isOwner: boolean) => void;
}

export const NavigationBanner: React.FC<NavigationBannerProps> = ({
  navigation,
  onCompleteGig,
  onCancelNavigation,
  onToggleOwnerMode,
}) => {
  const [isOwnerView, setIsOwnerView] = useState(navigation.isOwner);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDetailsHidden, setIsDetailsHidden] = useState(false);

  const handleToggle = () => {
    const nextVal = !isOwnerView;
    setIsOwnerView(nextVal);
    if (onToggleOwnerMode) {
      onToggleOwnerMode(nextVal);
    }
  };

  const nextStep = () => {
    if (currentStep < navigation.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Voice guidance
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const speak = (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      // Attempt to find a female voice
      const femaleVoice = voices.find(v => 
        v.name.includes('Google US English') || 
        v.name.includes('Microsoft Zira') ||
        v.name.includes('female')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    };

    speak(navigation.steps[currentStep]);
  }, [currentStep, navigation.steps]);

  // If details board is hidden, show a minimal compact floating pill to let user see only the map
  if (isDetailsHidden) {
    return (
      <aside
        aria-label="Compact Navigation Bar"
        className="fixed top-18 left-3 right-3 sm:left-auto sm:right-4 z-30 pointer-events-auto"
      >
        <div className="bg-white/95 backdrop-blur-md border border-emerald-300 rounded-full shadow-lg px-3.5 py-1.5 flex items-center justify-between gap-3 text-slate-900 animate-fade-in">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Navigation className="w-3 h-3 transform rotate-45" />
            </div>
            <span className="text-xs font-bold truncate max-w-[150px]">
              {navigation.destinationName}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Step {currentStep + 1}/{navigation.steps.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsDetailsHidden(false)}
              title="Show navigation details board"
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3 h-3 text-blue-600" />
              <span>Show Details</span>
            </button>
            <button
              onClick={onCancelNavigation}
              title="Exit navigation"
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      aria-label="Active Navigation Bar"
      className="fixed top-18 left-3 right-3 sm:left-auto sm:right-4 sm:w-72 z-30 pointer-events-auto"
    >
      <div className="bg-white border border-emerald-200 rounded-2xl shadow-lg p-3 text-slate-900 animate-slide-down">
        {/* Top Status */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Navigation className="w-3.5 h-3.5 transform rotate-45" />
            </div>
            <h3 className="text-[11px] font-bold text-slate-900 truncate">
              {navigation.gigTitle}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            {/* User can hide navigation details board */}
            <button
              onClick={() => setIsDetailsHidden(true)}
              title="Hide navigation details board"
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onCancelNavigation}
              title="Exit navigation"
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Turn-by-Turn Instruction */}
        <div className="py-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase mb-1">
            <span>Step {currentStep + 1} of {navigation.steps.length}</span>
            <span className="font-mono text-emerald-700">~{navigation.etaMinutes} mins</span>
          </div>
          <div className="text-xs font-bold text-slate-900 leading-snug">
            {navigation.steps[currentStep]}
          </div>
          <button 
            onClick={nextStep}
            disabled={currentStep === navigation.steps.length - 1}
            className="mt-2 text-[10px] text-blue-600 font-semibold flex items-center gap-1 disabled:text-slate-400"
          >
            Next Step <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Complete Gig Action Button (ONLY OWNER CAN CLICK) */}
        <div className="mt-2 pt-2 border-t border-slate-100">
          {isOwnerView ? (
            <button
              onClick={onCompleteGig}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Completed (Owner)</span>
            </button>
          ) : (
            <div className="w-full py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 text-[10px] flex items-center justify-center gap-1.5 cursor-not-allowed">
              <Lock className="w-3 h-3" />
              <span>Awaiting Owner Confirmation</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
