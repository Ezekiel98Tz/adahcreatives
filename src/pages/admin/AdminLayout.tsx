import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Image, FileText, LogOut, ExternalLink, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/admin/projects')) return 'Projects';
    if (path.includes('/admin/gallery')) return 'Gallery';
    if (path.includes('/admin/pages/home')) return 'Home Page';
    if (path.includes('/admin/pages/about')) return 'About Page';
    if (path.includes('/admin/pages/services')) return 'Services Page';
    return 'Admin';
  }, [location.pathname]);

  const Sidebar = ({ variant }: { variant: 'desktop' | 'mobile' }) => (
    <aside
      className={[
        'bg-black text-white flex flex-col border-r border-gray-900',
        variant === 'desktop' ? 'w-72' : 'w-80 max-w-[85vw] h-full',
      ].join(' ')}
      aria-label="Admin navigation"
    >
      <div className="p-8">
        <h1 className="text-xl font-light tracking-[0.2em] text-white">ADAH ADMIN</h1>
        <p className="text-xs text-gray-500 mt-2 font-medium">CONTENT MANAGEMENT</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        <Link
          to="/admin"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive('/admin')
              ? 'bg-white text-black font-medium'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutDashboard size={18} className={isActive('/admin') ? 'text-black' : 'group-hover:text-white'} />
          <span>Dashboard</span>
        </Link>

        <div className="pt-8 pb-3 px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          Modules
        </div>

        <Link
          to="/admin/projects"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive('/admin/projects')
              ? 'bg-white text-black font-medium'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Image size={18} className={isActive('/admin/projects') ? 'text-black' : 'group-hover:text-white'} />
          <span>Projects</span>
        </Link>

        <Link
          to="/admin/gallery"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive('/admin/gallery')
              ? 'bg-white text-black font-medium'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Image size={18} className={isActive('/admin/gallery') ? 'text-black' : 'group-hover:text-white'} />
          <span>Gallery</span>
        </Link>

        <Link
          to="/admin/pages/home"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive('/admin/pages/home')
              ? 'bg-white text-black font-medium'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={18} className={isActive('/admin/pages/home') ? 'text-black' : 'group-hover:text-white'} />
          <span>Home Page</span>
        </Link>

        <Link
          to="/admin/pages/about"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive('/admin/pages/about')
              ? 'bg-white text-black font-medium'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={18} className={isActive('/admin/pages/about') ? 'text-black' : 'group-hover:text-white'} />
          <span>About Page</span>
        </Link>

        <Link
          to="/admin/pages/services"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive('/admin/pages/services')
              ? 'bg-white text-black font-medium'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={18} className={isActive('/admin/pages/services') ? 'text-black' : 'group-hover:text-white'} />
          <span>Services Page</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-900 bg-gray-900/50">
        <div className="flex items-center px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
            <User size={14} />
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:flex">
        <Sidebar variant="desktop" />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
          <div className="absolute inset-y-0 left-0">
            <Sidebar variant="mobile" />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50">
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
          <div className="flex items-center text-sm text-gray-500">
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-black transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <span className="hidden sm:inline font-medium text-gray-900">Admin</span>
            <span className="mx-2 hidden sm:inline">/</span>
            <span className="font-medium text-gray-900">{pageTitle}</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            <span className="hidden sm:inline">View Live Site</span>
            <ExternalLink size={14} />
          </a>
        </header>
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
