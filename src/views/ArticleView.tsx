import React, { useState, useEffect } from 'react';
import { Article, AdSetting, Comment } from '../types';
import { getFormattedBengaliDate, getRelativeTimeBengali } from '../lib/dateUtils';
import { NewsStore } from '../lib/storage';
import { EditorialImage, CompactHorizontalCard } from '../components/NewsCards';
import { AdBanner } from '../components/AdBanner';
import {
  Share2,
  Printer,
  Copy,
  Check,
  MessageSquare,
  Eye,
  Clock,
  ChevronRight,
  BookOpen,
  Send,
  Facebook,
  Twitter,
  ArrowLeft,
} from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  allArticles: Article[];
  ads: AdSetting[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (slug: string) => void;
  onBack: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  allArticles,
  ads,
  onSelectArticle,
  onSelectCategory,
  onBack,
}) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'md' | 'lg'>('md');
  const [readingMode, setReadingMode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Sync document title and meta for SEO / Social
  useEffect(() => {
    document.title = `${article.title} | ঢাকা`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', article.summary || article.title);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', article.title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', article.summary);
    }

    // Increment view count
    NewsStore.incrementArticleViews(article.id);
    setComments(NewsStore.getComments(article.id));

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = 'ঢাকা - দেশ ও বিশ্বের সর্বশেষ সংবাদ';
    };
  }, [article.id, article.title, article.summary]);

  // Related articles (same category or shared tags)
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.categoryId === article.categoryId)
    .slice(0, 4);

  const latestArticles = allArticles
    .filter((a) => a.id !== article.id)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  // Ads
  const sidebarAd = ads.find((a) => a.placement === 'article_sidebar' && a.isActive);
  const bodyAd = ads.find((a) => a.placement === 'article_body' && a.isActive);
  const afterArticleAd = ads.find((a) => a.placement === 'after_article' && a.isActive);

  // Social sharing handlers
  const canonicalUrl = window.location.href;
  const shareText = encodeURIComponent(`${article.title} - ঢাকা`);

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=450');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${shareText}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=450');
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(canonicalUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentText) return;

    const newComm = NewsStore.addComment({
      articleId: article.id,
      authorName: commentName,
      authorEmail: commentEmail,
      content: commentText,
    });

    setComments((prev) => [newComm, ...prev]);
    setCommentName('');
    setCommentEmail('');
    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 3000);
  };

  const fontSizeClasses = {
    sm: 'text-sm sm:text-base leading-relaxed',
    md: 'text-base sm:text-lg leading-loose',
    lg: 'text-lg sm:text-xl leading-loose',
  };

  return (
    <article className="max-w-7xl mx-auto px-4 py-6">
      {/* 1. Breadcrumbs & Reading Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 editorial-border-b text-xs text-stone-500">
        <nav aria-label="ব্রেডক্রাম্ব" className="flex items-center gap-1.5 overflow-hidden">
          <button
            onClick={onBack}
            className="hover:text-red-700 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>প্রচ্ছদ</span>
          </button>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <button
            onClick={() => onSelectCategory(article.categorySlug)}
            className="hover:text-red-700 font-medium text-stone-800 transition"
          >
            {article.categoryName}
          </button>
          <ChevronRight className="w-3 h-3 text-stone-400 hidden sm:inline" />
          <span className="truncate max-w-[200px] text-stone-400 hidden sm:inline">
            {article.title}
          </span>
        </nav>

        {/* Font Adjuster & Reading Mode */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100 rounded p-0.5 border border-stone-200">
            <button
              onClick={() => setFontSizeLevel('sm')}
              className={`px-2 py-0.5 text-xs rounded ${fontSizeLevel === 'sm' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-500'}`}
              title="ছোট ফন্ট"
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeLevel('md')}
              className={`px-2 py-0.5 text-xs rounded ${fontSizeLevel === 'md' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-500'}`}
              title="স্বাভাবিক ফন্ট"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel('lg')}
              className={`px-2 py-0.5 text-xs rounded ${fontSizeLevel === 'lg' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-500'}`}
              title="বড় ফন্ট"
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setReadingMode(!readingMode)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition ${
              readingMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
            title="রিডিং মোড চালু/বন্ধ করুন"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">রিডিং মোড</span>
          </button>
        </div>
      </div>

      {/* 2. Main Article Grid */}
      <div className={`grid grid-cols-1 ${readingMode ? 'max-w-3xl mx-auto' : 'lg:grid-cols-12'} gap-8`}>
        {/* Main Column */}
        <div className={readingMode ? 'w-full' : 'lg:col-span-8'}>
          {/* Category Tag */}
          <div className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 font-sans">
            {article.categoryName}
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bengali-serif text-stone-900 leading-tight mb-3 text-balance">
            {article.title}
          </h1>

          {/* Subheadline */}
          {article.subtitle && (
            <h2 className="text-base sm:text-lg text-stone-600 font-medium font-bengali-serif mb-4 leading-snug">
              {article.subtitle}
            </h2>
          )}

          {/* Author Byline & Date Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 mb-5 border-y border-stone-200 text-xs text-stone-500">
            <div className="flex items-center gap-3">
              {article.authorAvatar && (
                <img
                  src={article.authorAvatar}
                  alt={article.authorName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
              )}
              <div>
                <div className="font-semibold text-stone-900 text-sm">
                  {article.authorName}
                </div>
                <div className="text-[11px] text-stone-500">
                  {article.authorDesignation || 'নিজস্ব প্রতিবেদক'}
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] font-sans">
              <div>প্রকাশ: {getFormattedBengaliDate(article.publishedAt)}</div>
              {article.updatedAt && (
                <div className="text-stone-400">
                  আপডেট: {getFormattedBengaliDate(article.updatedAt)}
                </div>
              )}
            </div>
          </div>

          {/* Social Sharing Bar */}
          <div className="flex items-center justify-between gap-2 py-2 mb-6 bg-stone-100/60 px-3 rounded border border-stone-200">
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span>শেয়ার:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFacebookShare}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                aria-label="ফেসবুকে শেয়ার করুন"
                title="ফেসবুক"
              >
                <Facebook className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleTwitterShare}
                className="p-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded transition"
                aria-label="টুইটার / এক্সে শেয়ার করুন"
                title="এক্স"
              >
                <Twitter className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition"
                aria-label="হোয়াটসঅ্যাপে শেয়ার করুন"
                title="হোয়াটসঅ্যাপ"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-stone-50 border border-stone-300 text-xs text-stone-700 rounded transition"
                title="লিঙ্ক কপি করুন"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>কপি লিঙ্ক</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="p-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded transition"
                aria-label="প্রিন্ট করুন"
                title="প্রিন্ট"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Featured Image with Caption */}
          <figure className="mb-6">
            <EditorialImage
              src={article.featuredImage}
              alt={article.title}
              aspectRatioClass="aspect-16/9"
              className="rounded-none shadow-xs"
            />
            {(article.imageCaption || article.imageCredit) && (
              <figcaption className="text-xs text-stone-500 mt-2 flex flex-col sm:flex-row justify-between gap-1 italic border-l-2 border-red-600 pl-2">
                <span>{article.imageCaption}</span>
                {article.imageCredit && (
                  <span className="not-italic text-stone-400 font-sans">
                    {article.imageCredit}
                  </span>
                )}
              </figcaption>
            )}
          </figure>

          {/* Article Body Content */}
          <div
            className={`prose prose-stone max-w-none text-stone-800 ${fontSizeClasses[fontSizeLevel]}`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="space-y-4"
            />
          </div>

          {/* In-Article Ad Banner */}
          {bodyAd && !readingMode && (
            <div className="my-6">
              <AdBanner placement="article_body" ad={bodyAd} />
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-stone-200">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">বিষয়:</span>
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-stone-700 hover:text-red-700 cursor-pointer font-sans"
                  >
                    #{tag}
                    {idx < article.tags.length - 1 && <span className="text-stone-300 ml-2">/</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* After Article Ad */}
          {afterArticleAd && !readingMode && (
            <div className="my-8">
              <AdBanner placement="after_article" ad={afterArticleAd} />
            </div>
          )}

          {/* 3. Comments Section */}
          <section className="mt-10 pt-8 border-t-2 border-stone-900">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-bengali-serif text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-red-600" />
                <span>পাঠকের মন্তব্য ({comments.length.toLocaleString('bn-BD')})</span>
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-stone-50 p-4 border border-stone-200 mb-6 space-y-3">
              <h4 className="text-sm font-semibold font-bengali-serif text-stone-800">
                আপনার মতামত ব্যক্ত করুন
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="আপনার নাম *"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  required
                  className="px-3 py-2 bg-white text-xs border border-stone-300 rounded focus:outline-none focus:border-red-600"
                />
                <input
                  type="email"
                  placeholder="ইমেইল (প্রকাশিত হবে না)"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  className="px-3 py-2 bg-white text-xs border border-stone-300 rounded focus:outline-none focus:border-red-600"
                />
              </div>

              <textarea
                placeholder="আপনার গঠনমূলক মন্তব্য লিখুন... *"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white text-xs border border-stone-300 rounded focus:outline-none focus:border-red-600"
              />

              <div className="flex items-center justify-between">
                {commentSubmitted && (
                  <span className="text-xs text-emerald-600 font-medium">
                    মন্তব্য সফলভাবে জমা হয়েছে।
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>মন্তব্য পাঠান</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comm) => (
                <div key={comm.id} className="p-3 bg-white border border-stone-200 rounded text-xs space-y-1">
                  <div className="flex items-center justify-between text-stone-500">
                    <span className="font-bold text-stone-800">{comm.authorName}</span>
                    <span className="text-[11px] font-sans">
                      {getRelativeTimeBengali(comm.createdAt)}
                    </span>
                  </div>
                  <p className="text-stone-700 leading-relaxed">{comm.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Related Stories Grid */}
          {relatedArticles.length > 0 && (
            <section className="mt-10 pt-8 border-t border-stone-200">
              <h3 className="text-lg font-bold font-bengali-serif text-stone-900 mb-4 pb-2 border-b border-stone-900">
                সম্পর্কিত সংবাদ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((art) => (
                  <CompactHorizontalCard
                    key={art.id}
                    article={art}
                    onClick={onSelectArticle}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column (Desktop) */}
        {!readingMode && (
          <aside className="lg:col-span-4 space-y-6 lg:border-l lg:border-stone-200 lg:pl-6">
            {/* Sidebar Ad Slot */}
            {sidebarAd && (
              <div className="mb-6">
                <AdBanner placement="article_sidebar" ad={sidebarAd} />
              </div>
            )}

            {/* Latest News */}
            <div className="bg-stone-50 border border-stone-200 p-4">
              <h3 className="font-bold text-base font-bengali-serif text-stone-900 pb-2 mb-3 border-b border-stone-200">
                এই মুহূর্তের শীর্ষ সংবাদ
              </h3>
              <div className="divide-y divide-stone-200">
                {latestArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art)}
                    className="py-2.5 cursor-pointer group"
                  >
                    <div className="text-[11px] text-red-700 font-sans mb-0.5">
                      {art.categoryName}
                    </div>
                    <h4 className="text-xs sm:text-sm font-medium font-bengali-serif text-stone-900 group-hover:text-red-700 transition line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
};
