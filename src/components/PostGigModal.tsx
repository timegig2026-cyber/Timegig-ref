import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  MapPin, 
  Zap, 
  Flame, 
  Calendar, 
  Search, 
  Navigation, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { Gig, GigCategory, UserLocation } from '../types';
import { reverseGeocodeLocation } from '../utils/geo';

interface PostGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: UserLocation | null;
  onAddGig: (newGig: Gig) => void;
}

export const PostGigModal: React.FC<PostGigModalProps> = ({
  isOpen,
  onClose,
  userLocation,
  onAddGig,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GigCategory>('errands');
  const [payRate, setPayRate] = useState<string>('150');
  const [payType, setPayType] = useState<'hourly' | 'fixed'>('fixed');
  const [description, setDescription] = useState('');

  // Selected exact location for this gig post
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  // Search inside modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ name: string; lat: number; lng: number }>>([]);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Timing: immediate vs scheduled
  const [isImmediate, setIsImmediate] = useState(true);
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // When modal opens, initialize with current searched location
  useEffect(() => {
    if (isOpen) {
      if (userLocation) {
        setSelectedLocation({
          lat: userLocation.lat,
          lng: userLocation.lng,
          name: userLocation.address || 'Searched Location',
        });
      } else {
        setSelectedLocation({
          lat: 37.7749,
          lng: -122.4194,
          name: 'Current Location',
        });
      }
    }
  }, [isOpen, userLocation]);

  if (!isOpen) return null;

  const categories: Array<{ id: GigCategory; label: string }> = [
    { id: 'errands', label: 'Errands & Queues' },
    { id: 'cleaning', label: 'House Cleaning' },
    { id: 'yard_work', label: 'Yard & Garden' },
    { id: 'pet_care', label: 'Pet Care & Walking' },
    { id: 'delivery', label: 'Shopping & Delivery' },
    { id: 'labor', label: 'Labor & Assembly' },
    { id: 'tech', label: 'Tech & Setup' },
    { id: 'education', label: 'Casual Tutoring' },
  ];

  // Search any location via OpenStreetMap Nominatim
  const handleSearchLocation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingLocation(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5`,
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
      setIsSearchingLocation(false);
    }
  };

  const handleSelectSearchResult = (item: { name: string; lat: number; lng: number }) => {
    setSelectedLocation(item);
    setSearchResults([]);
    setSearchQuery('');
  };

  // Option to detect live device GPS
  const handleUseDeviceGps = () => {
    if (!navigator.geolocation) return;

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const name = await reverseGeocodeLocation(lat, lng);
          setSelectedLocation({ lat, lng, name });
        } catch {
          setSelectedLocation({ lat, lng, name: 'Live Device Location' });
        } finally {
          setIsDetectingGps(false);
        }
      },
      () => {
        setIsDetectingGps(false);
        alert('Could not retrieve device GPS. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !payRate) return;

    const matchedCategory = categories.find((c) => c.id === category);

    const finalLat = selectedLocation?.lat ?? userLocation?.lat ?? 37.7749;
    const finalLng = selectedLocation?.lng ?? userLocation?.lng ?? -122.4194;
    const finalLocationName = selectedLocation?.name || userLocation?.address || 'Searched Location';

    const newGig: Gig = {
      id: `gig-user-${Date.now()}`,
      title: title.trim(),
      category,
      categoryLabel: matchedCategory ? matchedCategory.label : 'General',
      payRate: parseFloat(payRate) || 100,
      payType,
      description: description.trim() || 'No additional details provided.',
      locationName: finalLocationName,
      lat: finalLat,
      lng: finalLng,
      posterName: 'You (Gig Owner)',
      posterRating: 5.0,
      isUrgent,
      isImmediate,
      isOwner: true,
      status: 'open',
      scheduledTime: isImmediate ? 'Immediate (ASAP)' : (scheduledDateTime || 'Scheduled'),
      timeEstimate: '1-2 hours',
      postedAgo: 'Just now',
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    onAddGig(newGig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-gig-title"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-y-auto text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <h2 id="post-gig-title" className="text-base font-bold text-slate-950 tracking-tight">
                Post a New Casual GiG
              </h2>
              <p className="text-xs text-slate-500">
                Created at your exact searched location for workers to apply to
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Exact Gig Location Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Exact GiG Location
              </span>
              <button
                type="button"
                onClick={handleUseDeviceGps}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <Navigation className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Detecting...' : 'Use My GPS'}</span>
              </button>
            </div>

            {/* Currently Selected Location Display */}
            <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 truncate">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {selectedLocation?.name || 'Selected Map Location'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    Pin will drop at this exact location
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                Active Pin
              </span>
            </div>

            {/* Change / Search another location */}
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search street, suburb, city or province..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchLocation();
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSearchLocation()}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                >
                  {isSearchingLocation ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>Search</span>
                </button>
              </div>

              {/* Instant Search Results */}
              {searchResults.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-1.5 max-h-40 overflow-y-auto space-y-1 shadow-lg">
                  {searchResults.map((item, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-950 rounded-lg flex items-start gap-1.5 transition-colors font-medium"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Gig Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              GiG Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Queue waiting at Home Affairs or Lawn mowing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Simple Casual Categories */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors border ${
                    category === c.id
                      ? 'bg-amber-500/10 border-amber-500 text-amber-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment in ZAR (R) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pay Amount (ZAR R) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">R</span>
                <input
                  type="number"
                  required
                  min="20"
                  value={payRate}
                  onChange={(e) => setPayRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rate Type
              </label>
              <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setPayType('hourly')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    payType === 'hourly'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hourly
                </button>
                <button
                  type="button"
                  onClick={() => setPayType('fixed')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    payType === 'fixed'
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fixed
                </button>
              </div>
            </div>
          </div>

          {/* Timing: Immediate Assistance vs Scheduled Date & Time */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="text-xs font-semibold text-slate-800">
              Timing &amp; Availability
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsImmediate(true)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  isImmediate
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Immediate (ASAP)</span>
              </button>
              <button
                type="button"
                onClick={() => setIsImmediate(false)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  !isImmediate
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Date</span>
              </button>
            </div>

            {!isImmediate && (
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Select Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description &amp; Details
            </label>
            <textarea
              rows={3}
              placeholder="Describe what needs to be done..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          {/* Urgent switch */}
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-50 border-slate-300"
            />
            <span className="text-xs text-slate-700 flex items-center gap-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              Mark as Urgent / Priority GiG
            </span>
          </label>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Publish GiG at Exact Location</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-12 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
