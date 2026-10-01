import React, { useState } from 'react';
import { PhotoAlbum } from '../types';
import { Camera, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { getFormattedBengaliDate } from '../lib/dateUtils';

interface PhotoGalleryViewProps {
  albums: PhotoAlbum[];
  selectedAlbum?: PhotoAlbum;
  onBack: () => void;
}

export const PhotoGalleryView: React.FC<PhotoGalleryViewProps> = ({
  albums,
  selectedAlbum: initialSelectedAlbum,
  onBack,
}) => {
  const [activeAlbum, setActiveAlbum] = useState<PhotoAlbum | null>(
    initialSelectedAlbum || albums[0] || null
  );
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Breadcrumb */}
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
            <Camera className="w-5 h-5 text-red-600" />
            <span>ছবি ও চিত্রসংবাদ</span>
          </h1>
        </div>
      </div>

      {/* Featured Album Showcase */}
      {activeAlbum && (
        <div className="bg-stone-900 text-white p-6 sm:p-8">
          <div className="max-w-3xl mb-6">
            <div className="text-xs text-red-400 font-sans mb-1">{activeAlbum.category}</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-bengali-serif mb-2 text-balance">
              {activeAlbum.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mb-3 leading-relaxed">
              {activeAlbum.summary}
            </p>
            <div className="text-xs text-stone-400 font-sans">
              ছবি ও তথ্য: {activeAlbum.photographer} · প্রকাশ:{' '}
              {getFormattedBengaliDate(activeAlbum.publishedAt)}
            </div>
          </div>

          {/* Album Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activeAlbum.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setModalImageIndex(idx)}
                className="group cursor-pointer relative overflow-hidden bg-stone-800 aspect-4/3"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-xs text-white line-clamp-2">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Albums List */}
      <div className="pt-6">
        <h3 className="text-lg font-bold font-bengali-serif text-stone-900 mb-4 pb-2 border-b border-stone-300">
          আরও ফটো অ্যালবাম
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((alb) => (
            <div
              key={alb.id}
              onClick={() => {
                setActiveAlbum(alb);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer group space-y-2"
            >
              <div className="aspect-16/10 overflow-hidden bg-stone-200">
                <img
                  src={alb.coverImage}
                  alt={alb.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-xs text-stone-500 font-sans">
                {alb.category} · {alb.images.length}টি ছবি
              </div>
              <h4 className="text-sm font-bold font-bengali-serif text-stone-900 group-hover:text-red-700 transition">
                {alb.title}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal Image Viewer */}
      {modalImageIndex !== null && activeAlbum && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between text-white pb-4 border-b border-stone-800">
            <div>
              <div className="text-xs text-stone-400">{activeAlbum.title}</div>
              <div className="text-sm font-mono text-stone-300">
                ছবি: {modalImageIndex + 1} / {activeAlbum.images.length}
              </div>
            </div>
            <button
              onClick={() => setModalImageIndex(null)}
              className="p-2 text-stone-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={activeAlbum.images[modalImageIndex].url}
              alt={activeAlbum.images[modalImageIndex].caption}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] max-w-full object-contain mx-auto"
            />

            {/* Navigation arrows */}
            {modalImageIndex > 0 && (
              <button
                onClick={() => setModalImageIndex((prev) => (prev !== null ? prev - 1 : 0))}
                className="absolute left-2 p-2 bg-black/60 hover:bg-black text-white rounded-full"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {modalImageIndex < activeAlbum.images.length - 1 && (
              <button
                onClick={() => setModalImageIndex((prev) => (prev !== null ? prev + 1 : 0))}
                className="absolute right-2 p-2 bg-black/60 hover:bg-black text-white rounded-full"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="text-center text-stone-200 text-xs sm:text-sm max-w-xl mx-auto italic">
            "{activeAlbum.images[modalImageIndex].caption}"
          </div>
        </div>
      )}
    </div>
  );
};
