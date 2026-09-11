import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { MarketplaceView } from './components/MarketplaceView';
import { SellProduceForm } from './components/SellProduceForm';
import { FarmerRegisterForm } from './components/FarmerRegisterForm';
import { AboutView } from './components/AboutView';
import { ContactModal } from './components/ContactModal';
import { FarmerReviewModal } from './components/FarmerReviewModal';
import { FarmerReportModal } from './components/FarmerReportModal';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { fetchProducts, fetchStats, fetchReviews, resetDemoData, isLocalAdminAuthenticated, clearAdminSession } from './services/api';
import { Product, Farmer, MarketplaceStats, PageView, FilterState, FarmerReview } from './types';
import { ArrowRight, PlusCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [reviews, setReviews] = useState<FarmerReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'All',
    location: 'All',
    minPrice: '',
    maxPrice: '',
  });

  // Modal state
  const [contactProduct, setContactProduct] = useState<Product | null>(null);
  const [reviewFarmer, setReviewFarmer] = useState<{ farmerName: string; farmerPhone: string } | null>(null);
  const [reportFarmer, setReportFarmer] = useState<{ farmerName: string; farmerPhone: string } | null>(null);

  // Pre-fill state when a farmer registers first
  const [prefilledFarmer, setPrefilledFarmer] = useState<{
    name: string;
    phone: string;
    location: string;
  } | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin authentication modal state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const handleOpenAdmin = () => {
    if (isLocalAdminAuthenticated()) {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminModalOpen(true);
    }
  };

  // Load products, stats & reviews from shared online database
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const [fetchedProducts, fetchedStats, fetchedReviews] = await Promise.all([
        fetchProducts(),
        fetchStats(),
        fetchReviews(),
      ]);
      setProducts(fetchedProducts);
      setStats(fetchedStats);
      if (Array.isArray(fetchedReviews)) setReviews(fetchedReviews);
    } catch (err: unknown) {
      console.error('Data loading error:', err);
      setError(err instanceof Error ? err.message : 'Could not connect to shared database');
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Compute live star ratings & comments count for any farmer by phone number
  const getFarmerRatingSummary = useCallback((phone: string) => {
    if (!phone) return undefined;
    const clean = phone.replace(/\D/g, '');
    const farmerReviews = reviews.filter((r) => r.farmerPhone.replace(/\D/g, '') === clean);
    if (farmerReviews.length === 0) return undefined;
    const avg = farmerReviews.reduce((sum, r) => sum + r.rating, 0) / farmerReviews.length;
    return {
      average: Math.round(avg * 10) / 10,
      count: farmerReviews.length,
    };
  }, [reviews]);

  // Initial load
  useEffect(() => {
    loadData();

    // Cross-device sync: poll gently every 15 seconds so listings added on another device appear automatically
    const interval = setInterval(() => {
      loadData(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [loadData]);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductAdded = (newProduct: Product) => {
    // Optimistically prepend to state
    setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
    // Refresh stats and full list
    loadData(true);
    showToast(`"${newProduct.productName}" added to the shared database & visible on all devices!`);
  };

  const handleFarmerRegistered = (farmer: Farmer) => {
    setPrefilledFarmer({
      name: farmer.name,
      phone: farmer.phone,
      location: farmer.location,
    });
    loadData(true);
    showToast(`Farmer ${farmer.name} registered successfully!`);
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset sample agricultural listings to default initial demo data?')) {
      try {
        await resetDemoData();
        await loadData();
        showToast('Database reset to initial sample products.');
      } catch (err) {
        console.error('Reset error:', err);
      }
    }
  };

  // Featured sample products for Home view
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-emerald-500/40 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        productsCount={products.length}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Page Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero stats={stats} onNavigate={handleNavigate} />

            {/* Featured Marketplace Section on Home */}
            <section className="py-14 sm:py-20 bg-white border-b border-emerald-100/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
                      Live Produce Listings
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                      Fresh Produce Available Now
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">
                      Direct from local cultivators across Ranchi, Patna, Gaya, Dhanbad, and more.
                    </p>
                  </div>

                  <button
                    id="home-view-all-products-btn"
                    onClick={() => handleNavigate('products')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm border border-emerald-200 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <span>View All ({products.length}) Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {isLoading && products.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-8 h-8 mx-auto text-emerald-600 animate-spin mb-3" />
                    <p className="text-base font-semibold">Loading fresh produce from shared database...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {featuredProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onContact={(prod) => setContactProduct(prod)}
                        onReview={(prod) => setReviewFarmer({ farmerName: prod.farmerName, farmerPhone: prod.phone })}
                        onReport={(prod) => setReportFarmer({ farmerName: prod.farmerName, farmerPhone: prod.phone })}
                        ratingSummary={getFarmerRatingSummary(p.phone)}
                      />
                    ))}
                  </div>
                )}

                {/* Callout Strip on Home */}
                <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-emerald-700/15">
                  <div>
                    <h3 className="text-xl font-bold">Are you a local farmer?</h3>
                    <p className="text-sm text-emerald-100 mt-0.5">
                      List your produce in under 60 seconds with no login or password barriers.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      id="home-cta-sell-produce"
                      onClick={() => handleNavigate('sell')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-5 py-3 rounded-xl shadow-xs transition-colors cursor-pointer text-sm"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <span>Sell Your Produce</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Problem & Solution Detailed Section */}
            <ProblemSolution onNavigate={handleNavigate} />
          </div>
        )}

        {currentPage === 'products' && (
          <MarketplaceView
            products={products}
            isLoading={isLoading}
            error={error}
            filters={filters}
            onFilterChange={setFilters}
            onRefresh={() => loadData(false)}
            onContact={(prod) => setContactProduct(prod)}
            onReview={(prod) => setReviewFarmer({ farmerName: prod.farmerName, farmerPhone: prod.phone })}
            onReport={(prod) => setReportFarmer({ farmerName: prod.farmerName, farmerPhone: prod.phone })}
            getFarmerRatingSummary={getFarmerRatingSummary}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'sell' && (
          <SellProduceForm
            onProductAdded={handleProductAdded}
            onNavigate={handleNavigate}
            initialFarmerData={prefilledFarmer}
          />
        )}

        {currentPage === 'register' && (
          <FarmerRegisterForm
            onFarmerRegistered={handleFarmerRegistered}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <AboutView onNavigate={handleNavigate} />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            onNavigate={handleNavigate}
            onLogout={() => {
              clearAdminSession();
              setCurrentPage('home');
              showToast('Signed out of admin portal.');
            }}
          />
        )}
      </main>

      {/* Global Contact Farmer Modal */}
      <ContactModal
        product={contactProduct}
        onClose={() => setContactProduct(null)}
        onOpenReview={(prod) => setReviewFarmer({ farmerName: prod.farmerName, farmerPhone: prod.phone })}
        onOpenReport={(prod) => setReportFarmer({ farmerName: prod.farmerName, farmerPhone: prod.phone })}
      />

      {/* Farmer Reviews & Comments Modal */}
      {reviewFarmer && (
        <FarmerReviewModal
          isOpen={true}
          farmerName={reviewFarmer.farmerName}
          farmerPhone={reviewFarmer.farmerPhone}
          onClose={() => setReviewFarmer(null)}
          onReviewSubmitted={(newReview) => {
            setReviews((prev) => [newReview, ...prev.filter((r) => r.id !== newReview.id)]);
            showToast(`Rating and comment posted for ${newReview.farmerName}!`);
            loadData(true);
          }}
        />
      )}

      {/* Farmer Listing Report Modal */}
      {reportFarmer && (
        <FarmerReportModal
          isOpen={true}
          farmerName={reportFarmer.farmerName}
          farmerPhone={reportFarmer.farmerPhone}
          onClose={() => setReportFarmer(null)}
          onReportSubmitted={() => {
            showToast('Report submitted for admin review.');
          }}
        />
      )}

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          setIsAdminModalOpen(false);
          setCurrentPage('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showToast('Admin access unlocked!');
        }}
      />

      {/* Modern Agricultural Footer */}
      <Footer
        onNavigate={handleNavigate}
        onResetDemo={handleResetDemo}
        onOpenAdmin={handleOpenAdmin}
      />
    </div>
  );
}
