import React, { useState, useEffect } from 'react';
import {
  Article,
  Category,
  BreakingNewsItem,
  AdSetting,
  SiteSettings,
  PhotoAlbum,
  VideoNews,
  User,
} from './types';
import { NewsStore } from './lib/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { AdsterraScripts } from './components/AdsterraScripts';

// Public Views
import { HomeView } from './views/HomeView';
import { ArticleView } from './views/ArticleView';
import { CategoryView } from './views/CategoryView';
import { SearchView } from './views/SearchView';
import { PhotoGalleryView } from './views/PhotoGalleryView';
import { VideoNewsView } from './views/VideoNewsView';
import { StaticPageView } from './views/StaticPageView';

// Admin CMS Views
import { AdminLogin } from './views/admin/AdminLogin';
import { AdminLayout, AdminTab } from './views/admin/AdminLayout';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminArticles } from './views/admin/AdminArticles';
import { AdminArticleEditor } from './views/admin/AdminArticleEditor';
import { AdminBreakingNews } from './views/admin/AdminBreakingNews';
import { AdminCategories } from './views/admin/AdminCategories';
import { AdminMediaLibrary } from './views/admin/AdminMediaLibrary';
import { AdminAds } from './views/admin/AdminAds';
import { AdminHomepageControl } from './views/admin/AdminHomepageControl';
import { AdminComments } from './views/admin/AdminComments';
import { AdminSiteSettings } from './views/admin/AdminSiteSettings';
import { AdminDeploymentExport } from './views/admin/AdminDeploymentExport';
import { AdminAuditLog } from './views/admin/AdminAuditLog';
import { AdminAuthors } from './views/admin/AdminAuthors';

