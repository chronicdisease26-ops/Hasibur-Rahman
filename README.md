# ঢাকা (Dhaka) – প্রিমিয়াম ডিজিটাল সংবাদ প্ল্যাটফর্ম

> **"দেশ ও বিশ্বের সর্বশেষ সংবাদ"**

**ঢাকা** হলো বাংলাদেশের একটি আধুনিক, উচ্চগতির এবং সম্পাদকীয় মানসম্পন্ন ডিজিটাল সংবাদ প্রকাশনা প্ল্যাটফর্ম। এটি সম্পূর্ণ বাংলা ইউনিকোড ফন্টস্ট্যাক (Noto Sans Bengali ও Noto Serif Bengali), মোবাইল-ফার্স্ট রেসপনসিভ ডিজাইন, অ্যাডভান্সড এসইও, ফেসবুক ওপেনগ্রাফ শেয়ারিং, ব্রেকিং নিউজ টিকার, অ্যাডস্টেরা অ্যাডভারটাইজিং নেটওয়ার্ক এবং একটি পূর্ণাঙ্গ নিউজরুম সিএমএস (Content Management System) দিয়ে সমৃদ্ধ।

---

## ১. প্রযুক্তি ও আর্কিটেকচার (Tech Stack)

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
* **Typography**: Noto Sans Bengali & Noto Serif Bengali
* **PWA**: Progressive Web App সক্ষমতা, অফলাইন রেডি ও ইন-অ্যাপ ইন্সটল সাপোর্ট
* **CMS & Storage**: রিয়্যাক্টিভ লোকাল স্টোরেজ / এক্সটার্নাল পোস্টগ্রেসকিউএল সিঙ্ক আর্কিটেকচার
* **Deployment**: Netlify-রেডি (`netlify.toml`, SPA রিডাইরেক্ট ও সিকিউরিটি হেডার অন্তর্ভুক্ত)
* **SEO**: JSON-LD Structured Data, Open Graph, Twitter Cards, News sitemap, robots.txt

---

## ২. ফোল্ডার স্ট্রাকচার (Project Structure)

