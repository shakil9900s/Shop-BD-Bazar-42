import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { db, OrderStatus } from './server/db';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'shop_bd_bazar_secret_super_key_2026_bd';

// Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging in dev
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Admin Authentication Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized. Admin token missing.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    (req as any).adminUser = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Session expired or invalid token. Please log in again.' });
  }
}

// -------------------------------------------------------------
// PUBLIC STOREFRONT API ROUTES
// -------------------------------------------------------------

// 1. Store Settings & Delivery Charges
app.get('/api/settings', (req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Categories
app.get('/api/categories', (req: Request, res: Response) => {
  try {
    const categories = db.getCategories(true);
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Products List (Filter by Category, Search, Sort, Price)
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const { category, search, sort } = req.query;
    const products = db.getProducts({
      category: category as string,
      search: search as string,
      sort: sort as string,
      onlyActive: true
    });
    res.json({ success: true, data: products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Product Details by Unique Slug
app.get('/api/products/:slug', (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const product = db.getProductBySlug(slug) || db.getProductById(slug);
    if (!product || product.status === 'Inactive') {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Place Customer Order (Cash on Delivery)
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      phone,
      alternative_phone,
      division,
      district,
      upazila,
      area,
      address,
      delivery_note,
      product_id,
      selected_size,
      selected_color,
      quantity,
      delivery_charge
    } = req.body;

    // Validation
    if (!customer_name || customer_name.trim().length < 2) {
      res.status(400).json({ success: false, error: 'Please enter a valid customer name.' });
      return;
    }

    // Bangladeshi phone validation (013-019)
    const cleanPhone = phone ? phone.replace(/[\s-]/g, '') : '';
    const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    if (!cleanPhone || !bdPhoneRegex.test(cleanPhone)) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid 11-digit Bangladesh mobile number (e.g. 01712345678).'
      });
      return;
    }

    if (!division || !district || !upazila) {
      res.status(400).json({
        success: false,
        error: 'Please select your Division, District, and Upazila/Thana.'
      });
      return;
    }

    if (!address || address.trim().length < 5) {
      res.status(400).json({
        success: false,
        error: 'Please provide your detailed delivery address (House, Road, Ward, etc.).'
      });
      return;
    }

    if (!product_id) {
      res.status(400).json({ success: false, error: 'Invalid product selected.' });
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      res.status(400).json({ success: false, error: 'Quantity must be at least 1.' });
      return;
    }

    const delCharge = typeof delivery_charge === 'number' ? delivery_charge : 70;

    const order = db.createOrder({
      customer_name,
      phone: cleanPhone,
      alternative_phone: alternative_phone ? alternative_phone.trim() : undefined,
      division,
      district,
      upazila,
      area: area ? area.trim() : undefined,
      address,
      delivery_note,
      product_id,
      selected_size,
      selected_color,
      quantity: qty,
      delivery_charge: delCharge
    });

    res.status(201).json({
      success: true,
      message: 'Order successfully placed!',
      data: order
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. View Single Order by order_id (e.g. SBB-10001)
app.get('/api/orders/:orderId', (req: Request, res: Response) => {
  try {
    const order = db.getOrderById(req.params.orderId);
    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// SECURE ADMIN API ROUTES
// -------------------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Username and password are required.' });
      return;
    }

    const user = db.verifyAdminCredentials(username, password);
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid username or password.' });
      return;
    }

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin authentication successful.',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Me
app.get('/api/admin/me', requireAdminAuth, (req: Request, res: Response) => {
  const adminUser = (req as any).adminUser;
  res.json({ success: true, data: adminUser });
});

// Change Admin Password
app.post('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const adminUser = (req as any).adminUser;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      res.status(400).json({ success: false, error: 'Current and new password are required.' });
      return;
    }

    if (new_password.length < 6) {
      res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
      return;
    }

    const verified = db.verifyAdminCredentials(adminUser.username, current_password);
    if (!verified) {
      res.status(400).json({ success: false, error: 'Current password does not match.' });
      return;
    }

    const ok = db.updateAdminPassword(adminUser.id, new_password);
    if (!ok) {
      res.status(500).json({ success: false, error: 'Failed to update password.' });
      return;
    }

    res.json({ success: true, message: 'Admin password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Dashboard Analytics
app.get('/api/admin/dashboard', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const metrics = db.getDashboardMetrics();
    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Products (All statuses)
app.get('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { search, category, status } = req.query;
    const products = db.getProducts({
      search: search as string,
      category: category as string,
      status: status as string,
      onlyActive: false
    });
    res.json({ success: true, data: products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Add Product
app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      description,
      category,
      price,
      previous_price,
      discount,
      images,
      sizes,
      colors,
      stock,
      status,
      specifications
    } = req.body;

    if (!name || !price || !category) {
      res.status(400).json({ success: false, error: 'Product name, category, and price are required.' });
      return;
    }

    const product = db.createProduct({
      name,
      slug,
      description: description || '',
      category,
      price: Number(price),
      previous_price: previous_price ? Number(previous_price) : null,
      discount: discount ? Number(discount) : null,
      images: Array.isArray(images) ? images.slice(0, 4) : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      colors: Array.isArray(colors) ? colors : [],
      stock: Number(stock) || 0,
      status: status || 'Active',
      specifications: typeof specifications === 'object' && specifications !== null ? specifications : {}
    });

    res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Admin Edit Product
app.put('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (updates.images && Array.isArray(updates.images)) {
      updates.images = updates.images.slice(0, 4);
    }
    if (updates.price) {
      updates.price = Number(updates.price);
    }
    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);
    }

    const updated = db.updateProduct(id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Admin Delete Product
app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const ok = db.deleteProduct(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'Product not found.' });
      return;
    }
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Orders List
app.get('/api/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { search, status, startDate, endDate } = req.query;
    const orders = db.getOrders({
      search: search as string,
      status: status as string,
      startDate: startDate as string,
      endDate: endDate as string
    });
    res.json({ success: true, data: orders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Update Order Status
app.patch('/api/admin/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid order status.' });
      return;
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Order not found.' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Categories Management
app.get('/api/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const cats = db.getCategories(false);
    res.json({ success: true, data: cats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { name, slug, image, status } = req.body;
    if (!name) {
      res.status(400).json({ success: false, error: 'Category name is required.' });
      return;
    }
    const cat = db.createCategory({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: image || '',
      status: status || 'Active'
    });
    res.status(201).json({ success: true, data: cat });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Category not found.' });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const ok = db.deleteCategory(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'Category not found.' });
      return;
    }
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Settings Update
app.put('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Image Upload Endpoint (handles base64 data URLs / compressed images directly)
app.post('/api/upload', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { image, name } = req.body;
    if (!image) {
      res.status(400).json({ success: false, error: 'Image data is required.' });
      return;
    }
    // Return image string/URL directly so it persists cleanly in the database
    res.json({
      success: true,
      data: {
        url: image,
        name: name || 'uploaded_image'
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// VITE / STATIC PRODUCTION HANDLER
// -------------------------------------------------------------
async function startServer() {
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
    console.log(`[SHOP BD BAZAR] Server successfully running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
