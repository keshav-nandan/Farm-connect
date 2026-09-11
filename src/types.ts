export interface ProductFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document' | 'other';
  mimeType: string;
  size: number;
  dataUrl: string;
  uploadedAt: string;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  details: string;
  documents?: ProductFile[];
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
  harvestingDate: string; // Mandatory date of harvesting
  files?: ProductFile[];
  createdAt: string;
}

export interface FarmerReview {
  id: string;
  farmerPhone: string;
  farmerName: string;
  rating: number; // 1 - 5 stars
  reviewerName: string;
  comment: string;
  createdAt: string;
}

export interface FarmerReport {
  id: string;
  farmerPhone: string;
  farmerName: string;
  reportedBy: string;
  reporterPhone?: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface MarketplaceStats {
  farmersConnected: number;
  productsListed: number;
  directConnections: number;
  totalQuantityKg: number;
  activeLocationsCount: number;
}

export type PageView = 'home' | 'products' | 'sell' | 'register' | 'about' | 'admin';

export interface FilterState {
  searchQuery: string;
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}

export interface LoginLog {
  id: string;
  username: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  status: 'success' | 'failed';
}

export interface RegularSeller {
  farmerName: string;
  phone: string;
  location: string;
  listingsCount: number;
  totalQuantityKg: number;
  totalValue: number;
  categories: string[];
  crops: string[];
  firstListedAt: string;
  lastListedAt: string;
  tier: 'Top Regular' | 'Active Cultivator' | 'Occasional Seller';
}

export interface AdminAnalytics {
  totalLogins: number;
  loginHistory: LoginLog[];
  totalVisitors: number;
  regularSellers: RegularSeller[];
}
