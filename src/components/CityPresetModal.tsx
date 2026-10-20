import React from 'react';
import { X, Navigation, MapPin, Compass } from 'lucide-react';
import { formatCoordinates } from '../utils/geo';

interface CityPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (lat: number, lng: number, name: string) => void;
  onUseLiveGps: () => void;
  isLocating: boolean;
}

const PRESET_CITIES = [
  { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, tag: 'Bay Area' },
  { name: 'New York, NY', lat: 40.7128, lng: -74.006, tag: 'Manhattan' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, tag: 'Westminster' },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, tag: 'Shibuya' },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522, tag: 'Île-de-France' },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, tag: 'Harbour' },
  { name: 'Berlin, Germany', lat: 52.52, lng: 13.405, tag: 'Mitte' },
];

export const CityPresetModal: React.FC<CityPresetModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  onUseLiveGps,
  isLocating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-preset-title"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 id="city-preset-title" className="text-base font-bold text-white tracking-tight">
              Location &amp; Device Testing
            </h2>
            <p className="text-xs text-slate-400">
              Detect live GPS or simulate device location in top metro areas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live GPS button */}
        <div className="mt-4">
          <button
            onClick={() => {
              onUseLiveGps();
              onClose();
            }}
            className="w-full p-3.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 rounded-2xl flex items-center justify-between text-left transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md">
                <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Use Live Device Hardware GPS</div>
                <div className="text-xs text-blue-300">Request browser navigator.geolocation</div>
              </div>
            </div>
            <span className="text-xs bg-blue-500 text-white font-bold px-2.5 py-1 rounded-lg">
              Live
            </span>
          </button>
        </div>

        {/* Preset Cities */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Or Jump to Metro Hubs
          </div>
          <div className="space-y-2">
            {PRESET_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  onSelectCity(city.lat, city.lng, city.name);
                  onClose();
                }}
                className="w-full p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-slate-200">{city.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {formatCoordinates(city.lat, city.lng)}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  {city.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
