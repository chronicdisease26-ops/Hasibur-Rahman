import React, { useState, useEffect, useRef } from 'react';
import { Article, Category, Author } from '../../types';
import { NewsStore } from '../../lib/storage';
import {
  Save,
  Eye,
  ArrowLeft,
  Image,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';

interface AdminArticleEditorProps {
  initialArticle?: Article | null;
  categories: Category[];
  authors: Author[];
  onSaveComplete: () => void;
  onCancel: () => void;
}

export const AdminArticleEditor: React.FC<AdminArticleEditorProps> = ({
  initialArticle,
  categories,
  authors,
  onSaveComplete,
  onCancel,
}) => {
  const isEditing = !!initialArticle;

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [summary, setSummary] = useState(initialArticle?.summary || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [featuredImage, setFeaturedImage] = useState(
    initialArticle?.featuredImage || '/images/hero_dhaka_skyline_1790865674961.jpg'
  );
  const [imageCaption, setImageCaption] = useState(initialArticle?.imageCaption || '');
  const [imageCredit, setImageCredit] = useState(initialArticle?.imageCredit || '');
  const [categoryId, setCategoryId] = useState(
    initialArticle?.categoryId || categories[1]?.id || ''
  );
  const [authorId, setAuthorId] = useState(
    initialArticle?.authorId || authors[0]?.id || ''
  );
  const [status, setStatus] = useState<Article['status']>(
    initialArticle?.status || 'published'
  );
  const [isBreaking, setIsBreaking] = useState(initialArticle?.isBreaking || false);
  const [isFeatured, setIsFeatured] = useState(initialArticle?.isFeatured || false);
  const [isTrending, setIsTrending] = useState(initialArticle?.isTrending || false);
  const [isLeadStory, setIsLeadStory] = useState(initialArticle?.isLeadStory || false);
  const [tagsInput, setTagsInput] = useState(initialArticle?.tags?.join(', ') || '');
  const [location, setLocation] = useState(initialArticle?.location || 'ঢাকা');
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState(initialArticle?.seo?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialArticle?.seo?.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(initialArticle?.seo?.focusKeyword || '');

  // Autosave status
  const [autosaveState, setAutosaveState] = useState<'saved' | 'saving' | 'idle'>('saved');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Quick preset image selector
  const presetImages = [
    { label: 'ঢাকা স্কাইলাইন (হিরো)', url: '/images/hero_dhaka_skyline_1790865674961.jpg' },
    { label: 'জাতীয় সংসদ ভবন', url: '/images/news_parliament_dhaka_1790865687125.jpg' },
    { label: 'চট্টগ্রাম বন্দর বাণিজ্য', url: '/images/news_economy_trade_1790865699540.jpg' },
    { label: 'মিরপুর টেস্ট ক্রিকেট', url: '/images/news_sports_cricket_1790865711235.jpg' },
  ];

  // Helper to insert markdown/HTML tags in textarea
  const insertFormatting = (tagStart: string, tagEnd = '') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end) || 'এখানে টেক্সট লিখুন';
    const replacement = `${tagStart}${selected}${tagEnd}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    setAutosaveState('saving');
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tagStart.length, start + tagStart.length + selected.length);
      setAutosaveState('saved');
    }, 100);
  };

  const handleSave = (publishStatus: Article['status'] = status) => {
    if (!title.trim()) {
      alert('অনুগ্রহ করে প্রতিবেদনের শিরোনাম দিন।');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const selectedAuthor = authors.find((a) => a.id === authorId);

    const slug =
      initialArticle?.slug ||
      title
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0980-\u09FF]+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      `news-${Date.now()}`;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const articleData: Article = {
      id: initialArticle?.id || `art-${Date.now()}`,
      slug,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      summary: summary.trim() || title.trim(),
      content: content.trim() || `<p>${summary}</p>`,
      featuredImage: featuredImage.trim(),
      imageCaption: imageCaption.trim() || undefined,
      imageCredit: imageCredit.trim() || undefined,
      categoryId: selectedCategory?.id || 'cat-2',
      categoryName: selectedCategory?.name || 'জাতীয়',
      categorySlug: selectedCategory?.slug || 'national',
      authorId: selectedAuthor?.id || 'auth-1',
      authorName: selectedAuthor?.name || 'নিজস্ব প্রতিবেদক',
      authorAvatar: selectedAuthor?.avatar,
      authorDesignation: selectedAuthor?.designation,
      publishedAt: initialArticle?.publishedAt || new Date().toISOString(),
      updatedAt: isEditing ? new Date().toISOString() : undefined,
      status: publishStatus,
      isBreaking,
      isFeatured,
      isTrending,
      isLeadStory,
      views: initialArticle?.views || 100,
      readTimeMinutes: Math.max(2, Math.ceil(content.length / 500)),
      tags: tags.length > 0 ? tags : ['বাংলাদেশ', 'সংবাদ'],
      location: location.trim() || 'ঢাকা',
      seo: {
        metaTitle: metaTitle.trim() || `${title} | ঢাকা`,
        metaDescription: metaDescription.trim() || summary,
        focusKeyword: focusKeyword.trim() || undefined,
      },
    };

    NewsStore.saveArticle(articleData);

    // If breaking news is enabled, sync to breaking news table too
    if (isBreaking) {
      NewsStore.saveBreakingNews({
        id: `brk-${articleData.id}`,
        title: articleData.title,
        link: `/news/${articleData.categorySlug}/${articleData.slug}`,
        priority: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
      });
    }

    onSaveComplete();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 border border-stone-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-bengali-serif text-stone-900">
              {isEditing ? 'প্রতিবেদন সম্পাদনা করুন' : 'নতুন সংবাদ প্রতিবেদন রচনা'}
            </h1>
            <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
              <span>{isEditing ? `ID: ${initialArticle.id}` : 'খসড়া প্রস্তুতকরণ'}</span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">✓ {autosaveState === 'saving' ? 'সংরক্ষণ হচ্ছে...' : 'স্বয়ংক্রিয় সংরক্ষিত'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>প্রিভিউ</span>
          </button>

          <button
            onClick={() => handleSave('draft')}
            className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded transition cursor-pointer"
          >
            খসড়া রাখুন
          </button>

          <button
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-xs transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>প্রকাশ করুন</span>
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 columns: Content Fields */}
        <div className="lg:col-span-8 space-y-4">
          {/* Headline */}
          <div className="bg-white p-4 border border-stone-200 space-y-1">
            <label className="block text-xs font-bold text-stone-800 font-bengali-serif">
              প্রধান শিরোনাম (Headline) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="সংবাদের আকর্ষণীয় ও মূল শিরোনাম লিখুন..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-sm sm:text-base font-bold font-bengali-serif text-stone-900 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Subheadline */}
          <div className="bg-white p-4 border border-stone-200 space-y-1">
            <label className="block text-xs font-semibold text-stone-700">
              উপ-শিরোনাম (Subheadline / Kicker)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="শিরোনামের বিশদ প্রেক্ষাপট বা দ্বিতীয় লাইন..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Summary / Deck */}
          <div className="bg-white p-4 border border-stone-200 space-y-1">
            <label className="block text-xs font-semibold text-stone-700">
              সংক্ষিপ্ত সারসংক্ষেপ (Summary / Deck) *
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="নিবন্ধের প্রথম ২-৩ লাইনের মূল সারসংক্ষেপ..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* Rich Content Editor */}
          <div className="bg-white border border-stone-200">
            {/* Editor Toolbar */}
            <div className="p-2 border-b border-stone-200 bg-stone-50 flex flex-wrap items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => insertFormatting('<strong>', '</strong>')}
                className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
                title="বোল্ড"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<em>', '</em>')}
                className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
                title="ইটালিক"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-stone-300 mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting('<h2>', '</h2>')}
                className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
                title="সাব-হেডিং ২"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<h3>', '</h3>')}
                className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
                title="সাব-হেডিং ৩"
              >
                <Heading3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<blockquote>"', '"</blockquote>')}
                className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
                title="উদ্ধৃতি / কোট"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-stone-300 mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
                title="বুলেট তালিকা"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<hr />\n')}
                className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
                title="ডিভাইডার"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Textarea */}
            <div className="p-4">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                প্রতিবেদনের পূর্ণাঙ্গ বিবরণ (HTML / টেক্সট সমর্থিত) *
              </label>
              <textarea
                ref={textareaRef}
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="এখানে বিস্তারিত সংবাদ রচনা করুন। অনুচ্ছেদ, কোটেশন, বা উপশিরোনাম ব্যবহার করুন..."
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded text-xs sm:text-sm font-sans text-stone-800 leading-relaxed focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          {/* SEO Override Box */}
          <div className="bg-white p-4 border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
              সার্চ ইঞ্জিন ও সামাজিক মাধ্যম অপটিমাইজেশন (SEO Overrides)
            </h3>
            <div>
              <label className="block text-[11px] text-stone-600 mb-0.5">
                কাস্টম এসইও শিরোনাম (Meta Title)
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || 'স্বয়ংক্রিয় শিরোনাম ব্যবহৃত হবে'}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs rounded"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-0.5">
                মেটা ডেসক্রিপশন (Meta Description)
              </label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={summary || 'স্বয়ংক্রিয় সারসংক্ষেপ ব্যবহৃত হবে'}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs rounded"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-0.5">
                ফোকাস কি-ওয়ার্ড (Focus Keyword)
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="যেমন: ঢাকা মেট্রো, ক্রিকেট, বাজেট"
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs rounded"
              />
            </div>
          </div>
        </div>

        {/* Right 4 columns: Metadata & Settings */}
        <div className="lg:col-span-4 space-y-4">
          {/* Publishing Controls */}
          <div className="bg-white p-4 border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
              প্রকাশনা স্থিতি
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                স্ট্যাটাস (Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs rounded focus:outline-none focus:border-red-600"
              >
                <option value="published">প্রকাশিত (Published)</option>
                <option value="draft">খসড়া (Draft)</option>
                <option value="scheduled">নির্ধারিত (Scheduled)</option>
                <option value="pending">পেন্ডিং রিভিউ (Pending)</option>
                <option value="archived">আর্কাইভ (Archived)</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-stone-200 text-xs text-stone-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLeadStory}
                  onChange={(e) => setIsLeadStory(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span className="font-semibold text-red-700">প্রধান লিড স্টোরি (Hero Lead)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span>ব্রেকিং নিউজ টিকারে যুক্ত করুন</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span>হোমপেজে ফিচার্ড করুন</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span>ট্রেন্ডিং তালিকায় রাখুন</span>
              </label>
            </div>
          </div>

          {/* Category & Author */}
          <div className="bg-white p-4 border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
              বিভাগ ও প্রতিবেদক
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                বিভাগ (Category) *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs rounded focus:outline-none focus:border-red-600"
              >
                {categories
                  .filter((c) => c.slug !== 'home')
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                প্রতিবেদক / লেখক (Author) *
              </label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 text-xs rounded focus:outline-none focus:border-red-600"
              >
                {authors.map((auth) => (
                  <option key={auth.id} value={auth.id}>
                    {auth.name} ({auth.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                সংবাদের স্থান (Location)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="যেমন: ঢাকা, চট্টগ্রাম, সিলেট"
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ট্যাগসমূহ (Tags - কমা দিয়ে আলাদা করুন)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ঢাকা, রাজনীতি, অর্থনীতি"
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs rounded"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-4 border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1">
              ফিচার্ড ইমেজ (Featured Media)
            </h3>

            {featuredImage && (
              <div className="aspect-16/9 bg-stone-100 border border-stone-200 overflow-hidden relative">
                <img
                  src={featuredImage}
                  alt="Featured"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] text-stone-600 mb-0.5">
                ছবির লিংক (Image URL)
              </label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs rounded"
              />
            </div>

            {/* Quick preset selector */}
            <div className="pt-1">
              <label className="block text-[10px] text-stone-500 mb-1">
                দ্রুত নমুনা ছবি নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                {presetImages.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFeaturedImage(p.url)}
                    className="p-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-left truncate border border-stone-200 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-0.5">
                ছবির ক্যাপশন (Caption)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="ছবির বিবরণ..."
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs rounded"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone-600 mb-0.5">
                আলোকচিত্রী / ক্রেডিট (Credit)
              </label>
              <input
                type="text"
                value={imageCredit}
                onChange={(e) => setImageCredit(e.target.value)}
                placeholder="যেমন: ছবি: ঢাকা / রয়টার্স"
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex flex-col justify-center items-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 font-bold uppercase">
                  লাইভ প্রিভিউ মোড
                </span>
                <span className="text-xs text-stone-500 font-sans">
                  পাঠকরা যেভাবে দেখতে পাবেন
                </span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <article className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-stone-900 leading-tight">
                {title || 'শিরোনাম প্রদর্শিত হবে'}
              </h1>
              {subtitle && (
                <h2 className="text-base text-stone-600 font-medium font-bengali-serif">
                  {subtitle}
                </h2>
              )}

              {featuredImage && (
                <div className="aspect-16/9 bg-stone-100 overflow-hidden">
                  <img
                    src={featuredImage}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-sm font-semibold text-stone-700 italic border-l-2 border-red-600 pl-3">
                {summary}
              </p>

              <div
                className="prose prose-stone max-w-none text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content || '<p>বিস্তারিত প্রতিবেদন এখানে প্রদর্শিত হবে।</p>' }}
              />
            </article>

            <div className="mt-8 pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded"
              >
                প্রিভিউ বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
