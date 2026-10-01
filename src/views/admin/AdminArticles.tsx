import React, { useState } from 'react';
import { Article, Category } from '../../types';
import { getRelativeTimeBengali } from '../../lib/dateUtils';
import { NewsStore } from '../../lib/storage';
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Copy,
  Star,
  Eye,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface AdminArticlesProps {
  articles: Article[];
  categories: Category[];
  onNewArticle: () => void;
  onEditArticle: (article: Article) => void;
  onRefresh: () => void;
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({
  articles,
  categories,
  onNewArticle,
  onEditArticle,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = articles.filter((art) => {
    if (statusFilter !== 'all' && art.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && art.categorySlug !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.authorName.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${title}" মুছে ফেলতে চান?`)) {
      NewsStore.deleteArticle(id);
      onRefresh();
    }
  };

  const handleDuplicate = (art: Article) => {
    const duplicated: Article = {
      ...art,
      id: `art-${Date.now()}`,
      slug: `${art.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${art.title} (কপি)`,
      status: 'draft',
      isLeadStory: false,
      publishedAt: new Date().toISOString(),
      views: 0,
    };
    NewsStore.saveArticle(duplicated);
    onRefresh();
  };

  const handleToggleLead = (art: Article) => {
    const updated: Article = {
      ...art,
      isLeadStory: !art.isLeadStory,
    };
    NewsStore.saveArticle(updated);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-bengali-serif text-stone-900">
            নিবন্ধ ও প্রতিবেদন ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            মোট {articles.length.toLocaleString('bn-BD')} টি সংবাদ সংরক্ষিত আছে
          </p>
        </div>

        <button
          onClick={onNewArticle}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রতিবেদন তৈরি</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-stone-200">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="শিরোনাম বা লেখক দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-300 text-xs rounded focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 py-1.5 px-2.5 rounded focus:outline-none focus:border-red-600"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="published">প্রকাশিত (Published)</option>
            <option value="draft">খসড়া (Draft)</option>
            <option value="scheduled">নির্ধারিত (Scheduled)</option>
            <option value="pending">পেন্ডিং রিভিউ (Pending)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-stone-50 border border-stone-300 py-1.5 px-2.5 rounded focus:outline-none focus:border-red-600"
          >
            <option value="all">সকল বিভাগ</option>
            {categories
              .filter((c) => c.slug !== 'home')
              .map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-mono border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">লিড</th>
                <th className="py-3 px-4">শিরোনাম</th>
                <th className="py-3 px-4">বিভাগ</th>
                <th className="py-3 px-4">প্রতিবেদক</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4 text-right">ভিউ</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleLead(art)}
                      className={`p-1 rounded cursor-pointer ${
                        art.isLeadStory
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-stone-300 hover:text-stone-500'
                      }`}
                      title={art.isLeadStory ? 'প্রধান লিড স্টোরি' : 'লিড স্টোরি হিসেবে সেট করুন'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>

                  <td className="py-3 px-4 font-semibold text-stone-900 max-w-sm">
                    <div className="truncate">{art.title}</div>
                    {art.isBreaking && (
                      <span className="text-[10px] text-red-600 font-bold uppercase font-mono mr-1">
                        [ব্রেকিং]
                      </span>
                    )}
                    {art.isTrending && (
                      <span className="text-[10px] text-amber-600 font-bold uppercase font-mono">
                        [ট্রেন্ডিং]
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">{art.categoryName}</td>

                  <td className="py-3 px-4 whitespace-nowrap">{art.authorName}</td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-mono rounded ${
                        art.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : art.status === 'draft'
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {art.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-stone-500">
                    {getRelativeTimeBengali(art.publishedAt)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono whitespace-nowrap">
                    {art.views.toLocaleString('bn-BD')}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                    <button
                      onClick={() => onEditArticle(art)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition cursor-pointer"
                      title="সম্পাদনা"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDuplicate(art)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition cursor-pointer"
                      title="কপি তৈরি করুন"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(art.id, art.title)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
