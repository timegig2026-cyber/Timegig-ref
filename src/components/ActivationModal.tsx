import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Activity, 
  CheckCircle, 
  ShieldCheck, 
  DollarSign, 
  Camera, 
  Upload, 
  FileText, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelfieUploaded?: (selfieUrl: string) => void;
  onActivateSubscription?: (plan: 'tenant' | 'user') => void;
}

interface SubscriptionSlide {
  id: string;
  url: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  targetSub: 'tenant' | 'user';
}

const SUBSCRIPTION_SLIDES: SubscriptionSlide[] = [
  {
    id: 'slide-1',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
    title: 'Become a Tenant',
    badge: 'Passive Income • R299.99/mo',
    badgeColor: 'bg-emerald-500 text-white',
    description: 'Earn a steady passive monthly income from rental & property streams',
    targetSub: 'tenant',
  },
  {
    id: 'slide-2',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
    title: 'Verified Property Management',
    badge: 'Tenant Benefits',
    badgeColor: 'bg-blue-600 text-white',
    description: 'Manage verified lease agreements, tenants, and property documents',
    targetSub: 'tenant',
  },
  {
    id: 'slide-3',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    title: 'User Subscription',
    badge: 'Active Access • R29.99/mo',
    badgeColor: 'bg-amber-500 text-slate-950',
    description: 'Discover high-paying local tasks, errands, and casual gigs anytime',
    targetSub: 'user',
  },
  {
    id: 'slide-4',
    url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=80',
    title: 'Everyday GiG Work',
    badge: 'Instant Matching',
    badgeColor: 'bg-amber-500 text-slate-950',
    description: 'Shopping, cleaning, queue sitting, gardening, and courier services',
    targetSub: 'user',
  },
  {
    id: 'slide-5',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    title: 'Earn on Your Schedule',
    badge: 'Low Subscription Fee',
    badgeColor: 'bg-emerald-600 text-white',
    description: 'Keep your account active and connect directly with local seekers',
    targetSub: 'user',
  },
];

