import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { NewsStore } from '../../lib/storage';
import { Settings, Save, CheckCircle } from 'lucide-react';

interface AdminSiteSettingsProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSiteSettings: React.FC<AdminSiteSettingsProps> = ({
  settings,
  onRefresh,
}) => {
  const [form, setForm] = useState<SiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    NewsStore.saveSiteSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            সাইট ও সিস্টেম সেটিংস
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          ওয়েবসাইটের নাম, ব্রান্ডিং, যোগাযোগ তথ্য, সোশ্যাল লিংক ও অ্যানালিটিক্স কনফিগারেশন
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>সাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে।</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Basic Info */}
        <div className="bg-white p-6 border border-stone-200 space-y-4">
          <h2 className="text-sm font-bold font-bengali-serif text-stone-900 border-b border-stone-200 pb-2">
            ব্র্যান্ডিং ও মৌলিক তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ওয়েবসাইটের নাম *
              </label>
              <input
                type="text"
                required
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ট্যাগলাইন (Tagline) *
              </label>
              <input
                type="text"
                required
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 border border-stone-200 space-y-4">
          <h2 className="text-sm font-bold font-bengali-serif text-stone-900 border-b border-stone-200 pb-2">
            বার্তা কক্ষ ও যোগাযোগের তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ইমেইল ঠিকানা *
              </label>
              <input
                type="email"
                required
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ফোন নম্বর *
              </label>
              <input
                type="text"
                required
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              বার্তা কক্ষের ঠিকানা
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 border border-stone-200 space-y-4">
          <h2 className="text-sm font-bold font-bengali-serif text-stone-900 border-b border-stone-200 pb-2">
            সোশ্যাল মিডিয়া ইউআরএল
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ফেসবুক পেজ লিঙ্ক
              </label>
              <input
                type="text"
                value={form.facebookUrl}
                onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                টুইটার / এক্স লিঙ্ক
              </label>
              <input
                type="text"
                value={form.twitterUrl}
                onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ইউটিউব চ্যানেল লিঙ্ক
              </label>
              <input
                type="text"
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ইনস্টাগ্রাম লিঙ্ক
              </label>
              <input
                type="text"
                value={form.instagramUrl}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Analytics & SEO */}
        <div className="bg-white p-6 border border-stone-200 space-y-4">
          <h2 className="text-sm font-bold font-bengali-serif text-stone-900 border-b border-stone-200 pb-2">
            গুগল অ্যানালিটিক্স ও ডিফল্ট এসইও
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Google Analytics (GA4) Measurement ID
            </label>
            <input
              type="text"
              value={form.gaMeasurementId}
              onChange={(e) => setForm({ ...form, gaMeasurementId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ডিফল্ট এসইও শিরোনাম (Default SEO Title)
            </label>
            <input
              type="text"
              value={form.defaultSeoTitle}
              onChange={(e) => setForm({ ...form, defaultSeoTitle: e.target.value })}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ডিফল্ট মেটা ডেসক্রিপশন (Default Meta Description)
            </label>
            <textarea
              rows={2}
              value={form.defaultMetaDescription}
              onChange={(e) => setForm({ ...form, defaultMetaDescription: e.target.value })}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>সকল সেটিংস সংরক্ষণ করুন</span>
        </button>
      </form>
    </div>
  );
};
