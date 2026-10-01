import React, { useState } from 'react';
import { Author } from '../../types';
import { NewsStore } from '../../lib/storage';
import { Users, Plus, Edit2, Mail } from 'lucide-react';

interface AdminAuthorsProps {
  authors: Author[];
  onRefresh: () => void;
}

export const AdminAuthors: React.FC<AdminAuthorsProps> = ({ authors, onRefresh }) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAuthor: Author = {
      id: `auth-${Date.now()}`,
      name: name.trim(),
      designation: designation.trim() || 'প্রতিবেদক',
      email: email.trim() || `reporter${Date.now()}@dhaka.news`,
      bio: bio.trim() || 'ঢাকা ডিজিটাল নিউজের সাংবাদিক।',
      avatar:
        avatar.trim() ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      slug: name.trim().toLowerCase().replace(/[^\w\u0980-\u09FF]+/g, '-') || `author-${Date.now()}`,
    };

    NewsStore.saveAuthor(newAuthor);
    setName('');
    setDesignation('');
    setEmail('');
    setBio('');
    setAvatar('');
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-red-600" />
          <h1 className="text-xl font-bold font-bengali-serif text-stone-900">
            লেখক ও প্রতিবেদক ব্যবস্থাপনা
          </h1>
        </div>
        <p className="text-xs text-stone-500">
          সংবাদকক্ষের জ্যেষ্ঠ সাংবাদিক, বিশেষ সংবাদদাতা ও কলামিস্টদের প্রোফাইল
        </p>
      </div>

      {/* Add New Author Form */}
      <form onSubmit={handleAdd} className="bg-white p-5 border border-stone-200 space-y-4">
        <h2 className="text-sm font-bold font-bengali-serif text-stone-800">
          নতুন লেখক বা প্রতিবেদক যুক্ত করুন
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              পূর্ণ নাম *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: ড. সাজিদ হোসেন"
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              পদবি (Designation)
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="যেমন: জ্যেষ্ঠ প্রতিবেদক, অর্থনৈতিক বিশ্লেষক"
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              ইমেইল
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reporter@dhaka.news"
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              প্রোফাইল ছবির লিংক (Avatar URL)
            </label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            সংক্ষিপ্ত পরিচিতি (Bio)
          </label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="সাংবাদিকের অভিজ্ঞতা ও বিশেষ দক্ষতার বিবরণ..."
            className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs focus:outline-none focus:border-red-600"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>প্রতিবেদক যুক্ত করুন</span>
        </button>
      </form>

      {/* Authors List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {authors.map((auth) => (
          <div key={auth.id} className="bg-white p-4 border border-stone-200 flex items-start gap-3">
            <img
              src={auth.avatar}
              alt={auth.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-stone-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-stone-900 text-sm font-bengali-serif">{auth.name}</h3>
              <div className="text-[11px] text-red-700 font-sans mb-1">{auth.designation}</div>
              <p className="text-xs text-stone-600 line-clamp-2">{auth.bio}</p>
              <div className="text-[10px] text-stone-400 mt-2 flex items-center gap-1 font-mono">
                <Mail className="w-3 h-3" />
                <span>{auth.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
