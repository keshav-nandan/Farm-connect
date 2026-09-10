import React from 'react';
import { AlertCircle, CheckCircle2, TrendingDown, Users2, EyeOff, DollarSign, Store, Search, PhoneForwarded, Globe2 } from 'lucide-react';
import { PageView } from '../types';

interface ProblemSolutionProps {
  onNavigate: (page: PageView) => void;
}

export const ProblemSolution: React.FC<ProblemSolutionProps> = ({ onNavigate }) => {
  const problems = [
    {
      icon: <Users2 className="w-5 h-5 text-rose-600" />,
      title: 'Struggle to Find Local Buyers',
      description: 'Small farmers often struggle to find local buyers outside their immediate village or mandi.',
    },
    {
      icon: <EyeOff className="w-5 h-5 text-rose-600" />,
      title: 'Limited Ways to Share Produce',
      description: 'Farmers have limited ways to share what crops they have harvested, their quantities, and expected rates.',
    },
    {
      icon: <TrendingDown className="w-5 h-5 text-rose-600" />,
      title: 'Heavy Dependence on Intermediaries',
      description: 'Farmers frequently depend on layers of middlemen and brokers just to liquidate their seasonal stock.',
    },
    {
      icon: <DollarSign className="w-5 h-5 text-rose-600" />,
      title: 'Reduced Farmers Earnings',
      description: 'Intermediary margins and delayed commission cuts severely reduce the earnings that reach the farmer family.',
    },
  ];

  const solutions = [
    {
      icon: <Store className="w-5 h-5 text-emerald-600" />,
      title: 'Open Digital Marketplace',
      description: 'Gives farmers an open digital marketplace accessible from any smartphone, laptop, or computer.',
    },
    {
      icon: <Globe2 className="w-5 h-5 text-emerald-600" />,
      title: 'Instant Produce Listing',
      description: 'Allows farmers to list their produce with live quantity, location, and clear transparent prices per kg.',
    },
    {
      icon: <Search className="w-5 h-5 text-emerald-600" />,
      title: 'Local Buyer Search & Discovery',
      description: 'Allows buyers, restaurant owners, and wholesalers to search and filter fresh crops in nearby districts.',
    },
    {
      icon: <PhoneForwarded className="w-5 h-5 text-emerald-600" />,
      title: 'Direct Farmer-to-Buyer Contact',
      description: 'Enables direct 1-tap phone calls between buyer and farmer with zero middleman commissions.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
            Why Farm Connect?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
            Bridging the Agricultural Disconnect
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            A focused initiative addressing core challenges faced by Indian farmers through modern, accessible technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* PROBLEM CARD */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-50">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">The Problem</h3>
                <p className="text-xs sm:text-sm text-rose-700 font-medium">Challenges faced by local farmers</p>
              </div>
            </div>

            <div className="space-y-4">
              {problems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-rose-50/40 border border-rose-100/70 hover:bg-rose-50/80 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-white shadow-2xs shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-rose-100/70 text-xs text-rose-800 bg-rose-50/60 p-3 rounded-lg flex items-center gap-2">
              <span className="font-bold">Impact:</span>
              <span>Farmers lose up to 35%–50% of rightful market value to commission agents.</span>
            </div>
          </div>

          {/* SOLUTION CARD */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-50">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">The Solution</h3>
                <p className="text-xs sm:text-sm text-emerald-700 font-medium">How Farm Connect empowers both sides</p>
              </div>
            </div>

            <div className="space-y-4">
              {solutions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/70 hover:bg-emerald-50/80 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-white shadow-2xs shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-100/70 text-xs text-emerald-800 bg-emerald-50/60 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold">Outcome:</span>
                <span className="ml-1.5">Direct communication, fair pricing, and zero middleman fee.</span>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer shrink-0 ml-2"
              >
                Browse Produce →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
