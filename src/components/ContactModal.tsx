import React, { useState, useEffect } from 'react';
import { X, Phone, PhoneCall, MapPin, User, Package, Copy, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ContactModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ product, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Clean phone number for tel: link and display
  const cleanedPhone = product.phone.replace(/\D/g, '');
  const telLink = `tel:${product.phone.replace(/\s+/g, '')}`;
  const whatsappLink = `https://wa.me/${cleanedPhone.length === 10 ? '91' + cleanedPhone : cleanedPhone}?text=${encodeURIComponent(
    `Hello ${product.farmerName}, I saw your ${product.productName} listing (${product.quantity} kg @ ₹${product.price}/kg) on Farm Connect and would like to buy it.`
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(product.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="contact-farmer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="contact-farmer-modal"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-100 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Contact Farmer Directly</h3>
              <p className="text-xs text-emerald-100">Zero commission • Direct buyer-to-farmer call</p>
            </div>
          </div>
          <button
            id="modal-close-icon-btn"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Farmer Profile Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
              {product.farmerName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Registered Farmer
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-700 font-medium">Available</span>
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 truncate">{product.farmerName}</h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{product.location}</span>
              </div>
            </div>
          </div>

          {/* Product Summary Grid */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Product Inquired:</span>
              <span className="font-bold text-slate-900">{product.productName} ({product.category})</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Quantity Available:</span>
              <span className="font-bold text-slate-900">{product.quantity} kg</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Price per kg:</span>
              <span className="font-extrabold text-emerald-700 text-base">₹{product.price} / kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Produce Location:</span>
              <span className="font-semibold text-slate-800">{product.location}</span>
            </div>
          </div>

          {/* Phone Number Display Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                  Direct Phone Number
                </span>
                <div className="text-xl font-mono font-bold tracking-wide text-emerald-300">
                  {product.phone}
                </div>
              </div>
            </div>

            <button
              id="copy-phone-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition-colors cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Communication Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <a
              id="call-farmer-dialer-btn"
              href={telLink}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-3.5 px-4 rounded-xl font-bold text-base transition-colors shadow-md shadow-emerald-600/20 text-center cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>Call Farmer Now ({product.phone})</span>
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                id="whatsapp-farmer-btn"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm transition-colors text-center cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Message</span>
              </a>

              <button
                id="close-modal-btn"
                onClick={onClose}
                className="flex items-center justify-center py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

          {/* Safe trade notice */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Please inspect the produce quality upon meeting or shipment. Farm Connect facilitates direct phone contacts without commission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
