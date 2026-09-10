import React from 'react';
import { Search, Filter, X, RotateCcw, Tag, MapPin, IndianRupee } from 'lucide-react';
import { FilterState } from '../types';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableLocations: string[];
  totalResultsCount: number;
}

const CATEGORIES = [
  'All',
  'Vegetables',
  'Grains & Cereals',
  'Fruits',
  'Pulses',
  'Spices',
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  availableLocations,
  totalResultsCount,
}) => {
  const isFiltered =
    filters.searchQuery.trim() !== '' ||
    filters.category !== 'All' ||
    filters.location !== 'All' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '';

  const handleClear = () => {
    onFilterChange({
      searchQuery: '',
      category: 'All',
      location: 'All',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs mb-8">
      {/* Prominent Search Bar */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-emerald-600" />
        </div>
        <input
          id="marketplace-search-input"
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          placeholder="Search by product name (e.g. Tomato, Rice), farmer name (e.g. Raj Kumar), or location..."
          className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 transition-all"
        />
        {filters.searchQuery && (
          <button
            id="clear-search-btn"
            onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Row: Category, Location, Price Min/Max, and Clear */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Category Filter */}
        <div>
          <label htmlFor="filter-category-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Category</span>
          </label>
          <select
            id="filter-category-select"
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label htmlFor="filter-location-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Location</span>
          </label>
          <select
            id="filter-location-select"
            value={filters.location}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium cursor-pointer"
          >
            <option value="All">All Locations ({availableLocations.length})</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range: Min & Max */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>Price Range (₹/kg)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              id="filter-min-price-input"
              type="number"
              placeholder="Min ₹"
              min="0"
              value={filters.minPrice}
              onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              id="filter-max-price-input"
              type="number"
              placeholder="Max ₹"
              min="0"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Clear Filters & Summary Count */}
        <div className="flex items-center gap-2">
          <button
            id="clear-filters-btn"
            onClick={handleClear}
            disabled={!isFiltered}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              isFiltered
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-70'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {isFiltered && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Active Filters:
          </span>
          {filters.searchQuery.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Query: &quot;{filters.searchQuery}&quot;
              <button
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className="hover:text-emerald-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Category: {filters.category}
              <button
                onClick={() => onFilterChange({ ...filters, category: 'All' })}
                className="hover:text-emerald-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.location !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Location: {filters.location}
              <button
                onClick={() => onFilterChange({ ...filters, location: 'All' })}
                className="hover:text-emerald-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Price: ₹{filters.minPrice || '0'} – ₹{filters.maxPrice || '∞'}
              <button
                onClick={() => onFilterChange({ ...filters, minPrice: '', maxPrice: '' })}
                className="hover:text-emerald-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <span className="text-slate-400 ml-auto">
            Showing <strong className="text-slate-700">{totalResultsCount}</strong> products
          </span>
        </div>
      )}
    </div>
  );
};
