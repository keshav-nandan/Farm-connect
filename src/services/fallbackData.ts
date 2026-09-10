import { Product, Farmer, MarketplaceStats } from '../types';

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
    location: 'Dhanbad',
    description: 'Freshly dug medium-large Jyoti potatoes. Clean skin, excellent shelf life, perfect for wholesale or retail.',
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
    location: 'Gaya',
    description: 'Sharbati golden grain wheat. Sun-dried, machine-cleaned, high protein content for soft chapatis.',
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
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
];

const STORAGE_KEYS = {
  PRODUCTS: 'farmconnect_local_products',
  FARMERS: 'farmconnect_local_farmers',
};

// Safe local storage helpers for static hosting environments like Vercel
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read products from localStorage:', e);
  }
  return INITIAL_FALLBACK_PRODUCTS;
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
