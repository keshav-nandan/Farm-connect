import { Product, Farmer, MarketplaceStats, LoginLog, RegularSeller, AdminAnalytics, FarmerReview, FarmerReport } from '../types';

export const INITIAL_FALLBACK_FARMERS: Farmer[] = [
  {
    id: 'farmer-1',
    name: 'Raj Kumar',
    phone: '9876543210',
    location: 'Ranchi',
    details: 'Organic vegetable grower with 6 acres of farm land near Ormanjhi, Ranchi.',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'farmer-2',
    name: 'Suresh Kumar',
    phone: '9431122334',
    location: 'Dhanbad',
    details: 'Specializes in high yield potato and winter tubers with natural farming methods.',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'farmer-3',
    name: 'Amit Kumar',
    phone: '9835012345',
    location: 'Patna',
    details: 'Produces premium Basmati and Sona Masoori paddy along the fertile Ganga basin.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'farmer-4',
    name: 'Ravi Kumar',
    phone: '9123456780',
    location: 'Gaya',
    details: 'Wheat and pulse cultivator practicing eco-friendly water harvesting techniques.',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'farmer-5',
    name: 'Manoj Kumar',
    phone: '9708123456',
    location: 'Bhagalpur',
    details: 'Cultivator of red onions and garlic, supplying freshly harvested produce directly.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'farmer-6',
    name: 'Rakesh Kumar',
    phone: '9470123456',
    location: 'Muzaffarpur',
    details: 'Maize and grain producer with automated cleaning and dry sorting facilities.',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const INITIAL_FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    farmerName: 'Raj Kumar',
    phone: '9876543210',
    productName: 'Tomato',
    category: 'Vegetables',
    quantity: 100,
    price: 30,
    location: 'Ranchi',
    description: 'Farm-fresh ripe red desi tomatoes harvested this morning. Firm, juicy, and chemical-free.',
    harvestingDate: '2026-09-10',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: 'prod-2',
    farmerName: 'Suresh Kumar',
    phone: '9431122334',
    productName: 'Potato',
    category: 'Vegetables',
    quantity: 200,
    price: 25,
    location: 'Amarpur(Banka)',
    description: 'Freshly dug medium-large Jyoti potatoes. Clean skin, excellent shelf life, perfect for wholesale or retail.',
    harvestingDate: '2026-09-09',
    createdAt: new Date(Date.now() - 40 * 3600000).toISOString(),
  },
  {
    id: 'prod-3',
    farmerName: 'Amit Kumar',
    phone: '9835012345',
    productName: 'Rice',
    category: 'Grains & Cereals',
    quantity: 500,
    price: 45,
    location: 'Patna',
    description: 'Aromatic Sonam paddy rice freshly polished and destoned. Moisture-controlled packaging.',
    harvestingDate: '2026-09-08',
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
  {
    id: 'prod-4',
    farmerName: 'Ravi Kumar',
    phone: '9123456780',
    productName: 'Wheat',
    category: 'Grains & Cereals',
    quantity: 300,
    price: 32,
    location: 'Lakrikola',
    description: 'Sharbati golden grain wheat. Sun-dried, machine-cleaned, high protein content for soft chapatis.',
    harvestingDate: '2026-09-07',
    createdAt: new Date(Date.now() - 30 * 3600000).toISOString(),
  },
  {
    id: 'prod-5',
    farmerName: 'Manoj Kumar',
    phone: '9708123456',
    productName: 'Onion',
    category: 'Vegetables',
    quantity: 150,
    price: 28,
    location: 'Bhagalpur',
    description: 'Crisp medium red onions with tight outer skin. Dried thoroughly to prevent sprouting.',
    harvestingDate: '2026-09-08',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'prod-6',
    farmerName: 'Rakesh Kumar',
    phone: '9470123456',
    productName: 'Maize',
    category: 'Grains & Cereals',
    quantity: 250,
    price: 24,
    location: 'Muzaffarpur',
    description: 'Yellow dent corn maize for animal feed or industrial processing. Low moisture, 100% clean grains.',
    harvestingDate: '2026-09-09',
    createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
  {
    id: 'prod-7',
    farmerName: 'Pooja Devi',
    phone: '9934112244',
    productName: 'Carrot',
    category: 'Vegetables',
    quantity: 120,
    price: 35,
    location: 'Hazaribagh',
    description: 'Sweet, tender red desi carrots washed in clean tubewell water. Crunchy and rich in nutrients.',
    harvestingDate: '2026-09-10',
    createdAt: new Date(Date.now() - 16 * 3600000).toISOString(),
  },
  {
    id: 'prod-8',
    farmerName: 'Sunil Mahto',
    phone: '9430155667',
    productName: 'Cabbage',
    category: 'Vegetables',
    quantity: 180,
    price: 20,
    location: 'Bokaro',
    description: 'Compact, heavy green cabbages free of pesticide residue. Packed in ventilated gunny sacks.',
    harvestingDate: '2026-09-09',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: 'prod-9',
    farmerName: 'Anand Verma',
    phone: '9835778899',
    productName: 'Cauliflower',
    category: 'Vegetables',
    quantity: 140,
    price: 25,
    location: 'Deoghar',
    description: 'Snow-white tight curd cauliflowers with fresh outer green leaves intact for protection during transit.',
    harvestingDate: '2026-09-10',
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: 'prod-10',
    farmerName: 'Vikash Yadav',
    phone: '9771233445',
    productName: 'Brinjal',
    category: 'Vegetables',
    quantity: 90,
    price: 22,
    location: 'Giridih',
    description: 'Glossy dark purple oval brinjals (eggplant). Seedless, tender flesh, freshly picked today.',
    harvestingDate: '2026-09-11',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
];

export const INITIAL_FALLBACK_REVIEWS: FarmerReview[] = [
  {
    id: 'rev-1',
    farmerPhone: '9876543210',
    farmerName: 'Raj Kumar',
    rating: 5,
    reviewerName: 'Sunita Sharma',
    comment: 'Super fresh Desi tomatoes! Directly delivered in good wooden crates. Excellent farmer to deal with.',
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
  {
    id: 'rev-2',
    farmerPhone: '9876543210',
    farmerName: 'Raj Kumar',
    rating: 5,
    reviewerName: 'Deepak Verma',
    comment: 'Consistent quality and fair wholesale rate. Very polite and prompt on phone.',
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
  {
    id: 'rev-3',
    farmerPhone: '9431122334',
    farmerName: 'Suresh Kumar',
    rating: 4,
    reviewerName: 'Mohit Agarwal',
    comment: 'Clean potatoes with minimal soil waste. Great price per quintal.',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'rev-4',
    farmerPhone: '9835012345',
    farmerName: 'Amit Kumar',
    rating: 5,
    reviewerName: 'Ramesh Singh',
    comment: 'Paddy grain moisture was exactly within limits. Highly reliable seller in Patna area.',
    createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
];

export const INITIAL_FALLBACK_REPORTS: FarmerReport[] = [
  {
    id: 'rep-1',
    farmerPhone: '9708123456',
    farmerName: 'Manoj Kumar',
    reportedBy: 'Kunal Kishore',
    reporterPhone: '9811223344',
    reason: 'Price Mismatch on Call',
    details: 'Seller listed onions at ₹28/kg on portal but demanded ₹34/kg when reached via phone call.',
    status: 'pending',
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
];

const STORAGE_KEYS = {
  PRODUCTS: 'farmconnect_local_products',
  FARMERS: 'farmconnect_local_farmers',
  LOGINS: 'farmconnect_local_logins',
  VISITOR_COUNT: 'farmconnect_local_visitor_count',
  REVIEWS: 'farmconnect_local_reviews',
  REPORTS: 'farmconnect_local_reports',
};

// Safe local storage helpers for static hosting environments like Vercel
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p: Product) => ({
          ...p,
          harvestingDate: p.harvestingDate || '2026-09-08',
        }));
      }
    }
  } catch (e) {
    console.warn('Could not read products from localStorage:', e);
  }
  return INITIAL_FALLBACK_PRODUCTS;
}

export function getStoredReviews(): FarmerReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not read reviews from localStorage:', e);
  }
  return INITIAL_FALLBACK_REVIEWS;
}

