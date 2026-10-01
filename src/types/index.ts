export type ArticleStatus = 'published' | 'draft' | 'scheduled' | 'pending' | 'archived';

export interface Author {
  id: string;
  name: string;
  designation: string;
  avatar: string;
  bio: string;
  email: string;
  slug: string;
  socials?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  showInNav: boolean;
  color?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
  featuredImage: string;
  imageCaption?: string;
  imageCredit?: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorDesignation?: string;
  publishedAt: string;
  updatedAt?: string;
  status: ArticleStatus;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isLeadStory?: boolean;
  views: number;
  readTimeMinutes: number;
  tags: string[];
  location?: string;
  videoUrl?: string;
  galleryImages?: Array<{ url: string; caption: string }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    focusKeyword?: string;
    canonicalUrl?: string;
    socialImage?: string;
  };
}

export interface BreakingNewsItem {
  id: string;
  title: string;
  link?: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export type AdPlacement = 
  | 'header_top'
  | 'below_nav'
  | 'breaking_area'
  | 'homepage_middle'
  | 'article_sidebar'
  | 'article_body'
  | 'after_article'
  | 'footer_top';

export interface AdSetting {
  id: string;
  name: string;
  type: 'banner' | 'adsterra_popunder' | 'adsterra_socialbar' | 'custom_script';
  placement: AdPlacement;
  codeSnippet: string;
  imageUrl?: string;
  targetUrl?: string;
  isActive: boolean;
  deviceTarget: 'all' | 'desktop' | 'mobile';
  bannerSize?: '728x90' | '970x90' | '300x250' | '336x280' | '320x50';
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'spam';
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  siteUrl: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  defaultSeoTitle: string;
  defaultMetaDescription: string;
  defaultSocialImage: string;
  gaMeasurementId: string;
  enableNewsletter: boolean;
  enableComments: boolean;
  adsterraPopunderEnabled: boolean;
  adsterraPopunderCode: string;
  adsterraSocialBarEnabled: boolean;
  adsterraSocialBarCode: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'reporter' | 'author';
  avatar?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface PhotoAlbum {
  id: string;
  title: string;
  summary: string;
  category: string;
  coverImage: string;
  photographer: string;
  publishedAt: string;
  images: Array<{
    url: string;
    caption: string;
  }>;
}

export interface VideoNews {
  id: string;
  title: string;
  summary: string;
  youtubeId: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  category: string;
}
