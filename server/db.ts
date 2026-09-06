import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  previous_price?: number | null;
  discount?: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  phone: string;
  alternative_phone?: string;
  division: string;
  district: string;
  upazila: string;
  area?: string;
  address: string;
  delivery_note?: string;
  
  // Historical Snapshot
  product_id: string;
  product_name_snapshot: string;
  product_image_snapshot: string;
  selected_size?: string;
  selected_color?: string;
  quantity: number;
  product_price_snapshot: number;
  delivery_charge: number;
  total: number;
  payment_method: 'Cash on Delivery';
  status: OrderStatus;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  logo?: string;
  contact_number: string;
  email: string;
  store_address: string;
  social_facebook?: string;
  social_instagram?: string;
  social_youtube?: string;
  delivery_inside_dhaka: number;
  delivery_dhaka_suburbs: number;
  delivery_outside_dhaka: number;
  banner_title: string;
  banner_subtitle: string;
  banner_badge: string;
}

export interface AdminUserRecord {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at?: string;
}

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  categories: Category[];
  settings: StoreSettings;
  admin_users: AdminUserRecord[];
  next_order_number: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'shop_bd_bazar.json');

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialDatabase(): DatabaseSchema {
  // Hash Shakil9900 securely using bcrypt
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Shakil9900', salt);

  const initialProducts: Product[] = [
    {
      id: 'prod_1',
      name: 'Premium Embroidered Slim-Fit Cotton Panjabi',
      slug: 'premium-embroidered-cotton-panjabi',
      description: 'Handcrafted luxury slim-fit Panjabi tailored from 100% long-staple Egyptian cotton with intricate neckline embroidery and mother-of-pearl buttons. Ideal for Eid, weddings, and formal occasions in Bangladesh.',
      category: "Men's Fashion",
      price: 1850,
      previous_price: 2450,
      discount: 24,
      images: [
        'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['Midnight Black', 'Royal Navy', 'Off-White', 'Maroon'],
      stock: 45,
      status: 'Active',
      specifications: {
        'Fabric': '100% Combed Compact Cotton',
        'Collar': 'Mandarin Band Collar with Embroidery',
        'Cut': 'Modern Slim Fit',
        'Care': 'Dry Clean or Gentle Machine Wash',
        'Country of Origin': 'Bangladesh'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'prod_2',
      name: 'Executive Oxford Casual Formal Shirt',
      slug: 'executive-oxford-casual-formal-shirt',
      description: 'Timeless pinpoint Oxford cotton shirt designed for ultimate all-day comfort in tropical weather. Features reinforced French seams, button-down collar, and breathable weave.',
      category: "Men's Fashion",
      price: 1250,
      previous_price: 1650,
      discount: 24,
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Sky Blue', 'Pure White', 'Dusty Olive', 'Soft Pink'],
      stock: 60,
      status: 'Active',
      specifications: {
        'Fabric': '100% Breathable Oxford Cotton',
        'Pattern': 'Solid Micro-texture',
        'Sleeve': 'Full Sleeve with Adjustable Cuff',
        'Fit': 'Regular Fit'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'prod_3',
      name: 'Designer Silk Screen Jamdani Sharee with Blouse Piece',
      slug: 'designer-silk-screen-jamdani-sharee',
      description: 'Exclusive Dhakai traditional Jamdani motif designer sharee woven with fine art-silk threads. Features an ornate aanchol and comes with an unstitched matching blouse piece.',
      category: "Women's Fashion",
      price: 2950,
      previous_price: 3800,
      discount: 22,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['Free Size (12 Haat)'],
      colors: ['Emerald Green & Gold', 'Crimson Red', 'Royal Blue', 'Pastel Peach'],
      stock: 25,
      status: 'Active',
      specifications: {
        'Fabric': 'Premium Art Silk & Resham Thread',
        'Length': '6.3 Meters with Blouse Piece',
        'Occasion': 'Party, Festive, Wedding',
        'Weight': 'Lightweight and Soft Drape'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'prod_4',
      name: 'Genuine Full-Grain Leather Wallet & Reversible Belt Combo',
      slug: 'genuine-leather-wallet-reversible-belt-combo',
      description: 'Crafted from authentic Hazaribagh cowhide leather. Includes a bi-fold RFID-blocking wallet with 8 card slots and a dual-tone reversible pin-buckle leather belt in a luxury gift box.',
      category: 'Leather & Accessories',
      price: 1450,
      previous_price: 1950,
      discount: 26,
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['32-34', '36-38', '40-42'],
      colors: ['Classic Black & Tan', 'Deep Chocolate Brown'],
      stock: 40,
      status: 'Active',
      specifications: {
        'Material': '100% Genuine Full Grain Cowhide Leather',
        'Wallet Security': 'RFID-Protected Lining',
        'Belt Buckle': 'Anti-Rust Zinc Alloy',
        'Packaging': 'Premium Matte Gift Box'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'prod_5',
      name: 'Ultra-Bass Active Noise Cancelling Wireless Earbuds',
      slug: 'ultra-bass-anc-wireless-earbuds',
      description: 'Next-generation True Wireless Stereo earbuds with 35dB hybrid ANC, 13mm graphene dynamic drivers, 4-mic ENC for crystal-clear phone calls, and 36-hour total battery playback.',
      category: 'Gadgets & Electronics',
      price: 1990,
      previous_price: 2800,
      discount: 29,
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: [],
      colors: ['Matte Black', 'Pearl White'],
      stock: 55,
      status: 'Active',
      specifications: {
        'Bluetooth': 'Bluetooth v5.3 + EDR (10m range)',
        'Battery Life': '8 Hours single charge, 36 Hours with case',
        'Water Resistance': 'IPX5 Sweat & Splash Proof',
        'Charging Port': 'USB Type-C Fast Charge (10 min = 2 hrs)'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'prod_6',
      name: 'Embroidered Viscose Georgette Stitched Kurti 2-Piece',
      slug: 'embroidered-georgette-stitched-kurti',
      description: 'Elegant two-piece tunic set with thread embroidery, paired with a tapered cigarette pant. Lightweight, non-sheer inner lining, ideal for office wear and university daily fashion.',
      category: "Women's Fashion",
      price: 1650,
      previous_price: 2150,
      discount: 23,
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['38 (M)', '40 (L)', '42 (XL)', '44 (XXL)'],
      colors: ['Sage Green', 'Dusty Lavender', 'Sunset Mustard'],
      stock: 35,
      status: 'Active',
      specifications: {
        'Fabric': 'Premium Viscose Georgette with Butter Silk Lining',
        'Set Includes': 'Kurti Top + Matching Pant',
        'Length': '42 inches',
        'Work': 'Floral Thread & Sequin Needlework'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'prod_7',
      name: 'Rugged Canvas Leather Travel Duffle Bag (45L)',
      slug: 'rugged-canvas-leather-travel-duffle-bag',
      description: 'Heavy-duty 16oz waxed canvas weekender bag with genuine leather trims, dedicated shoe compartment, water-resistant interior lining, and heavy YKK brass zippers.',
      category: 'Leather & Accessories',
      price: 2250,
      previous_price: 2900,
      discount: 22,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: ['Standard 45 Liters'],
      colors: ['Khaki Army Green', 'Charcoal Grey', 'Vintage Brown'],
      stock: 20,
      status: 'Active',
      specifications: {
        'Dimensions': '52cm x 28cm x 30cm',
        'Compartments': 'Main chamber, shoe pocket, 2 quick-access zip pockets',
        'Strap': 'Padded Detachable Shoulder Strap'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'prod_8',
      name: 'AMOLED Smart Watch with Bluetooth Calling & Health Tracking',
      slug: 'amoled-smart-watch-bluetooth-calling',
      description: '1.43-inch Super AMOLED always-on display, metallic alloy bezel, 100+ sports modes, 24/7 heart rate, SpO2 sensor, and high-fidelity Bluetooth loudspeaker calling in Bengali & English UI.',
      category: 'Gadgets & Electronics',
      price: 2790,
      previous_price: 3650,
      discount: 24,
      images: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
      ],
      sizes: [],
      colors: ['Space Grey', 'Jet Black', 'Silver Metallic'],
      stock: 30,
      status: 'Active',
      specifications: {
        'Screen': '1.43" AMOLED 466x466 resolution 600 nits',
        'Compatibility': 'Android 6.0+ and iOS 11.0+',
        'Battery': '350mAh, 7-10 days standard usage',
        'Special Features': 'Bangla Font Support, Real-time SpO2, Sleep Monitor'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const initialCategories: Category[] = [
    {
      id: 'cat_1',
      name: "Men's Fashion",
      slug: 'mens-fashion',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop&q=80',
      status: 'Active',
      created_at: new Date().toISOString()
    },
    {
      id: 'cat_2',
      name: "Women's Fashion",
      slug: 'womens-fashion',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
      status: 'Active',
      created_at: new Date().toISOString()
    },
    {
      id: 'cat_3',
      name: 'Leather & Accessories',
      slug: 'leather-accessories',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80',
      status: 'Active',
      created_at: new Date().toISOString()
    },
    {
      id: 'cat_4',
      name: 'Gadgets & Electronics',
      slug: 'gadgets-electronics',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
      status: 'Active',
      created_at: new Date().toISOString()
    }
  ];

  const initialSettings: StoreSettings = {
    store_name: 'SHOP BD BAZAR',
    tagline: 'Premium Online Shopping in Bangladesh',
    contact_number: '+880 1712-345678',
    email: 'support@shopbdbazar.com',
    store_address: 'Level 4, Plot 12, Road 11, Banani, Dhaka-1213, Bangladesh',
    social_facebook: 'https://facebook.com/shopbdbazar',
    social_instagram: 'https://instagram.com/shopbdbazar',
    social_youtube: 'https://youtube.com',
    delivery_inside_dhaka: 70,
    delivery_dhaka_suburbs: 100,
    delivery_outside_dhaka: 120,
    banner_title: 'Exclusive Lifestyle & Eid Collection 2026',
    banner_subtitle: 'Premium quality handcrafted panjabis, authentic leather gear, and smart gadgets with Cash on Delivery nationwide.',
    banner_badge: 'Cash on Delivery Across All 64 Districts'
  };

  const initialAdminUsers: AdminUserRecord[] = [
    {
      id: 'adm_1',
      username: 'Shakil0099',
      password_hash: passwordHash,
      role: 'superadmin',
      created_at: new Date().toISOString()
    }
  ];

  const initialOrders: Order[] = [
    {
      id: 'ord_1',
      order_id: 'SBB-10001',
      customer_name: 'Tanvir Hossain',
      phone: '01712345678',
      alternative_phone: '01987654321',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
      area: 'Road 27',
      address: 'House 42, Apt 5B, Road 27, Dhanmondi, Dhaka',
      delivery_note: 'Please call before arriving',
      product_id: 'prod_1',
      product_name_snapshot: 'Premium Embroidered Slim-Fit Cotton Panjabi',
      product_image_snapshot: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800&auto=format&fit=crop&q=80',
      selected_size: 'XL',
      selected_color: 'Midnight Black',
      quantity: 1,
      product_price_snapshot: 1850,
      delivery_charge: 70,
      total: 1920,
      payment_method: 'Cash on Delivery',
      status: 'Delivered',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'ord_2',
      order_id: 'SBB-10002',
      customer_name: 'Farzana Akter',
      phone: '01812345678',
      division: 'Chattogram',
      district: 'Chattogram',
      upazila: 'Agrabad',
      area: 'Commercial Area',
      address: 'Plot 14, CDA Avenue, Agrabad, Chattogram',
      product_id: 'prod_3',
      product_name_snapshot: 'Designer Silk Screen Jamdani Sharee with Blouse Piece',
      product_image_snapshot: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      selected_size: 'Free Size (12 Haat)',
      selected_color: 'Crimson Red',
      quantity: 1,
      product_price_snapshot: 2950,
      delivery_charge: 120,
      total: 3070,
      payment_method: 'Cash on Delivery',
      status: 'Processing',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'ord_3',
      order_id: 'SBB-10003',
      customer_name: 'Mahmudul Hasan',
      phone: '01912345678',
      division: 'Dhaka',
      district: 'Dhaka',
      upazila: 'Uttara',
      area: 'Sector 4',
      address: 'Road 7, House 18, Sector 4, Uttara, Dhaka',
      product_id: 'prod_5',
      product_name_snapshot: 'Ultra-Bass Active Noise Cancelling Wireless Earbuds',
      product_image_snapshot: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      selected_color: 'Matte Black',
      quantity: 2,
      product_price_snapshot: 1990,
      delivery_charge: 70,
      total: 4050,
      payment_method: 'Cash on Delivery',
      status: 'Pending',
      created_at: new Date().toISOString()
    }
  ];

  return {
    products: initialProducts,
    orders: initialOrders,
    categories: initialCategories,
    settings: initialSettings,
    admin_users: initialAdminUsers,
    next_order_number: 10004
  };
}

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    ensureDataDirectory();
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure admin user exists with Shakil0099
        this.ensureAdminUser();
      } catch (err) {
        console.error('Error reading database file, initializing default database:', err);
        this.data = getInitialDatabase();
        this.persist();
      }
    } else {
      this.data = getInitialDatabase();
      this.persist();
    }
  }

  private ensureAdminUser() {
    if (!this.data.admin_users) {
      this.data.admin_users = [];
    }
    const admin = this.data.admin_users.find(u => u.username.toLowerCase() === 'shakil0099');
    if (!admin) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync('Shakil9900', salt);
      this.data.admin_users.push({
        id: 'adm_1',
        username: 'Shakil0099',
        password_hash: passwordHash,
        role: 'superadmin',
        created_at: new Date().toISOString()
      });
      this.persist();
    }
  }

  private persist() {
    try {
      ensureDataDirectory();
      const tmpPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write database atomically, fallback to direct write:', err);
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    }
  }

  // --- SETTINGS ---
  getSettings(): StoreSettings {
    return { ...this.data.settings };
  }

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.persist();
    return { ...this.data.settings };
  }

  // --- CATEGORIES ---
  getCategories(onlyActive = false): Category[] {
    if (onlyActive) {
      return this.data.categories.filter(c => c.status === 'Active');
    }
    return [...this.data.categories];
  }

  getCategoryById(id: string): Category | undefined {
    return this.data.categories.find(c => c.id === id);
  }

  createCategory(input: Omit<Category, 'id' | 'created_at'>): Category {
    const newCat: Category = {
      ...input,
      id: `cat_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.data.categories.push(newCat);
    this.persist();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = {
      ...this.data.categories[idx],
      ...updates
    };
    this.persist();
    return { ...this.data.categories[idx] };
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- PRODUCTS ---
  getProducts(filter?: {
    category?: string;
    search?: string;
    status?: string;
    sort?: string;
    onlyActive?: boolean;
  }): Product[] {
    let list = [...this.data.products];

    if (filter?.onlyActive) {
      list = list.filter(p => p.status !== 'Inactive');
    } else if (filter?.status && filter.status !== 'all') {
      list = list.filter(p => p.status === filter.status);
    }

    if (filter?.category && filter.category !== 'All' && filter.category !== '') {
      list = list.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter?.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filter?.sort) {
      switch (filter.sort) {
        case 'price_low_to_high':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price_high_to_low':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'popular':
        default:
          // Keep default or by stock / created
          break;
      }
    }

    return list;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find(p => p.slug === slug);
  }

  createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    // Generate unique slug
    let baseSlug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (this.data.products.some(p => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newProd: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.products.unshift(newProd);
    this.persist();
    return newProd;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const existing = this.data.products[idx];

    // Check slug uniqueness if slug changed
    let slug = updates.slug || existing.slug;
    if (updates.slug && updates.slug !== existing.slug) {
      let counter = 1;
      let baseSlug = updates.slug;
      while (this.data.products.some(p => p.id !== id && p.slug === slug)) {
        slug = `${baseSlug}-${counter++}`;
      }
    }

    const updatedProd: Product = {
      ...existing,
      ...updates,
      slug,
      updated_at: new Date().toISOString()
    };

    // Auto update status to Out of Stock if stock is zero and was Active
    if (updatedProd.stock <= 0 && updatedProd.status === 'Active') {
      updatedProd.status = 'Out of Stock';
    }

    this.data.products[idx] = updatedProd;
    this.persist();
    return updatedProd;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- ORDERS ---
  getOrders(filter?: {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Order[] {
    let list = [...this.data.orders];

    if (filter?.status && filter.status !== 'all') {
      list = list.filter(o => o.status === filter.status);
    }

    if (filter?.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        o =>
          o.order_id.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.product_name_snapshot.toLowerCase().includes(q)
      );
    }

    if (filter?.startDate) {
      const start = new Date(filter.startDate).getTime();
      list = list.filter(o => new Date(o.created_at).getTime() >= start);
    }

    if (filter?.endDate) {
      const end = new Date(filter.endDate).getTime() + 86400000;
      list = list.filter(o => new Date(o.created_at).getTime() <= end);
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }

  getOrderById(idOrOrderId: string): Order | undefined {
    return this.data.orders.find(o => o.id === idOrOrderId || o.order_id === idOrOrderId);
  }

  createOrder(orderInput: {
    customer_name: string;
    phone: string;
    alternative_phone?: string;
    division: string;
    district: string;
    upazila: string;
    area?: string;
    address: string;
    delivery_note?: string;
    product_id: string;
    selected_size?: string;
    selected_color?: string;
    quantity: number;
    delivery_charge: number;
  }): Order {
    // 1. Fetch live product to create historical snapshot
    const product = this.getProductById(orderInput.product_id);
    if (!product) {
      throw new Error('Selected product does not exist.');
    }
    if (product.status === 'Inactive') {
      throw new Error('This product is currently inactive.');
    }
    if (product.stock < orderInput.quantity) {
      throw new Error(`Insufficient stock. Available: ${product.stock}, requested: ${orderInput.quantity}`);
    }

    // 2. Generate unique Order ID e.g. SBB-10004
    const nextNum = this.data.next_order_number || 10001;
    const orderId = `SBB-${nextNum}`;
    this.data.next_order_number = nextNum + 1;

    // 3. Calculate snapshot total
    const itemTotal = product.price * orderInput.quantity;
    const grandTotal = itemTotal + orderInput.delivery_charge;

    // 4. Create Order object with complete immutable snapshot
    const newOrder: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      order_id: orderId,
      customer_name: orderInput.customer_name.trim(),
      phone: orderInput.phone.trim(),
      alternative_phone: orderInput.alternative_phone?.trim(),
      division: orderInput.division,
      district: orderInput.district,
      upazila: orderInput.upazila,
      area: orderInput.area?.trim(),
      address: orderInput.address.trim(),
      delivery_note: orderInput.delivery_note?.trim(),

      // Historical snapshot
      product_id: product.id,
      product_name_snapshot: product.name,
      product_image_snapshot: product.images[0] || '',
      selected_size: orderInput.selected_size,
      selected_color: orderInput.selected_color,
      quantity: orderInput.quantity,
      product_price_snapshot: product.price,
      delivery_charge: orderInput.delivery_charge,
      total: grandTotal,
      payment_method: 'Cash on Delivery',
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    // 5. Decrement product stock & auto update status if stock depleted
    product.stock = Math.max(0, product.stock - orderInput.quantity);
    if (product.stock === 0) {
      product.status = 'Out of Stock';
    }
    product.updated_at = new Date().toISOString();

    // 6. Append order
    this.data.orders.unshift(newOrder);
    this.persist();

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const order = this.data.orders.find(o => o.id === orderId || o.order_id === orderId);
    if (!order) return null;

    order.status = status;
    order.updated_at = new Date().toISOString();
    this.persist();
    return { ...order };
  }

  // --- ADMIN AUTH & PROFILE ---
  getAdminUser(username: string): AdminUserRecord | undefined {
    return this.data.admin_users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  verifyAdminCredentials(username: string, plainPassword: string): AdminUserRecord | null {
    const user = this.getAdminUser(username);
    if (!user) return null;

    const valid = bcrypt.compareSync(plainPassword, user.password_hash);
    if (!valid) return null;

    return user;
  }

  updateAdminPassword(userId: string, newPlainPassword: string): boolean {
    const user = this.data.admin_users.find(u => u.id === userId);
    if (!user) return false;

    const salt = bcrypt.genSaltSync(10);
    user.password_hash = bcrypt.hashSync(newPlainPassword, salt);
    user.updated_at = new Date().toISOString();
    this.persist();
    return true;
  }

  // --- DASHBOARD METRICS ---
  getDashboardMetrics() {
    const products = this.data.products;
    const orders = this.data.orders;

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'Active').length;
    const outOfStockProducts = products.filter(p => p.status === 'Out of Stock' || p.stock <= 0).length;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

    // Total sales (from non-cancelled orders)
    const totalSales = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((acc, curr) => acc + curr.total, 0);

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalSales,
      recentOrders: orders.slice(0, 8)
    };
  }
}

export const db = new DatabaseService();
