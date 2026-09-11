import { Product, Farmer, MarketplaceStats, FilterState, ProductFile, AdminAnalytics, LoginLog, RegularSeller, FarmerReview, FarmerReport } from '../types';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredFarmers,
  saveStoredFarmers,
  calculateLocalStats,
  recordLocalLogin,
  calculateLocalAdminAnalytics,
  updateLocalProduct,
  deleteLocalProduct,
  deleteLocalFarmer,
  getStoredReviews,
  addStoredReview,
  deleteStoredReview,
  getStoredReports,
  addStoredReport,
  updateStoredReportStatus,
  deleteStoredReport,
} from './fallbackData';

export const API_BASE = '/api';

/**
 * Safely extracts human-readable error messages from any error payload,
 * preventing JavaScript from displaying raw `[object Object]`.
 */
export function getSafeErrorMessage(errorData: unknown, fallback: string): string {
  if (!errorData) return fallback;
  if (typeof errorData === 'string') {
    return errorData === '[object Object]' ? fallback : errorData;
  }
  if (typeof errorData === 'object') {
    const obj = errorData as Record<string, unknown>;

    // Handle nested error object or string
    if (typeof obj.error === 'string' && obj.error) {
      return obj.error;
    }
    if (typeof obj.error === 'object' && obj.error !== null) {
      const inner = obj.error as Record<string, unknown>;
      if (typeof inner.message === 'string' && inner.message) return inner.message;
      if (typeof inner.code === 'string' && inner.code) return `Server error code: ${inner.code}`;
    }

    if (typeof obj.message === 'string' && obj.message && obj.message !== '[object Object]') {
      return obj.message;
    }
    if (typeof obj.detail === 'string' && obj.detail) {
      return obj.detail;
    }

    try {
      const json = JSON.stringify(errorData);
      if (json && json !== '{}' && !json.includes('[object Object]')) {
        return json;
      }
    } catch {
      // ignore serialization error
    }
  }
  return fallback;
}

/**
 * Filter local in-memory/localStorage products when running on static hosts like Vercel.
 */
function filterLocalProducts(products: Product[], filters?: Partial<FilterState>): Product[] {
  if (!filters) return products;
  let filtered = [...products];

  if (filters.searchQuery?.trim()) {
    const q = filters.searchQuery.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters.location && filters.location !== 'All') {
    filtered = filtered.filter((p) => p.location.toLowerCase() === filters.location!.toLowerCase());
  }

  if (filters.minPrice?.trim()) {
    const min = parseFloat(filters.minPrice);
    if (!isNaN(min)) {
      filtered = filtered.filter((p) => p.price >= min);
    }
  }

  if (filters.maxPrice?.trim()) {
    const max = parseFloat(filters.maxPrice);
    if (!isNaN(max)) {
      filtered = filtered.filter((p) => p.price <= max);
    }
  }

  return filtered;
}

/**
 * Creates and persists a product locally when running on static hosting like Vercel.
 */
function createLocalProduct(data: {
  farmerName: string;
  phone: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  location: string;
  description: string;
  harvestingDate: string;
  files?: ProductFile[];
}): { success: boolean; product: Product; message: string } {
  const newProduct: Product = {
    id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    farmerName: data.farmerName.trim(),
    phone: data.phone.trim(),
    productName: data.productName.trim(),
    category: data.category.trim(),
    quantity: data.quantity,
    price: data.price,
    location: data.location.trim(),
    description: data.description.trim(),
    harvestingDate: data.harvestingDate.trim() || new Date().toISOString().split('T')[0],
    files: data.files,
    createdAt: new Date().toISOString(),
  };

  const existing = getStoredProducts();
  saveStoredProducts([newProduct, ...existing]);

  return {
    success: true,
    product: newProduct,
    message: 'Produce successfully listed in direct marketplace!',
  };
}

/**
 * Registers and persists a farmer locally when running on static hosting like Vercel.
 */