```text
├── index.html                   # মেটাট্যাগ, গুগল ফন্ট এবং ওপেনগ্রাফ হেডার
├── netlify.toml                 # Netlify বিল্ড ও SPA রিডাইরেক্ট কনফিগারেশন
├── .env.example                 # এনভায়রনমেন্ট ভেরিয়েবল ডকুমেন্টেশন
├── metadata.json                # প্ল্যাটফর্ম মেটাডাটা ও ক্যাপাবিলিটি
├── public/
│   ├── icon.svg                 # ঢাকা ব্র‍্যান্ড ভেক্টর লোগো
│   ├── manifest.json            # PWA স্ট্যান্ডার্ড ম্যানিফেস্ট
│   ├── robots.txt               # সার্চ ইঞ্জিন ক্রলার ডিরেক্টিভ
│   └── sitemap.xml              # গুগল নিউজ ও সাইটম্যাপ এক্সএমএল
├── src/
│   ├── assets/images/           # হাই-রেজ্যুলেশন জেনারেটেড ও সম্পাদকীয় ইমেজ
│   ├── components/              # হেডবার, ফুটার, ব্রেকিং টিকার, নিউজ কার্ড, অ্যাড ব্যানার
│   │   ├── Header.tsx           # বাংলা ও ইংরেজি ক্যালেন্ডার, ওয়েদার, ন্যাভবার
│   │   ├── Footer.tsx           # ব্র‍্যান্ড স্টোরি, সেকশন লিংক, ডায়নামিক কপিরাইট
│   │   ├── BreakingNewsTicker.tsx # অ্যানিমেটেড ব্রেকিং নিউজ টিকার
│   │   ├── NewsCards.tsx        # ৮ ধরণের সম্পাদকীয় কার্ড সিস্টেম (জিরো-পিল ডিসিপ্লিন)
│   │   ├── AdBanner.tsx         # সিএলএস-মুক্ত রেসপনসিভ ব্যানার বিজ্ঞাপন
│   │   ├── AdsterraScripts.tsx  # ডায়নামিক পপআন্ডার ও সোশ্যাল বার স্ক্রিপ্ট
│   │   └── PWAInstallButton.tsx # ইন-অ্যাপ ইন্সটল বাটন (iOS ও Android সাপোর্ট)
│   ├── data/
│   │   └── initialData.ts       # ২০+ বাংলা সম্পাদকীয় খবর, ক্যাটাগরি, লেখক, বিজ্ঞাপন ডেটা
│   ├── hooks/
│   │   └── usePWAInstall.ts     # PWA ইন্সটলেশন হুক
│   ├── lib/
│   │   ├── dateUtils.ts         # বাংলা সংখ্যা, বঙ্গাব্দ ক্যালেন্ডার ও আপেক্ষিক সময় ইউটিলিটি
│   │   └── storage.ts           # রিয়্যাক্টিভ স্টোরেজ ম্যানেজার ও ব্যাকআপ এক্সপোর্টার
│   ├── types/
│   │   └── index.ts             # টাইপস্ক্রিপ্ট ডাটা মডেল ও ইন্টারফেস
│   ├── views/                   # পাবলিক ভিউসমূহ
│   │   ├── HomeView.tsx         # হিরো গ্রিড, ট্রেন্ডিং, বিভাগীয় সেকশন, ভিডিও ও ফটোগ্যালারি
│   │   ├── ArticleView.tsx      # ফুল রিডিং মোড, ফন্ট সাইজ চেঞ্জার, শেয়ারিং ও কমেন্ট
│   │   ├── CategoryView.tsx     # বিভাগভিত্তিক আর্কাইভিং ও পেজিনেশন
│   │   ├── SearchView.tsx       # লাইভ অনুসন্ধান ও ফিল্টারিং
│   │   ├── PhotoGalleryView.tsx # চিত্রসংবাদ ও ফুলস্ক্রিন ইমেজ ভিউয়ার
│   │   ├── VideoNewsView.tsx    # ভিডিও প্রতিবেদন ও ইউটিউব প্লেয়ার
│   │   └── StaticPageView.tsx   # আমাদের কথা, সম্পাদকীয় নীতি, প্রাইভেসি ও যোগাযোগ
│   └── views/admin/             # নিউজরুম কনটেন্ট ম্যানেজমেন্ট সিস্টেম (CMS)
│       ├── AdminLayout.tsx      # অ্যাডমিন লেআউট ও সাইডবার
│       ├── AdminDashboard.tsx   # পরিসংখ্যান, ভিজিটর ভিউজ অ্যানালিটিক্স ও মেট্রিক্স
│       ├── AdminArticles.tsx    # প্রতিবেদন তালিকা, ফিল্টারিং ও লিড টগল
│       ├── AdminArticleEditor.tsx # রিচ টেক্সট এডিটর, এসইও ওভাররাইড ও লাইভ প্রিভিউ
│       ├── AdminBreakingNews.tsx # ব্রেকিং নিউজ ম্যানেজমেন্ট
│       ├── AdminCategories.tsx  # ক্যাটাগরি ও মেনু কনফিগারেশন
│       ├── AdminAuthors.tsx     # সাংবাদিক ও কলামিস্ট প্রোফাইল
│       ├── AdminMediaLibrary.tsx # ফটো ও মিডিয়া আর্কাইভ
│       ├── AdminAds.tsx         # Adsterra Popunder, Social Bar ও ব্যানার বিজ্ঞাপন
│       ├── AdminHomepageControl.tsx # হোমপেজের সেকশন ও লিড স্টোরি নিয়ন্ত্রণ
│       ├── AdminComments.tsx    # পাঠকের মন্তব্য মডারেশন
│       ├── AdminSiteSettings.tsx # ব্র‍্যান্ডিং, সোশ্যাল লিংক ও GA4 ট্র্যাকিং
│       ├── AdminDeploymentExport.tsx # সম্পূর্ণ ডেটা ব্যাকআপ ও Netlify বিল্ড হুক
│       └── AdminAuditLog.tsx    # অ্যাকশন ও নিরাপত্তা অডিট লগ
└── package.json
```

---

## ৩. ইন্সটলেশন ও রান করার নিয়ম (Setup & Run)

### ডিপেন্ডেন্সি ইন্সটল করুন
```bash
npm install
```

