import React, { useState, useMemo } from 'react';
import { Article, Category } from '../types';
import { CompactHorizontalCard } from '../components/NewsCards';
import { Search as SearchIcon, X, Filter, ArrowLeft } from 'lucide-react';

interface SearchViewProps {
  articles: Article[];
  categories: Category[];
  onSelectArticle: (article: Article) => void;
  onBack: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  articles,
  categories,
  onSelectArticle,
  onBack,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const filteredArticles = useMemo(() => {
    let result = articles.filter((a) => a.status === 'published');

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.authorName.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.categorySlug === selectedCategory);
    }

    if (sortBy === 'popular') {
      result.sort((a, b) => b.views - a.views);
    } else {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return result;
  }, [articles, query, selectedCategory, sortBy]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top back button */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>প্রচ্ছদে ফিরে যান</span>
        </button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-stone-900 mb-2">
          ঢাকা ডিজিটাল অনুসন্ধান
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          শিরোনাম, প্রতিবেদক, বিষয় বা কি-ওয়ার্ড দিয়ে তাৎক্ষণিক অনুসন্ধান করুন
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative mb-6">
        <SearchIcon className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="অনুসন্ধান করতে লিখুন (যেমন: ঢাকা, বাজেট, ক্রিকেট)..."
          className="w-full pl-12 pr-10 py-3 bg-white border-2 border-stone-300 rounded-none text-sm sm:text-base focus:outline-none focus:border-red-600 shadow-xs"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-100 border border-stone-200 text-xs mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-500" />
          <span className="font-semibold text-stone-700">ফিল্টার:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-stone-300 py-1 px-2 rounded text-xs focus:outline-none focus:border-red-600"
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

        <div className="flex items-center gap-2">
          <span className="text-stone-500">ক্রম:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
            className="bg-white border border-stone-300 py-1 px-2 rounded text-xs focus:outline-none focus:border-red-600"
          >
            <option value="latest">সর্বশেষ প্রকাশিত</option>
            <option value="popular">সর্বাধিক পঠিত</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="text-xs text-stone-500 mb-4 pb-2 border-b border-stone-200">
        মোট ফলাফল: <strong className="text-stone-900">{filteredArticles.length.toLocaleString('bn-BD')}</strong> টি প্রতিবেদন
      </div>

      {/* Results List */}
      {filteredArticles.length > 0 ? (
        <div className="divide-y divide-stone-200 bg-white p-4 border border-stone-200">
          {filteredArticles.map((art) => (
            <CompactHorizontalCard
              key={art.id}
              article={art}
              onClick={onSelectArticle}
            />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-stone-50 border border-stone-200 text-stone-500 text-sm">
          আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ফলাফল পাওয়া যায়নি। অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড অনুসন্ধান করুন।
        </div>
      )}
    </div>
  );
};
