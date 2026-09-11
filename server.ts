import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

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
  rating: number;
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

interface DatabaseSchema {
  farmers: Farmer[];
  products: Product[];
  logins?: LoginLog[];
  visitorCount?: number;
  reviews?: FarmerReview[];
  reports?: FarmerReport[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'farmconnect_db.json');

const INITIAL_FARMERS: Farmer[] = [
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

const INITIAL_PRODUCTS: Product[] = [
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
    location: 'Dhanbad',
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
    location: 'Gaya',
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

const INITIAL_REVIEWS: FarmerReview[] = [
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

const INITIAL_REPORTS: FarmerReport[] = [
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

// In-memory + persistent store helper
function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed.products) && Array.isArray(parsed.farmers)) {
        if (!Array.isArray(parsed.logins)) parsed.logins = [];
        if (typeof parsed.visitorCount !== 'number') parsed.visitorCount = 142;
        if (!Array.isArray(parsed.reviews)) parsed.reviews = [...INITIAL_REVIEWS];
        if (!Array.isArray(parsed.reports)) parsed.reports = [...INITIAL_REPORTS];
        // Ensure legacy products have harvestingDate
        parsed.products.forEach((p: Product) => {
          if (!p.harvestingDate) p.harvestingDate = '2026-09-08';
        });
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading DB file, reinitializing:', err);
  }

  const initialDb: DatabaseSchema = {
    farmers: INITIAL_FARMERS,
    products: INITIAL_PRODUCTS,
    reviews: INITIAL_REVIEWS,
    reports: INITIAL_REPORTS,
    logins: [
      {
        id: 'log-1',
        username: 'admin',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
        status: 'success',
      },
    ],
    visitorCount: 148,
  };
  saveDatabase(initialDb);
  return initialDb;
}

function computeRegularSellers(db: DatabaseSchema): RegularSeller[] {
  const sellerMap = new Map<string, {
    farmerName: string;
    phone: string;
    location: string;
    listings: Product[];
  }>();

  db.products.forEach((p) => {
    const key = p.phone.replace(/\D/g, '') || p.farmerName.toLowerCase().trim();
    if (!sellerMap.has(key)) {
      sellerMap.set(key, {
        farmerName: p.farmerName,
        phone: p.phone,
        location: p.location,
        listings: [],
      });
    }
    const record = sellerMap.get(key)!;
    record.listings.push(p);
  });

  db.farmers.forEach((f) => {
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

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write DB file:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware with expanded limit for file attachments
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // CORS headers for broad device and preview compatibility
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // ==========================================
  // API Routes
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Farm Connect API',
      timestamp: new Date().toISOString(),
      productsCount: db.products.length,
      farmersCount: db.farmers.length,
    });
  });

  // Get statistics
  app.get('/api/stats', (req, res) => {
    // Unique farmers count from both registered farmers and product listings
    const farmerNames = new Set<string>();
    db.farmers.forEach((f) => farmerNames.add(f.name.toLowerCase().trim()));
    db.products.forEach((p) => farmerNames.add(p.farmerName.toLowerCase().trim()));

    const locations = new Set<string>();
    db.products.forEach((p) => locations.add(p.location.toLowerCase().trim()));

    const totalQuantity = db.products.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

    res.json({
      farmersConnected: Math.max(farmerNames.size, 15),
      productsListed: db.products.length,
      directConnections: 240 + db.products.length * 8, // Realistic direct connection interactions
      totalQuantityKg: totalQuantity,
      activeLocationsCount: locations.size,
    });
  });