export function saveStoredReviews(reviews: FarmerReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.warn('Could not save reviews to localStorage:', e);
  }
}

export function addStoredReview(review: Omit<FarmerReview, 'id' | 'createdAt'>): FarmerReview {
  const current = getStoredReviews();
  const newReview: FarmerReview = {
    ...review,
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  saveStoredReviews([newReview, ...current]);
  return newReview;
}

export function deleteStoredReview(id: string): void {
  const current = getStoredReviews();
  const updated = current.filter((r) => r.id !== id);
  saveStoredReviews(updated);
}

export function getStoredReports(): FarmerReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not read reports from localStorage:', e);
  }
  return INITIAL_FALLBACK_REPORTS;
}

export function saveStoredReports(reports: FarmerReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.warn('Could not save reports to localStorage:', e);
  }
}

export function addStoredReport(report: Omit<FarmerReport, 'id' | 'createdAt' | 'status'>): FarmerReport {
  const current = getStoredReports();
  const newReport: FarmerReport = {
    ...report,
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  saveStoredReports([newReport, ...current]);
  return newReport;
}

export function updateStoredReportStatus(id: string, status: 'pending' | 'resolved' | 'dismissed'): void {
  const current = getStoredReports();
  const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
  saveStoredReports(updated);
}

export function deleteStoredReport(id: string): void {
  const current = getStoredReports();
  const updated = current.filter((r) => r.id !== id);
  saveStoredReports(updated);
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.warn('Could not save products to localStorage:', e);
  }
}

