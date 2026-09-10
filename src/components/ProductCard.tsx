import React from 'react';
import { MapPin, User, Package, PhoneCall, Tag, Paperclip, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onContact: (product: Product) => void;
}

// Visual category helpers
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'vegetables':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'grains & cereals':
    case 'grains':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'fruits':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'pulses':
      return 'bg-orange-50 text-orange-800 border-orange-200';
    case 'spices':
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-lime-50 text-lime-800 border-lime-200';
  }
};

const getProductIconEmoji = (name: string, category: string): string => {
  const n = name.toLowerCase();
  if (n.includes('tomato')) return '🍅';
  if (n.includes('potato')) return '🥔';
  if (n.includes('rice') || n.includes('paddy')) return '🌾';
  if (n.includes('wheat')) return '🌾';
  if (n.includes('onion')) return '🧅';
  if (n.includes('maize') || n.includes('corn')) return '🌽';
  if (n.includes('carrot')) return '🥕';
  if (n.includes('cabbage')) return '🥬';
  if (n.includes('cauliflower')) return '🥦';
  if (n.includes('brinjal') || n.includes('eggplant')) return '🍆';
  if (n.includes('garlic')) return '🧄';
  if (n.includes('ginger')) return '🫚';
  if (n.includes('pea') || n.includes('matar')) return '🫛';
  if (n.includes('mango')) return '🥭';
  if (n.includes('banana')) return '🍌';
  if (n.includes('apple')) return '🍎';
  if (category.toLowerCase().includes('grain')) return '🌾';
  if (category.toLowerCase().includes('vegetable')) return '🥬';
  return '🌱';
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onContact }) => {
  const emoji = getProductIconEmoji(product.productName, product.category);
  const categoryClass = getCategoryColor(product.category);

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
    >
      {/* Card Header & Badges */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
              {emoji}
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-slate-900 group-hover:text-emerald-700 transition-colors">
                {product.productName}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{product.location}</span>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${categoryClass}`}
          >
            <Tag className="w-3 h-3" />
            {product.category}
          </span>
        </div>

        {/* Farmer Info */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3 text-xs text-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {product.farmerName.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <span className="text-slate-500">Farmer: </span>
            <span className="font-semibold text-slate-800">{product.farmerName}</span>
          </div>
        </div>

        {/* Product Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3 min-h-[2.5rem]">
          {product.description || 'Fresh agricultural produce harvested locally and offered directly to buyers.'}
        </p>

        {/* Attached Photos / Documents Indicator */}
        {product.files && product.files.length > 0 && (
          <div className="mb-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800">
            <div className="flex items-center gap-1.5 font-medium">
              <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
              <span>{product.files.length} {product.files.length === 1 ? 'file' : 'files'} attached</span>
            </div>
            <span className="text-[11px] text-emerald-700/80 font-medium">Photos / Proof</span>
          </div>
        )}

        {/* Quantity & Price Matrix */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-900">
              <Package className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available Qty</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              {product.quantity} <span className="text-xs font-semibold text-slate-500">kg</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-lime-50/50 border border-lime-100/60">
            <div className="flex items-center gap-1 text-[11px] font-medium text-lime-900">
              <span>Price per kg</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-emerald-700 mt-0.5">
              ₹{product.price} <span className="text-xs font-semibold text-slate-500">/kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 sm:p-6 pt-3 border-t border-slate-100 bg-slate-50/40">
        <button
          id={`contact-farmer-btn-${product.id}`}
          onClick={() => onContact(product)}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Contact Farmer</span>
        </button>
      </div>
    </div>
  );
};
