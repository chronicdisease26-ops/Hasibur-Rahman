import React, { useState } from 'react';
import { AdSetting, SiteSettings } from '../../types';
import { NewsStore } from '../../lib/storage';
import { DollarSign, ShieldCheck, Save, ToggleLeft, ToggleRight } from 'lucide-react';

interface AdminAdsProps {
  ads: AdSetting[];
  siteSettings: SiteSettings;
  onRefresh: () => void;
}

export const AdminAds: React.FC<AdminAdsProps> = ({
  ads,
  siteSettings,
  onRefresh,
}) => {
  // Adsterra state
  const [popunderEnabled, setPopunderEnabled] = useState(
    siteSettings.adsterraPopunderEnabled
  );
  const [popunderCode, setPopunderCode] = useState(
    siteSettings.adsterraPopunderCode || ''
  );
  const [socialBarEnabled, setSocialBarEnabled] = useState(
    siteSettings.adsterraSocialBarEnabled
  );
  const [socialBarCode, setSocialBarCode] = useState(
    siteSettings.adsterraSocialBarCode || ''
  );

  const [activeTab, setActiveTab] = useState<'adsterra' | 'banners'>('adsterra');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAdsterra = (e: React.FormEvent) => {
    e.preventDefault();
    NewsStore.saveSiteSettings({
      ...siteSettings,
      adsterraPopunderEnabled: popunderEnabled,
      adsterraPopunderCode: popunderCode,
      adsterraSocialBarEnabled: socialBarEnabled,
      adsterraSocialBarCode: socialBarCode,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  const handleToggleBanner = (ad: AdSetting) => {
    NewsStore.saveAdSetting({
      ...ad,
      isActive: !ad.isActive,
    });
    onRefresh();
  };

  const handleUpdateBannerImage = (ad: AdSetting, newUrl: string) => {
    NewsStore.saveAdSetting({
      ...ad,
      imageUrl: newUrl,
    });
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            বিজ্ঞাপন ও Adsterra নিয়ন্ত্রণ
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          ওয়েবসাইটের ব্যানার অ্যাড, Adsterra Popunder ও Social Bar সহজেই কনফিগার ও চালু/বন্ধ করুন
        </p>

        {/* Tab switch */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-stone-200 text-xs">
          <button
            onClick={() => setActiveTab('adsterra')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer ${
              activeTab === 'adsterra'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Adsterra স্ক্রিপ্ট সেটিংস
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-1.5 rounded font-medium transition cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-red-600 text-white font-bold'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            ডিসপ্লে ব্যানার স্লটসমূহ ({ads.length})
          </button>
        </div>
      </div>

      {activeTab === 'adsterra' && (
        <form onSubmit={handleSaveAdsterra} className="space-y-6">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded">
              ✓ Adsterra কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে।
            </div>
          )}

          {/* Adsterra Popunder */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm font-bengali-serif text-stone-900">
                  Adsterra Popunder
                </h3>
                <p className="text-xs text-stone-500">
                  ব্যবহারকারীর প্রথম ক্লিকে নতুন উইন্ডোতে পপআন্ডার বিজ্ঞাপন চালু হবে
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPopunderEnabled(!popunderEnabled)}
                className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                {popunderEnabled ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <ToggleRight className="w-6 h-6" /> সক্রিয়
                  </span>
                ) : (
                  <span className="text-stone-400 flex items-center gap-1">
                    <ToggleLeft className="w-6 h-6" /> নিষ্ক্রিয়
                  </span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Adsterra Popunder স্ক্রিপ্ট কোড
              </label>
              <textarea
                rows={3}
                value={popunderCode}
                onChange={(e) => setPopunderCode(e.target.value)}
                placeholder="<script type='text/javascript' src='//...popunder.js'></script>"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded font-mono text-xs focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Adsterra Social Bar */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm font-bengali-serif text-stone-900">
                  Adsterra Social Bar / In-Page Push
                </h3>
                <p className="text-xs text-stone-500">
                  মোবাইল ও ডেক্সটপে নন-ইনট্রুসিভ ফ্লটিং সোশ্যাল নোটিফিকেশন বার
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSocialBarEnabled(!socialBarEnabled)}
                className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                {socialBarEnabled ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <ToggleRight className="w-6 h-6" /> সক্রিয়
                  </span>
                ) : (
                  <span className="text-stone-400 flex items-center gap-1">
                    <ToggleLeft className="w-6 h-6" /> নিষ্ক্রিয়
                  </span>
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Adsterra Social Bar স্ক্রিপ্ট কোড
              </label>
              <textarea
                rows={3}
                value={socialBarCode}
                onChange={(e) => setSocialBarCode(e.target.value)}
                placeholder="<script type='text/javascript' src='//...socialbar.js'></script>"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded font-mono text-xs focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm rounded transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Adsterra সেটিংস সংরক্ষণ করুন</span>
          </button>
        </form>
      )}

      {activeTab === 'banners' && (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white p-5 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{ad.name}</h3>
                  <div className="text-[11px] text-stone-500 font-mono">
                    স্লট: {ad.placement} · সাইজ: {ad.bannerSize || 'Responsive'} · টার্গেট:{' '}
                    {ad.deviceTarget}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleBanner(ad)}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition ${
                    ad.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {ad.isActive ? 'চালু আছে' : 'বন্ধ আছে'}
                </button>
              </div>

              <div>
                <label className="block text-xs text-stone-600 mb-1">ব্যানার ইমেজ লিংক:</label>
                <input
                  type="text"
                  value={ad.imageUrl || ''}
                  onChange={(e) => handleUpdateBannerImage(ad, e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs"
                />
              </div>

              {ad.imageUrl && (
                <div className="p-2 bg-stone-100 rounded overflow-hidden">
                  <div className="text-[10px] text-stone-400 mb-1 font-mono">প্রিভিউ:</div>
                  <img
                    src={ad.imageUrl}
                    alt={ad.name}
                    referrerPolicy="no-referrer"
                    className="max-h-20 object-cover mx-auto"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
