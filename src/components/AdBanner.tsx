import React from 'react';
import { AdPlacement, AdSetting } from '../types';

interface AdBannerProps {
  placement: AdPlacement;
  ad?: AdSetting;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, ad, className = '' }) => {
  if (!ad || !ad.isActive) {
    return null;
  }

  // Size styling map to avoid CLS (Cumulative Layout Shift)
  const sizeClasses: Record<string, string> = {
    '728x90': 'max-w-[728px] min-h-[90px]',
    '970x90': 'max-w-[970px] min-h-[90px]',
    '300x250': 'w-[300px] min-h-[250px]',
    '336x280': 'w-[336px] min-h-[280px]',
    '320x50': 'max-w-[320px] min-h-[50px]',
  };

  const currentSizeClass = ad.bannerSize ? sizeClasses[ad.bannerSize] || 'w-full min-h-[90px]' : 'w-full min-h-[90px]';

  return (
    <aside
      aria-label="বিজ্ঞাপন"
      className={`relative mx-auto my-4 flex flex-col items-center justify-center overflow-hidden border border-stone-200/80 bg-stone-100/50 p-1 text-center transition-opacity ${currentSizeClass} ${className}`}
    >
      <div className="absolute top-0 right-1 text-[9px] uppercase tracking-wider text-stone-400 font-sans pointer-events-none">
        বিজ্ঞাপন
      </div>

      {ad.imageUrl ? (
        <a
          href={ad.targetUrl || '#'}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block w-full h-full"
        >
          <img
            src={ad.imageUrl}
            alt={ad.name || 'বিজ্ঞাপন'}
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover max-h-[120px] mx-auto"
            loading="lazy"
          />
        </a>
      ) : (
        <div
          className="w-full text-xs text-stone-500 py-3"
          dangerouslySetInnerHTML={{ __html: ad.codeSnippet || '<p class="text-stone-400">বিজ্ঞাপন স্লট</p>' }}
        />
      )}
    </aside>
  );
};
