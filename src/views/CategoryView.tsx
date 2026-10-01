import React, { useState } from 'react';
import { Article, Category, AdSetting } from '../types';
import { MediumNewsCard, CompactHorizontalCard } from '../components/NewsCards';
import { AdBanner } from '../components/AdBanner';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface CategoryViewProps {
  category: Category;
  articles: Article[];
  ads: AdSetting[];
  onSelectArticle: (article: Article) => void;
  onBack: () => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  articles,
  ads,
  onSelectArticle,
  onBack,
}) => {
  const [displayCount, setDisplayCount] = useState(8);

  // Filter articles belonging to this category (or all if slug is 'all')
  const categoryArticles =
    category.slug === 'all'
      ? articles
      : articles.filter((a) => a.categorySlug === category.slug);

  const leadStory = categoryArticles[0];
  const remainingArticles = categoryArticles.slice(1, displayCount);
  const popularArticles = [...categoryArticles].sort((a, b) => b.views - a.views).slice(0, 5);

  const sidebarAd = ads.find((a) => a.placement === 'article_sidebar' && a.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Header & Breadcrumb */}
      <div className="pb-3 border-b-2 border-stone-900">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
          <button onClick={onBack} className="hover:text-red-700 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>প্রচ্ছদ</span>
          </button>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="font-bold text-stone-800">{category.name}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-stone-900">
          {category.name} সংবাদ
        </h1>
        {category.description && (
          <p className="text-xs sm:text-sm text-stone-600 mt-1">{category.description}</p>
        )}
      </div>

      {/* 2. Main Category Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Articles */}
        <div className="lg:col-span-8 space-y-6">
          {leadStory ? (
            <div className="pb-6 border-b border-stone-200">
              <MediumNewsCard article={leadStory} onClick={onSelectArticle} />
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 bg-stone-100 rounded">
              এই বিভাগে কোনো নিবন্ধ পাওয়া যায়নি।
            </div>
          )}

          {/* Grid of articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {remainingArticles.map((art) => (
              <MediumNewsCard key={art.id} article={art} onClick={onSelectArticle} />
            ))}
          </div>

          {/* Load More Button */}
          {categoryArticles.length > displayCount && (
            <div className="pt-6 text-center">
              <button
                onClick={() => setDisplayCount((prev) => prev + 6)}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm transition cursor-pointer"
              >
                আরও সংবাদ দেখুন
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:border-l lg:border-stone-200 lg:pl-6">
          {sidebarAd && (
            <div className="mb-6">
              <AdBanner placement="article_sidebar" ad={sidebarAd} />
            </div>
          )}

          {/* Popular in this category */}
          <div className="bg-stone-50 border border-stone-200 p-4">
            <h3 className="font-bold text-base font-bengali-serif text-stone-900 pb-2 mb-3 border-b border-stone-200">
              {category.name} বিভাগে পঠিত
            </h3>
            <div className="divide-y divide-stone-200">
              {popularArticles.map((art) => (
                <CompactHorizontalCard
                  key={art.id}
                  article={art}
                  onClick={onSelectArticle}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
