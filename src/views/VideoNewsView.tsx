import React, { useState } from 'react';
import { VideoNews } from '../types';
import { VideoNewsCard } from '../components/NewsCards';
import { Video, ArrowLeft } from 'lucide-react';
import { getFormattedBengaliDate } from '../lib/dateUtils';

interface VideoNewsViewProps {
  videos: VideoNews[];
  selectedVideo?: VideoNews;
  onBack: () => void;
}

export const VideoNewsView: React.FC<VideoNewsViewProps> = ({
  videos,
  selectedVideo: initialSelected,
  onBack,
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoNews>(
    initialSelected || videos[0]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>প্রচ্ছদ</span>
          </button>
          <span className="text-stone-300">/</span>
          <h1 className="text-xl sm:text-2xl font-bold font-bengali-serif text-stone-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-red-600" />
            <span>ভিডিও সংবাদ</span>
          </h1>
        </div>
      </div>

      {/* Main Video Player */}
      {activeVideo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-stone-950 p-4 sm:p-6 text-white">
            <div className="relative aspect-16/9 w-full bg-black mb-4 overflow-hidden">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="text-xs text-red-400 font-sans mb-1">{activeVideo.category}</div>
            <h2 className="text-xl sm:text-2xl font-bold font-bengali-serif mb-2 text-balance">
              {activeVideo.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mb-3">{activeVideo.summary}</p>
            <div className="text-xs text-stone-400 font-sans">
              সময়কাল: {activeVideo.duration} · প্রকাশ:{' '}
              {getFormattedBengaliDate(activeVideo.publishedAt)}
            </div>
          </div>

          {/* Playlist */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-bold text-base font-bengali-serif text-stone-900 pb-2 border-b border-stone-300">
              অন্যান্য ভিডিও সংবাদ
            </h3>
            <div className="space-y-4">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => {
                    setActiveVideo(vid);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-2 cursor-pointer transition flex items-start gap-3 border ${
                    activeVideo.id === vid.id
                      ? 'border-red-600 bg-red-50/50'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="w-28 aspect-16/9 shrink-0 relative bg-stone-800">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] text-white px-1 font-mono">
                      {vid.duration}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-stone-500 font-sans">{vid.category}</div>
                    <h4 className="text-xs font-semibold font-bengali-serif text-stone-900 line-clamp-2 leading-snug">
                      {vid.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
