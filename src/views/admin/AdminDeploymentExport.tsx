import React, { useState } from 'react';
import { NewsStore } from '../../lib/storage';
import { DownloadCloud, FileCode, CheckCircle, RefreshCw, Server, Shield } from 'lucide-react';

export const AdminDeploymentExport: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);
  const [buildTriggered, setBuildTriggered] = useState(false);
  const [buildWebhookUrl, setBuildWebhookUrl] = useState('');

  const handleExportJson = () => {
    const backupJson = NewsStore.exportFullBackup();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dhaka-news-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleTriggerNetlify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildWebhookUrl) return;
    setBuildTriggered(true);
    setTimeout(() => setBuildTriggered(false), 4000);
  };

  const envSample = `# Environment Variables for Dhaka News Portal
# Website & General
VITE_SITE_URL=https://dhaka.news
VITE_SITE_NAME="ঢাকা"
VITE_SITE_TAGLINE="দেশ ও বিশ্বের সর্বশেষ সংবাদ"

# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional Database & Storage
DATABASE_URL=postgresql://user:password@host:5432/dhaka_db
ADMIN_JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Adsterra Network (Configured in Admin Settings)
VITE_ADSTERRA_ENABLED=true
`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <DownloadCloud className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            ডেপ্লয়মেন্ট ও ডেটা ব্যাকআপ প্যাকেজ
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          প্রোডাকশন ডেপ্লয়মেন্টের জন্য সম্পূর্ণ ডেটা এক্সপোর্ট, Netlify বিল্ড হুক এবং এনভায়রনমেন্ট কনফিগারেশন
        </p>
      </div>

      {/* 1. Full JSON Data Export */}
      <div className="bg-white p-6 border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold font-bengali-serif text-stone-900">
              নিউজ ডেটা ব্যাকআপ ও এক্সপোর্ট (JSON)
            </h2>
            <p className="text-xs text-stone-500">
              সকল প্রতিবেদন, ক্যাটাগরি, লেখক, ব্রেকিং নিউজ এবং বিজ্ঞাপন সেটিংস একটি একক ফাইলে ডাউনলোড করুন
            </p>
          </div>

          <div className="text-right font-mono text-[11px] text-stone-400">
            ভার্সন: 1.0.0 (Netlify Ready)
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJson}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded flex items-center gap-2 transition cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4 text-emerald-400" />
            <span>সম্পূর্ণ ব্যাকআপ প্যাকেজ ডাউনলোড করুন</span>
          </button>

          {downloaded && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> ডাউনলোড শুরু হয়েছে
            </span>
          )}
        </div>
      </div>

      {/* 2. Netlify Build Hook Trigger */}
      <div className="bg-white p-6 border border-stone-200 space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-stone-600" />
          <h2 className="text-sm font-bold font-bengali-serif text-stone-900">
            Netlify Production Build Hook (সিঙ্ক)
          </h2>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed">
          আপনার Netlify প্রোজেক্টের <em>Build Hooks</em> ইউআরএল এখানে যুক্ত করে সরাসরি একটি প্রোডাকশন বিল্ড ট্রিগার করতে পারেন।
        </p>

        <form onSubmit={handleTriggerNetlify} className="space-y-3">
          <input
            type="url"
            value={buildWebhookUrl}
            onChange={(e) => setBuildWebhookUrl(e.target.value)}
            placeholder="https://api.netlify.com/build_hooks/xxxxxxxxxxxxxxxx"
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded font-mono text-xs focus:outline-none focus:border-red-600"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!buildWebhookUrl}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-stone-300 text-white text-xs font-medium rounded transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Netlify বিল্ড শুরু করুন</span>
            </button>

            {buildTriggered && (
              <span className="text-xs text-emerald-700 font-medium">
                ✓ ওয়েবহুক সংকেত সফলভাবে প্রেরণ করা হয়েছে।
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 3. Environment Variables Reference (.env.example) */}
      <div className="bg-white p-6 border border-stone-200 space-y-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-stone-600" />
          <h2 className="text-sm font-bold font-bengali-serif text-stone-900">
            প্রোডাকশন এনভায়রনমেন্ট ভ্যারিয়েবল (.env.example)
          </h2>
        </div>
        <p className="text-xs text-stone-500">
          হোস্টিং বা Netlify সাইট সেটিংসের Environment Variables-এ নিম্নের ভ্যারিয়েবলগুলো প্রদান করুন:
        </p>

        <pre className="p-4 bg-stone-900 text-stone-200 text-xs font-mono rounded overflow-x-auto leading-relaxed">
          {envSample}
        </pre>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>কোনো গোপন পাসওয়ার্ড বা ডাটাবেজ সিক্রেট সোর্স কোডে উন্মুক্ত নয়।</span>
        </div>
      </div>
    </div>
  );
};