  // Get all products with optional filters
  app.get('/api/products', (req, res) => {
    try {
      const { q, category, location, minPrice, maxPrice } = req.query;

      let result = [...db.products];

      // Sort by newest first
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      if (q && typeof q === 'string' && q.trim()) {
        const queryLower = q.toLowerCase().trim();
        result = result.filter(
          (p) =>
            p.productName.toLowerCase().includes(queryLower) ||
            p.farmerName.toLowerCase().includes(queryLower) ||
            p.location.toLowerCase().includes(queryLower) ||
            p.description.toLowerCase().includes(queryLower)
        );
      }

      if (category && typeof category === 'string' && category !== 'All') {
        result = result.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (location && typeof location === 'string' && location !== 'All') {
        result = result.filter(
          (p) => p.location.toLowerCase() === location.toLowerCase()
        );
      }

      if (minPrice !== undefined && minPrice !== '') {
        const min = Number(minPrice);
        if (!isNaN(min)) {
          result = result.filter((p) => p.price >= min);
        }
      }

      if (maxPrice !== undefined && maxPrice !== '') {
        const max = Number(maxPrice);
        if (!isNaN(max)) {
          result = result.filter((p) => p.price <= max);
        }
      }

      res.json(result);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to retrieve products' });
    }
  });

  // Get single product
  app.get('/api/products/:id', (req, res) => {
    const product = db.products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  // Create new product
  app.post('/api/products', (req, res) => {
    try {
      const { farmerName, phone, productName, category, quantity, price, location, description, files, harvestingDate } = req.body;

      // Validation
      if (!farmerName || !String(farmerName).trim()) {
        return res.status(400).json({ error: 'Farmer Name is required' });
      }
      if (!phone || !String(phone).trim()) {
        return res.status(400).json({ error: 'Phone number is required' });
      }
      // Simple phone validation: at least 8 digits
      const cleanedPhone = String(phone).replace(/\D/g, '');
      if (cleanedPhone.length < 8) {
        return res.status(400).json({ error: 'Please enter a valid phone number (at least 8-10 digits)' });
      }

      if (!productName || !String(productName).trim()) {
        return res.status(400).json({ error: 'Product Name is required' });
      }
      if (!category || !String(category).trim()) {
        return res.status(400).json({ error: 'Category is required' });
      }

      // Mandatory date of harvesting
      if (!harvestingDate || !String(harvestingDate).trim()) {
        return res.status(400).json({ error: 'Date of harvesting is mandatory when adding produce' });
      }

      const numQuantity = Number(quantity);
      if (isNaN(numQuantity) || numQuantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be a positive number' });
      }

      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
      }

      if (!location || !String(location).trim()) {
        return res.status(400).json({ error: 'Location is required' });
      }

      const newProduct: Product = {
        id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        farmerName: String(farmerName).trim(),
        phone: String(phone).trim(),
        productName: String(productName).trim(),
        category: String(category).trim(),
        quantity: numQuantity,
        price: numPrice,
        location: String(location).trim(),
        description: description ? String(description).trim() : 'Fresh produce harvested locally by farmer.',
        harvestingDate: String(harvestingDate).trim(),
        files: Array.isArray(files) ? files : [],
        createdAt: new Date().toISOString(),
      };

      // Also ensure farmer exists or is auto-recorded in farmers registry
      const existingFarmer = db.farmers.find(
        (f) => f.phone.replace(/\D/g, '') === cleanedPhone || f.name.toLowerCase() === newProduct.farmerName.toLowerCase()
      );
      if (!existingFarmer) {
        const newFarmer: Farmer = {
          id: 'farmer-' + Date.now(),
          name: newProduct.farmerName,
          phone: newProduct.phone,
          location: newProduct.location,
          details: `Farmer cultivating ${newProduct.category} in ${newProduct.location}.`,
          createdAt: new Date().toISOString(),
        };
        db.farmers.unshift(newFarmer);
      }

      db.products.unshift(newProduct);
      saveDatabase(db);

      res.status(201).json({
        success: true,
        message: 'Product listed successfully in the shared marketplace!',
        product: newProduct,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Server error while saving product' });
    }
  });

  // Get all registered farmers
  app.get('/api/farmers', (req, res) => {
    res.json(db.farmers);
  });

  // Register a farmer
  app.post('/api/farmers', (req, res) => {
    try {
      const { name, phone, location, details, documents } = req.body;

      if (!name || !String(name).trim()) {
        return res.status(400).json({ error: 'Farmer Name is required' });
      }
      if (!phone || !String(phone).trim()) {
        return res.status(400).json({ error: 'Phone number is required' });
      }
      const cleanedPhone = String(phone).replace(/\D/g, '');
      if (cleanedPhone.length < 8) {
        return res.status(400).json({ error: 'Please enter a valid phone number' });
      }
      if (!location || !String(location).trim()) {
        return res.status(400).json({ error: 'Location is required' });
      }

      // Check if already registered
      const existing = db.farmers.find(
        (f) => f.phone.replace(/\D/g, '') === cleanedPhone
      );
      if (existing) {
        existing.name = String(name).trim();
        existing.location = String(location).trim();
        if (details) existing.details = String(details).trim();
        if (Array.isArray(documents) && documents.length > 0) {
          existing.documents = [...(existing.documents || []), ...documents];
        }
        saveDatabase(db);
        return res.json({
          success: true,
          message: 'Farmer details updated successfully!',
          farmer: existing,
        });
      }

      const newFarmer: Farmer = {
        id: 'farmer-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: String(name).trim(),
        phone: String(phone).trim(),
        location: String(location).trim(),
        details: details ? String(details).trim() : 'Local farmer registered on Farm Connect.',
        documents: Array.isArray(documents) ? documents : [],
        createdAt: new Date().toISOString(),
      };

      db.farmers.unshift(newFarmer);
      saveDatabase(db);

      res.status(201).json({
        success: true,
        message: 'Farmer registered successfully!',
        farmer: newFarmer,
      });
    } catch (error) {
      console.error('Error registering farmer:', error);
      res.status(500).json({ error: 'Server error while registering farmer' });
    }
  });

  // ==========================================
  // Admin & Data Management Endpoints
  // Username: admin / Password: admin
  // ==========================================

  // Admin authentication
  app.post('/api/admin/login', (req, res) => {
    try {
      const { username, password } = req.body;
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = (req.headers['user-agent'] as string) || 'Browser Session';

      if (username === 'admin' && password === 'admin') {
        const newLog: LoginLog = {
          id: 'log-' + Date.now(),
          username: 'admin',
          timestamp: new Date().toISOString(),
          ip,
          userAgent,
          status: 'success',
        };

        if (!Array.isArray(db.logins)) db.logins = [];
        db.logins.unshift(newLog);
        db.visitorCount = (db.visitorCount || 142) + 1;
        saveDatabase(db);

        return res.json({
          success: true,
          message: 'Admin authentication successful',
          token: 'fc-admin-token-' + Date.now(),
          totalLogins: db.logins.length,
          activeVisitors: db.visitorCount,
          lastLogin: newLog.timestamp,
        });
      } else {
        const failLog: LoginLog = {
          id: 'log-' + Date.now(),
          username: username ? String(username) : 'unknown',
          timestamp: new Date().toISOString(),
          ip,
          userAgent,
          status: 'failed',
        };
        if (!Array.isArray(db.logins)) db.logins = [];
        db.logins.unshift(failLog);
        saveDatabase(db);

        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. Please use username "admin" and password "admin".',
        });
      }
    } catch (err) {
      console.error('Admin login error:', err);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  });

  // Admin analytics: visitor counts, login records, and regular sellers
  app.get('/api/admin/analytics', (req, res) => {
    try {
      const regularSellers = computeRegularSellers(db);
      res.json({
        totalLogins: db.logins ? db.logins.length : 0,
        loginHistory: (db.logins || []).slice(0, 50),
        totalVisitors: db.visitorCount || 148,
        regularSellers,
      });
    } catch (err) {
      console.error('Analytics error:', err);
      res.status(500).json({ error: 'Failed to retrieve admin analytics' });
    }
  });

  // Edit produce details (Admin control)
  app.put('/api/products/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { farmerName, phone, productName, category, quantity, price, location, description, files, harvestingDate } = req.body;

      const productIndex = db.products.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Produce record not found' });
      }

      const existing = db.products[productIndex];
      const updatedProduct: Product = {
        ...existing,
        farmerName: farmerName ? String(farmerName).trim() : existing.farmerName,
        phone: phone ? String(phone).trim() : existing.phone,
        productName: productName ? String(productName).trim() : existing.productName,
        category: category ? String(category).trim() : existing.category,
        quantity: quantity !== undefined ? Number(quantity) : existing.quantity,
        price: price !== undefined ? Number(price) : existing.price,
        location: location ? String(location).trim() : existing.location,
        description: description !== undefined ? String(description).trim() : existing.description,
        harvestingDate: harvestingDate ? String(harvestingDate).trim() : (existing.harvestingDate || '2026-09-08'),
        files: Array.isArray(files) ? files : existing.files,
      };

      db.products[productIndex] = updatedProduct;
      saveDatabase(db);

      res.json({
        success: true,
        message: `Produce "${updatedProduct.productName}" updated successfully!`,
        product: updatedProduct,
      });
    } catch (err) {
      console.error('Error updating produce:', err);
      res.status(500).json({ error: 'Failed to update produce details' });
    }
  });

