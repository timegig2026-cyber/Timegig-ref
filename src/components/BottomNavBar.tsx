import React from 'react';
import { Compass, CircleUserRound, Activity, Building, Users, Lock } from 'lucide-react';

interface BottomNavBarProps {
  onOpenActivation: () => void;
  onOpenSeekers: () => void;
  onOpenGigs: () => void;
  onOpenTenant: () => void;
  onOpenProfile: () => void;
  isTenantUnlocked?: boolean;
  selfieUrl?: string | null;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  onOpenActivation,
  onOpenSeekers,
  onOpenGigs,
  onOpenTenant,
  onOpenProfile,
  isTenantUnlocked = false,
  selfieUrl,
}) => {
  return (
    <nav 
      aria-label="GiGs Bottom Bar" 
      className="fixed bottom-0 left-0 right-0 z-35 bg-gradient-to-t from-slate-100 via-white to-white border-t border-slate-200/90 shadow-[0_-8px_24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,1)] pointer-events-auto pb-safe"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around relative">
        {/* 1. Activation */}
        <button
          onClick={onOpenActivation}
          aria-label="Activation Feature"
          className="group flex flex-col items-center justify-center focus:outline-none py-1 px-3 active:scale-95 transition-all text-slate-600 hover:text-slate-900"
        >
          <Activity className="w-5 h-5 text-slate-700 stroke-[2.2] group-hover:text-amber-600 transition-colors" />
          <span className="text-[9px] font-bold text-slate-800 mt-1">Activation</span>
        </button>

        {/* 2. Tenant */}
        <button
          onClick={onOpenTenant}
          aria-label={isTenantUnlocked ? "Tenant Feature (Unlocked)" : "Tenant Feature (Locked)"}
          className={`group flex flex-col items-center justify-center focus:outline-none py-1 px-3 active:scale-95 transition-all ${
            isTenantUnlocked ? 'text-slate-700 hover:text-slate-950' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <Building className={`w-5 h-5 stroke-[2.2] transition-colors ${
              isTenantUnlocked ? 'text-blue-600 group-hover:text-blue-700' : 'text-slate-400'
            }`} />
            {!isTenantUnlocked && (
              <span className="absolute -top-1 -right-1.5 bg-slate-800 text-white p-0.5 rounded-full shadow-sm">
                <Lock className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold mt-1 text-slate-800">
            Tenant
          </span>
        </button>

        {/* 3. GiGs */}
        <button
          onClick={onOpenGigs}
          aria-label="GiGs Feature"
          className="group flex flex-col items-center justify-center focus:outline-none py-1 px-3 active:scale-95 transition-all"
        >
          <Compass className="w-11 h-11 text-amber-500 group-hover:scale-110 transition-transform stroke-[2.3]" />
          <span className="text-[10px] font-black text-slate-950 mt-0.5">GiGs</span>
        </button>

        {/* 4. Seekers */}
        <button
          onClick={onOpenSeekers}
          aria-label="Seekers Feature"
          className="group flex flex-col items-center justify-center focus:outline-none py-1 px-3 active:scale-95 transition-all text-slate-600 hover:text-slate-900"
        >
          <Users className="w-5 h-5 text-slate-700 stroke-[2.2] group-hover:text-amber-600 transition-colors" />
          <span className="text-[9px] font-bold text-slate-800 mt-1">Seekers</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={onOpenProfile}
          aria-label="Profile Feature"
          className="group flex flex-col items-center justify-center focus:outline-none py-1 px-3 active:scale-95 transition-all text-slate-600 hover:text-slate-900"
        >
          {selfieUrl ? (
            <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-amber-500 shadow-xs group-hover:scale-105 transition-transform bg-slate-100 flex items-center justify-center">
              <img src={selfieUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <CircleUserRound className="w-6 h-6 text-slate-700 stroke-[2.2] group-hover:text-amber-600 transition-colors" />
          )}
          <span className="text-[9px] font-bold text-slate-800 mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