export function getStoredFarmers(): Farmer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FARMERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read farmers from localStorage:', e);
  }
  return INITIAL_FALLBACK_FARMERS;
}

export function saveStoredFarmers(farmers: Farmer[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FARMERS, JSON.stringify(farmers));
  } catch (e) {
    console.warn('Could not save farmers to localStorage:', e);
  }
}

export function getStoredLogins(): LoginLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGINS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [
    {
      id: 'log-default-1',
      username: 'admin',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      userAgent: 'Chrome on Windows 11',
      status: 'success',
    },
    {
      id: 'log-default-2',
      username: 'admin',
      timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      userAgent: 'Mobile Safari on iPhone',
      status: 'success',
    },
  ];
}

export function saveStoredLogins(logins: LoginLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGINS, JSON.stringify(logins));
  } catch {
    // ignore
  }
}

export function recordLocalLogin(status: 'success' | 'failed', username = 'admin'): LoginLog {
  const current = getStoredLogins();
  const newLog: LoginLog = {
    id: `log-${Date.now()}`,
    username,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent || 'Web Browser',
    status,
  };
  const updated = [newLog, ...current];
  saveStoredLogins(updated);

  // Increment visitor count
  try {
    const prev = parseInt(localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT) || '154', 10);
    localStorage.setItem(STORAGE_KEYS.VISITOR_COUNT, String(prev + 1));
  } catch {
    // ignore
  }

  return newLog;
}