export const ActivationModal: React.FC<ActivationModalProps> = ({ 
  isOpen, 
  onClose,
  onSelfieUploaded,
  onActivateSubscription,
}) => {
  const [step, setStep] = useState<'select' | 'verify'>('select');
  const [selectedSub, setSelectedSub] = useState<'tenant' | 'user' | null>('user');
  
  // Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Verification states
  const [faceImageName, setFaceImageName] = useState<string | null>(null);
  const [faceImageUrl, setFaceImageUrl] = useState<string | null>(null);
  const [idDocumentName, setIdDocumentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-play sliding show of images
  useEffect(() => {
    if (!isOpen || step !== 'select' || isPaused) return;

    slideIntervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SUBSCRIPTION_SLIDES.length);
    }, 3800);

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isOpen, step, isPaused]);

  if (!isOpen) return null;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SUBSCRIPTION_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SUBSCRIPTION_SLIDES.length) % SUBSCRIPTION_SLIDES.length);
  };

  const handleFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaceImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFaceImageUrl(result);
        if (onSelfieUploaded) {
          onSelfieUploaded(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdDocumentName(file.name);
    }
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faceImageUrl && !faceImageName) {
      alert('Please upload your face picture or capture a live selfie.');
      return;
    }
    if (!idDocumentName) {
      alert('Please upload your ID document.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const planName = selectedSub === 'tenant' ? 'Become a Tenant (R299.99/mo)' : 'User Subscription (R29.99/mo)';
      alert(`Verification successful! ${planName} is now active, and your selfie has been set as your profile picture.`);
      if (selectedSub && onActivateSubscription) {
        onActivateSubscription(selectedSub);
      }
      setStep('select');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="activation-title"
        className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 id="activation-title" className="text-base font-black text-slate-950 tracking-tight">
                {step === 'select' ? 'Subscriptions & Activation' : 'Identity Verification'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {step === 'select' ? 'Choose your plan & enjoy passive income or active gigs' : 'Step 2: Upload selfie & ID document'}
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

        {step === 'select' ? (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* ========================================================
                SLIDING SHOW OF IMAGES FOR SUBSCRIPTIONS
            ======================================================== */}
            <div 
              className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden shadow-md group select-none bg-slate-950"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slides Container */}
              <div 
                className="w-full h-full flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {SUBSCRIPTION_SLIDES.map((slide, idx) => (
                  <div key={slide.id} className="w-full h-full shrink-0 relative">
                    <img 
                      src={slide.url} 
                      alt={slide.title}
                      className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" 
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                    {/* Content on slide */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5 shadow-sm ${slide.badgeColor}`}>
                        {slide.badge}
                      </span>
                      <h3 className="text-sm sm:text-base font-black leading-tight drop-shadow-md text-white">
                        {slide.title}
                      </h3>
                      <p className="text-[11px] text-slate-200 line-clamp-1 mt-0.5 font-medium">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev / Next Navigation Arrows */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-80 group-hover:opacity-100 transition-all active:scale-95"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-80 group-hover:opacity-100 transition-all active:scale-95"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Indicators / Dots */}
              <div className="absolute bottom-2 right-4 flex items-center gap-1.5 z-10">
                {SUBSCRIPTION_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentSlide === idx 
                        ? 'w-5 bg-amber-400' 
                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Instruction & Section Header */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-700">Choose your membership tier:</span>
              <span className="flex items-center gap-1 text-amber-600 font-extrabold text-[11px] bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                Featured Options
              </span>
            </div>

            {/* Subscription Option 1: Become a Tenant (Realistic 3D Card) */}
            <div
              onClick={() => {
                setSelectedSub('tenant');
                setCurrentSlide(0);
              }}
              className={`relative rounded-3xl p-5 cursor-pointer transition-all duration-300 ${
                selectedSub === 'tenant'
                  ? 'bg-gradient-to-b from-white via-blue-50/40 to-slate-50 border-2 border-amber-500 shadow-[0_16px_32px_rgba(245,158,11,0.18),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.03)] scale-[1.01]'
                  : 'bg-gradient-to-b from-white to-slate-50/70 border border-slate-200/90 shadow-[0_8px_20px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Top Row: Metallic Badge + Title & Pricing */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-800 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(15,23,42,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-slate-700">
                    <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-blue-700 flex items-center gap-1">
                      <span>Passive Yield Asset</span>
                      <span className="w-1 h-1 rounded-full bg-blue-500" />
                      <span>Executive Tier</span>
                    </div>
                    <h3 className="text-base font-black text-slate-950 tracking-tight">
                      Become a Tenant
                    </h3>
                  </div>
                </div>

                {/* 3D Radio Selection Disc */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selectedSub === 'tenant'
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-[0_2px_8px_rgba(245,158,11,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)]'
                    : 'border-2 border-slate-300 bg-white'
                }`}>
                  {selectedSub === 'tenant' && <CheckCircle className="w-4 h-4 fill-slate-950 text-amber-400" />}
                </div>
              </div>

              {/* Realistic Embossed Pricing Ribbon */}
              <div className="mt-3.5 flex items-baseline justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-200/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-950 tracking-tight">R299.99</span>
                  <span className="text-[11px] font-bold text-slate-500">/ month</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-white px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs">
                  Active Account Fee
                </span>
              </div>

              {/* Feature Points */}
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                  <span>Earn guaranteed <strong className="text-emerald-700 font-bold">passive monthly income</strong> (R4,850+ avg)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                  <span>Direct 1st-of-month bank EFT transfers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                  <span>Unlocks the full-screen <strong className="text-slate-900 font-bold">Tenant Portal</strong> with PoP records</span>
                </li>
              </ul>
            </div>

            {/* Subscription Option 2: User Subscription (Realistic 3D Card) */}
            <div
              onClick={() => {
                setSelectedSub('user');
                setCurrentSlide(2);
              }}
              className={`relative rounded-3xl p-5 cursor-pointer transition-all duration-300 ${
                selectedSub === 'user'
                  ? 'bg-gradient-to-b from-white via-amber-50/40 to-slate-50 border-2 border-amber-500 shadow-[0_16px_32px_rgba(245,158,11,0.18),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.03)] scale-[1.01]'
                  : 'bg-gradient-to-b from-white to-slate-50/70 border border-slate-200/90 shadow-[0_8px_20px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Top Row: Metallic Badge + Title & Pricing */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(245,158,11,0.35),inset_0_1px_1px_rgba(255,255,255,0.5)] border border-amber-300">
                    <Activity className="w-6 h-6 stroke-[2.4]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
                      <span>Casual GiG Worker</span>
                      <span className="w-1 h-1 rounded-full bg-amber-500" />
                      <span>Standard Access</span>
                    </div>
                    <h3 className="text-base font-black text-slate-950 tracking-tight">
                      User Subscription
                    </h3>
                  </div>
                </div>

                {/* 3D Radio Selection Disc */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selectedSub === 'user'
                    ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-[0_2px_8px_rgba(245,158,11,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)]'
                    : 'border-2 border-slate-300 bg-white'
                }`}>
                  {selectedSub === 'user' && <CheckCircle className="w-4 h-4 fill-slate-950 text-amber-400" />}
                </div>
              </div>

              {/* Realistic Embossed Pricing Ribbon */}
              <div className="mt-3.5 flex items-baseline justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50/40 to-white border border-amber-200/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-950 tracking-tight">R29.99</span>
                  <span className="text-[11px] font-bold text-slate-500">/ month</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-white px-2 py-0.5 rounded-md border border-amber-200 shadow-2xs">
                  Active Account Fee
                </span>
              </div>

              {/* Feature Points */}
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                  <span>Discover and apply for everyday casual gigs nearby</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                  <span>Direct client matching &amp; navigation to job location</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0">✓</span>
                  <span>Instant wallet earnings released directly on completion</span>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (selectedSub) {
                    setStep('verify');
                  } else {
                    alert('Please select a subscription option first.');
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95"
              >
                Continue to Verification
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitVerification} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <p className="text-xs text-slate-500">
              For security and compliance, please upload a face picture (or capture a live selfie) and your ID document to finalize your subscription.
            </p>

            {/* Face / Selfie Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-600" />
                Face Picture / Live Selfie
              </label>

              {faceImageUrl && (
                <div className="mb-2 flex items-center gap-3 p-2.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
                  <img 
                    src={faceImageUrl} 
                    alt="Selfie preview" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm" 
                  />
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">Selfie Attached</div>
                    <div className="text-[10px] text-slate-500">Will be set as your profile avatar</div>
                  </div>
                </div>
              )}

              <label className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 transition-colors">
                <Camera className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700 text-center">
                  {faceImageName ? faceImageName : 'Click to snap live selfie or upload face photo'}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="user"
                  onChange={handleFaceUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* ID Document Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                ID Document (Passport / National ID / Driver&apos;s License)
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700 text-center">
                  {idDocumentName ? idDocumentName : 'Click to upload ID document scan'}
                </span>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleIdUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Activate'}
              </button>
              <button
                type="button"
                onClick={() => setStep('select')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
