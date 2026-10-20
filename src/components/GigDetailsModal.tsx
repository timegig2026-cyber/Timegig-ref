import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  MessageCircle,
  Navigation,
  ShieldCheck,
  Flame,
  Calendar,
  Zap
} from 'lucide-react';
import { Gig, UserLocation } from '../types';
import { calculateDistanceKm, formatDistance } from '../utils/geo';

interface GigDetailsModalProps {
  gig: Gig | null;
  onClose: () => void;
  userLocation: UserLocation | null;
  isSaved: boolean;
  onToggleSave: (gigId: string) => void;
  onApply?: (gig: Gig) => void;
}

export const GigDetailsModal: React.FC<GigDetailsModalProps> = ({
  gig,
  onClose,
  userLocation,
  isSaved,
  onToggleSave,
  onApply,
}) => {
  const [hasApplied, setHasApplied] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!gig) return null;

  const distanceKm = userLocation
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, gig.lat, gig.lng)
    : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `GiG: ${gig.title} - R${gig.payRate} (${gig.locationName}) via GiGs Map`
      );
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="gig-details-title"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col max-h-[90vh] overflow-y-auto text-slate-900"
      >
        {/* Top bar with Category, Close & Share */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {gig.categoryLabel}
            </span>
            {gig.isUrgent && (
              <span className="text-xs font-black text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-red-500 text-red-500" />
                Urgent
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share gig link"
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(gig.id)}
              title={isSaved ? 'Remove from saved' : 'Save gig'}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-600 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copiedShare && (
          <div className="mt-2 text-center text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 py-1.5 rounded-xl font-medium">
            GiG details copied to clipboard!
          </div>
        )}

        {/* Title & Pay Rate in ZAR (R) */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="gig-details-title" className="text-lg font-bold text-slate-950 tracking-tight">
              {gig.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {gig.locationName}
              </span>
              {distanceKm !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-blue-600 font-semibold">
                    {formatDistance(distanceKm)} away
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-emerald-600 font-mono">
              R{gig.payRate}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {gig.payType === 'hourly' ? 'per hour' : 'fixed payment'}
            </div>
          </div>
        </div>

        {/* Poster Profile Row */}
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-sm shadow-sm">
              {gig.posterName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                {gig.posterName}
                <span title="Verified Poster">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-amber-700 font-semibold">{gig.posterRating}</span>
                <span>(Verified Member)</span>
              </div>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <span>Posted {gig.postedAgo}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Job Scope &amp; Details
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            {gig.description}
          </p>
        </div>

        {/* Timing badge: Immediate or Scheduled */}
        <div className="mt-3 flex items-center gap-2">
          <div className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 border ${
            gig.isImmediate 
              ? 'bg-amber-50 border-amber-200 text-amber-900' 
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            {gig.isImmediate ? <Zap className="w-3.5 h-3.5 fill-current" /> : <Calendar className="w-3.5 h-3.5" />}
            <span>Timing: {gig.scheduledTime || (gig.isImmediate ? 'Immediate (ASAP)' : 'Scheduled')}</span>
          </div>
        </div>

        {/* Meta badges: time, tags, location */}
        <div className="mt-3 flex flex-wrap gap-2">
          {gig.timeEstimate && (
            <div className="flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Est: {gig.timeEstimate}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl border border-slate-200">
            <Navigation className="w-3.5 h-3.5 text-slate-500" />
            <span>Location: {gig.locationName}</span>
          </div>
          {gig.tags.map((tag, i) => (
            <div key={i} className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-xl border border-slate-200">
              #{tag}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-3">
          {hasApplied ? (
            <div className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Application Sent to {gig.posterName}</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  if (onApply && gig) {
                    onClose();
                    onApply(gig);
                  } else {
                    setHasApplied(true);
                  }
                }}
                className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Apply to GiG</span>
              </button>
              <button
                onClick={onClose}
                className="h-12 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