function registerLocalFarmer(data: {
  name: string;
  phone: string;
  location: string;
  details?: string;
  documents?: ProductFile[];
}): { success: boolean; farmer: Farmer; message: string } {
  const newFarmer: Farmer = {
    id: `farmer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    phone: data.phone.trim(),
    location: data.location.trim(),
    details: data.details?.trim() || 'Cultivator registered on Farm Connect digital network.',
    documents: data.documents,
    createdAt: new Date().toISOString(),
  };

  const existing = getStoredFarmers();
  saveStoredFarmers([newFarmer, ...existing]);

  return {
    success: true,
    farmer: newFarmer,
    message: 'Farmer registration completed successfully!',
  };
}

/**
 * Fetches products. Attempts backend API first; falls back seamlessly to localStorage on static hosts (e.g. Vercel).
 */
export async function fetchProducts(filters?: Partial<FilterState>): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.searchQuery?.trim()) {
    params.append('q', filters.searchQuery.trim());
  }
  if (filters?.category && filters.category !== 'All') {
    params.append('category', filters.category);
  }
  if (filters?.location && filters.location !== 'All') {
    params.append('location', filters.location);
  }
  if (filters?.minPrice?.trim()) {
    params.append('minPrice', filters.minPrice.trim());
  }
  if (filters?.maxPrice?.trim()) {
    params.append('maxPrice', filters.maxPrice.trim());
  }

  const queryString = params.toString();
  const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      if (Array.isArray(data)) {
        // Sync to local storage for offline / static backup
        saveStoredProducts(data);
        return data;
      }
    }

    // Static host fallback (e.g. 404 or index.html returned by Vercel)
    return filterLocalProducts(getStoredProducts(), filters);
  } catch (err) {
    console.warn('API endpoint unreachable, using client storage fallback:', err);
    return filterLocalProducts(getStoredProducts(), filters);
  }
}

/**
 * Creates a product. Uses backend server when running in Node/Cloud Run, or local storage on static hosts like Vercel.
 */
export async function createProduct(data: {
  farmerName: string;
  phone: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  location: string;
  description: string;
  harvestingDate: string;
  files?: ProductFile[];
}): Promise<{ success: boolean; product: Product; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const resJson = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && resJson?.success && resJson?.product) {
      // Sync to local cache
      const current = getStoredProducts();
      saveStoredProducts([resJson.product, ...current.filter((p) => p.id !== resJson.product.id)]);
      return resJson;
    }

    // On Vercel without Node server running, /api/products returns 404 or index.html fallback
    if (response.status === 404 || response.status === 502 || !isJson) {
      console.warn('Server API not hosted in this environment (e.g. Vercel static build). Using persistent local storage.');
      return createLocalProduct(data);
    }

    // Backend returned a real error with status
    const errorMsg = getSafeErrorMessage(resJson, `Server error (${response.status})`);
    throw new Error(errorMsg);
  } catch (err: unknown) {
    // If network connection failed entirely (offline or static preview on Vercel)
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('network'))) {
      console.warn('Network unreachable. Persisting produce to local storage.');
      return createLocalProduct(data);
    }
    const safeMsg = getSafeErrorMessage(err, 'Failed to save product to database');
    throw new Error(safeMsg);
  }
}

/**
 * Fetches all registered farmers.
 */
export async function fetchFarmers(): Promise<Farmer[]> {
  try {
    const response = await fetch(`${API_BASE}/farmers`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      if (Array.isArray(data)) {
        saveStoredFarmers(data);
        return data;
      }
    }

    return getStoredFarmers();
  } catch (err) {
    console.warn('API endpoint unreachable, using client storage fallback for farmers:', err);
    return getStoredFarmers();
  }
}

/**
 * Registers a new farmer.
 */
export async function registerFarmer(data: {
  name: string;
  phone: string;
  location: string;
  details?: string;
  documents?: ProductFile[];
}): Promise<{ success: boolean; farmer: Farmer; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/farmers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const resJson = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && resJson?.success && resJson?.farmer) {
      const current = getStoredFarmers();
      saveStoredFarmers([resJson.farmer, ...current.filter((f) => f.id !== resJson.farmer.id)]);
      return resJson;
    }

    // On static hosting like Vercel without Node runtime
    if (response.status === 404 || response.status === 502 || !isJson) {
      console.warn('Server API not hosted in this environment (e.g. Vercel static build). Using persistent local storage.');
      return registerLocalFarmer(data);
    }

    const errorMsg = getSafeErrorMessage(resJson, `Server error (${response.status})`);
    throw new Error(errorMsg);
  } catch (err: unknown) {
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('network'))) {
      console.warn('Network unreachable. Persisting farmer to local storage.');
      return registerLocalFarmer(data);
    }
    const safeMsg = getSafeErrorMessage(err, 'Failed to register farmer in database');
    throw new Error(safeMsg);
  }
}

/**
 * Fetches platform stats.
 */
export async function fetchStats(): Promise<MarketplaceStats> {
  try {
    const response = await fetch(`${API_BASE}/stats`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      return await response.json();
    }

    return calculateLocalStats();
  } catch {
    return calculateLocalStats();
  }
}

/**
 * Resets demo data.
 */
export async function resetDemoData(): Promise<void> {
  try {
    await fetch(`${API_BASE}/reset-demo`, {
      method: 'POST',
    });
  } catch {
    // Reset local store as well
    try {
      localStorage.removeItem('farmconnect_local_products');
      localStorage.removeItem('farmconnect_local_farmers');
    } catch {
      // ignore
    }
  }
}

// ==========================================
// Admin Services (Username: admin / Password: admin)
// ==========================================

const ADMIN_STORAGE_TOKEN = 'farmconnect_admin_auth';

export function isLocalAdminAuthenticated(): boolean {
  try {
    const auth = localStorage.getItem(ADMIN_STORAGE_TOKEN);
    if (!auth) return false;
    const parsed = JSON.parse(auth);
    return Boolean(parsed?.authenticated && parsed?.username === 'admin');
  } catch {
    return false;
  }
}

export function saveAdminSession(): void {
  try {
    localStorage.setItem(
      ADMIN_STORAGE_TOKEN,
      JSON.stringify({
        authenticated: true,
        username: 'admin',
        loggedInAt: new Date().toISOString(),
      })
    );
  } catch {
    // ignore
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_STORAGE_TOKEN);
  } catch {
    // ignore
  }
}

/**
 * Authenticates admin with username and password.
 */
export async function adminLogin(
  username: string,
  pass: string
): Promise<{ success: boolean; message: string; token?: string }> {
  const cleanUser = username.trim();
  const cleanPass = pass.trim();

  try {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username: cleanUser, password: cleanPass }),
    });

    const isJson = (response.headers.get('content-type') || '').includes('application/json');
    const resJson = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && resJson?.success) {
      saveAdminSession();
      return { success: true, message: 'Welcome back, Admin!', token: resJson.token };
    }

    // Static host fallback (e.g. Vercel static build where /api returns 404)
    if (response.status === 404 || response.status === 502 || !isJson) {
      if (cleanUser === 'admin' && cleanPass === 'admin') {
        saveAdminSession();
        recordLocalLogin('success', cleanUser);
        return { success: true, message: 'Admin authentication successful (client mode)' };
      } else {
        recordLocalLogin('failed', cleanUser);
        throw new Error('Invalid credentials. Required: Username="admin", Password="admin"');
      }
    }

    const err = getSafeErrorMessage(resJson, 'Invalid username or password');
    throw new Error(err);
  } catch (err: unknown) {
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('network'))) {
      if (cleanUser === 'admin' && cleanPass === 'admin') {
        saveAdminSession();
        recordLocalLogin('success', cleanUser);
        return { success: true, message: 'Admin authentication successful (offline mode)' };
      } else {
        recordLocalLogin('failed', cleanUser);
        throw new Error('Invalid credentials. Required: Username="admin", Password="admin"');
      }
    }
    const safeMsg = getSafeErrorMessage(err, 'Authentication failed');
    throw new Error(safeMsg);
  }
}

/**
 * Fetches analytics: how many logged in, login records, and regular sellers.
 */
export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  try {
    const response = await fetch(`${API_BASE}/admin/analytics`, {
      headers: { Accept: 'application/json' },
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }

    return calculateLocalAdminAnalytics();
  } catch {
    return calculateLocalAdminAnalytics();
  }
}

/**
 * Admin: Update produce details.
 */
export async function updateProductDetails(
  id: string,
  data: Partial<Product>
): Promise<{ success: boolean; product: Product; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    const isJson = (response.headers.get('content-type') || '').includes('application/json');
    const resJson = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && resJson?.success && resJson?.product) {
      // Sync local storage
      const current = getStoredProducts();
      const updatedList = current.map((p) => (p.id === id ? resJson.product : p));
      saveStoredProducts(updatedList);
      return resJson;
    }

    if (response.status === 404 || response.status === 502 || !isJson) {
      const updated = updateLocalProduct(id, data);
      return {
        success: true,
        product: updated,
        message: 'Produce updated successfully!',
      };
    }

    const err = getSafeErrorMessage(resJson, 'Failed to update produce details');
    throw new Error(err);
  } catch (err: unknown) {
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('network'))) {
      const updated = updateLocalProduct(id, data);
      return {
        success: true,
        product: updated,
        message: 'Produce updated successfully in local storage!',
      };
    }
    const safeMsg = getSafeErrorMessage(err, 'Failed to update produce');
    throw new Error(safeMsg);
  }
}

/**
 * Admin: Delete a product listing.
 */
export async function deleteProductRecord(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    const isJson = (response.headers.get('content-type') || '').includes('application/json');
    const resJson = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && resJson?.success) {
      deleteLocalProduct(id);
      return resJson;
    }

    if (response.status === 404 || response.status === 502 || !isJson) {
      deleteLocalProduct(id);
      return { success: true, message: 'Produce listing deleted successfully!' };
    }

    const err = getSafeErrorMessage(resJson, 'Failed to delete produce record');
    throw new Error(err);
  } catch (err: unknown) {
    deleteLocalProduct(id);
    return { success: true, message: 'Produce listing removed from storage!' };
  }
}

/**
 * Admin: Delete farmer details.
 */
export async function deleteFarmerRecord(
  id: string,
  deleteLinkedProducts = false
): Promise<{ success: boolean; message: string; removedProductsCount?: number }> {
  try {
    const url = `${API_BASE}/farmers/${encodeURIComponent(id)}${
      deleteLinkedProducts ? '?deleteProducts=true' : ''
    }`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    const isJson = (response.headers.get('content-type') || '').includes('application/json');
    const resJson = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && resJson?.success) {
      deleteLocalFarmer(id, deleteLinkedProducts);
      return resJson;
    }

    if (response.status === 404 || response.status === 502 || !isJson) {
      const res = deleteLocalFarmer(id, deleteLinkedProducts);
      return {
        success: true,
        message: 'Farmer details deleted successfully!',
        removedProductsCount: res.removedCount,
      };
    }

    const err = getSafeErrorMessage(resJson, 'Failed to delete farmer details');
    throw new Error(err);
  } catch (err: unknown) {
    const res = deleteLocalFarmer(id, deleteLinkedProducts);
    return {
      success: true,
      message: 'Farmer details deleted successfully from local storage!',
      removedProductsCount: res.removedCount,
    };
  }
}

/**
 * Fetch reviews for farmers. If farmerPhone is provided, filters to that farmer.
 */
export async function fetchReviews(farmerPhone?: string): Promise<FarmerReview[]> {
  try {
    const url = farmerPhone
      ? `${API_BASE}/reviews?farmerPhone=${encodeURIComponent(farmerPhone)}`
      : `${API_BASE}/reviews`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn('Could not fetch reviews from server, falling back to local storage:', err);
  }
  const all = getStoredReviews();
  if (farmerPhone) {
    const clean = farmerPhone.replace(/\D/g, '');
    return all.filter((r) => r.farmerPhone.replace(/\D/g, '') === clean);
  }
  return all;
}

/**
 * Submit a rating and review for a farmer.
 */
export async function submitReview(data: {
  farmerPhone: string;
  farmerName: string;
  rating: number;
  reviewerName: string;
  comment: string;
}): Promise<{ success: boolean; review: FarmerReview; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    const isJson = (response.headers.get('content-type') || '').includes('application/json');
    const resJson = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && resJson?.success && resJson?.review) {
      addStoredReview(resJson.review);
      return resJson;
    }

    if (response.status === 404 || response.status === 502 || !isJson) {
      const created = addStoredReview(data);
      return {
        success: true,
        review: created,
        message: 'Review and rating submitted successfully!',
      };
    }

    const err = getSafeErrorMessage(resJson, 'Failed to submit review');
    throw new Error(err);
  } catch (err: unknown) {
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('network'))) {
      const created = addStoredReview(data);
      return {
        success: true,
        review: created,
        message: 'Review and rating saved locally!',
      };
    }
    const safeMsg = getSafeErrorMessage(err, 'Failed to submit review');
    throw new Error(safeMsg);
  }
}

/**
 * Delete a farmer review (Admin moderation).
 */
export async function deleteReview(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/reviews/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    deleteStoredReview(id);
    return { success: true, message: 'Review deleted successfully' };
  } catch {
    deleteStoredReview(id);
    return { success: true, message: 'Review deleted from local storage' };
  }
}

/**
 * Fetch farmer reports (Admin).
 */
export async function fetchReports(): Promise<FarmerReport[]> {
  try {
    const response = await fetch(`${API_BASE}/reports`, {
      headers: { Accept: 'application/json' },
    });
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn('Could not fetch reports from server, falling back to local storage:', err);
  }
  return getStoredReports();
}

/**
 * Submit a report against a farmer.
 */
export async function submitReport(data: {
  farmerPhone: string;
  farmerName: string;
  reportedBy: string;
  reporterPhone?: string;
  reason: string;
  details: string;
}): Promise<{ success: boolean; report: FarmerReport; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    const isJson = (response.headers.get('content-type') || '').includes('application/json');
    const resJson = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && resJson?.success && resJson?.report) {
      addStoredReport(resJson.report);
      return resJson;
    }

    if (response.status === 404 || response.status === 502 || !isJson) {
      const created = addStoredReport(data);
      return {
        success: true,
        report: created,
        message: 'Report submitted successfully to the administrator!',
      };
    }

    const err = getSafeErrorMessage(resJson, 'Failed to submit report');
    throw new Error(err);
  } catch (err: unknown) {
    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('network'))) {
      const created = addStoredReport(data);
      return {
        success: true,
        report: created,
        message: 'Report submitted and saved locally!',
      };
    }
    const safeMsg = getSafeErrorMessage(err, 'Failed to submit report');
    throw new Error(safeMsg);
  }
}

/**
 * Update report status (e.g. mark resolved or dismissed).
 */
export async function updateReportStatus(
  id: string,
  status: 'pending' | 'resolved' | 'dismissed'
): Promise<{ success: boolean; report?: FarmerReport }> {
  try {
    const response = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const isJson = (response.headers.get('content-type') || '').includes('application/json');
    const resJson = isJson ? await response.json().catch(() => null) : null;

    if (response.ok && resJson?.success) {
      updateStoredReportStatus(id, status);
      return resJson;
    }
    updateStoredReportStatus(id, status);
    return { success: true };
  } catch {
    updateStoredReportStatus(id, status);
    return { success: true };
  }
}

/**
 * Delete / dismiss report permanently.
 */
export async function deleteReport(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/reports/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    deleteStoredReport(id);
    return { success: true, message: 'Report dismissed' };
  } catch {
    deleteStoredReport(id);
    return { success: true, message: 'Report dismissed locally' };
  }
}
