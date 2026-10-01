import React from 'react';
import { Category, SiteSettings } from '../types';
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  categories: Category[];
  siteSettings: SiteSettings;
  onSelectCategory: (slug: string) => void;
  onSelectStaticPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  siteSettings,
  onSelectCategory,
  onSelectStaticPage,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-300 pt-12 pb-8 border-t-4 border-red-700 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top brand grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800">
          {/* Col 1 & 2: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-3xl font-black font-bengali-serif tracking-tight text-white">
                ঢাকা
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            </div>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              ‘ঢাকা’ বাংলাদেশের শীর্ষস্থানীয় ও নির্ভরযোগ্য ডিজিটাল সংবাদপত্র। বস্তুনিষ্ঠ সংবাদ, গভীর অনুসন্ধান ও সার্বক্ষণিক সত্যের অন্বেষণে আমরা সর্বদা দায়বদ্ধ ও আপসহীন।
            </p>

            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <a
                href={siteSettings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                aria-label="ফেসবুক"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center hover:bg-stone-700 hover:text-white transition"
                aria-label="এক্স / টুইটার"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                aria-label="ইউটিউব"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center hover:bg-pink-600 hover:text-white transition"
                aria-label="ইনস্টাগ্রাম"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3 font-bengali-serif border-b border-stone-800 pb-1.5">
              বিভাগসমূহ
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(1, 8).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.slug)}
                    className="hover:text-red-400 transition cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: More Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3 font-bengali-serif border-b border-stone-800 pb-1.5">
              অন্যান্য বিভাগ
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(8).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.slug)}
                    className="hover:text-red-400 transition cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Editorial & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-3 font-bengali-serif border-b border-stone-800 pb-1.5">
              যোগাযোগ ও সম্পাদকীয়
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`mailto:${siteSettings.contactEmail}`} className="hover:text-white">
                  {siteSettings.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>{siteSettings.contactPhone}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-stone-500 block">ভারপ্রাপ্ত সম্পাদক: তানভীর আহমেদ</span>
              <span className="text-[11px] text-stone-500 block">প্রকাশক: ঢাকা পাবলিকেশন্স লিমিটেড</span>
            </div>
          </div>
        </div>

        {/* Bottom utility links & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button
              onClick={() => onSelectStaticPage('about')}
              className="hover:text-stone-300 transition"
            >
              আমাদের কথা
            </button>
            <span>·</span>
            <button
              onClick={() => onSelectStaticPage('editorial-policy')}
              className="hover:text-stone-300 transition"
            >
              সম্পাদকীয় নীতিমালা
            </button>
            <span>·</span>
            <button
              onClick={() => onSelectStaticPage('privacy')}
              className="hover:text-stone-300 transition"
            >
              গোপনীয়তা নীতি
            </button>
            <span>·</span>
            <button
              onClick={() => onSelectStaticPage('terms')}
              className="hover:text-stone-300 transition"
            >
              শর্তাবলি
            </button>
            <span>·</span>
            <button
              onClick={() => onSelectStaticPage('contact')}
              className="hover:text-stone-300 transition"
            >
              যোগাযোগ
            </button>
          </div>

          <div className="text-center sm:text-right font-mono text-[11px]">
            © {currentYear} ঢাকা. সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </div>
    </footer>
  );
};
