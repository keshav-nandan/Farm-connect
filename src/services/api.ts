import { Product, Farmer, MarketplaceStats, FilterState, ProductFile } from '../types';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredFarmers,
  saveStoredFarmers,
  calculateLocalStats,
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
