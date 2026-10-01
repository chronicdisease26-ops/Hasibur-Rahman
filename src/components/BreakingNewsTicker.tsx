import React, { useState, useEffect } from 'react';
import { BreakingNewsItem } from '../types';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface BreakingNewsTickerProps {
  items: BreakingNewsItem[];
  onSelectArticleByUrl?: (url: string) => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  items,
  onSelectArticleByUrl,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, isPaused]);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handleClickItem = (link?: string) => {
    if (link && onSelectArticleByUrl) {
      onSelectArticleByUrl(link);
    }
  };

  return (
    <div
      className="bg-red-700 text-white shadow-sm overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="ব্রেকিং নিউজ"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center h-10 text-xs sm:text-sm">
        {/* Badge */}
        <div className="flex items-center gap-1.5 font-bold tracking-wide uppercase px-2.5 py-1 bg-red-900 rounded-sm shrink-0 mr-3 text-red-100">
          <Zap className="w-3.5 h-3.5 fill-current text-amber-300 animate-pulse" />
          <span className="font-bengali-serif">ব্রেকিং নিউজ</span>
        </div>

        {/* Scrolling text */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div
            key={currentItem.id}
            className="truncate font-medium transition-all duration-300 ease-in-out cursor-pointer hover:underline"
            onClick={() => handleClickItem(currentItem.link)}
            title={currentItem.title}
          >
            {currentItem.title}
          </div>
        </div>

        {/* Counter and manual controls */}
        <div className="flex items-center gap-1 shrink-0 ml-3 text-red-200">
          <span className="text-[11px] font-mono hidden sm:inline mr-1 opacity-80">
            {currentIndex + 1}/{items.length}
          </span>
          <button
            onClick={handlePrev}
            className="p-1 hover:bg-red-800 rounded transition cursor-pointer"
            aria-label="পূর্ববর্তী ব্রেকিং নিউজ"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 hover:bg-red-800 rounded transition cursor-pointer"
            aria-label="পরবর্তী ব্রেকিং নিউজ"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
