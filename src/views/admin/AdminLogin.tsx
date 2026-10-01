import React, { useState } from 'react';
import { NewsStore } from '../../lib/storage';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('admin@dhaka.news');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = NewsStore.login(email, password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('ভুল ইমেইল বা পাসওয়ার্ড। ডেমো অ্যাকাউন্টে প্রবেশ করতে admin@dhaka.news এবং demo123 ব্যবহার করুন।');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-stone-100">
      <div className="w-full max-w-md bg-white border border-stone-200 shadow-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="text-3xl font-black font-bengali-serif text-stone-900">ঢাকা</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
          </div>
          <h2 className="text-lg font-bold font-bengali-serif text-stone-800">
            বার্তা কক্ষ নিয়ন্ত্রণ প্যানেল
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            নিরাপদ প্রমাণীকরণ ও সম্পাদকীয় অ্যাক্সেস
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ইমেইল অ্যাড্রেস
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 text-xs sm:text-sm rounded focus:outline-none focus:border-red-600"
                placeholder="admin@dhaka.news"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 text-xs sm:text-sm rounded focus:outline-none focus:border-red-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="bg-stone-50 p-2.5 rounded border border-stone-200 text-[11px] text-stone-600 space-y-0.5">
            <div className="font-semibold text-stone-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ডেমো অ্যাকাউন্ট তথ্য:</span>
            </div>
            <div>ইমেইল: <code className="text-red-700">admin@dhaka.news</code></div>
            <div>পাসওয়ার্ড: <code className="text-red-700">demo123</code></div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm rounded transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>লগইন করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onCancel}
            className="text-xs text-stone-500 hover:text-stone-800 transition"
          >
            ওয়েবসাইটে ফিরে যান
          </button>
        </div>
      </div>
    </div>
  );
};
