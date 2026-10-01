import {
  Article,
  Author,
  Category,
  BreakingNewsItem,
  AdSetting,
  SiteSettings,
  PhotoAlbum,
  VideoNews,
  Comment,
  User,
  AuditLog,
} from '../types';
import {
  INITIAL_ARTICLES,
  INITIAL_AUTHORS,
  INITIAL_CATEGORIES,
  INITIAL_BREAKING_NEWS,
  INITIAL_AD_SETTINGS,
  INITIAL_SITE_SETTINGS,
  INITIAL_PHOTO_ALBUMS,
  INITIAL_VIDEO_NEWS,
  INITIAL_COMMENTS,
} from '../data/initialData';

const STORAGE_KEYS = {
  ARTICLES: 'dhaka_news_articles_v1',
  CATEGORIES: 'dhaka_news_categories_v1',
  AUTHORS: 'dhaka_news_authors_v1',
  BREAKING_NEWS: 'dhaka_news_breaking_v1',
  AD_SETTINGS: 'dhaka_news_ads_v1',
  SITE_SETTINGS: 'dhaka_news_site_settings_v1',
  COMMENTS: 'dhaka_news_comments_v1',
  PHOTO_ALBUMS: 'dhaka_news_photo_albums_v1',
  VIDEO_NEWS: 'dhaka_news_video_news_v1',
  SUBSCRIBERS: 'dhaka_news_subscribers_v1',
  AUDIT_LOGS: 'dhaka_news_audit_logs_v1',
  CURRENT_USER: 'dhaka_news_admin_user_v1',
};

// Safe JSON loader
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

// Initial default admin user
const DEFAULT_USER: User = {
  id: 'usr-1',
  name: 'সম্পাদক মণ্ডলী (Chief Editor)',
  email: 'admin@dhaka.news',
  role: 'super_admin',
};

