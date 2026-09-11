import React, { useState } from 'react';
import { Sprout, Menu, X, PlusCircle, UserCheck, ShoppingBag, Info, Home, Shield } from 'lucide-react';
import { PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  productsCount: number;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  productsCount,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { id: string; label: string; page: PageView; icon: React.ReactNode; badge?: number }[] = [
    { id: 'nav-home', label: 'Home', page: 'home', icon: <Home className="w-4 h-4" /> },
    { id: 'nav-products', label: 'Products', page: 'products', icon: <ShoppingBag className="w-4 h-4" />, badge: productsCount },
    { id: 'nav-sell', label: 'Sell Produce', page: 'sell', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'nav-register', label: 'Register Farmer', page: 'register', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'nav-about', label: 'About', page: 'about', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Farm<span className="text-emerald-600">Connect</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SIH Prototype
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium hidden sm:block">
                Direct Farmer-to-Buyer Marketplace
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.id}
                  id={link.id}
                  onClick={() => handleNav(link.page)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full text-xs ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTA & Status Indicator */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-xs text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">No Login Needed</span>
            </div>

            <button
              id="header-sell-produce-cta"
              onClick={() => handleNav('sell')}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Produce</span>
            </button>

            {/* Admin option in corner */}
            <button
              id="header-admin-portal-btn"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                currentPage === 'admin'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 border-slate-200'
              }`}
              title="Admin Control Panel (username: admin / pass: admin)"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Admin</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-admin-btn-corner"
              onClick={onOpenAdmin}
              className="p-2 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
              title="Admin Panel"
            >
              <Shield className="w-5 h-5 text-emerald-600" />
            </button>
            <button
              id="mobile-sell-btn-icon"
              onClick={() => handleNav('sell')}
              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200"
              title="Sell Produce"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white shadow-xl px-4 pt-3 pb-6 space-y-1">
          <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Menu Navigation
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Open Access (No Sign In)
            </span>
          </div>
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={`mobile-${link.id}`}
                id={`mobile-${link.id}`}
                onClick={() => handleNav(link.page)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isActive ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 space-y-2">
            <button
              id="mobile-drawer-sell-cta"
              onClick={() => handleNav('sell')}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium shadow-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Sell Your Produce Now</span>
            </button>
            <button
              id="mobile-drawer-admin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-semibold border border-slate-700"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Admin Portal (admin / admin)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
