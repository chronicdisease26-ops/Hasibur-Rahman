import React from 'react';
import { Article, Category, BreakingNewsItem } from '../../types';
import { getRelativeTimeBengali } from '../../lib/dateUtils';
import {
  FileText,
  Eye,
  Zap,
  FolderTree,
  Users,
  Clock,
  Plus,
  TrendingUp,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  breakingNews: BreakingNewsItem[];
  onNewArticle: () => void;
  onEditArticle: (article: Article) => void;
  onGoToTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  breakingNews,
  onNewArticle,
  onEditArticle,
  onGoToTab,
}) => {
  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.status === 'published').length;
  const draftArticles = articles.filter((a) => a.status === 'draft').length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const activeBreaking = breakingNews.filter((b) => b.isActive).length;

  const recentArticles = articles.slice(0, 6);

  // Group views by category for chart
  const categoryStats = categories.slice(1, 7).map((cat) => {
    const catArticles = articles.filter((a) => a.categorySlug === cat.slug);
    const catViews = catArticles.reduce((sum, a) => sum + (a.views || 0), 0);
    return {
      name: cat.name,
      count: catArticles.length,
      views: catViews,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-bengali-serif text-stone-900">
            বার্তা কক্ষ ওভারভিউ
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            ঢাকা ডিজিটাল নিউজ ব্যবস্থাপনার সার্বিক হালচাল ও পরিসংখ্যান
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNewArticle}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন প্রতিবেদন তৈরি</span>
          </button>
          <button
            onClick={() => onGoToTab('breaking-news')}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>ব্রেকিং নিউজ</span>
          </button>
        </div>
      </div>

      {/* 1. Stat Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 border border-stone-200 space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>মোট প্রতিবেদন</span>
            <FileText className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {totalArticles.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {publishedArticles} প্রকাশিত
          </div>
        </div>

        <div className="bg-white p-4 border border-stone-200 space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>মোট ভিউজ</span>
            <Eye className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {totalViews.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-stone-500">সকল প্ল্যাটফর্ম মিলিয়ে</div>
        </div>

        <div className="bg-white p-4 border border-stone-200 space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>সক্রিয় ব্রেকিং</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600">
            {activeBreaking.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-stone-500">লাইভ স্ক্রোলিং</div>
        </div>

        <div className="bg-white p-4 border border-stone-200 space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>খসড়া ও পেন্ডিং</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {draftArticles.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-stone-500">রিভিউ অপেক্ষায়</div>
        </div>

        <div className="bg-white p-4 border border-stone-200 space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>ক্যাটাগরি সমূহ</span>
            <FolderTree className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {categories.length.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-stone-500">সক্রিয় নিউজ বিভাগ</div>
        </div>
      </div>

      {/* 2. Visual Analytics & Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Views Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="text-sm font-bold font-bengali-serif text-stone-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-600" />
              <span>বিভাগভিত্তিক পাঠকপ্রিয়তা ও ভিউজ</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">সাম্প্রতিক ডাটা</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryStats.map((stat, idx) => {
              const maxViews = Math.max(...categoryStats.map((s) => s.views), 1);
              const percentage = Math.round((stat.views / maxViews) * 100);

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between text-stone-700">
                    <span className="font-medium">{stat.name}</span>
                    <span className="font-mono text-stone-500">
                      {stat.views.toLocaleString('bn-BD')} ভিউ ({stat.count} প্রতিবেদন)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Publishing Activity */}
        <div className="lg:col-span-5 bg-white p-6 border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="text-sm font-bold font-bengali-serif text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>নিউজ প্রকাশনার গতিপ্রকৃতি</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs text-stone-600">
            <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
              <div className="font-semibold text-stone-800">আজকের সংবাদ উৎপাদন হার:</div>
              <p>প্রতি ঘণ্টায় গড়ে ১.৫ টি বিশ্লেষণমূলক সংবাদ প্রস্তুত হচ্ছে।</p>
            </div>
            <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
              <div className="font-semibold text-stone-800">সর্বাধিক পঠিত সেগমেন্ট:</div>
              <p>জাতীয় ও অর্থনীতি বিষয়ে পাঠকদের এনগেজমেন্ট সর্বাধিক (৭০%+ সময় ধরে পাঠ)।</p>
            </div>
            <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
              <div className="font-semibold text-stone-800">গুগল নিউজ ও এসইও সিঙ্ক:</div>
              <p className="text-emerald-700 font-medium">
                ✓ সাইটম্যাপ ও মেটাট্যাগ স্বয়ংক্রিয়ভাবে সিঙ্ক হচ্ছে।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Articles Table */}
      <div className="bg-white border border-stone-200 overflow-hidden">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-200">
          <h3 className="text-sm sm:text-base font-bold font-bengali-serif text-stone-900">
            সাম্প্রতিক প্রকাশিত প্রতিবেদনসমূহ
          </h3>
          <button
            onClick={() => onGoToTab('articles')}
            className="text-xs text-red-700 font-semibold hover:underline"
          >
            সকল প্রতিবেদন ({totalArticles})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-mono border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">শিরোনাম</th>
                <th className="py-3 px-4">বিভাগ</th>
                <th className="py-3 px-4">লেখক</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-right">ভিউ</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {recentArticles.map((art) => (
                <tr key={art.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 px-4 font-medium text-stone-900 max-w-xs truncate">
                    {art.title}
                  </td>
                  <td className="py-3 px-4">{art.categoryName}</td>
                  <td className="py-3 px-4">{art.authorName}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-100 text-emerald-800">
                      {art.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {art.views.toLocaleString('bn-BD')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onEditArticle(art)}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] font-medium transition cursor-pointer"
                    >
                      সম্পাদনা
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
