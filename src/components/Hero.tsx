import React from 'react';
import { ArrowRight, PlusCircle, Users, ShoppingBag, PhoneCall, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { MarketplaceStats, PageView } from '../types';

interface HeroProps {
  stats: MarketplaceStats | null;
  onNavigate: (page: PageView) => void;
}

export const Hero: React.FC<HeroProps> = ({ stats, onNavigate }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-white to-slate-50/60 pt-10 pb-14 sm:pt-16 sm:pb-20 border-b border-emerald-100/60">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-lime-200/20 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold mb-6 border border-emerald-200 shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>SIH Hackathon Project Prototype</span>
              <span className="hidden sm:inline-block text-emerald-400">•</span>
              <span className="hidden sm:inline-block font-normal text-emerald-700">Open Public Access</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Connecting Farmers Directly With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-lime-600 underline decoration-emerald-300 decoration-wavy decoration-2">
                Buyers
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8">
              Farm Connect is a simple digital marketplace where local farmers can list their fresh
              produce and buyers can discover and contact them directly.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <button
                id="hero-explore-products-btn"
                onClick={() => onNavigate('products')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md shadow-emerald-600/25 transition-all transform active:scale-98 cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-sell-produce-btn"
                onClick={() => onNavigate('sell')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-600 font-semibold text-base shadow-xs transition-all transform active:scale-98 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>Sell Your Produce</span>
              </button>
            </div>

            {/* Value Props Strip */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Commission</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Phone Call</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Local Mandis</span>
              </div>
            </div>
          </div>

          {/* Right Visual & Live Stats Column */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 border border-emerald-100 relative">
              {/* Top Card Header */}
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Marketplace At A Glance</h3>
                  <p className="text-xs text-slate-500">Live statistics from shared online database</p>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync
                </span>
              </div>

              {/* Statistics Grid */}
              <div className="space-y-4">
                {/* Stat 1: Farmers Connected */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {stats ? stats.farmersConnected : '18'}+
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-emerald-900">
                        Farmers Connected
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-white text-emerald-800 px-2.5 py-1 rounded-md font-semibold border border-emerald-200 shadow-2xs">
                    Verified
                  </span>
                </div>

                {/* Stat 2: Products Listed */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-lime-50/70 border border-lime-200/70 hover:bg-lime-50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-lime-600 flex items-center justify-center text-white shadow-xs">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {stats ? stats.productsListed : '10'}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-lime-900">
                        Products Listed
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-white text-lime-800 px-2.5 py-1 rounded-md font-semibold border border-lime-200 shadow-2xs">
                    Fresh Stock
                  </span>
                </div>

                {/* Stat 3: Direct Connections */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {stats ? stats.directConnections : '320'}+
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-amber-900">
                        Direct Connections
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-white text-amber-800 px-2.5 py-1 rounded-md font-semibold border border-amber-200 shadow-2xs">
                    Interactions
                  </span>
                </div>
              </div>

              {/* Bottom Notification */}
              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
                <span className="text-base leading-none">💡</span>
                <p>
                  <strong>No Account Required:</strong> Add a product on your phone or laptop and see it update across all connected devices in real time!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
