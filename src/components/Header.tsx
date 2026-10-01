import React, { useState } from 'react';
import { Category, SiteSettings, User } from '../types';
import { getFormattedBengaliDate, getTraditionalBanglaDate } from '../lib/dateUtils';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Search,
  Menu,
  X,
  Facebook,
  Twitter,
  Youtube,
  User as UserIcon,
  CloudSun,
  ShieldAlert,
} from 'lucide-react';

interface HeaderProps {
  categories: Category[];
  activeCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  siteSettings: SiteSettings;
  currentUser: User | null;
  onGoToAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategorySlug,
  onSelectCategory,
  onOpenSearch,
  onNavigateHome,
  siteSettings,
  currentUser,
  onGoToAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const gregorianDate = getFormattedBengaliDate();
  const banglaDate = getTraditionalBanglaDate();

  // Navigation items to display in main bar (first 9 items)
  const navCategories = categories.filter((c) => c.showInNav && c.slug !== 'home');
  const primaryNav = navCategories.slice(0, 10);
  const secondaryNav = navCategories.slice(10);

  const handleCategoryClick = (slug: string) => {
    onSelectCategory(slug);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white editorial-border-b sticky top-0 z-40">
      {/* 1. Top Utility Ribbon */}
      <div className="bg-stone-100/90 text-stone-600 text-xs editorial-border-b py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Bengali Date & Bangla San */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden whitespace-nowrap">
            <span className="font-medium text-stone-800">{gregorianDate}</span>
            <span className="hidden sm:inline text-stone-400">|</span>
            <span className="hidden sm:inline text-stone-600">{banglaDate} বঙ্গাব্দ</span>
            <span className="hidden md:inline text-stone-400">|</span>
            <div className="hidden md:flex items-center gap-1 text-stone-600">
              <CloudSun className="w-3.5 h-3.5 text-amber-600" />
              <span>ঢাকা ২৭° সে.</span>
            </div>
          </div>

          {/* Right: Actions, Social & Admin */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2.5 text-stone-500">
              <a
                href={siteSettings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 transition"
                aria-label="ফেসবুক"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={siteSettings.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-stone-900 transition"
                aria-label="এক্স"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href={siteSettings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-red-600 transition"
                aria-label="ইউটিউব"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            <PWAInstallButton />

            <button
              onClick={onGoToAdmin}
              className="flex items-center gap-1 text-stone-700 hover:text-red-700 font-medium transition cursor-pointer"
              title="বার্তা কক্ষ ও নিয়ন্ত্রণ প্যানেল"
            >
              <UserIcon className="w-3.5 h-3.5 text-stone-500" />
              <span>{currentUser ? 'কন্ট্রোল প্যানেল' : 'লগইন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header (Prominent "ঢাকা" Wordmark) */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-5 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
          aria-label="মেনু খুলুন"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Center/Left Logo Lockup */}
        <div
          onClick={onNavigateHome}
          className="flex flex-col items-center lg:items-start cursor-pointer select-none mx-auto lg:mx-0 group"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-3xl sm:text-5xl lg:text-6xl font-black font-bengali-serif tracking-tight text-stone-900 leading-none group-hover:text-red-700 transition-colors">
              ঢাকা
            </span>
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-600 self-baseline mt-1 group-hover:scale-125 transition-transform" />
          </div>
          <span className="text-[10px] sm:text-xs text-stone-500 tracking-wider font-sans font-medium mt-1">
            {siteSettings.tagline}
          </span>
        </div>

        {/* Right Search Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600 bg-stone-100 hover:bg-stone-200 rounded transition cursor-pointer"
            aria-label="অনুসন্ধান"
          >
            <Search className="w-4 h-4 text-stone-500" />
            <span className="hidden sm:inline">অনুসন্ধান করুন</span>
          </button>
        </div>
      </div>

      {/* 3. Category Navigation Ribbon (Desktop) */}
      <nav
        aria-label="প্রধান নেভিগেশন"
        className="hidden lg:block bg-stone-900 text-stone-100 border-t border-stone-800"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center space-x-1 sm:space-x-2 text-sm font-medium py-1">
            <button
              onClick={() => handleCategoryClick('home')}
              className={`px-3 py-2 transition-colors cursor-pointer border-b-2 font-medium ${
                activeCategorySlug === 'home'
                  ? 'border-red-500 text-white font-bold'
                  : 'border-transparent text-stone-300 hover:text-white'
              }`}
            >
              প্রচ্ছদ
            </button>

            {primaryNav.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-3 py-2 transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                  activeCategorySlug === cat.slug
                    ? 'border-red-500 text-white font-bold'
                    : 'border-transparent text-stone-300 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {secondaryNav.length > 0 && (
              <div className="relative group">
                <button className="px-3 py-2 text-stone-300 hover:text-white border-b-2 border-transparent transition cursor-pointer flex items-center gap-1">
                  <span>আরও</span>
                  <span className="text-[10px]">▼</span>
                </button>
                <div className="absolute right-0 top-full hidden group-hover:block bg-stone-900 text-white shadow-xl py-2 min-w-[150px] border border-stone-800 z-50">
                  {secondaryNav.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="w-full text-left px-4 py-2 text-xs text-stone-300 hover:bg-stone-800 hover:text-white"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 editorial-border-b">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold font-bengali-serif text-stone-900">ঢাকা</span>
                <span className="w-2 h-2 rounded-full bg-red-600" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-2 text-xs text-stone-500 editorial-border-b">
              {gregorianDate} · {banglaDate} বঙ্গাব্দ
            </div>

            <div className="flex flex-col py-3 space-y-1">
              <button
                onClick={() => handleCategoryClick('home')}
                className={`text-left px-3 py-2.5 rounded text-sm font-medium ${
                  activeCategorySlug === 'home'
                    ? 'bg-red-50 text-red-700 font-bold'
                    : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                প্রচ্ছদ
              </button>

              {categories
                .filter((c) => c.slug !== 'home')
                .map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`text-left px-3 py-2 rounded text-sm font-medium ${
                      activeCategorySlug === cat.slug
                        ? 'bg-red-50 text-red-700 font-bold'
                        : 'text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-stone-200 flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGoToAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-stone-900 text-white rounded text-sm font-medium"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>বার্তা কক্ষ নিয়ন্ত্রণ প্যানেল</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