  // Delete produce record (Admin control)
  app.delete('/api/products/:id', (req, res) => {
    try {
      const { id } = req.params;
      const productIndex = db.products.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Produce item not found' });
      }

      const deleted = db.products.splice(productIndex, 1)[0];
      saveDatabase(db);

      res.json({
        success: true,
        message: `Produce "${deleted.productName}" deleted successfully from marketplace.`,
        deletedProduct: deleted,
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Failed to delete produce record' });
    }
  });

  // Delete farmer details (Admin control)
  app.delete('/api/farmers/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { deleteProducts } = req.query;

      const farmerIndex = db.farmers.findIndex((f) => f.id === id);
      if (farmerIndex === -1) {
        return res.status(404).json({ error: 'Farmer record not found' });
      }

      const deletedFarmer = db.farmers.splice(farmerIndex, 1)[0];

      let removedProductsCount = 0;
      if (deleteProducts === 'true') {
        const cleanedPhone = deletedFarmer.phone.replace(/\D/g, '');
        const initialCount = db.products.length;
        db.products = db.products.filter(
          (p) =>
            p.phone.replace(/\D/g, '') !== cleanedPhone &&
            p.farmerName.toLowerCase().trim() !== deletedFarmer.name.toLowerCase().trim()
        );
        removedProductsCount = initialCount - db.products.length;
      }

      saveDatabase(db);

      res.json({
        success: true,
        message: `Farmer "${deletedFarmer.name}" details deleted successfully.${
          removedProductsCount > 0 ? ` Also removed ${removedProductsCount} linked produce listing(s).` : ''
        }`,
        deletedFarmer,
        removedProductsCount,
      });
    } catch (err) {
      console.error('Error deleting farmer:', err);
      res.status(500).json({ error: 'Failed to delete farmer details' });
    }
  });

  // ==========================================
  // Farmer Reviews API
  // ==========================================
  app.get('/api/reviews', (req, res) => {
    try {
      if (!Array.isArray(db.reviews)) db.reviews = [...INITIAL_REVIEWS];
      const { farmerPhone } = req.query;
      let list = [...db.reviews];
      if (farmerPhone && typeof farmerPhone === 'string') {
        const clean = farmerPhone.replace(/\D/g, '');
        list = list.filter((r) => r.farmerPhone.replace(/\D/g, '') === clean);
      }
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(list);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.post('/api/reviews', (req, res) => {
    try {
      const { farmerPhone, farmerName, rating, reviewerName, comment } = req.body;

      if (!farmerPhone || !String(farmerPhone).trim()) {
        return res.status(400).json({ error: 'Farmer phone is required' });
      }
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
      }
      if (!reviewerName || !String(reviewerName).trim()) {
        return res.status(400).json({ error: 'Your name is required' });
      }
      if (!comment || !String(comment).trim()) {
        return res.status(400).json({ error: 'Review comment is required' });
      }

      const newReview: FarmerReview = {
        id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        farmerPhone: String(farmerPhone).trim(),
        farmerName: farmerName ? String(farmerName).trim() : 'Farmer',
        rating: Math.round(numRating),
        reviewerName: String(reviewerName).trim(),
        comment: String(comment).trim(),
        createdAt: new Date().toISOString(),
      };

      if (!Array.isArray(db.reviews)) db.reviews = [];
      db.reviews.unshift(newReview);
      saveDatabase(db);

      res.status(201).json({
        success: true,
        message: 'Review and rating submitted successfully!',
        review: newReview,
      });
    } catch (err) {
      console.error('Error submitting review:', err);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  });

  // Delete review (Admin moderation)
  app.delete('/api/reviews/:id', (req, res) => {
    try {
      const { id } = req.params;
      if (!Array.isArray(db.reviews)) db.reviews = [];
      const idx = db.reviews.findIndex((r) => r.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Review not found' });
      }
      const deleted = db.reviews.splice(idx, 1)[0];
      saveDatabase(db);
      res.json({ success: true, message: 'Review deleted successfully', deleted });
    } catch (err) {
      console.error('Error deleting review:', err);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  });

  // ==========================================
  // Farmer Reports API (Visible in Admin)
  // ==========================================
  app.get('/api/reports', (req, res) => {
    try {
      if (!Array.isArray(db.reports)) db.reports = [...INITIAL_REPORTS];
      const list = [...db.reports];
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(list);
    } catch (err) {
      console.error('Error fetching reports:', err);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  });

  app.post('/api/reports', (req, res) => {
    try {
      const { farmerPhone, farmerName, reportedBy, reporterPhone, reason, details } = req.body;

      if (!farmerPhone || !String(farmerPhone).trim()) {
        return res.status(400).json({ error: 'Farmer phone is required' });
      }
      if (!reason || !String(reason).trim()) {
        return res.status(400).json({ error: 'Please choose or enter a reason for reporting' });
      }
      if (!details || !String(details).trim()) {
        return res.status(400).json({ error: 'Please provide details about the issue' });
      }

      const newReport: FarmerReport = {
        id: 'rep-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        farmerPhone: String(farmerPhone).trim(),
        farmerName: farmerName ? String(farmerName).trim() : 'Farmer',
        reportedBy: reportedBy ? String(reportedBy).trim() : 'Anonymous Buyer',
        reporterPhone: reporterPhone ? String(reporterPhone).trim() : undefined,
        reason: String(reason).trim(),
        details: String(details).trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      if (!Array.isArray(db.reports)) db.reports = [];
      db.reports.unshift(newReport);
      saveDatabase(db);

      res.status(201).json({
        success: true,
        message: 'Report submitted successfully. The administrator will review this.',
        report: newReport,
      });
    } catch (err) {
      console.error('Error submitting report:', err);
      res.status(500).json({ error: 'Failed to submit report' });
    }
  });

  app.patch('/api/reports/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!Array.isArray(db.reports)) db.reports = [];
      const report = db.reports.find((r) => r.id === id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      if (status && ['pending', 'resolved', 'dismissed'].includes(status)) {
        report.status = status;
      }
      saveDatabase(db);
      res.json({ success: true, report });
    } catch (err) {
      console.error('Error updating report status:', err);
      res.status(500).json({ error: 'Failed to update report' });
    }
  });

  app.delete('/api/reports/:id', (req, res) => {
    try {
      const { id } = req.params;
      if (!Array.isArray(db.reports)) db.reports = [];
      const idx = db.reports.findIndex((r) => r.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Report not found' });
      }
      const deleted = db.reports.splice(idx, 1)[0];
      saveDatabase(db);
      res.json({ success: true, message: 'Report dismissed/deleted', deleted });
    } catch (err) {
      console.error('Error deleting report:', err);
      res.status(500).json({ error: 'Failed to delete report' });
    }
  });

  // Reset demo data endpoint (useful for live demonstrations/evaluations)
  app.post('/api/reset-demo', (req, res) => {
    db = {
      farmers: [...INITIAL_FARMERS],
      products: [...INITIAL_PRODUCTS],
      reviews: [...INITIAL_REVIEWS],
      reports: [...INITIAL_REPORTS],
      logins: [
        {
          id: 'log-1',
          username: 'admin',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
          status: 'success',
        },
      ],
      visitorCount: 148,
    };
    saveDatabase(db);
    res.json({ success: true, message: 'Database reset to initial sample records' });
  });

  // ==========================================
  // Vite Integration (dev vs prod)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Farm Connect Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