export function App() {
  // Global Store States
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>([]);
  const [ads, setAds] = useState<AdSetting[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(NewsStore.getSiteSettings());
  const [photoAlbums, setPhotoAlbums] = useState<PhotoAlbum[]>([]);
  const [videoNews, setVideoNews] = useState<VideoNews[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Navigation & View States
  const [currentView, setCurrentView] = useState<
    'home' | 'article' | 'category' | 'search' | 'photos' | 'videos' | 'static' | 'admin-login' | 'admin'
  >('home');

  const [activeCategorySlug, setActiveCategorySlug] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedStaticPage, setSelectedStaticPage] = useState<
    'about' | 'editorial-policy' | 'privacy' | 'terms' | 'contact'
  >('about');
  const [selectedPhotoAlbum, setSelectedPhotoAlbum] = useState<PhotoAlbum | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoNews | null>(null);

  // Admin States
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const refreshData = () => {
    setArticles(NewsStore.getArticles());
    setCategories(NewsStore.getCategories());
    setBreakingNews(NewsStore.getBreakingNews());
    setAds(NewsStore.getAdSettings());
    setSiteSettings(NewsStore.getSiteSettings());
    setPhotoAlbums(NewsStore.getPhotoAlbums());
    setVideoNews(NewsStore.getVideoNews());
    setCurrentUser(NewsStore.getCurrentUser());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers
  const handleSelectArticle = (art: Article) => {
    setSelectedArticle(art);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (slug: string) => {
    if (slug === 'home') {
      setCurrentView('home');
      setActiveCategorySlug('home');
    } else if (slug === 'photos') {
      setCurrentView('photos');
      setActiveCategorySlug('photos');
    } else if (slug === 'videos') {
      setCurrentView('videos');
      setActiveCategorySlug('videos');
    } else {
      setActiveCategorySlug(slug);
      setCurrentView('category');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStaticPage = (page: string) => {
    setSelectedStaticPage(page as any);
    setCurrentView('static');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPhotoAlbum = (album: PhotoAlbum) => {
    setSelectedPhotoAlbum(album);
    setCurrentView('photos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVideo = (vid: VideoNews) => {
    setSelectedVideo(vid);
    setCurrentView('videos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToAdmin = () => {
    if (currentUser) {
      setCurrentView('admin');
    } else {
      setCurrentView('admin-login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminNewArticle = () => {
    setEditingArticle(null);
    setAdminTab('article-new');
  };

  const handleAdminEditArticle = (art: Article) => {
    setEditingArticle(art);
    setAdminTab('article-edit');
  };

  const activeCategory =
    categories.find((c) => c.slug === activeCategorySlug) || {
      id: 'cat-all',
      name: 'সকল খবর',
      slug: 'all',
      order: 0,
      showInNav: false,
    };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-red-600 selection:text-white">
      {/* Injects Adsterra Popunder / Social Bar when enabled */}
      <AdsterraScripts settings={siteSettings} />

      {/* Admin Interface */}
      {currentView === 'admin' ? (
        <AdminLayout
          currentTab={adminTab}
          onSelectTab={(tab) => {
            if (tab === 'article-new') {
              handleAdminNewArticle();
            } else {
              setAdminTab(tab);
            }
          }}
          currentUser={currentUser}
          onLogout={() => {
            NewsStore.logout();
            setCurrentUser(null);
            setCurrentView('home');
          }}
          onViewSite={() => setCurrentView('home')}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              articles={articles}
              categories={categories}
              breakingNews={breakingNews}
              onNewArticle={handleAdminNewArticle}
              onEditArticle={handleAdminEditArticle}
              onGoToTab={(tab) => setAdminTab(tab)}
            />
          )}

          {adminTab === 'articles' && (
            <AdminArticles
              articles={articles}
              categories={categories}
              onNewArticle={handleAdminNewArticle}
              onEditArticle={handleAdminEditArticle}
              onRefresh={refreshData}
            />
          )}

          {(adminTab === 'article-new' || adminTab === 'article-edit') && (
            <AdminArticleEditor
              initialArticle={adminTab === 'article-edit' ? editingArticle : null}
              categories={categories}
              authors={NewsStore.getAuthors()}
              onSaveComplete={() => {
                refreshData();
                setAdminTab('articles');
              }}
              onCancel={() => setAdminTab('articles')}
            />
          )}

          {adminTab === 'breaking-news' && (
            <AdminBreakingNews
              breakingNews={NewsStore.getAllBreakingNews()}
              onRefresh={refreshData}
            />
          )}

          {adminTab === 'categories' && (
            <AdminCategories categories={categories} onRefresh={refreshData} />
          )}

          {adminTab === 'authors' && (
            <AdminAuthors authors={NewsStore.getAuthors()} onRefresh={refreshData} />
          )}

          {adminTab === 'media' && <AdminMediaLibrary />}

          {adminTab === 'ads' && (
            <AdminAds ads={ads} siteSettings={siteSettings} onRefresh={refreshData} />
          )}

          {adminTab === 'homepage-control' && (
            <AdminHomepageControl articles={articles} onRefresh={refreshData} />
          )}

          {adminTab === 'comments' && (
            <AdminComments comments={NewsStore.getComments()} onRefresh={refreshData} />
          )}

          {adminTab === 'settings' && (
            <AdminSiteSettings settings={siteSettings} onRefresh={refreshData} />
          )}

          {adminTab === 'deployment' && <AdminDeploymentExport />}

          {adminTab === 'audit-logs' && (
            <AdminAuditLog logs={NewsStore.getAuditLogs()} />
          )}
        </AdminLayout>
      ) : currentView === 'admin-login' ? (
        <AdminLogin
          onLoginSuccess={() => {
            refreshData();
            setCurrentView('admin');
          }}
          onCancel={() => setCurrentView('home')}
        />
      ) : (
        /* Public Newsroom Website */
        <>
          {/* Header */}
          <Header
            categories={categories}
            activeCategorySlug={activeCategorySlug}
            onSelectCategory={handleSelectCategory}
            onOpenSearch={() => {
              setCurrentView('search');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => handleSelectCategory('home')}
            siteSettings={siteSettings}
            currentUser={currentUser}
            onGoToAdmin={handleGoToAdmin}
          />

          {/* Breaking News Ticker (Sticky below Header) */}
          <BreakingNewsTicker
            items={breakingNews}
            onSelectArticleByUrl={(url) => {
              // Extract slug if it matches article
              const slugMatch = url.split('/').pop();
              if (slugMatch) {
                const found = articles.find((a) => a.slug === slugMatch);
                if (found) {
                  handleSelectArticle(found);
                  return;
                }
              }
              handleSelectCategory('national');
            }}
          />

          {/* Main Content Router */}
          <main className="flex-1">
            {currentView === 'home' && (
              <HomeView
                articles={articles}
                categories={categories}
                ads={ads}
                photoAlbums={photoAlbums}
                videoNews={videoNews}
                onSelectArticle={handleSelectArticle}
                onSelectCategory={handleSelectCategory}
                onSelectPhotoAlbum={handleSelectPhotoAlbum}
                onSelectVideo={handleSelectVideo}
              />
            )}

            {currentView === 'article' && selectedArticle && (
              <ArticleView
                article={selectedArticle}
                allArticles={articles}
                ads={ads}
                onSelectArticle={handleSelectArticle}
                onSelectCategory={handleSelectCategory}
                onBack={() => setCurrentView('home')}
              />
            )}

            {currentView === 'category' && (
              <CategoryView
                category={activeCategory}
                articles={articles}
                ads={ads}
                onSelectArticle={handleSelectArticle}
                onBack={() => handleSelectCategory('home')}
              />
            )}

            {currentView === 'search' && (
              <SearchView
                articles={articles}
                categories={categories}
                onSelectArticle={handleSelectArticle}
                onBack={() => setCurrentView('home')}
              />
            )}

            {currentView === 'photos' && (
              <PhotoGalleryView
                albums={photoAlbums}
                selectedAlbum={selectedPhotoAlbum || undefined}
                onBack={() => setCurrentView('home')}
              />
            )}

            {currentView === 'videos' && (
              <VideoNewsView
                videos={videoNews}
                selectedVideo={selectedVideo || undefined}
                onBack={() => setCurrentView('home')}
              />
            )}

            {currentView === 'static' && (
              <StaticPageView
                pageType={selectedStaticPage}
                siteSettings={siteSettings}
                onBack={() => setCurrentView('home')}
              />
            )}
          </main>

          {/* Footer */}
          <Footer
            categories={categories}
            siteSettings={siteSettings}
            onSelectCategory={handleSelectCategory}
            onSelectStaticPage={handleSelectStaticPage}
          />
        </>
      )}
    </div>
  );
}

export default App;
