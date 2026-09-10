import React, { useState } from 'react';
import { UserCheck, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sprout, PlusCircle } from 'lucide-react';
import { registerFarmer } from '../services/api';
import { Farmer, PageView } from '../types';

interface FarmerRegisterFormProps {
  onFarmerRegistered: (farmer: Farmer) => void;
  onNavigate: (page: PageView) => void;
}

export const FarmerRegisterForm: React.FC<FarmerRegisterFormProps> = ({
  onFarmerRegistered,
  onNavigate,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registeredFarmer, setRegisteredFarmer] = useState<Farmer | null>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Farmer Name is required';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (cleanPhone.length < 8 || cleanPhone.length > 13) {
      errs.phone = 'Please enter a valid phone number (10 digits)';
    }

    if (!location.trim()) {
      errs.location = 'Location (District/State) is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await registerFarmer({
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        details: details.trim() || 'Cultivator registered on Farm Connect digital network.',
      });

      if (response.success && response.farmer) {
        setRegisteredFarmer(response.farmer);
        onFarmerRegistered(response.farmer);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err: unknown) {
      console.error('Farmer registration error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to register farmer in database');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 bg-slate-50/60 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>No Password • No Gmail Required</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Farmer Registration
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto mt-2">
            Join the Farm Connect digital directory. Registering lets buyers recognize your verified farmer identity when listing crops.
          </p>
        </div>

        {registeredFarmer ? (
          /* Registration Success Card */
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-lg text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Farmer Profile Registered!</h2>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
              Welcome, <strong className="text-slate-900">{registeredFarmer.name}</strong>! Your farmer profile is now stored in the shared database and ready for crop listings.
            </p>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 max-w-sm mx-auto mb-6 text-left text-xs sm:text-sm space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-semibold text-slate-900">{registeredFarmer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono font-semibold text-slate-900">{registeredFarmer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-900">{registeredFarmer.location}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="registered-sell-produce-cta"
                onClick={() => onNavigate('sell')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your Produce Now</span>
              </button>

              <button
                id="registered-browse-marketplace-btn"
                onClick={() => onNavigate('products')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm cursor-pointer"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-md">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Registration failed</h4>
                  <p className="text-xs text-rose-600">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Farmer Name */}
              <div>
                <label htmlFor="farmer-reg-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Farmer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="farmer-reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Ramesh Singh / Raj Kumar"
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="farmer-reg-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="farmer-reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="e.g. 9876543210 (Direct calling number)"
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone}</p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Buyers will use this number to contact and purchase your produce directly.
                </p>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="farmer-reg-location" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Location <span className="text-rose-500">*</span>
                </label>
                <input
                  id="farmer-reg-location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors({ ...errors, location: '' });
                  }}
                  placeholder="e.g. Ranchi, Jharkhand / Gaya, Bihar"
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.location ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                />
                {errors.location && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{errors.location}</p>
                )}
              </div>

              {/* Basic Details */}
              <div>
                <label htmlFor="farmer-reg-details" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Basic Details
                </label>
                <textarea
                  id="farmer-reg-details"
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Land size (e.g. 4 acres), main seasonal crops (Paddy, Maize, Vegetables), farming type (Organic, Drip irrigation)."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
                />
              </div>

              {/* Privacy / Open Access Badge */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Beginner-Friendly & SIH Prototype Compliant</span>
                </div>
                <p>
                  No email verification, passwords, or OAuth tokens required. All records are saved to the project&apos;s shared online database.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="register-farmer-submit-btn"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registering farmer...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-5 h-5" />
                      <span>Register Farmer</span>
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