export const NewsStore = {
  // Articles
  getArticles(): Article[] {
    return loadFromStorage<Article[]>(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES);
  },

  getArticleBySlug(slug: string): Article | undefined {
    const articles = this.getArticles();
    return articles.find((a) => a.slug === slug || encodeURIComponent(a.slug) === encodeURIComponent(slug));
  },

  getArticlesByCategory(categorySlug: string): Article[] {
    const articles = this.getArticles().filter((a) => a.status === 'published');
    if (categorySlug === 'home' || categorySlug === 'all') return articles;
    return articles.filter((a) => a.categorySlug === categorySlug);
  },

  getLeadStory(): Article | undefined {
    const articles = this.getArticles().filter((a) => a.status === 'published');
    return articles.find((a) => a.isLeadStory) || articles[0];
  },

  getTrendingArticles(limit = 6): Article[] {
    const articles = this.getArticles().filter((a) => a.status === 'published');
    return articles
      .filter((a) => a.isTrending || a.views > 7000)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },

  getLatestArticles(limit = 10): Article[] {
    const articles = this.getArticles().filter((a) => a.status === 'published');
    return [...articles]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  },

  saveArticle(article: Article): Article {
    const articles = this.getArticles();
    const index = articles.findIndex((a) => a.id === article.id);

    // If marked as lead story, unset other lead stories
    if (article.isLeadStory) {
      articles.forEach((a) => {
        if (a.id !== article.id) a.isLeadStory = false;
      });
    }

    if (index >= 0) {
      articles[index] = { ...article, updatedAt: new Date().toISOString() };
      this.logAction(`নিবন্ধ আপডেট করা হয়েছে: "${article.title}"`);
    } else {
      articles.unshift(article);
      this.logAction(`নতুন নিবন্ধ তৈরি করা হয়েছে: "${article.title}"`);
    }

    saveToStorage(STORAGE_KEYS.ARTICLES, articles);
    return article;
  },

  deleteArticle(id: string): void {
    const articles = this.getArticles();
    const target = articles.find((a) => a.id === id);
    const updated = articles.filter((a) => a.id !== id);
    saveToStorage(STORAGE_KEYS.ARTICLES, updated);
    if (target) {
      this.logAction(`নিবন্ধ মুছে ফেলা হয়েছে: "${target.title}"`);
    }
  },

  incrementArticleViews(id: string): void {
    const articles = this.getArticles();
    const article = articles.find((a) => a.id === id);
    if (article) {
      article.views = (article.views || 0) + 1;
      saveToStorage(STORAGE_KEYS.ARTICLES, articles);
    }
  },

  // Categories
  getCategories(): Category[] {
    return loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES).sort(
      (a, b) => a.order - b.order
    );
  },

  saveCategory(category: Category): Category {
    const categories = this.getCategories();
    const idx = categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      categories[idx] = category;
      this.logAction(`ক্যাটাগরি আপডেট: ${category.name}`);
    } else {
      categories.push(category);
      this.logAction(`নতুন ক্যাটাগরি তৈরি: ${category.name}`);
    }
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    return category;
  },

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
    this.logAction(`ক্যাটাগরি মুছে ফেলা হয়েছে (ID: ${id})`);
  },

  // Authors
  getAuthors(): Author[] {
    return loadFromStorage<Author[]>(STORAGE_KEYS.AUTHORS, INITIAL_AUTHORS);
  },

  saveAuthor(author: Author): Author {
    const authors = this.getAuthors();
    const idx = authors.findIndex((a) => a.id === author.id);
    if (idx >= 0) {
      authors[idx] = author;
      this.logAction(`লেখক তথ্য আপডেট: ${author.name}`);
    } else {
      authors.push(author);
      this.logAction(`নতুন লেখক সংযোজন: ${author.name}`);
    }
    saveToStorage(STORAGE_KEYS.AUTHORS, authors);
    return author;
  },

  // Breaking News
  getBreakingNews(): BreakingNewsItem[] {
    const items = loadFromStorage<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    return items.filter((b) => b.isActive).sort((a, b) => a.priority - b.priority);
  },

  getAllBreakingNews(): BreakingNewsItem[] {
    return loadFromStorage<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
  },

  saveBreakingNews(item: BreakingNewsItem): void {
    const items = this.getAllBreakingNews();
    const idx = items.findIndex((b) => b.id === item.id);
    if (idx >= 0) {
      items[idx] = item;
      this.logAction(`ব্রেকিং নিউজ আপডেট: "${item.title}"`);
    } else {
      items.unshift(item);
      this.logAction(`নতুন ব্রেকিং নিউজ যুক্ত: "${item.title}"`);
    }
    saveToStorage(STORAGE_KEYS.BREAKING_NEWS, items);
  },

  deleteBreakingNews(id: string): void {
    const items = this.getAllBreakingNews().filter((b) => b.id !== id);
    saveToStorage(STORAGE_KEYS.BREAKING_NEWS, items);
    this.logAction(`ব্রেকিং নিউজ মুছে ফেলা হয়েছে (ID: ${id})`);
  },

  // Ads
  getAdSettings(): AdSetting[] {
    return loadFromStorage<AdSetting[]>(STORAGE_KEYS.AD_SETTINGS, INITIAL_AD_SETTINGS);
  },

  getAdByPlacement(placement: string): AdSetting | undefined {
    const ads = this.getAdSettings();
    return ads.find((a) => a.placement === placement && a.isActive);
  },

  saveAdSetting(ad: AdSetting): void {
    const ads = this.getAdSettings();
    const idx = ads.findIndex((a) => a.id === ad.id);
    if (idx >= 0) {
      ads[idx] = ad;
    } else {
      ads.push(ad);
    }
    saveToStorage(STORAGE_KEYS.AD_SETTINGS, ads);
    this.logAction(`বিজ্ঞাপন কনফিগারেশন পরিবর্তন: ${ad.name}`);
  },

  // Site Settings
  getSiteSettings(): SiteSettings {
    return loadFromStorage<SiteSettings>(STORAGE_KEYS.SITE_SETTINGS, INITIAL_SITE_SETTINGS);
  },

  saveSiteSettings(settings: SiteSettings): void {
    saveToStorage(STORAGE_KEYS.SITE_SETTINGS, settings);
    this.logAction('সাইট সেটিংস হালনাগাদ করা হয়েছে');
  },

  // Comments
  getComments(articleId?: string): Comment[] {
    const comments = loadFromStorage<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    if (articleId) {
      return comments.filter((c) => c.articleId === articleId && c.status === 'approved');
    }
    return comments;
  },

  addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'status'>): Comment {
    const comments = loadFromStorage<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const newComment: Comment = {
      ...comment,
      id: `comm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'approved', // Auto-approved in demo
    };
    comments.unshift(newComment);
    saveToStorage(STORAGE_KEYS.COMMENTS, comments);
    return newComment;
  },

  updateCommentStatus(id: string, status: 'approved' | 'pending' | 'spam'): void {
    const comments = this.getComments();
    const target = comments.find((c) => c.id === id);
    if (target) {
      target.status = status;
      saveToStorage(STORAGE_KEYS.COMMENTS, comments);
      this.logAction(`মন্তব্যের স্ট্যাটাস পরিবর্তিত: ID ${id} -> ${status}`);
    }
  },

  deleteComment(id: string): void {
    const comments = this.getComments().filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.COMMENTS, comments);
    this.logAction(`মন্তব্য মুছে ফেলা হয়েছে: ID ${id}`);
  },

  // Photo & Video
  getPhotoAlbums(): PhotoAlbum[] {
    return loadFromStorage<PhotoAlbum[]>(STORAGE_KEYS.PHOTO_ALBUMS, INITIAL_PHOTO_ALBUMS);
  },

  getVideoNews(): VideoNews[] {
    return loadFromStorage<VideoNews[]>(STORAGE_KEYS.VIDEO_NEWS, INITIAL_VIDEO_NEWS);
  },

  // Newsletter Subscribers
  getSubscribers(): string[] {
    return loadFromStorage<string[]>(STORAGE_KEYS.SUBSCRIBERS, ['reader@dhaka.news']);
  },

  addSubscriber(email: string): boolean {
    const subs = this.getSubscribers();
    if (subs.includes(email)) return false;
    subs.push(email);
    saveToStorage(STORAGE_KEYS.SUBSCRIBERS, subs);
    return true;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return loadFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-1',
        action: 'সিস্টেম ইনিশিয়ালাইজেশন',
        user: 'Chief Editor',
        timestamp: new Date().toISOString(),
        details: 'ঢাকা ডিজিটাল পোর্টাল সফলভাবে বুটস্ট্র্যাপ হয়েছে।',
      },
    ]);
  },

  logAction(action: string, details = ''): void {
    const user = this.getCurrentUser();
    const logs = this.getAuditLogs();
    logs.unshift({
      id: `log-${Date.now()}`,
      action,
      user: user?.name || 'Administrator',
      timestamp: new Date().toISOString(),
      details,
    });
    // keep last 100
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100));
  },

  // Current User / Auth
  getCurrentUser(): User | null {
    return loadFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
  },

  login(email: string, pass: string): boolean {
    // Demo authentication accepting demo credentials
    if ((email === 'admin@dhaka.news' || email === 'editor@dhaka.news') && (pass === 'demo123' || pass === 'admin123')) {
      const user: User = {
        id: 'usr-admin',
        name: email === 'admin@dhaka.news' ? 'তানভীর আহমেদ (প্রধান সম্পাদক)' : 'ফারহানা ইয়াসমিন (বার্তা সম্পাদক)',
        email,
        role: email === 'admin@dhaka.news' ? 'super_admin' : 'editor',
      };
      saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
      this.logAction(`লগইন সম্পন্ন করেছেন: ${user.name}`);
      return true;
    }
    // Allow any non-empty demo password in development environment
    if (email && pass.length >= 4) {
      const user: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: 'admin',
      };
      saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
      this.logAction(`লগইন সম্পন্ন করেছেন: ${user.name}`);
      return true;
    }
    return false;
  },

  logout(): void {
    this.logAction('লগআউট করেছেন');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Full backup and restore
  exportFullBackup(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      siteSettings: this.getSiteSettings(),
      articles: this.getArticles(),
      categories: this.getCategories(),
      authors: this.getAuthors(),
      breakingNews: this.getAllBreakingNews(),
      ads: this.getAdSettings(),
      comments: this.getComments(),
      subscribers: this.getSubscribers(),
    };
    return JSON.stringify(data, null, 2);
  },

  resetToDefault(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  },
};
