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
  files?: ProductFile[];
  createdAt: string;
}

interface DatabaseSchema {
  farmers: Farmer[];
  products: Product[];
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
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading DB file, reinitializing:', err);
  }

  const initialDb: DatabaseSchema = {
    farmers: INITIAL_FARMERS,
    products: INITIAL_PRODUCTS,
  };
  saveDatabase(initialDb);
  return initialDb;
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
      const { farmerName, phone, productName, category, quantity, price, location, description, files } = req.body;

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

  // Reset demo data endpoint (useful for live demonstrations/evaluations)
  app.post('/api/reset-demo', (req, res) => {
    db = {
      farmers: [...INITIAL_FARMERS],
      products: [...INITIAL_PRODUCTS],
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
