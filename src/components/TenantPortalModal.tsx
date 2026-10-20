import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Coins, 
  Receipt, 
  CreditCard, 
  LayoutDashboard, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  Eye, 
  Download 
} from 'lucide-react';
import { UserLocation } from '../types';

interface TenantPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation?: UserLocation | null;
  selfieUrl?: string | null;
}

type TenantTab = 'overview' | 'verification' | 'tenant_pop' | 'user_pop';

interface ReferralApplicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  subType: 'Tenant Subscription (R299.99/mo)' | 'User Subscription (R29.99/mo)';
  submittedDate: string;
  faceSelfieUrl: string;
  idDocumentUrl: string;
  idDocumentName: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PoPRecord {
  id: string;
  title: string;
  amount: string;
  reference: string;
  date: string;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  doc1Title: string;
  doc1Name: string;
  doc1Url: string;
  doc2Title: string;
  doc2Name: string;
  doc2Url: string;
}

const INITIAL_REFERRALS: ReferralApplicant[] = [];

const INITIAL_TENANT_POPS: PoPRecord[] = [
  {
    id: 'tpop-1',
    title: 'Tenant Subscription Fee (Monthly Maintenance)',
    amount: 'R299.99',
    reference: 'TN-POP-2026-1020',
    date: '20 Oct 2026, 08:30 AM',
    method: 'Debit Card / Instant EFT',
    status: 'pending',
    doc1Title: 'Bank Payment Slip',
    doc1Name: 'EFT_Payment_Slip_1020.pdf',
    doc1Url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    doc2Title: 'Official Tax Invoice',
    doc2Name: 'Tax_Invoice_TN_8812.pdf',
    doc2Url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tpop-2',
    title: 'Passive Monthly Rental Dividend Payout',
    amount: '+R4,850.00',
    reference: 'EFT-POP-98124',
    date: '01 Oct 2026, 09:00 AM',
    method: 'FNB Direct Settlement',
    status: 'approved',
    doc1Title: 'Disbursal Bank Advice',
    doc1Name: 'FNB_EFT_Advice_01Oct.pdf',
    doc1Url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    doc2Title: 'Rental Statement Voucher',
    doc2Name: 'Monthly_Yield_Voucher.pdf',
    doc2Url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tpop-3',
    title: 'Tenant Subscription Fee (Previous Cycle)',
    amount: 'R299.99',
    reference: 'TN-POP-2026-0920',
    date: '20 Sep 2026, 08:30 AM',
    method: 'MasterCard Direct Debit',
    status: 'approved',
    doc1Title: 'Debit Confirmation Slip',
    doc1Name: 'Card_Debit_Slip_0920.pdf',
    doc1Url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    doc2Title: 'Tax Invoice & Receipt',
    doc2Name: 'Invoice_TN_0920.pdf',
    doc2Url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
];

const INITIAL_USER_POPS: PoPRecord[] = [
  {
    id: 'upop-1',
    title: 'User Monthly Subscription (App Worker Access)',
    amount: 'R29.99',
    reference: 'USR-POP-88219',
    date: '18 Oct 2026, 10:15 AM',
    method: 'Capitec Pay / Instant EFT',
    status: 'pending',
    doc1Title: 'Payment Proof Slip',
    doc1Name: 'Capitec_Receipt_88219.pdf',
    doc1Url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    doc2Title: 'Digital Access Voucher',
    doc2Name: 'Worker_Access_Pass.pdf',
    doc2Url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'upop-2',
    title: 'Casual GiG Payout: Grocery & Errand Run',
    amount: '+R350.00',
    reference: 'GIG-PAY-7719',
    date: '16 Oct 2026, 04:45 PM',
    method: 'Wallet Release to Bank',
    status: 'approved',
    doc1Title: 'Wallet Payout Slip',
    doc1Name: 'Task_Payout_Receipt_7719.pdf',
    doc1Url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    doc2Title: 'Client Completion Sign-off',
    doc2Name: 'Client_Signoff_Slip.pdf',
    doc2Url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'upop-3',
    title: 'Casual GiG Payout: House Cleaning & Ironing',
    amount: '+R520.00',
    reference: 'GIG-PAY-6642',
    date: '12 Oct 2026, 02:10 PM',
    method: 'Wallet Release to Bank',
    status: 'approved',
    doc1Title: 'Wallet Payout Slip',
    doc1Name: 'Task_Payout_Receipt_6642.pdf',
    doc1Url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    doc2Title: 'Client Verification Slip',
    doc2Name: 'Cleaning_Checklist_Signed.pdf',
    doc2Url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
];

import { db, auth } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export const TenantPortalModal: React.FC<TenantPortalModalProps> = ({ 
  isOpen, 
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TenantTab>('overview');
  const [referrals, setReferrals] = useState<ReferralApplicant[]>([]);
  const [tenantPoPs, setTenantPoPs] = useState<PoPRecord[]>([]);
  const [userPoPs, setUserPoPs] = useState<PoPRecord[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ title: string; url: string } | null>(null);

  useEffect(() => {
    if (!isOpen || !auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const referralsQuery = query(collection(db, 'referrals'), where('userId', '==', userId));
    const unsubscribeReferrals = onSnapshot(referralsQuery, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReferralApplicant));
        setReferrals(data);
    });

    const popsQuery = query(collection(db, 'proofsOfPayment'), where('userId', '==', userId));
    const unsubscribePops = onSnapshot(popsQuery, (snapshot) => {
        const allPops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PoPRecord));
        setTenantPoPs(allPops.filter(p => p.title.toLowerCase().includes('tenant')));
        setUserPoPs(allPops.filter(p => p.title.toLowerCase().includes('subscription')));
    });

    return () => {
        unsubscribeReferrals();
        unsubscribePops();
    };
  }, [isOpen, auth.currentUser]);

  if (!isOpen) return null;

  const tenantReferralLink = `${window.location.origin}/?ref=${auth.currentUser?.uid || 'unknown'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tenantReferralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Referral Actions
  const handleApproveReferral = (id: string) => {
    setReferrals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  };

  const handleRejectReferral = (id: string) => {
    setReferrals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  };

  // Tenant PoP Actions
  const handleApproveTenantPoP = (id: string) => {
    setTenantPoPs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const handleRejectTenantPoP = (id: string) => {
    setTenantPoPs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  // User PoP Actions
  const handleApproveUserPoP = (id: string) => {
    setUserPoPs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
  };

  const handleRejectUserPoP = (id: string) => {
    setUserPoPs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
  };

  return (
    <aside 
      aria-label="Tenant Full Screen Portal"
      className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col w-screen h-screen overflow-hidden animate-fade-in"
    >
      {/* Discreet floating exit button (No top bar) */}
      <button
        onClick={onClose}
        title="Exit Tenant Portal & Return to Map"
        className="fixed top-3 right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-md active:scale-95 transition-all border border-slate-200"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Main Content Area */}
      <main className={`flex-1 ${activeTab === 'overview' ? 'overflow-y-auto p-3 sm:p-5 max-w-4xl mx-auto w-full pb-20' : 'overflow-y-auto px-4 sm:px-6 pt-5 pb-24 max-w-4xl mx-auto w-full space-y-4'}`}>

        {/* ========================================================
            TAB 1: OVERVIEW (COMPACT, NO SCROLLING UP AND DOWN)
            Shows ONLY:
            1. Total Profit
            2. Tenant Subscription Profit
            3. User Subscription Profit
            4. Total Referrals Joined Through Tenant Link
            + Tenant Referral Link
        ======================================================== */}
        {activeTab === 'overview' && (
          <div className="flex flex-col space-y-4 animate-fade-in">
            {/* Header (Compact) */}
            <div className="flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-500" />
                  Overview
                </span>
                <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-tight">
                  Profit &amp; Referral Summary
                </h1>
              </div>
              <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                Active Tenant (R299.99/mo)
              </span>
            </div>

            {/* 1. Total Profit Hero Card (Compact) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-3.5 sm:p-4.5 shadow-md border border-slate-800 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Profit
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                    R{(tenantPoPs.filter(p => p.status === 'approved').reduce((acc, p) => acc + parseFloat(p.amount.replace(/[^0-9.]/g, '')), 0) + 
                       userPoPs.filter(p => p.status === 'approved').reduce((acc, p) => acc + parseFloat(p.amount.replace(/[^0-9.]/g, '')), 0)).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    Consolidated profits from Tenant &amp; User subscriptions.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 block">
                    Next Disbursal
                  </span>
                  <span className="text-xs font-black text-emerald-400">01 Nov 2026</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Auto EFT</span>
                </div>
              </div>
            </div>

            {/* 2. Three Metric Cards Grid (Compact) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
              {/* Tenant Subscription Profit */}
              <div className="p-2.5 sm:p-3.5 bg-gradient-to-br from-blue-50/70 to-white border border-blue-200 rounded-2xl shadow-xs">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-blue-700 block truncate">
                  Tenant Sub Profit
                </span>
                <div className="text-sm sm:text-lg font-black text-slate-950 mt-1">
                  R{tenantPoPs.filter(p => p.status === 'approved').reduce((acc, p) => acc + parseFloat(p.amount.replace(/[^0-9.]/g, '')), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[8px] sm:text-[9px] text-slate-500 block truncate mt-0.5">
                  R299.99/mo tier
                </span>
              </div>

              {/* User Subscription Profit */}
              <div className="p-2.5 sm:p-3.5 bg-gradient-to-br from-amber-50/70 to-white border border-amber-200 rounded-2xl shadow-xs">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-800 block truncate">
                  User Sub Profit
                </span>
                <div className="text-sm sm:text-lg font-black text-slate-950 mt-1">
                  R{userPoPs.filter(p => p.status === 'approved').reduce((acc, p) => acc + parseFloat(p.amount.replace(/[^0-9.]/g, '')), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[8px] sm:text-[9px] text-slate-500 block truncate mt-0.5">
                  R29.99/mo tier
                </span>
              </div>

              {/* Total Referrals Joined Through Tenant Link */}
              <div className="p-2.5 sm:p-3.5 bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-200 rounded-2xl shadow-xs">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-800 block truncate">
                  Total Referrals
                </span>
                <div className="text-sm sm:text-lg font-black text-slate-950 mt-1">
                  {referrals.length}
                </div>
                <span className="text-[8px] sm:text-[9px] text-slate-500 block truncate mt-0.5">
                  Joined via link
                </span>
              </div>
            </div>

            {/* 3. Tenant Referral Link Card (Compact) */}
            <div className="p-3 sm:p-3.5 bg-gradient-to-br from-blue-50 via-white to-slate-50 border border-blue-200 rounded-2xl shadow-2xs space-y-2 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-950 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  Your Tenant Referral Link
                </span>
                <span className="text-[8px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-[11px] font-mono text-slate-800 truncate select-all">
                  {tenantReferralLink}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all active:scale-95 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: VERIFICATION (REFERRAL LIST VIEW)
        ======================================================== */}
        {activeTab === 'verification' && (
          <div className="space-y-4 animate-fade-in">
            {/* Header without upload button */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Referral Verifications
                </span>
                <h1 className="text-xl font-black text-slate-950 tracking-tight mt-0.5">
                  Identity &amp; Document Review
                </h1>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100">
                  {referrals.filter((r) => r.status === 'pending').length} Pending
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {referrals.filter((r) => r.status === 'approved').length} Approved
                </span>
              </div>
            </div>

            {/* Referral Verifications List View */}
            <div className="space-y-3.5">
              {referrals.map((referral) => (
                <div 
                  key={referral.id}
                  className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-sm transition-all space-y-3"
                >
                  {/* Top Row: Info & Status with Approve / Reject Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-950">{referral.name}</h3>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                          referral.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : referral.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        }`}>
                          {referral.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-semibold text-blue-700">{referral.subType}</span>
                        <span>•</span>
                        <span>{referral.submittedDate}</span>
                        <span>•</span>
                        <span className="font-mono">{referral.phone}</span>
                      </div>
                    </div>

                    {/* Action Buttons: Approve / Reject */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => handleApproveReferral(referral.id)}
                        disabled={referral.status === 'approved'}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{referral.status === 'approved' ? 'Approved' : 'Approve'}</span>
                      </button>

                      <button
                        onClick={() => handleRejectReferral(referral.id)}
                        disabled={referral.status === 'rejected'}
                        className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{referral.status === 'rejected' ? 'Rejected' : 'Reject'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Attached Documents Row: Face Selfie & ID Document */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                    {/* 1. Attached Face Selfie */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                      <div 
                        onClick={() => setPreviewImage({ title: `${referral.name} - Face Selfie`, url: referral.faceSelfieUrl })}
                        className="relative w-14 h-14 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-slate-200 shadow-2xs"
                      >
                        <img 
                          src={referral.faceSelfieUrl} 
                          alt="Face Selfie" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Attached Selfie
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          Live Biometric Selfie
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ title: `${referral.name} - Face Selfie`, url: referral.faceSelfieUrl })}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Full Photo</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Attached ID Document */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                      <div 
                        onClick={() => setPreviewImage({ title: `${referral.name} - ${referral.idDocumentName}`, url: referral.idDocumentUrl })}
                        className="relative w-14 h-14 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-slate-200 shadow-2xs bg-slate-200"
                      >
                        <img 
                          src={referral.idDocumentUrl} 
                          alt="ID Document" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Attached ID Document
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {referral.idDocumentName}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ title: `${referral.name} - ${referral.idDocumentName}`, url: referral.idDocumentUrl })}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Document</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: TENANT POP (SAME LOOK AS VERIFICATION WITH 
            APPROVE & REJECT, AND NO TOP UPLOAD BUTTON)
        ======================================================== */}
        {activeTab === 'tenant_pop' && (
          <div className="space-y-4 animate-fade-in">
            {/* Header without upload button */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-4 h-4" />
                  Tenant Proof of Payment
                </span>
                <h1 className="text-xl font-black text-slate-950 tracking-tight mt-0.5">
                  Tenant PoP &amp; Invoices
                </h1>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100">
                  {tenantPoPs.filter((p) => p.status === 'pending').length} Pending
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {tenantPoPs.filter((p) => p.status === 'approved').length} Approved
                </span>
              </div>
            </div>

            {/* Tenant PoP List View (Matching Verification Layout with Approve/Reject) */}
            <div className="space-y-3.5">
              {tenantPoPs.filter(pop => pop.title.toLowerCase().includes('tenant')).map((record) => (
                <div 
                  key={record.id}
                  className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-sm transition-all space-y-3"
                >
                  {/* Top Row: Info, Status & Approve / Reject Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-950">{record.title}</h3>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                          record.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : record.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-bold text-slate-900">{record.amount}</span>
                        <span>•</span>
                        <span>{record.date}</span>
                        <span>•</span>
                        <span className="font-mono text-blue-700">{record.reference}</span>
                        <span>•</span>
                        <span>{record.method}</span>
                      </div>
                    </div>

                    {/* Approve & Reject Actions (Same look as verification) */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => handleApproveTenantPoP(record.id)}
                        disabled={record.status === 'approved'}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{record.status === 'approved' ? 'Approved' : 'Approve'}</span>
                      </button>

                      <button
                        onClick={() => handleRejectTenantPoP(record.id)}
                        disabled={record.status === 'rejected'}
                        className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{record.status === 'rejected' ? 'Rejected' : 'Reject'}</span>
                      </button>

                      <button
                        onClick={() => alert(`Downloading PoP ${record.reference} (PDF)...`)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Download Receipt PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Attached Documents Row (Matching Verification Style) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                    {/* Document 1: Attached Payment Slip */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                      <div 
                        onClick={() => setPreviewImage({ title: `${record.title} - ${record.doc1Title}`, url: record.doc1Url })}
                        className="relative w-14 h-14 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-slate-200 shadow-2xs bg-white"
                      >
                        <img 
                          src={record.doc1Url} 
                          alt={record.doc1Title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Attached Proof Slip
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {record.doc1Name}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ title: `${record.title} - ${record.doc1Title}`, url: record.doc1Url })}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Proof Slip</span>
                        </button>
                      </div>
                    </div>

                    {/* Document 2: Attached Invoice */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                      <div 
                        onClick={() => setPreviewImage({ title: `${record.title} - ${record.doc2Title}`, url: record.doc2Url })}
                        className="relative w-14 h-14 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-slate-200 shadow-2xs bg-white"
                      >
                        <img 
                          src={record.doc2Url} 
                          alt={record.doc2Title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Attached Invoice
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {record.doc2Name}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ title: `${record.title} - ${record.doc2Title}`, url: record.doc2Url })}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: USER POP (SAME LOOK AS VERIFICATION WITH 
            APPROVE & REJECT, AND NO TOP UPLOAD BUTTON)
        ======================================================== */}
        {activeTab === 'user_pop' && (
          <div className="space-y-4 animate-fade-in">
            {/* Header without upload button */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  User Proof of Payment
                </span>
                <h1 className="text-xl font-black text-slate-950 tracking-tight mt-0.5">
                  User PoP &amp; Task Receipts
                </h1>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100">
                  {userPoPs.filter((p) => p.status === 'pending').length} Pending
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {userPoPs.filter((p) => p.status === 'approved').length} Approved
                </span>
              </div>
            </div>

            {/* User PoP List View (Matching Verification Layout with Approve/Reject) */}
            <div className="space-y-3.5">
              {userPoPs.filter(pop => pop.title.toLowerCase().includes('subscription')).map((record) => (
                <div 
                  key={record.id}
                  className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-sm transition-all space-y-3"
                >
                  {/* Top Row: Info, Status & Approve / Reject Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-950">{record.title}</h3>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                          record.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : record.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="font-bold text-slate-900">{record.amount}</span>
                        <span>•</span>
                        <span>{record.date}</span>
                        <span>•</span>
                        <span className="font-mono text-amber-700">{record.reference}</span>
                        <span>•</span>
                        <span>{record.method}</span>
                      </div>
                    </div>

                    {/* Approve & Reject Actions (Same look as verification) */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => handleApproveUserPoP(record.id)}
                        disabled={record.status === 'approved'}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{record.status === 'approved' ? 'Approved' : 'Approve'}</span>
                      </button>

                      <button
                        onClick={() => handleRejectUserPoP(record.id)}
                        disabled={record.status === 'rejected'}
                        className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{record.status === 'rejected' ? 'Rejected' : 'Reject'}</span>
                      </button>

                      <button
                        onClick={() => alert(`Downloading PoP ${record.reference} (PDF)...`)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Download Receipt PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Attached Documents Row (Matching Verification Style) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                    {/* Document 1: Attached Proof Slip */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                      <div 
                        onClick={() => setPreviewImage({ title: `${record.title} - ${record.doc1Title}`, url: record.doc1Url })}
                        className="relative w-14 h-14 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-slate-200 shadow-2xs bg-white"
                      >
                        <img 
                          src={record.doc1Url} 
                          alt={record.doc1Title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Attached Proof Slip
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {record.doc1Name}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ title: `${record.title} - ${record.doc1Title}`, url: record.doc1Url })}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Proof Slip</span>
                        </button>
                      </div>
                    </div>

                    {/* Document 2: Attached Voucher / Signoff */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                      <div 
                        onClick={() => setPreviewImage({ title: `${record.title} - ${record.doc2Title}`, url: record.doc2Url })}
                        className="relative w-14 h-14 rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-slate-200 shadow-2xs bg-white"
                      >
                        <img 
                          src={record.doc2Url} 
                          alt={record.doc2Title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Attached Voucher
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {record.doc2Name}
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ title: `${record.title} - ${record.doc2Title}`, url: record.doc2Url })}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Slip</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          DOCUMENT / IMAGE FULL VIEW PREVIEW MODAL
      ======================================================== */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-900">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-950 truncate max-w-[300px]">
                {previewImage.title}
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] flex items-center justify-center bg-slate-50">
              <img 
                src={previewImage.url} 
                alt={previewImage.title} 
                className="max-h-[60vh] max-w-full rounded-2xl object-contain shadow-md" 
              />
            </div>
            <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOTTOM MENU BAR IN TENANT FEATURE:
          1. Overview
          2. Verification
          3. Tenant PoP
          4. User PoP
      ======================================================== */}
      <nav 
        aria-label="Tenant Portal Bottom Navigation" 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 shadow-2xl backdrop-blur-xl pb-safe"
      >
        <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
          {/* 1. Overview */}
          <button
            onClick={() => setActiveTab('overview')}
            aria-label="Overview Tab"
            className={`flex flex-col items-center justify-center focus:outline-none py-1 px-3 active:scale-95 transition-all ${
              activeTab === 'overview' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900 font-bold'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 stroke-[2.2] transition-colors ${
              activeTab === 'overview' ? 'text-blue-600' : 'text-slate-500'
            }`} />
            <span className="text-[9px] mt-1">Overview</span>
          </button>

          {/* 2. Verification */}
          <button
            onClick={() => setActiveTab('verification')}
            aria-label="Verification Tab"
            className={`flex flex-col items-center justify-center focus:outline-none py-1 px-3 active:scale-95 transition-all ${
              activeTab === 'verification' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900 font-bold'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 stroke-[2.2] transition-colors ${
              activeTab === 'verification' ? 'text-blue-600' : 'text-slate-500'
            }`} />
            <span className="text-[9px] mt-1">Verification</span>
          </button>

          {/* 3. Tenant PoP */}
          <button
            onClick={() => setActiveTab('tenant_pop')}
            aria-label="Tenant PoP Tab"
            className={`flex flex-col items-center justify-center focus:outline-none py-1 px-3 active:scale-95 transition-all ${
              activeTab === 'tenant_pop' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900 font-bold'
            }`}
          >
            <Receipt className={`w-5 h-5 stroke-[2.2] transition-colors ${
              activeTab === 'tenant_pop' ? 'text-blue-600' : 'text-slate-500'
            }`} />
            <span className="text-[9px] mt-1">Tenant PoP</span>
          </button>

          {/* 4. User PoP */}
          <button
            onClick={() => setActiveTab('user_pop')}
            aria-label="User PoP Tab"
            className={`flex flex-col items-center justify-center focus:outline-none py-1 px-3 active:scale-95 transition-all ${
              activeTab === 'user_pop' ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900 font-bold'
            }`}
          >
            <CreditCard className={`w-5 h-5 stroke-[2.2] transition-colors ${
              activeTab === 'user_pop' ? 'text-blue-600' : 'text-slate-500'
            }`} />
            <span className="text-[9px] mt-1">User PoP</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
