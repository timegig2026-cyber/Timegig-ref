import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db } from '../firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && !termsAccepted) {
      setError('You must accept the terms and conditions.');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          firstName: '',
          lastName: '',
          selfieUrl: null,
          location: '',
          phone: '',
          email: userCredential.user.email,
          trades: [],
          socialLinks: [],
          isLocked: false,
          subscriptionStatus: 'inactive',
          subscriptionExpiry: '',
          createdAt: new Date().toISOString(),
          role: 'user',
        });

        // Referral logic
        const refCode = sessionStorage.getItem('referralCode');
        if (refCode && refCode !== userCredential.user.uid) {
          await addDoc(collection(db, 'referrals'), {
            userId: refCode,
            referredUserId: userCredential.user.uid,
            name: 'New User',
            email: userCredential.user.email,
            status: 'pending',
            submittedDate: new Date().toLocaleDateString(),
            subType: 'User Subscription (R29.99/mo)',
          });
          sessionStorage.removeItem('referralCode');
        }
      }
      onAuthSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-200">
        <h2 className="text-3xl font-black mb-6 text-slate-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 border-2 border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all placeholder-slate-500 text-slate-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-4 border-2 border-slate-300 rounded-2xl pr-12 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all placeholder-slate-500 text-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-4.5 text-slate-500 hover:text-slate-800"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
          {!isLogin && (
            <label className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-5 h-5 accent-blue-600" />
              <span>I accept the Terms and Conditions</span>
            </label>
          )}
          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-500/30">
            {isLogin ? 'Login to Access' : 'Register Account'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-slate-600 hover:text-blue-600 font-bold text-center">
          {isLogin ? 'Need an account? Register now' : 'Have an account? Login here'}
        </button>
      </div>
    </div>
  );
};
