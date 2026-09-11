import React, { useState, useEffect } from 'react';
import {
  Shield,
  Package,
  Users,
  TrendingUp,
  Activity,
  Trash2,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Award,
  Calendar,
  Layers,
  FileText,
  X,
  Save,
  Check,
  ExternalLink,
  ChevronRight,
  Flag,
  ShieldAlert,
  Star,
  CheckCheck,
} from 'lucide-react';
import { Product, Farmer, AdminAnalytics, PageView, RegularSeller, FarmerReport, FarmerReview } from '../types';
import {
  fetchProducts,
  fetchFarmers,
  fetchAdminAnalytics,
  updateProductDetails,
  deleteProductRecord,
  deleteFarmerRecord,
  clearAdminSession,
  getSafeErrorMessage,
  fetchReports,
  updateReportStatus,
  deleteReport,
  fetchReviews,
  deleteReview,
} from '../services/api';

interface AdminDashboardProps {
  onNavigate: (page: PageView) => void;
  onLogout: () => void;
}

type AdminTab = 'produce' | 'farmers' | 'regular_sellers' | 'reviews' | 'logins' | 'reports';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('produce');
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [reports, setReports] = useState<FarmerReport[]>([]);
  const [reviews, setReviews] = useState<FarmerReview[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & filter states
  const [produceSearch, setProduceSearch] = useState('');
  const [produceCategory, setProduceCategory] = useState('All');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [reportSearch, setReportSearch] = useState('');
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<'all' | '5' | '4' | '3' | '1-2'>('all');
  const [isUpdatingReportId, setIsUpdatingReportId] = useState<string | null>(null);
  const [isDeletingReviewId, setIsDeletingReviewId] = useState<string | null>(null);

  // Editing Produce Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({
    productName: '',
    category: '',
    quantity: 0,
    price: 0,
    location: '',
    farmerName: '',
    phone: '',
    description: '',
    harvestingDate: '',
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Farmer Modal State
  const [farmerToDelete, setFarmerToDelete] = useState<Farmer | null>(null);
  const [deleteLinkedProducts, setDeleteLinkedProducts] = useState(true);
  const [isDeletingFarmer, setIsDeletingFarmer] = useState(false);

  // Delete Product Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4500);
  };

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      const [fetchedProducts, fetchedFarmers, fetchedAnalytics, fetchedReports, fetchedReviews] = await Promise.all([
        fetchProducts(),
        fetchFarmers(),
        fetchAdminAnalytics(),
        fetchReports(),
        fetchReviews(),
      ]);
      setProducts(fetchedProducts);
      setFarmers(fetchedFarmers);
      setAnalytics(fetchedAnalytics);
      setReports(fetchedReports);
      setReviews(fetchedReviews);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showFeedback('Could not fetch latest records. Using offline data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReviewItem = async (reviewId: string, reviewerName: string) => {
    if (!window.confirm(`Are you sure you want to remove the review & comment by "${reviewerName}"?`)) return;
    setIsDeletingReviewId(reviewId);
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showFeedback('Farmer review and comment removed.');
    } catch (err) {
      showFeedback(getSafeErrorMessage(err, 'Failed to delete review'), 'error');
    } finally {
      setIsDeletingReviewId(null);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Handle Edit Produce
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      productName: product.productName,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      location: product.location,
      farmerName: product.farmerName,
      phone: product.phone,
      description: product.description || '',
      harvestingDate: product.harvestingDate || '',
    });
  };

  const handleSaveProduceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSavingEdit(true);
    try {
      const res = await updateProductDetails(editingProduct.id, {
        productName: editFormData.productName,
        category: editFormData.category,
        quantity: Number(editFormData.quantity),
        price: Number(editFormData.price),
        location: editFormData.location,
        farmerName: editFormData.farmerName,
        phone: editFormData.phone,
        description: editFormData.description,
        harvestingDate: editFormData.harvestingDate,
      });

      // Update local state
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? res.product : p)));
      setEditingProduct(null);
      showFeedback(`Produce "${res.product.productName}" updated successfully!`);

      // Refresh analytics
      fetchAdminAnalytics().then(setAnalytics).catch(() => {});
    } catch (err) {
      const msg = getSafeErrorMessage(err, 'Failed to update produce record');
      showFeedback(msg, 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Delete Produce
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeletingProduct(true);
    try {
      await deleteProductRecord(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showFeedback(`Produce "${productToDelete.productName}" removed from marketplace.`);
      setProductToDelete(null);

      // Refresh analytics
      fetchAdminAnalytics().then(setAnalytics).catch(() => {});
    } catch (err) {
      const msg = getSafeErrorMessage(err, 'Failed to delete produce record');
      showFeedback(msg, 'error');
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Handle Delete Farmer
  const confirmDeleteFarmer = async () => {
    if (!farmerToDelete) return;
    setIsDeletingFarmer(true);
    try {
      const res = await deleteFarmerRecord(farmerToDelete.id, deleteLinkedProducts);
      setFarmers((prev) => prev.filter((f) => f.id !== farmerToDelete.id));

      if (deleteLinkedProducts) {
        const cleanedPhone = farmerToDelete.phone.replace(/\D/g, '');
        setProducts((prev) =>
          prev.filter(
            (p) =>
              p.phone.replace(/\D/g, '') !== cleanedPhone &&
              p.farmerName.toLowerCase().trim() !== farmerToDelete.name.toLowerCase().trim()
          )
        );
      }

      showFeedback(res.message || `Farmer "${farmerToDelete.name}" deleted successfully.`);
      setFarmerToDelete(null);

      // Refresh analytics
      fetchAdminAnalytics().then(setAnalytics).catch(() => {});
    } catch (err) {
      const msg = getSafeErrorMessage(err, 'Failed to delete farmer details');
      showFeedback(msg, 'error');
    } finally {
      setIsDeletingFarmer(false);
    }
  };

  const handleLogoutClick = () => {
    clearAdminSession();
    onLogout();
  };

  // Handle Report status update (Resolved or Dismissed)
  const handleUpdateReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    setIsUpdatingReportId(reportId);
    try {
      await updateReportStatus(reportId, status);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
      showFeedback(`Report marked as ${status}.`);
    } catch (err) {
      showFeedback(getSafeErrorMessage(err, 'Failed to update report'), 'error');
    } finally {
      setIsUpdatingReportId(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      showFeedback('Report removed.');
    } catch (err) {
      showFeedback(getSafeErrorMessage(err, 'Failed to remove report'), 'error');
    }
  };

  const handleActionDeleteFarmerFromReport = (farmerPhone: string, farmerName: string) => {
    const existing = farmers.find((f) => f.phone === farmerPhone);
    if (existing) {
      setFarmerToDelete(existing);
    } else {
      setFarmerToDelete({
        id: `temp_${farmerPhone}`,
        name: farmerName,
        phone: farmerPhone,
        location: 'Recorded in produce listings/reports',
        details: '',
        registeredAt: new Date().toISOString(),
      });
    }
  };

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesStatus = reportFilter === 'all' || r.status === reportFilter;
    const q = reportSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.farmerName.toLowerCase().includes(q) ||
      r.farmerPhone.includes(q) ||
      r.reason.toLowerCase().includes(q) ||
      r.reportedBy.toLowerCase().includes(q) ||
      r.details.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Filtered produce
  const filteredProducts = products.filter((p) => {
    const q = produceSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.productName.toLowerCase().includes(q) ||
      p.farmerName.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.phone.includes(q);

    const matchesCategory = produceCategory === 'All' || p.category === produceCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered farmers
  const filteredFarmers = farmers.filter((f) => {
    const q = farmerSearch.toLowerCase().trim();
    return (
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.phone.includes(q) ||
      f.location.toLowerCase().includes(q) ||
      f.details.toLowerCase().includes(q)
    );
  });

  // Unique categories for filter
  const allCategories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Total produce metrics
  const totalVolumeKg = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
  const totalValueRs = products.reduce((acc, p) => acc + (Number(p.quantity) * Number(p.price) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border ${
              feedbackMsg.type === 'success'
                ? 'bg-slate-900 text-white border-emerald-500'
                : 'bg-red-900 text-white border-red-500'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight">Farm Connect Admin Center</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Authenticated
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Full control: Edit produce, delete farmer records, monitor logins & regular sellers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={loadAllAdminData}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Refresh All Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              </button>

              <button
                id="admin-back-to-market-btn"
                onClick={() => onNavigate('products')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View Marketplace</span>
              </button>

              <button
                id="admin-logout-btn"
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 text-red-200 text-xs font-medium border border-red-800/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('produce')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'produce'
                  ? 'bg-slate-50 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Produce Management</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-2xs ${
                  activeTab === 'produce' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('farmers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'farmers'
                  ? 'bg-slate-50 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Farmer Records</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-2xs ${
                  activeTab === 'farmers' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {farmers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('regular_sellers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'regular_sellers'
                  ? 'bg-slate-50 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Regular Sellers Data</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-2xs ${
                  activeTab === 'regular_sellers' ? 'bg-amber-100 text-amber-800' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {analytics?.regularSellers?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('logins')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'logins'
                  ? 'bg-slate-50 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Traffic & Logins</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-2xs ${
                  activeTab === 'logins' ? 'bg-blue-100 text-blue-800' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {analytics?.totalLogins ?? 0} logged in
              </span>
            </button>

            <button
              id="admin-reports-tab-btn"
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-slate-50 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flag className="w-4 h-4 text-rose-400" />
              <span>Farmer Reports</span>
              {pendingReportsCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full text-2xs bg-rose-500 text-white font-extrabold animate-pulse">
                  {pendingReportsCount} new
                </span>
              ) : (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-2xs ${
                    activeTab === 'reports' ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {reports.length}
                </span>
              )}
            </button>

            <button
              id="admin-reviews-tab-btn"
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-slate-50 text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>Ratings & Comments</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-2xs ${
                  activeTab === 'reviews' ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {reviews.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================= */}
        {/* TAB 1: PRODUCE MANAGEMENT (Edit produce details & delete)  */}
        {/* ========================================================= */}
        {activeTab === 'produce' && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Listings</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{products.length} Products</p>
                <p className="text-xs text-emerald-600 font-medium mt-0.5">Live on farmer network</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Harvest Volume</span>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">{totalVolumeKg.toLocaleString()} kg</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Across all active categories</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Market Value</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalValueRs.toLocaleString()}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Total direct inventory valuation</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search produce, farmer, location..."
                  value={produceSearch}
                  onChange={(e) => setProduceSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-medium text-slate-500">Category:</span>
                <select
                  value={produceCategory}
                  onChange={(e) => setProduceCategory(e.target.value)}
                  className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-400 ml-2">
                  Showing {filteredProducts.length} of {products.length}
                </span>
              </div>
            </div>

            {/* Produce Listings Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-700 border-b border-slate-200 tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Produce Details</th>
                      <th className="px-4 py-3">Farmer & Contact</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Quantity & Price</th>
                      <th className="px-4 py-3">Total Value</th>
                      <th className="px-4 py-3">Photos</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-sm">
                          No produce listings match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-900 text-base">{p.productName}</div>
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mt-0.5">
                              {p.category}
                            </span>
                            {p.description && (
                              <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-xs">{p.description}</p>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-slate-900">{p.farmerName}</div>
                            <div className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />
                              <span>{p.phone}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1 text-slate-700 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{p.location}</span>
                            </div>
                            <div className="text-2xs text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-emerald-600" />
                              <span>Harvested: {p.harvestingDate || 'N/A'}</span>
                            </div>
                            <span className="text-2xs text-slate-400">
                              Listed: {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-900">{p.quantity} kg</div>
                            <div className="text-xs text-emerald-700 font-semibold">₹{p.price} / kg</div>
                          </td>
                          <td className="px-4 py-3.5 font-extrabold text-slate-900">
                            ₹{(Number(p.quantity) * Number(p.price)).toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5">
                            {p.files && p.files.length > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                <FileText className="w-3.5 h-3.5" />
                                <span>{p.files.length} attached</span>
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">None</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(p)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors cursor-pointer border border-emerald-200"
                                title="Edit this produce's details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => setProductToDelete(p)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors cursor-pointer border border-red-200"
                                title="Delete produce listing"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FARMER RECORDS (Delete farmer details)              */}
        {/* ========================================================= */}
        {activeTab === 'farmers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search farmer name, phone, district..."
                  value={farmerSearch}
                  onChange={(e) => setFarmerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Registered Cultivators: <strong>{farmers.length}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFarmers.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                  No registered farmers match your search query.
                </div>
              ) : (
                filteredFarmers.map((f) => {
                  const linkedProductsCount = products.filter(
                    (p) =>
                      p.phone.replace(/\D/g, '') === f.phone.replace(/\D/g, '') ||
                      p.farmerName.toLowerCase().trim() === f.name.toLowerCase().trim()
                  ).length;

                  return (
                    <div
                      key={f.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{f.name}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{f.location}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            ID: {f.id.split('-').slice(-1)[0] || 'reg'}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-xs">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                            <span className="text-slate-500">Phone:</span>
                            <span className="font-mono font-bold text-slate-900">{f.phone}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                            <span className="text-slate-500">Active Listings:</span>
                            <span className="font-bold text-emerald-700">{linkedProductsCount} crop(s)</span>
                          </div>
                          {f.documents && f.documents.length > 0 && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60">
                              <span className="text-emerald-800 font-medium">Verification Documents:</span>
                              <span className="font-bold text-emerald-900">{f.documents.length} files</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 line-clamp-3">
                          {f.details || 'Farmer registered on network.'}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-2xs text-slate-400">
                          Joined: {new Date(f.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => {
                            setFarmerToDelete(f);
                            setDeleteLinkedProducts(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors cursor-pointer"
                          title="Delete this farmer's details"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Farmer</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: REGULAR SELLERS DATA ("who sells regularly")        */}
        {/* ========================================================= */}
        {activeTab === 'regular_sellers' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    <Award className="w-3.5 h-3.5" />
                    Marketplace Intelligence
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2">Cultivators Who Sell Regularly</h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Ranked by frequency of crop listings and cumulative harvest tonnage supplied directly to buyers.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 text-center">
                    <span className="text-2xs uppercase tracking-wider text-slate-300 font-semibold block">
                      Top Regulars
                    </span>
                    <span className="text-xl font-extrabold text-white">
                      {analytics?.regularSellers.filter((s) => s.tier === 'Top Regular').length || 0}
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 text-center">
                    <span className="text-2xs uppercase tracking-wider text-slate-300 font-semibold block">
                      Active Cultivators
                    </span>
                    <span className="text-xl font-extrabold text-white">
                      {analytics?.regularSellers.filter((s) => s.tier === 'Active Cultivator').length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Sellers Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-700 border-b border-slate-200 tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">Rank & Cultivator</th>
                      <th className="px-4 py-3.5">Tier Status</th>
                      <th className="px-4 py-3.5">Listing Frequency</th>
                      <th className="px-4 py-3.5">Total Supplied</th>
                      <th className="px-4 py-3.5">Valuation</th>
                      <th className="px-4 py-3.5">Primary Crops</th>
                      <th className="px-4 py-3.5">Location</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {!analytics?.regularSellers || analytics.regularSellers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                          Calculating seller listing frequency...
                        </td>
                      </tr>
                    ) : (
                      analytics.regularSellers.map((seller, idx) => (
                        <tr key={seller.phone + seller.farmerName} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                  idx === 0
                                    ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                                    : idx === 1
                                    ? 'bg-slate-300 text-slate-800'
                                    : idx === 2
                                    ? 'bg-amber-700 text-amber-100'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                #{idx + 1}
                              </span>
                              <div>
                                <span className="font-bold text-slate-900 text-base block">{seller.farmerName}</span>
                                <span className="text-xs text-emerald-700 font-mono">{seller.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {seller.tier === 'Top Regular' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <Award className="w-3.5 h-3.5 text-emerald-600" />
                                Top Regular
                              </span>
                            )}
                            {seller.tier === 'Active Cultivator' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                Active Cultivator
                              </span>
                            )}
                            {seller.tier === 'Occasional Seller' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                Occasional
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 font-extrabold text-slate-900 text-base">
                            {seller.listingsCount} listings
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-extrabold text-emerald-700">
                              {seller.totalQuantityKg.toLocaleString()} kg
                            </div>
                            <span className="text-2xs text-slate-400">total listed</span>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            ₹{seller.totalValue.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {seller.crops.map((crop) => (
                                <span
                                  key={crop}
                                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-medium"
                                >
                                  {crop}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-700 font-medium">
                            <div className="flex items-center gap-1 text-xs">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{seller.location}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => {
                                setProduceSearch(seller.farmerName);
                                setActiveTab('produce');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 cursor-pointer"
                            >
                              <span>View Crops</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: TRAFFIC & LOGINS ("see how many logged in")         */}
        {/* ========================================================= */}
        {activeTab === 'logins' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Admin Logins Recorded
                </span>
                <p className="text-3xl font-black text-slate-900 mt-1">{analytics?.totalLogins ?? 0}</p>
                <p className="text-xs text-slate-500 mt-1">Logged into Admin Control Panel</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Marketplace Visitors
                </span>
                <p className="text-3xl font-black text-emerald-700 mt-1">
                  {(analytics?.totalVisitors ?? 154).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">Buyer and farmer session visits recorded</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Session</span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">Active (admin)</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1">● Live session authenticated</p>
              </div>
            </div>

            {/* Login Activity Logs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Login Activity Log</h3>
                  <p className="text-xs text-slate-500">History of authenticated admin logins with timestamps</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-700">
                  {analytics?.loginHistory.length || 0} entries
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Username</th>
                      <th className="px-6 py-3">Browser / Device</th>
                      <th className="px-6 py-3">IP Address</th>
                      <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {!analytics?.loginHistory || analytics.loginHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-sans text-sm">
                          No login records yet.
                        </td>
                      </tr>
                    ) : (
                      analytics.loginHistory.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="px-6 py-3.5 font-sans font-medium text-slate-900">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-3.5 font-bold text-emerald-700">{log.username}</td>
                          <td className="px-6 py-3.5 text-slate-600 truncate max-w-xs font-sans">
                            {log.userAgent || 'Web Client'}
                          </td>
                          <td className="px-6 py-3.5 text-slate-500">{log.ip || 'Local / Edge IP'}</td>
                          <td className="px-6 py-3.5 text-right font-sans">
                            {log.status === 'success' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3" />
                                Success
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-red-100 text-red-800">
                                <AlertCircle className="w-3 h-3" />
                                Failed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: FARMER REPORTS & BUYER FEEDBACK                     */}
        {/* ========================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{reports.length}</div>
                <p className="text-xs text-slate-400 mt-0.5">Reported by buyers or platform users</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Pending Investigation</span>
                <div className="text-2xl font-extrabold text-rose-600 mt-1">{pendingReportsCount}</div>
                <p className="text-xs text-rose-600/80 mt-0.5">Requires admin review and decision</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolved / Dismissed</span>
                <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                  {reports.filter((r) => r.status === 'resolved' || r.status === 'dismissed').length}
                </div>
                <p className="text-xs text-emerald-600/80 mt-0.5">Handled complaints & resolved disputes</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reports by farmer, phone, reason, or reporter..."
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {(['all', 'pending', 'resolved', 'dismissed'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setReportFilter(status)}
                      className={`px-3 py-1 rounded-md text-xs font-bold capitalize transition-colors cursor-pointer ${
                        reportFilter === status
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
                  <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700 text-sm">No farmer reports found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {reports.length === 0
                      ? 'No reports have been submitted by buyers yet.'
                      : 'No reports match your active search or status filter.'}
                  </p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className={`bg-white rounded-xl border p-5 shadow-xs transition-all ${
                      report.status === 'pending'
                        ? 'border-rose-200 bg-rose-50/20'
                        : report.status === 'resolved'
                        ? 'border-emerald-200'
                        : 'border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <Flag className="w-3 h-3 text-rose-600" />
                          <span>{report.reason}</span>
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider ${
                            report.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : report.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-2xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(report.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Report Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                        <span className="font-bold text-slate-500 uppercase tracking-wider text-2xs">Reported Farmer</span>
                        <div className="font-bold text-sm text-slate-900">{report.farmerName}</div>
                        <div className="flex items-center gap-1.5 text-emerald-800 font-semibold font-mono">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{report.farmerPhone}</span>
                          <a
                            href={`tel:${report.farmerPhone}`}
                            className="ml-2 text-2xs text-emerald-600 underline font-sans font-medium hover:text-emerald-800"
                          >
                            Call Farmer
                          </a>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                        <span className="font-bold text-slate-500 uppercase tracking-wider text-2xs">Submitted By</span>
                        <div className="font-semibold text-slate-900">{report.reportedBy}</div>
                        {report.reporterPhone && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>Reporter phone: {report.reporterPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Incident Details */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900 block mb-1 text-2xs uppercase tracking-wider">
                        Incident Explanation:
                      </span>
                      {report.details}
                    </div>

                    {/* Admin Action Controls */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-3 mt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {report.status !== 'resolved' && (
                          <button
                            type="button"
                            disabled={isUpdatingReportId === report.id}
                            onClick={() => handleUpdateReport(report.id, 'resolved')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark Resolved</span>
                          </button>
                        )}
                        {report.status !== 'dismissed' && (
                          <button
                            type="button"
                            disabled={isUpdatingReportId === report.id}
                            onClick={() => handleUpdateReport(report.id, 'dismissed')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                          >
                            <span>Dismiss</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleActionDeleteFarmerFromReport(report.farmerPhone, report.farmerName)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                          title="Delete this farmer and their produce listings from the platform"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete Farmer</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete report entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: FARMER RATINGS & COMMENTS (Moderation & Feedback)  */}
        {/* ========================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Total Reviews</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{reviews.length}</p>
                <p className="text-2xs text-slate-400 mt-0.5">Buyer ratings logged</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Average Rating</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-2xl font-black text-amber-600">
                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                  </span>
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <p className="text-2xs text-slate-400 mt-0.5">Across all farmers</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">5-Star Feedback</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {reviews.filter((r) => r.rating === 5).length}
                </p>
                <p className="text-2xs text-slate-400 mt-0.5">Highest quality rating</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Reviewed Farmers</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {new Set(reviews.map((r) => r.farmerPhone.replace(/\D/g, ''))).size}
                </p>
                <p className="text-2xs text-slate-400 mt-0.5">Unique farmer profiles</p>
              </div>
            </div>

            {/* Controls: Search and Rating Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search farmer, reviewer, or comment..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {reviewSearch && (
                  <button
                    onClick={() => setReviewSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs text-slate-500 font-medium shrink-0">Filter Stars:</span>
                {(['all', '5', '4', '3', '1-2'] as const).map((starVal) => (
                  <button
                    key={starVal}
                    onClick={() => setReviewRatingFilter(starVal)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      reviewRatingFilter === starVal
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {starVal === 'all' ? 'All Ratings' : starVal === '1-2' ? '1-2 Stars' : `${starVal} Stars`}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.filter((rev) => {
                if (reviewSearch.trim()) {
                  const q = reviewSearch.toLowerCase().trim();
                  const matchFarmer = rev.farmerName.toLowerCase().includes(q);
                  const matchPhone = rev.farmerPhone.includes(q);
                  const matchReviewer = rev.reviewerName.toLowerCase().includes(q);
                  const matchComment = rev.comment.toLowerCase().includes(q);
                  if (!matchFarmer && !matchPhone && !matchReviewer && !matchComment) return false;
                }
                if (reviewRatingFilter === '5' && rev.rating !== 5) return false;
                if (reviewRatingFilter === '4' && rev.rating !== 4) return false;
                if (reviewRatingFilter === '3' && rev.rating !== 3) return false;
                if (reviewRatingFilter === '1-2' && rev.rating > 2) return false;
                return true;
              }).length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-800">No ratings or comments found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {reviews.length === 0
                      ? 'No buyer ratings or comments have been submitted yet. When buyers review farmers on the marketplace, they will appear here.'
                      : 'No reviews match your current search or star filter criteria.'}
                  </p>
                </div>
              ) : (
                reviews
                  .filter((rev) => {
                    if (reviewSearch.trim()) {
                      const q = reviewSearch.toLowerCase().trim();
                      const matchFarmer = rev.farmerName.toLowerCase().includes(q);
                      const matchPhone = rev.farmerPhone.includes(q);
                      const matchReviewer = rev.reviewerName.toLowerCase().includes(q);
                      const matchComment = rev.comment.toLowerCase().includes(q);
                      if (!matchFarmer && !matchPhone && !matchReviewer && !matchComment) return false;
                    }
                    if (reviewRatingFilter === '5' && rev.rating !== 5) return false;
                    if (reviewRatingFilter === '4' && rev.rating !== 4) return false;
                    if (reviewRatingFilter === '3' && rev.rating !== 3) return false;
                    if (reviewRatingFilter === '1-2' && rev.rating > 2) return false;
                    return true;
                  })
                  .map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold shrink-0">
                            {rev.rating}★
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">
                                Farmer: {rev.farmerName}
                              </h4>
                              <span className="text-xs text-slate-500 font-medium">
                                ({rev.farmerPhone})
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Reviewed by <strong className="text-slate-700">{rev.reviewerName}</strong>
                              {rev.reviewerPhone && ` • Contact: ${rev.reviewerPhone}`}
                              {rev.createdAt && ` • ${new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs text-slate-700 italic">
                        "{rev.comment}"
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-2">
                        <span className="text-[11px] text-slate-400">
                          ID: {rev.id}
                        </span>

                        <button
                          type="button"
                          disabled={isDeletingReviewId === rev.id}
                          onClick={() => handleDeleteReviewItem(rev.id, rev.reviewerName)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete inappropriate or spam review"
                        >
                          {isDeletingReviewId === rev.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          <span>Remove Review & Comment</span>
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: EDIT PRODUCE DETAILS                                */}
      {/* ========================================================= */}
      {editingProduct && (
        <div
          id="edit-produce-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingProduct(null);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg">Edit Produce Details</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduceEdit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop / Produce Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.productName}
                    onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Available Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.quantity}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expected Price (₹/kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Date of Harvesting (Mandatory)
                  </label>
                  <input
                    type="date"
                    required
                    value={editFormData.harvestingDate}
                    onChange={(e) => setEditFormData({ ...editFormData, harvestingDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cultivator / Farmer Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.farmerName}
                    onChange={(e) => setEditFormData({ ...editFormData, farmerName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Produce Description</label>
                  <textarea
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-70"
                >
                  {isSavingEdit ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION                        */}
      {/* ========================================================= */}
      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setProductToDelete(null);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Produce Listing</h3>
            <p className="text-sm text-slate-600 mt-2">
              Are you sure you want to remove <strong>{productToDelete.productName}</strong> ({productToDelete.quantity} kg) listed by <strong>{productToDelete.farmerName}</strong> from the shared marketplace?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={confirmDeleteProduct}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isDeletingProduct ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE FARMER DETAILS CONFIRMATION                 */}
      {/* ========================================================= */}
      {farmerToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFarmerToDelete(null);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Farmer Details</h3>
            <p className="text-sm text-slate-600 mt-2">
              Are you sure you want to permanently delete farmer record <strong>{farmerToDelete.name}</strong> ({farmerToDelete.phone}, {farmerToDelete.location})?
            </p>

            <label className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteLinkedProducts}
                onChange={(e) => setDeleteLinkedProducts(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-amber-900 font-medium">
                Also remove all active produce listings submitted by this farmer
              </span>
            </label>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFarmerToDelete(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingFarmer}
                onClick={confirmDeleteFarmer}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isDeletingFarmer ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Farmer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
