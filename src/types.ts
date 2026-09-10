export interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  details: string;
  createdAt: string;
}

export interface Product {
  id: string;
  farmerName: string;
  phone: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  location: string;
  description: string;
  createdAt: string;
}

export interface MarketplaceStats {
  farmersConnected: number;
  productsListed: number;
  directConnections: number;
  totalQuantityKg: number;
  activeLocationsCount: number;
}

export type PageView = 'home' | 'products' | 'sell' | 'register' | 'about';

export interface FilterState {
  searchQuery: string;
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}
