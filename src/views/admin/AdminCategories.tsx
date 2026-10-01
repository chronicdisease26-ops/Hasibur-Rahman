import React, { useState } from 'react';
import { Category } from '../../types';
import { NewsStore } from '../../lib/storage';
import { FolderTree, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface AdminCategoriesProps {
  categories: Category[];
  onRefresh: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onRefresh,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [showInNav, setShowInNav] = useState(true);
  const [order, setOrder] = useState(categories.length + 1);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug =
      slug.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0980-\u09FF]+/g, '-') ||
      `cat-${Date.now()}`;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: generatedSlug,
      description: description.trim() || undefined,
      showInNav,
      order: Number(order) || categories.length + 1,
    };

    NewsStore.saveCategory(newCat);
    setName('');
    setSlug('');
    setDescription('');
    onRefresh();
  };

  const handleDelete = (id: string, catName: string) => {
    if (window.confirm(`আপনি কি "${catName}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
      NewsStore.deleteCategory(id);
      onRefresh();
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  };

  const saveEdit = (cat: Category) => {
    NewsStore.saveCategory({
      ...cat,
      name: editName.trim() || cat.name,
      slug: editSlug.trim() || cat.slug,
    });
    setEditingId(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <FolderTree className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            ক্যাটাগরি ও বিভাগ ব্যবস্থাপনা
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          ওয়েবসাইটের প্রধান মেন্যু ও সংবাদ ক্যাটাগরি কনফিগার করুন
        </p>
      </div>

      {/* Add New Category */}
      <form onSubmit={handleAdd} className="bg-white p-5 border border-stone-200 space-y-4">
        <h2 className="text-sm font-bold font-bengali-serif text-stone-800">
          নতুন ক্যাটাগরি তৈরি করুন
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ক্যাটাগরির নাম *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: বাণিজ্য, বিজ্ঞান, কলাম"
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ইউআরএল স্লাগ (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="যেমন: business, science"
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            বিবরণ (ঐচ্ছিক)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="বিভাগের সংক্ষিপ্ত পরিচয়..."
            className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showInNav}
              onChange={(e) => setShowInNav(e.target.checked)}
              className="rounded text-red-600"
            />
            <span>প্রধান ন্যাভিগেশন বারে দেখান</span>
          </label>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ক্যাটাগরি যুক্ত করুন</span>
        </button>
      </form>

      {/* List */}
      <div className="bg-white border border-stone-200 overflow-hidden">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-stone-50 text-stone-500 uppercase font-mono border-b border-stone-200">
            <tr>
              <th className="py-3 px-4">ক্রম</th>
              <th className="py-3 px-4">নাম</th>
              <th className="py-3 px-4">স্লাগ (URL)</th>
              <th className="py-3 px-4">মেন্যু প্রদর্শন</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {categories.map((cat, idx) => (
              <tr key={cat.id} className="hover:bg-stone-50 transition">
                <td className="py-3 px-4 font-mono">{idx + 1}</td>
                <td className="py-3 px-4 font-semibold text-stone-900">
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-2 py-1 text-xs border border-stone-400 rounded"
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="py-3 px-4 font-mono text-stone-500">
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      className="px-2 py-1 text-xs border border-stone-400 rounded"
                    />
                  ) : (
                    cat.slug
                  )}
                </td>
                <td className="py-3 px-4">
                  {cat.showInNav ? (
                    <span className="text-emerald-700 font-medium">হ্যাঁ</span>
                  ) : (
                    <span className="text-stone-400">না</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  {editingId === cat.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(cat)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 text-stone-400 hover:bg-stone-100 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1 text-stone-500 hover:text-stone-800 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {cat.slug !== 'home' && (
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1 text-red-500 hover:text-red-700 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
