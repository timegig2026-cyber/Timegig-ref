import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  MapPin, 
  RefreshCw, 
  X,
  Crosshair
} from 'lucide-react';
import { MapTileStyle, UserLocation } from '../types';

interface TopFloatingHeaderProps {
  userLocation: UserLocation | null;
  locationError: string | null;
  isLocating: boolean;
  onRequestLocation: () => void;
  onRecenter: () => void;
  tileStyle: MapTileStyle;
  onChangeTileStyle: (style: MapTileStyle) => void;
  onSelectSearchCoordinate: (lat: number, lng: number, label: string) => void;
  onOpenPresetModal: () => void;
  onOpenPostGigModal?: () => void;
}

export const TopFloatingHeader: React.FC<TopFloatingHeaderProps> = ({
  onRecenter,
  tileStyle,
  onChangeTileStyle,
  onSelectSearchCoordinate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ name: string; lat: number; lng: number }>>([]);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=4`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(
          data.map((item: { display_name: string; lat: string; lon: string }) => ({
            name: item.display_name.split(',').slice(0, 3).join(', '),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          }))
        );
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none p-3 sm:p-4">
      <div className="max-w-xl mx-auto flex flex-col gap-2">
        {/* Search Bar + Recenter & Tiles Style Icons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Main White Search Input */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-xl focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all text-slate-900"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search area, street, city or province..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {isSearching && (
              <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
            )}
          </form>

          {/* Re-center / Direct back to live device location Button */}
          <button
            onClick={onRecenter}
            title="Locate my position on map"
            className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-blue-600 hover:bg-slate-50 flex items-center justify-center shadow-xl active:scale-95 transition-all"
          >
            <Crosshair className="w-5 h-5" />
          </button>

          {/* Map Layer Switcher (Tiles Style Icon) */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              title="Change map tile style"
              className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center shadow-xl active:scale-95 transition-all"
            >
              <Layers className="w-5 h-5" />
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 top-13 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 z-30">
                <div className="text-[11px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                  Map View Style
                </div>
                <button
                  onClick={() => {
                    onChangeTileStyle('standard');
                    setShowLayerMenu(false);
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    tileStyle === 'standard'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Standard OpenStreetMap
                </button>
                <button
                  onClick={() => {
                    onChangeTileStyle('satellite');
                    setShowLayerMenu(false);
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    tileStyle === 'satellite'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Satellite Imagery
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Results Dropdown (White Card) */}
        {searchResults.length > 0 && (
          <div className="pointer-events-auto bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 flex flex-col gap-1 max-h-56 overflow-y-auto">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectSearchCoordinate(result.lat, result.lng, result.name);
                  setSearchResults([]);
                  setSearchQuery('');
                }}
                className="text-left px-3 py-2.5 rounded-xl text-xs hover:bg-slate-50 text-slate-800 flex items-start gap-2 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <span className="line-clamp-2 font-medium">{result.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
