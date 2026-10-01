import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowLeft } from 'lucide-react';

interface StaticPageViewProps {
  pageType: 'about' | 'editorial-policy' | 'privacy' | 'terms' | 'contact';
  siteSettings: SiteSettings;
  onBack: () => void;
}

export const StaticPageView: React.FC<StaticPageViewProps> = ({
  pageType,
  siteSettings,
  onBack,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setIsSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
  };

  const titles: Record<string, string> = {
    about: 'আমাদের কথা (About Us)',
    'editorial-policy': 'সম্পাদকীয় নীতিমালা (Editorial Policy)',
    privacy: 'গোপনীয়তা নীতি (Privacy Policy)',
    terms: 'ব্যবহারের শর্তাবলি (Terms & Conditions)',
    contact: 'যোগাযোগ ও বার্তা কক্ষ (Contact Us)',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>প্রচ্ছদে ফিরে যান</span>
      </button>

      <div className="pb-3 border-b-2 border-stone-900">
        <h1 className="text-2xl sm:text-3xl font-bold font-bengali-serif text-stone-900">
          {titles[pageType] || 'তথ্য'}
        </h1>
      </div>

      {pageType === 'about' && (
        <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4">
          <p className="lead font-medium text-stone-900 text-base sm:text-lg">
            ‘ঢাকা’ হলো বাংলাদেশ ও বিশ্বের প্রতিটি প্রান্তের সত্যনিষ্ঠ, নিরপেক্ষ ও নির্ভীক সংবাদ পরিবেশনের একটি শীর্ষস্থানীয় স্বাধীন ডিজিটাল সংবাদ প্ল্যাটফর্ম।
          </p>
          <p>
            আমরা বিশ্বাস করি, একটি সমৃদ্ধ ও গণতান্ত্রিক সমাজ গঠনের ভিত্তি হলো অবাধ তথ্যপ্রবাহ ও সাংবাদিকতার সততা। ঢাকা ডিজিটাল নিউজ কোনো রাজনৈতিক বা বাণিজ্যিক গোষ্ঠীর তোষামোদ না করে জনস্বার্থের কথা বলে।
          </p>
          <h2>আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
          <ul>
            <li>যাচাই-বাছাইকৃত ও বস্তুনিষ্ঠ সংবাদ পরিবেশন।</li>
            <li>অনুসন্ধানী প্রতিবেদনের মাধ্যমে জবাবদিহিতা নিশ্চিতকরণ।</li>
            <li>বাংলা ভাষা ও সংস্কৃতির মর্যাদা বিশ্বব্যাপী ছড়িয়ে দেওয়া।</li>
            <li>সর্বাধুনিক প্রযুক্তি ব্যবহারের মাধ্যমে দ্রুততম সময়ে পাঠকদের কাছে তথ্য পৌঁছানো।</li>
          </ul>
        </div>
      )}

      {pageType === 'editorial-policy' && (
        <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            ‘ঢাকা’ সাংবাদিকতার পেশাগত নৈতিকতা এবং আন্তর্জাতিক মানদণ্ড অনুসরণ করে পরিচালিত হয়।
          </p>
          <h2>১. সত্যনিষ্ঠা ও নির্ভুলতা</h2>
          <p>
            প্রতিটি সংবাদ প্রকাশের আগে তথ্য একাধিক নির্ভরযোগ্য উৎস থেকে যাচাই করা হয়। কোনো ক্ষেত্রে ভুল প্রমাণিত হলে অবিলম্বে সংশোধনী প্রকাশ করা হয়।
          </p>
          <h2>২. নিরপেক্ষতা ও ভারসাম্য</h2>
          <p>
            যেকোনো বিতর্কিত বিষয়ে সকল পক্ষের বক্তব্য উপস্থাপন করা আমাদের নীতি। ব্যক্তিগত আক্রমণ, বিদ্বেষমূলক বক্তব্য বা অপপ্রচার ‘ঢাকা’য় কঠোরভাবে নিষিদ্ধ।
          </p>
          <h2>৩. সূত্রের নিরাপত্তা</h2>
          <p>
            অনুসন্ধানী সাংবাদিকতায় সূত্রের গোপনীয়তা রক্ষা করা আমাদের আইনি ও নৈতিক দায়িত্ব।
          </p>
        </div>
      )}

      {pageType === 'privacy' && (
        <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            পাঠকদের ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করতে ‘ঢাকা’ প্রতিশ্রুতিবদ্ধ। এই নীতিমালায় ব্যাখ্যা করা হয়েছে কীভাবে আমরা তথ্য সংগ্রহ ও ব্যবহার করি।
          </p>
          <h2>তথ্য সংগ্রহ</h2>
          <p>
            আমরা কোনো অননুমোদিত ব্যক্তিগত তথ্য সংগ্রহ করি না। নিউজলেটার সাবস্ক্রিপশন বা মন্তব্য করার সময় শুধুমাত্র প্রয়োজনীয় নাম ও ইমেইল ঠিকানা সংরক্ষিত হয়।
          </p>
          <h2>কুকিজ (Cookies)</h2>
          <p>
            পাঠকদের ব্রাউজিং অভিজ্ঞতা উন্নত করতে এবং সাইটের কার্যকারিতা বিশ্লেষণে স্ট্যান্ডার্ড ব্রাউজার কুকি ব্যবহৃত হয়।
          </p>
        </div>
      )}

      {pageType === 'terms' && (
        <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4">
          <p>
            ‘ঢাকা’ ওয়েবসাইটে প্রবেশের মাধ্যমে আপনি নিম্নোক্ত শর্তাবলি মেনে নিতে সম্মত হচ্ছেন:
          </p>
          <h2>কপিরাইট ও স্বত্বাধিকার</h2>
          <p>
            এই ওয়েবসাইটে প্রকাশিত সকল লেখা, ছবি, অডিও ও ভিডিও ‘ঢাকা’ অথবা সংশ্লিষ্ট কনটেন্ট পার্টনারদের কপিরাইট দ্বারা সুরক্ষিত। লিখিত অনুমতি ব্যতিরেকে কোনো উপাদান বাণিজ্যিক উদ্দেশ্যে পুনঃব্যবহার করা দণ্ডনীয় অপরাধ।
          </p>
        </div>
      )}

      {pageType === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Info */}
          <div className="md:col-span-5 bg-stone-100 p-6 space-y-4 text-xs sm:text-sm">
            <h3 className="font-bold font-bengali-serif text-base text-stone-900">
              বার্তা কক্ষের ঠিকানা
            </h3>
            <div className="flex items-start gap-2.5 text-stone-700">
              <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{siteSettings.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-700">
              <Mail className="w-4 h-4 text-red-600 shrink-0" />
              <a href={`mailto:${siteSettings.contactEmail}`} className="hover:underline">
                {siteSettings.contactEmail}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-stone-700">
              <Phone className="w-4 h-4 text-red-600 shrink-0" />
              <span>{siteSettings.contactPhone}</span>
            </div>
            <div className="pt-4 border-t border-stone-300 text-stone-500 text-xs">
              জরুরি সংবাদের জন্য ২৪ ঘণ্টা আমাদের নিউজরুম হেল্পলাইন খোলা থাকে।
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            {isSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold font-bengali-serif text-base">ধন্যবাদ!</h4>
                  <p className="text-xs">আপনার বার্তা বার্তা কক্ষে সফলভাবে পৌঁছেছে। আমরা দ্রুত আপনার সাথে যোগাযোগ করব।</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 text-xs sm:text-sm rounded focus:outline-none focus:border-red-600"
                    placeholder="আপনার পূর্ণ নাম"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    ইমেইল ঠিকানা *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 text-xs sm:text-sm rounded focus:outline-none focus:border-red-600"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    বিষয়
                  </label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 text-xs sm:text-sm rounded focus:outline-none focus:border-red-600"
                    placeholder="বার্তার বিষয়বস্তু"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    আপনার বার্তা *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 text-xs sm:text-sm rounded focus:outline-none focus:border-red-600"
                    placeholder="আপনার প্রশ্ন বা মতামত বিস্তারিত লিখুন..."
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm rounded transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>বার্তা পাঠান</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