export function calculateLocalRegularSellers(): RegularSeller[] {
  const products = getStoredProducts();
  const farmers = getStoredFarmers();

  const sellerMap = new Map<string, {
    farmerName: string;
    phone: string;
    location: string;
    listings: Product[];
  }>();

  products.forEach((p) => {
    const key = p.phone.replace(/\D/g, '') || p.farmerName.toLowerCase().trim();
    if (!sellerMap.has(key)) {
      sellerMap.set(key, {
        farmerName: p.farmerName,
        phone: p.phone,
        location: p.location,
        listings: [],
      });
    }
    sellerMap.get(key)!.listings.push(p);
  });

  farmers.forEach((f) => {
    const key = f.phone.replace(/\D/g, '') || f.name.toLowerCase().trim();
    if (!sellerMap.has(key)) {
      sellerMap.set(key, {
        farmerName: f.name,
        phone: f.phone,
        location: f.location,
        listings: [],
      });
    }
  });

  const sellers: RegularSeller[] = [];

  sellerMap.forEach((val) => {
    const count = val.listings.length;
    const totalQty = val.listings.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    const totalVal = val.listings.reduce((acc, curr) => acc + (Number(curr.quantity) * Number(curr.price) || 0), 0);
    const categories = Array.from(new Set(val.listings.map((l) => l.category)));
    const crops = Array.from(new Set(val.listings.map((l) => l.productName)));

    let firstDate = new Date().toISOString();
    let lastDate = new Date(0).toISOString();
    if (val.listings.length > 0) {
      val.listings.forEach((l) => {
        if (l.createdAt < firstDate) firstDate = l.createdAt;
        if (l.createdAt > lastDate) lastDate = l.createdAt;
      });
    }

    let tier: 'Top Regular' | 'Active Cultivator' | 'Occasional Seller' = 'Occasional Seller';
    if (count >= 3 || totalQty >= 400) {
      tier = 'Top Regular';
    } else if (count >= 2 || totalQty >= 150) {
      tier = 'Active Cultivator';
    }

    sellers.push({
      farmerName: val.farmerName,
      phone: val.phone,
      location: val.location,
      listingsCount: count,
      totalQuantityKg: totalQty,
      totalValue: totalVal,
      categories,
      crops,
      firstListedAt: firstDate,
      lastListedAt: lastDate,
      tier,
    });
  });

  return sellers.sort((a, b) => b.listingsCount - a.listingsCount || b.totalQuantityKg - a.totalQuantityKg);
}

export function updateLocalProduct(id: string, updates: Partial<Product>): Product {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  const updated = { ...products[index], ...updates };
  products[index] = updated;
  saveStoredProducts(products);
  return updated;
}

export function deleteLocalProduct(id: string): boolean {
  const products = getStoredProducts();
  const filtered = products.filter((p) => p.id !== id);
  saveStoredProducts(filtered);
  return filtered.length < products.length;
}

export function deleteLocalFarmer(id: string, deleteProducts = false): { deleted: boolean; removedCount: number } {
  const farmers = getStoredFarmers();
  const target = farmers.find((f) => f.id === id);
  if (!target) return { deleted: false, removedCount: 0 };

  const filteredFarmers = farmers.filter((f) => f.id !== id);
  saveStoredFarmers(filteredFarmers);

  let removedCount = 0;
  if (deleteProducts) {
    const products = getStoredProducts();
    const cleanedPhone = target.phone.replace(/\D/g, '');
    const remainingProducts = products.filter(
      (p) => p.phone.replace(/\D/g, '') !== cleanedPhone && p.farmerName.toLowerCase().trim() !== target.name.toLowerCase().trim()
    );
    removedCount = products.length - remainingProducts.length;
    saveStoredProducts(remainingProducts);
  }

  return { deleted: true, removedCount };
}

export function calculateLocalAdminAnalytics(): AdminAnalytics {
  const logins = getStoredLogins();
  const regularSellers = calculateLocalRegularSellers();
  let visitors = 154;
  try {
    visitors = parseInt(localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT) || '154', 10);
  } catch {
    // ignore
  }

  return {
    totalLogins: logins.length,
    loginHistory: logins,
    totalVisitors: visitors,
    regularSellers,
  };
}

export function calculateLocalStats(): MarketplaceStats {
  const products = getStoredProducts();
  const farmers = getStoredFarmers();

  const totalQuantity = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
  const locations = new Set(products.map((p) => p.location.trim().toLowerCase()));

  return {
    farmersConnected: Math.max(farmers.length, 15),
    productsListed: products.length,
    directConnections: 320 + products.length * 3,
    totalQuantityKg: totalQuantity,
    activeLocationsCount: locations.size,
  };
}
