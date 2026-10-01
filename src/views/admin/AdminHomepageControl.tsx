import React, { useState } from 'react';
import { Article } from '../../types';
import { NewsStore } from '../../lib/storage';
import { Sliders, Star, Check, ArrowUp, ArrowDown } from 'lucide-react';

interface AdminHomepageControlProps {
  articles: Article[];
  onRefresh: () => void;
}

export const AdminHomepageControl: React.FC<AdminHomepageControlProps> = ({
  articles,
  onRefresh,
}) => {
  const currentLead = articles.find((a) => a.isLeadStory) || articles[0];
  const [selectedLeadId, setSelectedLeadId] = useState(currentLead?.id || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sections on homepage
  const [sections, setSections] = useState([
    { id: 'hero', name: 'প্রধান লিড ও শীর্ষ খবর (Hero Grid)', enabled: true },
    { id: 'trending', name: 'আলোচিত সংবাদ স্ট্রিপ (Trending Strip)', enabled: true },
    { id: 'national_politics', name: 'জাতীয় ও রাজনীতি বিভাগ (National & Politics)', enabled: true },
    { id: 'economy_sports', name: 'অর্থনীতি ও খেলাধুলা (Economy & Sports)', enabled: true },
    { id: 'opinion', name: 'মতামত ও কলামিস্ট (Opinion Block)', enabled: true },
    { id: 'multimedia', name: 'ভিডিও ও ফটোগ্যালারি (Multimedia Showcase)', enabled: true },
    { id: 'newsletter', name: 'নিউজলেটার সাবস্ক্রিপশন (Newsletter)', enabled: true },
  ]);

  const handleSetLeadStory = () => {
    const target = articles.find((a) => a.id === selectedLeadId);
    if (!target) return;

    NewsStore.saveArticle({
      ...target,
      isLeadStory: true,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            হোমপেজ লেআউট ও লিড স্টোরি নিয়ন্ত্রণ
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          কোড পরিবর্তন না করেই হোমপেজের প্রধান শিরোনাম ও সেকশনগুলোর প্রদর্শন নিয়ন্ত্রণ করুন
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded">
          ✓ হোমপেজের প্রধান লিড স্টোরি সফলভাবে হালনাগাদ করা হয়েছে।
        </div>
      )}

      {/* Lead Story Selector */}
      <div className="bg-white p-6 border border-stone-200 space-y-4">
        <h2 className="text-sm font-bold font-bengali-serif text-stone-900 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-current" />
          <span>প্রধান লিড সংবাদ (Lead Story) নির্বাচন</span>
        </h2>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            হোমপেজের শীর্ষে সবচেয়ে বড় ফন্টে প্রদর্শিত সংবাদ:
          </label>
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="w-full p-2 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
          >
            {articles
              .filter((a) => a.status === 'published')
              .map((art) => (
                <option key={art.id} value={art.id}>
                  [{art.categoryName}] {art.title}
                </option>
              ))}
          </select>
        </div>

        <button
          onClick={handleSetLeadStory}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>লিড হিসেবে সংরক্ষণ করুন</span>
        </button>
      </div>

      {/* Sections Reordering */}
      <div className="bg-white p-6 border border-stone-200 space-y-4">
        <h2 className="text-sm font-bold font-bengali-serif text-stone-900">
          হোমপেজ সেকশন সমূহের ক্রম ও দৃশ্যমানতা
        </h2>

        <div className="space-y-2">
          {sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-stone-400 w-5">{idx + 1}.</span>
                <span className="font-semibold text-stone-800">{sec.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSection(sec.id)}
                  className={`px-2.5 py-1 text-[11px] rounded font-medium ${
                    sec.enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {sec.enabled ? 'চালু' : 'লুকানো'}
                </button>

                <button
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, 'up')}
                  className="p-1 hover:bg-stone-200 rounded disabled:opacity-30"
                  title="উপরে নিন"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  disabled={idx === sections.length - 1}
                  onClick={() => moveSection(idx, 'down')}
                  className="p-1 hover:bg-stone-200 rounded disabled:opacity-30"
                  title="নিচে নিন"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
