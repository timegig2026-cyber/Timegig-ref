import React from 'react';
import { X, BookmarkCheck, ArrowRight } from 'lucide-react';
import { Gig, UserLocation } from '../types';
import { calculateDistanceKm, formatDistance } from '../utils/geo';

interface SavedGigsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedGigs: Gig[];
  onSelectGig: (gig: Gig) => void;
  onRemoveSaved: (gigId: string) => void;
  userLocation: UserLocation | null;
}

export const SavedGigsModal: React.FC<SavedGigsModalProps> = ({
  isOpen,
  onClose,
  savedGigs,
  onSelectGig,
  onRemoveSaved,
  userLocation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-gigs-title"
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <h2 id="saved-gigs-title" className="text-base font-bold text-white tracking-tight">
              Saved GiGs ({savedGigs.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 flex-1 overflow-y-auto">
          {savedGigs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">You haven&apos;t saved any GiGs yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Explore nearby casual gigs on the map and bookmark the ones you like.
              </p>
            </div>
          ) : (
            savedGigs.map((gig) => {
              const distanceKm = userLocation
                ? calculateDistanceKm(userLocation.lat, userLocation.lng, gig.lat, gig.lng)
                : null;

              return (
                <div
                  key={gig.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-start justify-between gap-3 group"
                >
                  <div className="flex-1">
                    <div className="text-xs text-amber-400 font-semibold mb-0.5">
                      {gig.categoryLabel}
                    </div>
                    <h3 className="text-sm font-bold text-white">{gig.title}</h3>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>{gig.locationName}</span>
                      {distanceKm !== null && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-blue-400 font-medium">
                            {formatDistance(distanceKm)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <div className="text-sm font-black text-emerald-400 font-mono">
                      R{gig.payRate}
                      <span className="text-[10px] text-slate-400">
                        {gig.payType === 'hourly' ? '/h' : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onSelectGig(gig);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemoveSaved(gig.id)}
                        className="p-1 text-slate-500 hover:text-red-400 text-xs transition-colors"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
