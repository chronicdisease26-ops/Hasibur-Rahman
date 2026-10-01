import React, { useState } from 'react';
import { BreakingNewsItem } from '../../types';
import { NewsStore } from '../../lib/storage';
import { getRelativeTimeBengali } from '../../lib/dateUtils';
import { Zap, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface AdminBreakingNewsProps {
  breakingNews: BreakingNewsItem[];
  onRefresh: () => void;
}

export const AdminBreakingNews: React.FC<AdminBreakingNewsProps> = ({
  breakingNews,
  onRefresh,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newPriority, setNewPriority] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BreakingNewsItem = {
      id: `brk-${Date.now()}`,
      title: newTitle.trim(),
      link: newLink.trim() || undefined,
      priority: Number(newPriority) || 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    NewsStore.saveBreakingNews(newItem);
    setNewTitle('');
    setNewLink('');
    onRefresh();
  };

  const handleToggleActive = (item: BreakingNewsItem) => {
    NewsStore.saveBreakingNews({
      ...item,
      isActive: !item.isActive,
    });
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই ব্রেকিং নিউজ মুছে ফেলতে চান?')) {
      NewsStore.deleteBreakingNews(id);
      onRefresh();
    }
  };

  const startEdit = (item: BreakingNewsItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  const saveEdit = (item: BreakingNewsItem) => {
    NewsStore.saveBreakingNews({
      ...item,
      title: editTitle.trim() || item.title,
    });
    setEditingId(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-red-600 fill-current" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            ব্রেকিং নিউজ নিয়ন্ত্রণ
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          হোমপেজ ও সংবাদের শীর্ষে লাল রঙের অ্যানিমেটেড টিকারে সক্রিয় সংবাদের তালিকা
        </p>
      </div>

      {/* Add New Form */}
      <form onSubmit={handleAdd} className="bg-white p-5 border border-stone-200 space-y-4">
        <h2 className="text-sm font-bold font-bengali-serif text-stone-800">
          নতুন ব্রেকিং নিউজ যুক্ত করুন
        </h2>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            ব্রেকিং সংবাদের শিরোনাম *
          </label>
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="জরুরি সংবাদের এক লাইনের সারমর্ম লিখুন..."
            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded text-xs sm:text-sm focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              লিংক (ঐচ্ছিক URL)
            </label>
            <input
              type="text"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="/news/national/..."
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              অগ্রাধিকার (Priority - ১ সর্বোচ্চ)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={newPriority}
              onChange={(e) => setNewPriority(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ব্রেকিং নিউজ যুক্ত করুন</span>
        </button>
      </form>

      {/* List */}
      <div className="bg-white border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-200 font-bold font-bengali-serif text-sm">
          বর্তমান ব্রেকিং সংবাদের তালিকা ({breakingNews.length})
        </div>

        <div className="divide-y divide-stone-200">
          {breakingNews.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isActive ? 'bg-white' : 'bg-stone-50 opacity-60'
              }`}
            >
              <div className="flex-1 min-w-0">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-stone-400 rounded"
                    />
                    <button
                      onClick={() => saveEdit(item)}
                      className="p-1 bg-emerald-600 text-white rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 bg-stone-300 text-stone-700 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold text-stone-900 text-xs sm:text-sm">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-stone-500 font-sans mt-0.5">
                      অগ্রাধিকার: {item.priority} · {getRelativeTimeBengali(item.createdAt)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition ${
                    item.isActive
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {item.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </button>

                <button
                  onClick={() => startEdit(item)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded"
                  title="সম্পাদনা"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-600 hover:text-red-800 rounded"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
