import React, { useState, useMemo } from 'react';
import { 
  X, 
  Map, 
  Navigation, 
  Search, 
  Flame,
  User
} from 'lucide-react';
import { Gig, UserLocation } from '../types';
import { calculateDistanceKm, formatDistance } from '../utils/geo';

interface GigsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  gigs: Gig[];
  userLocation: UserLocation | null;
  onSelectGig: (gig: Gig) => void;
}

export const GigsDrawer: React.FC<GigsDrawerProps> = ({
  isOpen,
  onClose,
  gigs,
  userLocation,
  onSelectGig,
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const processedGigs = useMemo(() => {
    return gigs
      .map((gig) => {
        const distance = userLocation
          ? calculateDistanceKm(userLocation.lat, userLocation.lng, gig.lat, gig.lng)
          : 0;
        return {
          ...gig,
          computedDistanceKm: distance,
        };
      })
      .filter((gig) => {
        if (searchFilter.trim()) {
          const query = searchFilter.toLowerCase();
          return (
            gig.title.toLowerCase().includes(query) ||
            gig.description.toLowerCase().includes(query) ||
            gig.categoryLabel.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => a.computedDistanceKm - b.computedDistanceKm);
  }, [gigs, userLocation, searchFilter]);

  if (!isOpen) return null;

  return (
    <aside 
      aria-label="Nearby GiGs Discovery"
      className="fixed inset-0 z-50 bg-white flex flex-col transition-all duration-300 text-slate-900"
    >
      <div className="pt-safe px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Map className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-950 tracking-tight">Nearby Casual GiGs</h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-3">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search nearby gigs..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Gigs List or Empty State */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
        {processedGigs.length === 0 ? (
          <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
              <Map className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              No Nearby GiGs
            </h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              There are currently no active casual gigs in this area.
            </p>
          </div>
        ) : (
          processedGigs.map((gig) => (
            <div
              key={gig.id}
              onClick={() => {
                onSelectGig(gig);
                onClose();
              }}
              className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4"
            >
              {/* User Profile Picture Logo */}
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                <User className="w-6 h-6 text-slate-400" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-950 line-clamp-1">{gig.title}</h3>
                  {gig.isUrgent && <Flame className="w-4 h-4 text-red-500 fill-red-500" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span className="font-semibold text-amber-700">{gig.categoryLabel}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-blue-600" />
                    {formatDistance(gig.computedDistanceKm)}
                  </span>
                </div>
                <div className="mt-2 text-sm font-black text-emerald-700">R{gig.payRate}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
