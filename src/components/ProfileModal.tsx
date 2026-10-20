import React, { useState, useEffect } from 'react';
import { 
  X, 
  CircleUserRound, 
  Camera, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Globe, 
  Sparkles, 
  Briefcase, 
  ShieldCheck,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { UserLocation, UserProfileData, SocialLink } from '../types';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: UserLocation | null;
  profile: UserProfileData;
  onSaveProfile: (profile: UserProfileData) => void;
  onAutoSetLocation?: () => void;
}

export const CASUAL_GIG_TRADES = [
  'Lawn Mowing & Gardening',
  'House Cleaning & Ironing',
  'Queue Standing / Line Sitting',
  'Grocery & Errand Runs',
  'Parcel & Courier Delivery',
  'Furniture Assembly',
  'Moving & Heavy Lifting Helper',
  'Pet Sitting & Dog Walking',
  'Mobile Car Wash & Detailing',
  'Painting & Wall Touch-ups',
  'Minor Handyman & Home Repairs',
  'Babysitting & Childcare',
  'Event Setup & Ushering',
  'Flyer & Pamphlet Distribution',
  'Tech Help & Phone/TV Setup',
  'Pool Cleaning & Maintenance',
  'Dishwashing & Kitchen Assist',
  'Window Washing',
  'Cooking & Meal Prep Assist',
  'Shelf Mounting & Drilling',
  'Car Tyre & Battery Jumpstart'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userLocation,
  profile,
  onSaveProfile,
  onAutoSetLocation,
}) => {
  const [formData, setFormData] = useState<UserProfileData>(profile);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customTradeInput, setCustomTradeInput] = useState('');

  // Sync internal state when profile prop changes
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  if (!isOpen) return null;

  // Handle Selfie / Photo Capture or Upload
  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          selfieUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto set location from GPS userLocation
  const handleAutoLocation = () => {
    if (userLocation?.address) {
      setFormData((prev) => ({
        ...prev,
        location: userLocation.address || 'Current Live Location',
      }));
    } else if (onAutoSetLocation) {
      onAutoSetLocation();
    }
  };

  // Toggle trade selection
  const handleToggleTrade = (trade: string) => {
    setFormData((prev) => {
      const exists = prev.trades.includes(trade);
      if (exists) {
        return { ...prev, trades: prev.trades.filter((t) => t !== trade) };
      } else {
        return { ...prev, trades: [...prev.trades, trade] };
      }
    });
  };

  // Add custom trade
  const handleAddCustomTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTradeInput.trim();
    if (!trimmed) return;
    if (!formData.trades.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        trades: [...prev.trades, trimmed],
      }));
    }
    setCustomTradeInput('');
  };

  // Add new social media link
  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: 'WhatsApp',
      url: '',
    };
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, newLink],
    }));
  };

  // Update social media link
  const handleUpdateSocialLink = (id: string, field: 'platform' | 'url', value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Remove social link
  const handleRemoveSocialLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((item) => item.id !== id),
    }));
  };

  // Save profile and lock
  const handleSaveAndLock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validations: Required fields
    if (!formData.firstName.trim()) {
      setErrorMsg('First Name is required.');
      return;
    }
    if (!formData.lastName.trim()) {
      setErrorMsg('Surname / Last Name is required.');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMsg('Location is required. Enter your location or click Auto-Set.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Contact phone number is required.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (formData.trades.length === 0) {
      setErrorMsg('Please choose at least one casual gig trade.');
      return;
    }

    const updatedProfile: UserProfileData = {
      ...formData,
      isLocked: true,
    };
    setFormData(updatedProfile);
    onSaveProfile(updatedProfile);
  };

  // Unlock profile to edit
  const handleUnlockProfile = () => {
    setFormData((prev) => ({
      ...prev,
      isLocked: false,
    }));
    setErrorMsg(null);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // Clear persisted data for the next user
      onClose();
      window.location.reload(); // Refresh to ensure clean state
    } catch (error) {
      console.error("Error signing out: ", error);
      setErrorMsg("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-sm">
              <CircleUserRound className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 id="profile-title" className="text-base font-black text-slate-950 tracking-tight flex items-center gap-2">
                User Profile
                {formData.isLocked && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Locked &amp; Active
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {formData.isLocked ? 'View your verified details' : 'Complete your identity & choose trades'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ========================================================
              LOCKED VIEW: Read-Only with Edit Button
          ======================================================== */}
          {formData.isLocked ? (
            <div className="space-y-5 animate-fade-in">
              {/* Profile Card Header with Selfie */}
              <div className="p-5 bg-gradient-to-br from-amber-50/80 via-white to-slate-50 border border-amber-200/80 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Selfie Avatar */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400 bg-slate-100 shadow-md overflow-hidden flex items-center justify-center">
                    {formData.selfieUrl ? (
                      <img 
                        src={formData.selfieUrl} 
                        alt="Profile Selfie" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <CircleUserRound className="w-14 h-14 text-slate-300" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-950 truncate">
                        {formData.firstName} {formData.lastName}
                      </h3>
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-slate-600 font-medium mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{formData.location}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleUnlockProfile}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all self-center sm:self-auto"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{formData.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium truncate max-w-[200px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{formData.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chosen Casual Gig Trades */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    My Chosen Trades ({formData.trades.length})
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.trades.map((trade, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs shadow-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                      {trade}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Media Links (if any) */}
              {formData.socialLinks.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Social Media Links
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formData.socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between"
                      >
                        <span className="font-bold text-slate-800">{link.platform}:</span>
                        <span className="text-slate-600 truncate max-w-[140px] font-mono">
                          {link.url || 'No link added'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lock Status Note */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  Your profile is locked for integrity and safety. You can click <strong>Edit Profile</strong> at any time to update your trades, selfie, location, or contact details.
                </p>
              </div>
            </div>
          ) : (
            /* ========================================================
                EDIT VIEW: Interactive Form with All Required Fields
            ======================================================== */
            <form onSubmit={handleSaveAndLock} className="space-y-4 animate-fade-in">
              {/* 1. Selfie as Profile Picture */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-3 border-amber-400 bg-slate-50 shadow-md overflow-hidden flex items-center justify-center">
                    {formData.selfieUrl ? (
                      <img 
                        src={formData.selfieUrl} 
                        alt="Profile Selfie" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <CircleUserRound className="w-14 h-14 text-slate-300" />
                    )}
                  </div>
                  
                  {/* Camera overlay / trigger */}
                  <label 
                    htmlFor="selfie-file-input"
                    className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                  >
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                      {formData.selfieUrl ? 'Change' : 'Selfie'}
                    </span>
                  </label>
                  <input
                    id="selfie-file-input"
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleSelfieChange}
                    className="hidden"
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1.5">
                  {formData.selfieUrl ? 'Selfie attached as profile picture' : 'Tap to snap a live selfie or upload face photo'}
                </p>
              </div>

              {/* 2. Name & Surname (Required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sipho"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dlamini"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* 3. Location (Required) + Auto-Set Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoLocation}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                    <span>Auto-Set (GPS Location)</span>
                  </button>
                </div>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sandton, Johannesburg or Cape Town"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* 4. Contact Phone (Required) & Email (Required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +27 82 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. sipho@example.co.za"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Choose Trade (A lot of simple casual gigs) (Required) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Choose Your Trade(s) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {formData.trades.length} selected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Select all simple casual gigs and tasks you can do:
                </p>

                {/* Casual Gig Trade Badges */}
                <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-1.5 border border-slate-200 rounded-2xl bg-slate-50/50">
                  {CASUAL_GIG_TRADES.map((trade) => {
                    const isSelected = formData.trades.includes(trade);
                    return (
                      <button
                        key={trade}
                        type="button"
                        onClick={() => handleToggleTrade(trade)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-sm ring-1 ring-amber-600'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                        <span>{trade}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Optional custom trade input */}
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add other casual trade/skill..."
                    value={customTradeInput}
                    onChange={(e) => setCustomTradeInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTrade}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* 6. Social Media Links (Optional - user can add more) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Social Media Links (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Link</span>
                  </button>
                </div>

                {formData.socialLinks.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">
                    No social media links added yet. Click &quot;Add Link&quot; to connect WhatsApp, Instagram, LinkedIn, etc.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {formData.socialLinks.map((link) => (
                      <div key={link.id} className="flex items-center gap-2">
                        <select
                          value={link.platform}
                          onChange={(e) => handleUpdateSocialLink(link.id, 'platform', e.target.value)}
                          className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                        >
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Instagram">Instagram</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Facebook">Facebook</option>
                          <option value="X (Twitter)">X (Twitter)</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Website">Website</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Handle or URL"
                          value={link.url}
                          onChange={(e) => handleUpdateSocialLink(link.id, 'url', e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveSocialLink(link.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          title="Remove link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons: Save & Lock Profile */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Save &amp; Lock Profile</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
