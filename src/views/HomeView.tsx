import React, { useState } from 'react';
import {
  Article,
  Category,
  AdSetting,
  PhotoAlbum,
  VideoNews,
} from '../types';
import {
  FeaturedHeroCard,
  MediumNewsCard,
  CompactHorizontalCard,
  SmallLatestCard,
  TrendingRankCard,
  OpinionNewsCard,
  PhotoAlbumCard,
  VideoNewsCard,
} from '../components/NewsCards';
import { AdBanner } from '../components/AdBanner';
import { NewsStore } from '../lib/storage';
import {
  Flame,
  Clock,
  TrendingUp,
  Camera,
  Video,
  Send,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';

interface HomeViewProps {
  articles: Article[];
  categories: Category[];
  ads: AdSetting[];
  photoAlbums: PhotoAlbum[];
  videoNews: VideoNews[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (slug: string) => void;
  onSelectPhotoAlbum: (album: PhotoAlbum) => void;
  onSelectVideo: (video: VideoNews) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  categories,
  ads,
  photoAlbums,
  videoNews,
  onSelectArticle,
  onSelectCategory,
  onSelectPhotoAlbum,
  onSelectVideo,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Lead and featured stories
  const leadStory = articles.find((a) => a.isLeadStory) || articles[0];
  const secondaryStories = articles
    .filter((a) => a.id !== leadStory?.id && a.isFeatured)
    .slice(0, 3);
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 7);
  const trendingArticles = articles
    .filter((a) => a.isTrending || a.views > 7000)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Grouped by Category for editorial blocks
  const nationalArticles = articles.filter((a) => a.categorySlug === 'national').slice(0, 4);
  const politicsArticles = articles.filter((a) => a.categorySlug === 'politics').slice(0, 4);
  const economyArticles = articles.filter((a) => a.categorySlug === 'economy').slice(0, 4);
  const sportsArticles = articles.filter((a) => a.categorySlug === 'sports').slice(0, 4);
  const techArticles = articles.filter((a) => a.categorySlug === 'technology').slice(0, 4);
  const opinionArticles = articles.filter((a) => a.categorySlug === 'opinion').slice(0, 3);

  // Ad placements
  const belowNavAd = ads.find((a) => a.placement === 'below_nav' && a.isActive);
  const middleAd = ads.find((a) => a.placement === 'homepage_middle' && a.isActive);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    NewsStore.addSubscriber(newsletterEmail);
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Below Navigation Ad Banner */}
      {belowNavAd && (
        <div className="max-w-7xl mx-auto px-4 pt-2">
          <AdBanner placement="below_nav" ad={belowNavAd} />
        </div>
      )}

      {/* 2. Primary Hero Editorial Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Lead Story (Col 1-7) */}
          <div className="lg:col-span-7 xl:col-span-8">
            {leadStory && (
              <FeaturedHeroCard article={leadStory} onClick={onSelectArticle} />
            )}

            {/* 2 Sub-lead stories beneath lead story */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-200">
              {secondaryStories.slice(0, 2).map((art) => (
                <MediumNewsCard
                  key={art.id}
                  article={art}
                  onClick={onSelectArticle}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Live Latest News & Trending (Col 8-12) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:border-l lg:border-stone-200 lg:pl-6">
            {/* Live Latest News Box */}
            <div className="bg-stone-50 border border-stone-200 p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <h3 className="font-bold text-base font-bengali-serif text-stone-900">
                    সর্বশেষ সংবাদ
                  </h3>
                </div>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="text-xs text-red-700 hover:underline cursor-pointer"
                >
                  সব দেখুন
                </button>
              </div>

              <div className="divide-y divide-stone-200">
                {latestArticles.map((art) => (
                  <SmallLatestCard
                    key={art.id}
                    article={art}
                    onClick={onSelectArticle}
                  />
                ))}
              </div>
            </div>

            {/* 3rd Secondary Story */}
            {secondaryStories[2] && (
              <div className="pt-2">
                <CompactHorizontalCard
                  article={secondaryStories[2]}
                  onClick={onSelectArticle}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Trending Strip */}
      <section className="bg-stone-100/70 py-6 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold font-bengali-serif text-stone-900">
              পাঠকপ্রিয় ও আলোচিত সংবাদ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingArticles.map((art, idx) => (
              <TrendingRankCard
                key={art.id}
                article={art}
                rank={idx + 1}
                onClick={onSelectArticle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Category Section: জাতীয় ও রাজনীতি (National & Politics) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* National */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-stone-900">
              <h2 className="text-xl font-bold font-bengali-serif text-stone-900">
                জাতীয়
              </h2>
              <button
                onClick={() => onSelectCategory('national')}
                className="text-xs font-semibold text-red-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>আরও জাতীয়</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nationalArticles[0] && (
              <MediumNewsCard
                article={nationalArticles[0]}
                onClick={onSelectArticle}
              />
            )}

            <div className="mt-3 divide-y divide-stone-200">
              {nationalArticles.slice(1).map((art) => (
                <CompactHorizontalCard
                  key={art.id}
                  article={art}
                  onClick={onSelectArticle}
                />
              ))}
            </div>
          </div>

          {/* Politics */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-stone-900">
              <h2 className="text-xl font-bold font-bengali-serif text-stone-900">
                রাজনীতি
              </h2>
              <button
                onClick={() => onSelectCategory('politics')}
                className="text-xs font-semibold text-red-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>আরও রাজনীতি</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {politicsArticles[0] && (
              <MediumNewsCard
                article={politicsArticles[0]}
                onClick={onSelectArticle}
              />
            )}

            <div className="mt-3 divide-y divide-stone-200">
              {politicsArticles.slice(1).map((art) => (
                <CompactHorizontalCard
                  key={art.id}
                  article={art}
                  onClick={onSelectArticle}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Middle Sponsor Ad Banner */}
      {middleAd && (
        <div className="max-w-7xl mx-auto px-4 my-6">
          <AdBanner placement="homepage_middle" ad={middleAd} />
        </div>
      )}

      {/* 6. Category Section: অর্থনীতি ও খেলা (Economy & Sports) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Economy */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-stone-900">
              <h2 className="text-xl font-bold font-bengali-serif text-stone-900">
                অর্থনীতি ও বাণিজ্য
              </h2>
              <button
                onClick={() => onSelectCategory('economy')}
                className="text-xs font-semibold text-red-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>আরও অর্থনীতি</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {economyArticles[0] && (
              <MediumNewsCard
                article={economyArticles[0]}
                onClick={onSelectArticle}
              />
            )}

            <div className="mt-3 divide-y divide-stone-200">
              {economyArticles.slice(1).map((art) => (
                <CompactHorizontalCard
                  key={art.id}
                  article={art}
                  onClick={onSelectArticle}
                />
              ))}
            </div>
          </div>

          {/* Sports */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-stone-900">
              <h2 className="text-xl font-bold font-bengali-serif text-stone-900">
                খেলাধুলা
              </h2>
              <button
                onClick={() => onSelectCategory('sports')}
                className="text-xs font-semibold text-red-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>আরও খেলা</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {sportsArticles[0] && (
              <MediumNewsCard
                article={sportsArticles[0]}
                onClick={onSelectArticle}
              />
            )}

            <div className="mt-3 divide-y divide-stone-200">
              {sportsArticles.slice(1).map((art) => (
                <CompactHorizontalCard
                  key={art.id}
                  article={art}
                  onClick={onSelectArticle}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Opinion & Columns Section */}
      <section className="bg-stone-50 py-8 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-stone-300">
            <h2 className="text-xl font-bold font-bengali-serif text-stone-900">
              মতামত ও বিশ্লেষণ
            </h2>
            <button
              onClick={() => onSelectCategory('opinion')}
              className="text-xs text-red-700 font-semibold hover:underline cursor-pointer"
            >
              সব কলাম দেখুন
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opinionArticles.map((art) => (
              <OpinionNewsCard
                key={art.id}
                article={art}
                onClick={onSelectArticle}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Multimedia Section: Video & Photos */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Video News (Col 1-8) */}
          <div className="lg:col-span-8 bg-stone-950 p-6 text-white rounded-none">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold font-bengali-serif">ভিডিও সংবাদ</h2>
              </div>
              <button
                onClick={() => onSelectCategory('videos')}
                className="text-xs text-stone-400 hover:text-white cursor-pointer"
              >
                সব ভিডিও
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {videoNews.map((vid) => (
                <VideoNewsCard
                  key={vid.id}
                  video={vid}
                  onClick={onSelectVideo}
                />
              ))}
            </div>
          </div>

          {/* Photo Gallery (Col 9-12) */}
          <div className="lg:col-span-4 bg-stone-100 p-6 border border-stone-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-bold font-bengali-serif text-stone-900">
                  চিত্র সংবাদ
                </h2>
              </div>
              <button
                onClick={() => onSelectCategory('photos')}
                className="text-xs text-red-700 hover:underline cursor-pointer"
              >
                সব অ্যালবাম
              </button>
            </div>

            <div className="space-y-4">
              {photoAlbums.map((album) => (
                <PhotoAlbumCard
                  key={album.id}
                  album={album}
                  onClick={onSelectPhotoAlbum}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Newsletter Subscription Bar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-stone-900 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-red-600">
          <div className="max-w-xl space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold font-bengali-serif">
              সকালের প্রথম খবর পৌঁছে যাবে আপনার ইনবক্সে
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              দেশ ও বিশ্বের গুরুত্বপূর্ণ ঘটনার নির্ভরযোগ্য সারসংক্ষেপ পেতে ‘ঢাকা’র দৈনিক সংবাদপত্রে যুক্ত হোন।
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm bg-emerald-950/60 px-4 py-2 rounded border border-emerald-800">
              <CheckCircle className="w-4 h-4" />
              <span>ধন্যবাদ! আপনি সফলভাবে যুক্ত হয়েছেন।</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="আপনার ইমেইল ঠিকানা দিন"
                required
                className="px-4 py-2.5 bg-stone-800 text-white text-xs sm:text-sm rounded border border-stone-700 focus:outline-none focus:border-red-500 w-full sm:w-72"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm rounded transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>সাবস্ক্রাইব</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
