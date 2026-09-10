import { Product, Farmer, MarketplaceStats, FilterState } from '../types';

export const API_BASE = '/api';

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

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to fetch products' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function createProduct(data: {
  farmerName: string;
  phone: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  location: string;
  description: string;
}): Promise<{ success: boolean; product: Product; message: string }> {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const resJson = await response.json().catch(() => ({ error: 'Failed to parse response' }));

  if (!response.ok) {
    throw new Error(resJson.error || 'Failed to list product in shared database');
  }

  return resJson;
}

export async function fetchFarmers(): Promise<Farmer[]> {
  const response = await fetch(`${API_BASE}/farmers`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function registerFarmer(data: {
  name: string;
  phone: string;
  location: string;
  details?: string;
}): Promise<{ success: boolean; farmer: Farmer; message: string }> {
  const response = await fetch(`${API_BASE}/farmers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const resJson = await response.json().catch(() => ({ error: 'Failed to register farmer' }));

  if (!response.ok) {
    throw new Error(resJson.error || 'Failed to register farmer in shared database');
  }

  return resJson;
}

export async function fetchStats(): Promise<MarketplaceStats> {
  const response = await fetch(`${API_BASE}/stats`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    // Return sensible fallback
    return {
      farmersConnected: 18,
      productsListed: 10,
      directConnections: 320,
      totalQuantityKg: 1930,
      activeLocationsCount: 10,
    };
  }

  return response.json();
}

export async function resetDemoData(): Promise<void> {
  await fetch(`${API_BASE}/reset-demo`, {
    method: 'POST',
  });
}
