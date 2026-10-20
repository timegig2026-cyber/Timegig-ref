import React from 'react';
import { X, Zap } from 'lucide-react';

interface GigsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPostGig?: () => void;
}

export const GigsModal: React.FC<GigsModalProps> = ({ isOpen, onClose, onOpenPostGig }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="gigs-modal-title"
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-y-auto text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <h2 id="gigs-modal-title" className="text-base font-bold text-slate-950 tracking-tight">
              GiGs
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Empty State Body */}
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
            <Zap className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            GiGs Empty
          </h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            You currently have no active or accepted casual gigs.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex gap-2">
          {onOpenPostGig && (
            <button
              onClick={() => {
                onClose();
                onOpenPostGig();
              }}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
            >
              Post a GiG
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
