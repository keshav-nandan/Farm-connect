import React from 'react';
import { Sprout, Phone, Heart, RotateCcw, Shield } from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onResetDemo: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onResetDemo, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">
                Farm<span className="text-emerald-400">Connect</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Connecting Farmers Directly With Buyers. A digital marketplace built to eliminate middlemen,
              empower local farmers, and enable transparent farm-to-table commerce.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SIH Hackathon Project Prototype • 100% Free & Open Access</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Browse Products (Marketplace)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sell')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Sell Produce (List Crop)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Register Farmer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  About Farm Connect
                </button>
              </li>
            </ul>
          </div>

          {/* Key Principles & Testing Utilities */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Prototype Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> No Gmail/Google login required
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Cross-device shared database active
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Direct 1-tap phone dialer links
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Real-time instant search & filters
              </li>
            </ul>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                id="footer-reset-demo-btn"
                onClick={onResetDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Reset sample data in database if needed for test demonstrations"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reset Demo Sample Products</span>
              </button>

              {onOpenAdmin && (
                <button
                  id="footer-admin-btn"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                  title="Admin Control (username: admin / password: admin)"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Access</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Farm Connect. Smart India Hackathon Prototype.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for local farming communities</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