### ডেভেলপমেন্ট সার্ভার চালু করুন
```bash
npm run dev
```
এরপর ব্রাউজারে `http://localhost:3000` ঠিকানায় প্রবেশ করুন।

### প্রোডাকশন বিল্ড তৈরি করুন
```bash
npm run build
```

---

## ৪. অ্যাডমিন সিএমএস লগইন (Admin Credentials)

ওয়েবসাইটের উপরের ডানদিকের **লগইন** বাটনে ক্লিক করে অ্যাডমিন প্যানেলে প্রবেশ করুন:

* **Email**: `admin@dhaka.news`
* **Password**: `demo123`

*(বার্তা সম্পাদক অ্যাকাউন্টের জন্য: `editor@dhaka.news` / `demo123`)*

---

## ৫. Adsterra অ্যাডভার্টাইজিং নেটওয়ার্ক সেটআপ (Adsterra Integration)

১. সিএমএসে লগইন করে **বিজ্ঞাপন ও Adsterra** ট্যাবে যান।
২. **Adsterra স্ক্রিপ্ট সেটিংস** নির্বাচন করুন:
   * **Popunder**: সক্রিয় করুন এবং Adsterra ড্যাশবোর্ড থেকে প্রাপ্ত Popunder কোড স্নিপেট পেস্ট করুন।
   * **Social Bar**: সক্রিয় করুন এবং Social Bar কোড স্নিপেট পেস্ট করুন।
৩. **ডিসপ্লে ব্যানার স্লটসমূহ**:
   * Header Top (728x90)
   * Below Nav (970x90)
   * Homepage Middle (970x90)
   * Article Sidebar (300x250)
   * Article Body (728x90)
   * After Article
৪. প্রতিটি ব্যানার স্লটের জন্য ইমেজ ইউআরএল বা ডিরেক্ট অ্যাড কোড কাস্টমাইজ করতে পারবেন। কোনো কোড পরিবর্তন করতে হবে না।

---

## ৬. গুগল অ্যানালিটিক্স ৪ (GA4 Setup)

১. অ্যাডমিন প্যানেল থেকে **সাইট সেটিংস** মেন্যুতে যান।
২. আপনার GA4 Measurement ID (যেমন: `G-XXXXXXXXXX`) প্রদান করে সেভ করুন।

---

## ৭. Netlify ডেপ্লয়মেন্ট গাইডলাইন (Deploy to Netlify)

১. আপনার গিটহাবে রিপোজিটরি পুশ করুন:
   ```bash
   git add .
   git commit -m "feat: complete Dhaka news portal"
   git push origin main
   ```
২. **Netlify Dashboard**-এ গিয়ে `Add new site` > `Import an existing project` নির্বাচন করুন।
৩. রিপোজিটরি নির্বাচন করুন।
৪. Build Command: `npm run build`
৫. Publish directory: `dist`
৬. `.env.example` ফাইলের ভ্যারিয়েবলগুলো Netlify **Site configuration > Environment variables**-এ যুক্ত করুন।
৭. **Deploy site** চাপুন। সাইটটি লাইভ হয়ে যাবে!

---

## ৮. সোশ্যাল শেয়ারিং ও ওপেন গ্রাফ (Facebook & X Open Graph)

প্রতিটি সংবাদের পাতায় স্বয়ংক্রিয়ভাবে:
* `og:title`
* `og:description`
* `og:image` (১২০০x৬৩০ ডাইমেনশনে অপটিমাইজড)
* `og:url` (ক্যানোনিকাল ইউআরএল)
* `twitter:card` (summary_large_image)
উপস্থিত থাকে, যা ফেসবুকে শেয়ার করার সাথে সাথে প্রিমিয়াম থাম্বনেইল প্রিভিউ প্রদান করে।

---

## ৯. নিরাপত্তা ও ডেটা ব্যাকআপ (Security & Backup)

* অ্যাডমিন কনসোল থেকে **ডেপ্লয়মেন্ট ও এক্সপোর্ট** ট্যাবে গিয়ে যে কোনো সময় সম্পূর্ণ নিউজ ডেটাবেজ এক ক্লিকে JSON ফরম্যাটে এক্সপোর্ট করা যাবে।
* কোনো ধরণের সিক্রেট বা প্রাইভেট কি সোর্স কোডে উন্মুক্ত নয়।
