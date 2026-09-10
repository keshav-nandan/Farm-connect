import React from 'react';
import { Sprout, CheckCircle2, ShieldCheck, PhoneCall, Globe2, ArrowRight, Database, Users, Laptop, Smartphone } from 'lucide-react';
import { PageView } from '../types';

interface AboutViewProps {
  onNavigate: (page: PageView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const farmerBenefits = [
    'Direct buyer connection without middlemen taking cut',
    'Better product visibility across nearby towns and mandis',
    'Easy product listing with quick mobile form in under 60 seconds',
    'Expansive local market reach beyond immediate village borders',
    'Less dependence on intermediaries and unfair commission agents',
  ];

  const buyerBenefits = [
    'Discover fresh local produce harvested directly from farmers',
    'Search easily by crop name, farmer, or nearby district',
    'Compare available products with clear rates and quantities',
    'Transparent price per kg and verified quantity in stock',
    'Contact farmers directly via phone or WhatsApp with 1 tap',
  ];

  return (
    <div className="py-12 sm:py-16 bg-slate-50/50 min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <Sprout className="w-3.5 h-3.5" />
            <span>About Farm Connect</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Connecting Farmers Directly With Buyers
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
            A digital marketplace prototype built to eliminate agricultural middlemen, empower smallholders with open technology, and ensure fair prices for both grower and consumer.
          </p>
        </div>

        {/* What is Farm Connect Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
            <span className="w-3 h-8 bg-emerald-600 rounded-full inline-block" />
            What is Farm Connect?
          </h2>
          <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-6">
            Farm Connect is a digital marketplace designed to connect local farmers directly with buyers.
            It provides a frictionless platform where farmers can advertise their harvests without needing
            complicated tech skills, and buyers—ranging from local consumers and restaurants to wholesale traders—can
            discover produce and reach the farmer directly over the phone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100">
              <h3 className="text-base font-bold text-rose-900 mb-2">The Core Problem</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Farmers often have difficulty finding buyers for their fresh produce. Without transparent local
                market access, perishable crops are sold at distressed rates to middlemen who pocket major margins.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <h3 className="text-base font-bold text-emerald-900 mb-2">Our Digital Solution</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Farmers can digitally list their produce in seconds, while buyers can search, filter, compare,
                and directly call farmers to finalize the deal with zero intermediary transaction fees.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Grid: Farmers vs Buyers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Benefits for Farmers */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Benefits for Farmers</h3>
                  <p className="text-xs text-emerald-700 font-medium">Empowering rural cultivators</p>
                </div>
              </div>

              <ul className="space-y-3.5 mb-6">
                {farmerBenefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onNavigate('sell')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <span>Start Listing Your Produce</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Benefits for Buyers */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-lime-100">
                <div className="w-12 h-12 rounded-2xl bg-lime-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Benefits for Buyers</h3>
                  <p className="text-xs text-lime-700 font-medium">For households, restaurants & traders</p>
                </div>
              </div>

              <ul className="space-y-3.5 mb-6">
                {buyerBenefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onNavigate('products')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <span>Explore Marketplace Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Hackathon Prototype Architecture Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-900/50">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 inline-block mb-3">
              SIH / Hackathon Technical Prototype
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Cross-Device Shared Online Architecture
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Farm Connect complies strictly with open accessibility standards. No Google authentication, Gmail
              sign-in, or passwords are required. Any user on any device can interact seamlessly:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 flex flex-col gap-2">
                <Smartphone className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-white">Device A (Farmer)</span>
                <span className="text-slate-300">
                  Adds crop (e.g. Tomato → 100 kg → ₹30/kg → Ranchi) via mobile phone.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/10 border border-white/10 flex flex-col gap-2">
                <Database className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-white">Shared Backend</span>
                <span className="text-slate-300">
                  Data persists in shared online server database (`/api/products`).
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/10 border border-white/10 flex flex-col gap-2">
                <Laptop className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-white">Device B (Buyer)</span>
                <span className="text-slate-300">
                  Opens URL on another laptop/phone and immediately views and contacts the farmer.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
