import React, { useState } from 'react';
import { User } from '../../types';
import {
  LayoutDashboard,
  FileText,
  Zap,
  FolderTree,
  Users,
  Image,
  DollarSign,
  Sliders,
  MessageSquare,
  Settings,
  DownloadCloud,
  LogOut,
  ExternalLink,
  Menu,
  X,
  History,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'articles'
  | 'article-new'
  | 'article-edit'
  | 'breaking-news'
  | 'categories'
  | 'authors'
  | 'media'
  | 'ads'
  | 'homepage-control'
  | 'comments'
  | 'settings'
  | 'deployment'
  | 'audit-logs';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentUser: User | null;
  onLogout: () => void;
  onViewSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  onViewSite,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'articles', label: 'সকল প্রতিবেদন', icon: FileText },
    { id: 'breaking-news', label: 'ব্রেকিং নিউজ', icon: Zap },
    { id: 'categories', label: 'ক্যাটাগরি সমূহ', icon: FolderTree },
    { id: 'authors', label: 'লেখক ও প্রতিবেদক', icon: Users },
    { id: 'media', label: 'মিডিয়া লাইব্রেরি', icon: Image },
    { id: 'ads', label: 'বিজ্ঞাপন ও Adsterra', icon: DollarSign },
    { id: 'homepage-control', label: 'হোমপেজ নিয়ন্ত্রণ', icon: Sliders },
    { id: 'comments', label: 'পাঠকের মন্তব্য', icon: MessageSquare },
    { id: 'settings', label: 'সাইট সেটিংস', icon: Settings },
    { id: 'deployment', label: 'ডেপ্লয়মেন্ট ও এক্সপোর্ট', icon: DownloadCloud },
    { id: 'audit-logs', label: 'অডিট লগ', icon: History },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white h-14 px-4 flex items-center justify-between border-b border-stone-800 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <span className="text-xl font-bold font-bengali-serif text-white">ঢাকা</span>
            <span className="text-xs px-2 py-0.5 bg-red-600 text-white font-mono rounded">
              CMS v1.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={onViewSite}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ওয়েবসাইট দেখুন</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-800">
            <div className="text-right">
              <div className="font-semibold text-stone-200">{currentUser?.name}</div>
              <div className="text-[10px] text-stone-400 uppercase font-mono">{currentUser?.role}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 text-stone-400 hover:text-red-400 transition"
            title="লগআউট"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-14 left-0 w-64 bg-stone-900 text-stone-300 p-4 z-20 flex flex-col justify-between transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-3 mb-2">
              সংবাদকক্ষ ব্যবস্থাপনা
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'articles' && currentTab.startsWith('article-'));

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id as AdminTab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded transition ${
                    isActive
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-500">
            <div>ঢাকা ডিজিটাল নিউজ প্ল্যাটফর্ম</div>
            <div className="text-stone-600 font-mono">Netlify Ready Production</div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
