import React, { useState } from 'react';
import { PlusCircle, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Sprout, Info, FileText, Image as ImageIcon } from 'lucide-react';
import { createProduct, getSafeErrorMessage } from '../services/api';
import { Product, PageView, ProductFile } from '../types';
import { FileUpload } from './FileUpload';

interface SellProduceFormProps {
  onProductAdded: (newProduct: Product) => void;
  onNavigate: (page: PageView) => void;
  initialFarmerData?: { name: string; phone: string; location: string } | null;
}

export const SellProduceForm: React.FC<SellProduceFormProps> = ({
  onProductAdded,
  onNavigate,
  initialFarmerData,
}) => {
  const [farmerName, setFarmerName] = useState(initialFarmerData?.name || '');
  const [phone, setPhone] = useState(initialFarmerData?.phone || '');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState(initialFarmerData?.location || '');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<ProductFile[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successProduct, setSuccessProduct] = useState<Product | null>(null);

  // Validate form client-side
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!farmerName.trim()) {
      errs.farmerName = 'Farmer name is required';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (cleanPhone.length < 8 || cleanPhone.length > 13) {
      errs.phone = 'Please enter a valid phone number (10 digits)';
    }

    if (!productName.trim()) {
      errs.productName = 'Product name is required (e.g. Tomato, Wheat)';
    }

    if (!category.trim()) {
      errs.category = 'Category selection is required';
    }

    const numQty = parseFloat(quantity);
    if (!quantity.trim()) {
      errs.quantity = 'Available quantity is required';
    } else if (isNaN(numQty) || numQty <= 0) {
      errs.quantity = 'Quantity must be a positive number greater than 0';
    }

    const numPrice = parseFloat(price);
    if (!price.trim()) {
      errs.price = 'Price per kg is required';
    } else if (isNaN(numPrice) || numPrice <= 0) {
      errs.price = 'Price must be a positive number greater than 0';
    }

    if (!location.trim()) {
      errs.location = 'Location (City/District) is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createProduct({
        farmerName: farmerName.trim(),
        phone: phone.trim(),
        productName: productName.trim(),
        category: category.trim(),
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        location: location.trim(),
        description: description.trim() || `Fresh ${productName.trim()} direct from farmer.`,
        files: files.length > 0 ? files : undefined,
      });

      if (response.success && response.product) {
        setSuccessProduct(response.product);
        onProductAdded(response.product);
      } else {
        throw new Error(response.message || 'Failed to list product');
      }
    } catch (err: unknown) {
      console.error('Submission error:', err);
      const message = getSafeErrorMessage(err, 'Failed to save product. Please try again.');
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductName('');
    setQuantity('');
    setPrice('');
    setDescription('');
    setFiles([]);
    setErrors({});
    setSubmitError(null);
    setSuccessProduct(null);
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50/60 min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <Sprout className="w-3.5 h-3.5" />
            <span>Open Farmer Portal • No Login Required</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sell Your Produce
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-2">
            List your agricultural harvest directly on the shared digital marketplace. Any buyer across India can view and call you.
          </p>
        </div>

        {/* Success Banner if successfully submitted */}
        {successProduct ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-lg text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Listed Successfully!</h2>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
              Your crop <strong className="text-emerald-700 font-bold">{successProduct.productName}</strong> ({successProduct.quantity} kg @ ₹{successProduct.price}/kg) has been permanently stored in the shared database and is live on all devices.
            </p>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 max-w-md mx-auto mb-6 text-left text-xs sm:text-sm space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer:</span>
                <span className="font-semibold">{successProduct.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono font-semibold">{successProduct.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold">{successProduct.location}</span>
              </div>
              {successProduct.files && successProduct.files.length > 0 && (
                <div className="flex justify-between items-center pt-1 border-t border-emerald-200/60">
                  <span className="text-slate-500">Attached Files:</span>
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{successProduct.files.length} {successProduct.files.length === 1 ? 'file' : 'files'} saved</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="view-marketplace-after-add-btn"
                onClick={() => onNavigate('products')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <span>View in Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="list-another-product-btn"
                onClick={resetForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Another Product</span>
              </button>
            </div>
          </div>
        ) : (
          /* The Form Card */
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-md">
            
            {/* Quick Demo Pre-fill helper button */}
            <div className="mb-6 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Need a sample to test cross-device sync?</span>
              </div>
              <button
                type="button"
                id="demo-prefill-btn"
                onClick={() => {
                  setFarmerName('Devendra Singh');
                  setPhone('9876501234');
                  setProductName('Green Peas (Matar)');
                  setCategory('Vegetables');
                  setQuantity('160');
                  setPrice('40');
                  setLocation('Ranchi');
                  setDescription('Crisp, tender sweet green peas freshly harvested from winter organic plots.');
                  setErrors({});
                }}
                className="font-bold underline hover:text-emerald-700 cursor-pointer"
              >
                Fill Sample Data
              </button>
            </div>

            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Failed to list product</h4>
                  <p className="text-xs text-rose-600">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Farmer Contact Info Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Farmer Name */}
                <div>
                  <label htmlFor="farmerName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Farmer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="farmerName"
                    type="text"
                    value={farmerName}
                    onChange={(e) => {
                      setFarmerName(e.target.value);
                      if (errors.farmerName) setErrors({ ...errors, farmerName: '' });
                    }}
                    placeholder="e.g. Raj Kumar"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.farmerName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                  />
                  {errors.farmerName && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.farmerName}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="e.g. 9876543210"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Product Info Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label htmlFor="productName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Product Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (errors.productName) setErrors({ ...errors, productName: '' });
                    }}
                    placeholder="e.g. Tomato, Wheat, Potato"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.productName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                  />
                  {errors.productName && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.productName}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm cursor-pointer"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>
              </div>

              {/* Quantity, Price, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Quantity Available */}
                <div>
                  <label htmlFor="quantity" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Quantity (kg) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    step="any"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                      if (errors.quantity) setErrors({ ...errors, quantity: '' });
                    }}
                    placeholder="e.g. 100"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.quantity ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                  />
                  {errors.quantity && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.quantity}</p>
                  )}
                </div>

                {/* Price per kg */}
                <div>
                  <label htmlFor="price" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Price per kg (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="1"
                    step="any"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price) setErrors({ ...errors, price: '' });
                    }}
                    placeholder="e.g. 30"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.price ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                  />
                  {errors.price && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.price}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Location / City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location) setErrors({ ...errors, location: '' });
                    }}
                    placeholder="e.g. Ranchi, Patna"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      errors.location ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                  />
                  {errors.location && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.location}</p>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Product Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention quality, variety (e.g. Desi, Hybrid), harvest date, minimum order size, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
                />
              </div>

              {/* Produce Photos & Documents Section (Multiple files + Add more files) */}
              <div className="pt-2 pb-1 border-t border-slate-100">
                <FileUpload
                  files={files}
                  onChange={setFiles}
                  title="Produce Photos & Verification Documents (Optional)"
                  description="Farmers can attach multiple files (crop harvest pictures, field photos, organic farming certificates, or lab test reports). You can always click '+ Add More Files' to upload more."
                  idPrefix="sell-produce"
                />
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  No login required. Your listing and attached files are saved directly to the shared database and will be immediately visible on all devices.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="list-product-submit-btn"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving product...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      <span>List Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
