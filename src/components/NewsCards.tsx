import React, { useState } from 'react';
import { Article, PhotoAlbum, VideoNews } from '../types';
import { getRelativeTimeBengali } from '../lib/dateUtils';
import { Clock, Eye, Play, Camera, Newspaper } from 'lucide-react';

interface NewsCardProps {
  article: Article;
  onClick: (article: Article) => void;
  className?: string;
}

// Resilient Image component with Zero-Broken-Image Policy
export const EditorialImage: React.FC<{
  src?: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
}> = ({ src, alt, className = '', aspectRatioClass = 'aspect-16/9' }) => {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <div
        className={`w-full ${aspectRatioClass} bg-stone-200 flex flex-col items-center justify-center text-stone-400 p-4 border border-stone-300/40 select-none ${className}`}
      >
        <Newspaper className="w-8 h-8 opacity-40 mb-1" />
        <span className="text-[11px] font-sans text-stone-500 line-clamp-1 text-center">
          {alt || 'ঢাকা সংবাদ'}
        </span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-stone-100 ${aspectRatioClass} ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
  );
};

// 1. Large Featured Card (Hero / Lead section)
export const FeaturedHeroCard: React.FC<NewsCardProps> = ({ article, onClick, className = '' }) => {
  return (
    <article
      onClick={() => onClick(article)}
      className={`group cursor-pointer flex flex-col space-y-3.5 pb-4 editorial-border-b ${className}`}
    >
      <EditorialImage
        src={article.featuredImage}
        alt={article.title}
        aspectRatioClass="aspect-16/9"
        className="rounded-none shadow-xs"
      />

      <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
        <span className="font-semibold text-red-700 tracking-wider">
          {article.categoryName}
        </span>
        <span aria-hidden="true">·</span>
        <span>{getRelativeTimeBengali(article.publishedAt)}</span>
        {article.location && (
          <>
            <span aria-hidden="true">·</span>
            <span>{article.location}</span>
          </>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-bengali-serif text-stone-900 leading-tight group-hover:text-red-700 transition-colors text-balance">
        {article.title}
      </h1>

      <p className="text-sm sm:text-base text-stone-600 line-clamp-3 leading-relaxed">
        {article.summary}
      </p>

      <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
        <span className="font-medium text-stone-800">{article.authorName}</span>
        <span className="flex items-center gap-1 font-mono text-[11px]">
          <Eye className="w-3.5 h-3.5 text-stone-400" />
          {article.views.toLocaleString('bn-BD')}
        </span>
      </div>
    </article>
  );
};

// 2. Medium Card (Category blocks & Secondary stories)
export const MediumNewsCard: React.FC<NewsCardProps> = ({ article, onClick, className = '' }) => {
  return (
    <article
      onClick={() => onClick(article)}
      className={`group cursor-pointer flex flex-col space-y-2.5 pb-3 ${className}`}
    >
      <EditorialImage
        src={article.featuredImage}
        alt={article.title}
        aspectRatioClass="aspect-16/10"
      />

      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans">
        <span className="font-medium text-red-700">{article.categoryName}</span>
        <span aria-hidden="true">·</span>
        <span>{getRelativeTimeBengali(article.publishedAt)}</span>
      </div>

      <h2 className="text-base sm:text-lg font-bold font-bengali-serif text-stone-900 leading-snug group-hover:text-red-700 transition-colors line-clamp-2">
        {article.title}
      </h2>

      <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
        {article.summary}
      </p>
    </article>
  );
};

// 3. Compact Horizontal Card (Desktop sidebars & lists)
export const CompactHorizontalCard: React.FC<NewsCardProps> = ({ article, onClick, className = '' }) => {
  return (
    <article
      onClick={() => onClick(article)}
      className={`group cursor-pointer flex items-start gap-3 py-2.5 editorial-border-b last:border-b-0 ${className}`}
    >
      <div className="w-24 sm:w-28 shrink-0">
        <EditorialImage
          src={article.featuredImage}
          alt={article.title}
          aspectRatioClass="aspect-4/3"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1 font-sans">
          <span className="text-red-700 font-medium">{article.categoryName}</span>
          <span aria-hidden="true">·</span>
          <span>{getRelativeTimeBengali(article.publishedAt)}</span>
        </div>
        <h3 className="text-sm font-semibold font-bengali-serif text-stone-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>
      </div>
    </article>
  );
};

// 4. Small Latest-News Card (Text-focused with live dot)
export const SmallLatestCard: React.FC<NewsCardProps> = ({ article, onClick, className = '' }) => {
  return (
    <article
      onClick={() => onClick(article)}
      className={`group cursor-pointer py-2.5 editorial-border-b last:border-b-0 ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1 font-sans">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block animate-pulse" />
        <span className="text-stone-700 font-medium">{article.categoryName}</span>
        <span aria-hidden="true">·</span>
        <span>{getRelativeTimeBengali(article.publishedAt)}</span>
      </div>
      <h3 className="text-sm font-medium font-bengali-serif text-stone-800 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
        {article.title}
      </h3>
    </article>
  );
};

// 5. Trending Card (Numbered ranking)
export const TrendingRankCard: React.FC<{
  article: Article;
  rank: number;
  onClick: (article: Article) => void;
}> = ({ article, rank, onClick }) => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const rankBn = String(rank).replace(/[0-9]/g, (d) => banglaDigits[parseInt(d, 10)]);

  return (
    <article
      onClick={() => onClick(article)}
      className="group cursor-pointer flex items-baseline gap-3.5 py-3 editorial-border-b last:border-b-0"
    >
      <span className="text-2xl font-bold font-mono text-stone-300 group-hover:text-red-600 transition-colors shrink-0 w-6">
        {rankBn}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-stone-500 mb-0.5 font-sans">
          <span>{article.categoryName}</span>
          <span className="mx-1">·</span>
          <span>{getRelativeTimeBengali(article.publishedAt)}</span>
        </div>
        <h3 className="text-sm font-semibold font-bengali-serif text-stone-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
          {article.title}
        </h3>
      </div>
    </article>
  );
};

// 6. Video Card
export const VideoNewsCard: React.FC<{
  video: VideoNews;
  onClick: (video: VideoNews) => void;
}> = ({ video, onClick }) => {
  return (
    <article
      onClick={() => onClick(video)}
      className="group cursor-pointer flex flex-col space-y-2 bg-stone-900 text-white p-2.5 rounded-none"
    >
      <div className="relative aspect-16/9 overflow-hidden bg-stone-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-[10px] font-mono text-white rounded">
          {video.duration}
        </div>
      </div>
      <div className="text-[11px] text-red-400 font-sans">{video.category}</div>
      <h3 className="text-sm font-semibold font-bengali-serif text-stone-100 group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
        {video.title}
      </h3>
    </article>
  );
};

// 7. Photo Album Card
export const PhotoAlbumCard: React.FC<{
  album: PhotoAlbum;
  onClick: (album: PhotoAlbum) => void;
}> = ({ album, onClick }) => {
  return (
    <article
      onClick={() => onClick(album)}
      className="group cursor-pointer flex flex-col space-y-2"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-stone-200">
        <img
          src={album.coverImage}
          alt={album.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
          <Camera className="w-3.5 h-3.5" />
          <span>{album.images.length}টি ছবি</span>
        </div>
      </div>
      <div className="text-xs text-stone-500 font-sans">
        <span>{album.category}</span>
        <span className="mx-1">·</span>
        <span>{album.photographer}</span>
      </div>
      <h3 className="text-sm sm:text-base font-bold font-bengali-serif text-stone-900 group-hover:text-red-700 transition-colors line-clamp-2">
        {album.title}
      </h3>
    </article>
  );
};

// 8. Opinion / Columnist Card
export const OpinionNewsCard: React.FC<NewsCardProps> = ({ article, onClick }) => {
  return (
    <article
      onClick={() => onClick(article)}
      className="group cursor-pointer p-4 bg-stone-100/70 border-l-2 border-red-700 hover:bg-stone-100 transition-colors flex flex-col justify-between"
    >
      <div>
        <div className="text-xs font-semibold text-red-700 mb-1 font-sans">
          মতামত ও কলাম
        </div>
        <h3 className="text-base font-bold font-bengali-serif text-stone-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-2">
          {article.title}
        </h3>
        <p className="text-xs text-stone-600 line-clamp-2 italic">
          "{article.summary}"
        </p>
      </div>

      <div className="flex items-center gap-2.5 pt-3 mt-3 border-t border-stone-200">
        {article.authorAvatar && (
          <img
            src={article.authorAvatar}
            alt={article.authorName}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <div className="min-w-0">
          <div className="text-xs font-semibold text-stone-900 truncate">
            {article.authorName}
          </div>
          <div className="text-[10px] text-stone-500 truncate">
            {article.authorDesignation || 'কলামিস্ট'}
          </div>
        </div>
      </div>
    </article>
  );
};
