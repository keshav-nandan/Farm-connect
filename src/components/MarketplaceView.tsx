import React from 'react';
import { ShoppingBag, RefreshCw, AlertTriangle, PlusCircle, Sparkles } from 'lucide-react';
import { Product, FilterState, PageView } from '../types';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';

interface MarketplaceViewProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onRefresh: () => void;
  onContact: (product: Product) => void;
  onNavigate: (page: PageView) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  isLoading,
  error,
  filters,
  onFilterChange,
  onRefresh,
  onContact,
  onNavigate,
}) => {
  // Extract unique locations from all products for the filter dropdown
  const availableLocations = Array.from(
    new Set(products.map((p) => p.location.trim()).filter(Boolean))
  ).sort();

  // Apply filters client-side (combined with search for instant feedback)
  const filteredProducts = products.filter((p) => {
    // 1. Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = p.productName.toLowerCase().includes(q);
      const matchFarmer = p.farmerName.toLowerCase().includes(q);
      const matchLoc = p.location.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchFarmer && !matchLoc && !matchDesc) {
        return false;
      }
    }

    // 2. Category
    if (filters.category !== 'All') {
      if (p.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // 3. Location
    if (filters.location !== 'All') {
      if (p.location.toLowerCase() !== filters.location.toLowerCase()) {
        return false;
      }
    }

    // 4. Min Price
    if (filters.minPrice.trim()) {
      const min = Number(filters.minPrice);
      if (!isNaN(min) && p.price < min) {
        return false;
      }
    }

    // 5. Max Price
    if (filters.maxPrice.trim()) {
      const max = Number(filters.maxPrice);
      if (!isNaN(max) && p.price > max) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="py-8 sm:py-12 bg-slate-50/50 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Fresh Farm Marketplace
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • Shared Online Database
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Agricultural Products Directory
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Browse directly from farmers. Search by crop, farmer name, or local district.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="refresh-marketplace-btn"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium shadow-2xs hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh product list from shared database"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              id="marketplace-add-product-btn"
              onClick={() => onNavigate('sell')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Crop</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Component */}
        <ProductFilters
          filters={filters}
          onFilterChange={onFilterChange}
          availableLocations={availableLocations}
          totalResultsCount={filteredProducts.length}
        />

        {/* Error Alert if any */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Unable to connect to shared database</h4>
                <p className="text-xs text-rose-600 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid Content */}
        {isLoading && products.length === 0 ? (
          /* Loading State */
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mb-4 animate-pulse">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Loading products...</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Fetching fresh crop listings from the shared online database.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search Results State */
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 sm:p-16 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No products found.</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              We couldn&apos;t find any produce matching your current search or filter criteria. Try clearing some filters or searching for another crop.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="empty-state-clear-filters-btn"
                onClick={() =>
                  onFilterChange({
                    searchQuery: '',
                    category: 'All',
                    location: 'All',
                    minPrice: '',
                    maxPrice: '',
                  })
                }
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
              <button
                id="empty-state-sell-btn"
                onClick={() => onNavigate('sell')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                List this Crop Instead
              </button>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs sm:text-sm font-medium text-slate-500">
                Available listings: <strong className="text-slate-800 font-bold">{filteredProducts.length}</strong> items
              </span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Direct mandi prices
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onContact={onContact}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
