import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Copy, Check, Trash2, Search, ExternalLink } from 'lucide-react';

export const AdminMediaLibrary: React.FC = () => {
  const [images, setImages] = useState([
    {
      id: 'img-1',
      title: 'ঢাকা স্কাইলাইন ও হাতিরঝিল',
      url: '/images/hero_dhaka_skyline_1790865674961.jpg',
      aspect: '16:9',
      category: 'জাতীয় / হিরো',
    },
    {
      id: 'img-2',
      title: 'জাতীয় সংসদ ভবন ঢাকা',
      url: '/images/news_parliament_dhaka_1790865687125.jpg',
      aspect: '16:9',
      category: 'রাজনীতি / সংসদ',
    },
    {
      id: 'img-3',
      title: 'চট্টগ্রাম বন্দর ও কনটেইনার টার্মিনাল',
      url: '/images/news_economy_trade_1790865699540.jpg',
      aspect: '4:3',
      category: 'অর্থনীতি / বন্দর',
    },
    {
      id: 'img-4',
      title: 'মিরপুর শের-ই-বাংলা স্টেডিয়াম টেস্ট ক্রিকেট',
      url: '/images/news_sports_cricket_1790865711235.jpg',
      aspect: '4:3',
      category: 'খেলা / ক্রিকেট',
    },
    {
      id: 'img-5',
      title: 'বাংলা এআই গবেষণা ও ডাটা সেন্টার',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      aspect: '16:9',
      category: 'প্রযুক্তি',
    },
    {
      id: 'img-6',
      title: 'আন্তর্জাতিক কূটনীতি ও সম্মেলন',
      url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
      aspect: '16:9',
      category: 'মতামত',
    },
    {
      id: 'img-7',
      title: 'শ্রীমঙ্গলের সবুজে ঘেরা চা বাগান',
      url: 'https://images.unsplash.com/photo-1596405835955-465de8971940?w=800&auto=format&fit=crop&q=80',
      aspect: '16:9',
      category: 'সারাদেশ / পর্যটন',
    },
    {
      id: 'img-8',
      title: 'আন্তর্জাতিক চলচ্চিত্র উৎসব রেড কার্পেট',
      url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
      aspect: '16:9',
      category: 'বিনোদন',
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('সাধারণ');
  const [search, setSearch] = useState('');

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setImages([
      {
        id: `img-${Date.now()}`,
        title: newTitle.trim() || 'নতুন সংযোজিত মিডিয়া',
        url: newUrl.trim(),
        aspect: '16:9',
        category: newCategory,
      },
      ...images,
    ]);

    setNewUrl('');
    setNewTitle('');
  };

  const filtered = images.filter(
    (img) =>
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <ImageIcon className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            মিডিয়া লাইব্রেরি
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          সংবাদ প্রতিবেদনের জন্য প্রস্তুতকৃত হাই-রেজুলেশন ছবি ও ফটো আর্কাইভ
        </p>
      </div>

      {/* Add New Image URL Form */}
      <form onSubmit={handleAdd} className="bg-white p-5 border border-stone-200 space-y-3">
        <h2 className="text-xs font-bold font-bengali-serif text-stone-800 uppercase tracking-wider">
          নতুন ছবি যুক্ত করুন
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="ছবির ইউআরএল (Image URL)..."
            className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
          />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="ছবির বিবরণ বা শিরোনাম..."
            className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="ক্যাটাগরি..."
              className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition shrink-0 cursor-pointer"
            >
              যোগ করুন
            </button>
          </div>
        </div>
      </form>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ছবি খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 text-xs rounded focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((img) => (
          <div key={img.id} className="bg-white border border-stone-200 overflow-hidden group">
            <div className="aspect-16/10 bg-stone-100 relative overflow-hidden">
              <img
                src={img.url}
                alt={img.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 text-[9px] text-white rounded font-mono">
                {img.aspect}
              </span>
            </div>

            <div className="p-3 space-y-1">
              <div className="text-[10px] text-red-700 font-sans">{img.category}</div>
              <div className="text-xs font-medium text-stone-900 truncate" title={img.title}>
                {img.title}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <button
                  onClick={() => handleCopy(img.id, img.url)}
                  className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  {copiedId === img.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-stone-400" />
                      <span>URL কপি</span>
                    </>
                  )}
                </button>

                <a
                  href={img.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-400 hover:text-stone-700 p-1"
                  title="নতুন ট্যাবে খুলুন"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
