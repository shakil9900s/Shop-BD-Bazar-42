import React, { useState, useEffect } from 'react';
import { Product, Category, StoreSettings, Order } from './types';
import { CartProvider, useCart } from './context/CartContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';

// Storefront Components
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Footer } from './components/Footer';
import { ProductDetailsView } from './components/ProductDetailsView';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CartDrawer } from './components/CartDrawer';
import { TrackOrderView } from './components/TrackOrderView';

// Admin Components
import { AdminLogin } from './components/Admin/AdminLogin';
import { AdminLayout } from './components/Admin/AdminLayout';
import { AdminDashboardView } from './components/Admin/AdminDashboardView';
import { AdminProductsView } from './components/Admin/AdminProductsView';
import { AdminProductModal } from './components/Admin/AdminProductModal';
import { AdminOrdersView } from './components/Admin/AdminOrdersView';
import { AdminCategoriesView } from './components/Admin/AdminCategoriesView';
import { AdminSettingsView } from './components/Admin/AdminSettingsView';
import { AdminProfileView } from './components/Admin/AdminProfileView';

import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

function MainApp() {
  const { isAuthenticated, token } = useAdminAuth();

  // Navigation State
  // 'home' | 'shop' | 'product-details' | 'track-order' | 'admin'
  const [currentView, setCurrentView] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Active Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Checkout & Order State
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutSize, setCheckoutSize] = useState<string | undefined>(undefined);
  const [checkoutColor, setCheckoutColor] = useState<string | undefined>(undefined);
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [successfulOrder, setSuccessfulOrder] = useState<Order | null>(null);

  // Admin Data & Modals
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminProductModalOpen, setAdminProductModalOpen] = useState(false);

  // Fetch Public Data
  const fetchPublicData = async () => {
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/settings')
      ]);

      const prods = await prodRes.json();
      const cats = await catRes.json();
      const sets = await setRes.json();

      if (prods.success) setProducts(prods.data);
      if (cats.success) setCategories(cats.data);
      if (sets.success) setSettings(sets.data);
    } catch (e) {
      console.error('Error loading store data:', e);
    }
  };

  // Fetch Admin Data
  const fetchAdminData = async () => {
    if (!token) return;
    try {
      const [metricsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const metrics = await metricsRes.json();
      const orders = await ordersRes.json();

      if (metrics.success) setAdminMetrics(metrics.data);
      if (orders.success) setAdminOrders(orders.data);
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentView === 'admin') {
      fetchAdminData();
    }
  }, [isAuthenticated, currentView, token]);

  // Handle URL slug hash routing (SEO Friendly Product URLs)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/product/')) {
        const slug = hash.replace('#/product/', '');
        const found = products.find(p => p.slug === slug);
        if (found) {
          setActiveProduct(found);
          setCurrentView('product-details');
        }
      } else if (hash === '#/track-order') {
        setCurrentView('track-order');
      } else if (hash === '#/admin') {
        setCurrentView('admin');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  // Product Actions
  const handleViewDetails = (product: Product) => {
    setActiveProduct(product);
    setCurrentView('product-details');
    window.location.hash = `#/product/${product.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderNow = (
    product: Product,
    size?: string,
    color?: string,
    quantity: number = 1
  ) => {
    setCheckoutProduct(product);
    setCheckoutSize(size);
    setCheckoutColor(color);
    setCheckoutQuantity(quantity);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setSuccessfulOrder(order);
    fetchPublicData();
  };

  // Filtered Products for Catalog
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Render Admin View
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onBackToStore={() => {
            setCurrentView('home');
            window.location.hash = '';
          }}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={setAdminTab}
        onBackToStore={() => {
          setCurrentView('home');
          window.location.hash = '';
        }}
        onAddProductClick={() => setAdminProductModalOpen(true)}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboardView
            metrics={adminMetrics}
            onNavigate={tab => setAdminTab(tab)}
          />
        )}
        {adminTab === 'products' && (
          <AdminProductsView
            products={products}
            categories={categories}
            onRefresh={() => {
              fetchPublicData();
              fetchAdminData();
            }}
            onViewProductLive={prod => {
              handleViewDetails(prod);
            }}
          />
        )}
        {adminTab === 'categories' && (
          <AdminCategoriesView
            categories={categories}
            onRefresh={() => {
              fetchPublicData();
              fetchAdminData();
            }}
          />
        )}
        {adminTab === 'orders' && (
          <AdminOrdersView
            orders={adminOrders}
            onRefresh={() => {
              fetchAdminData();
            }}
          />
        )}
        {adminTab === 'settings' && (
          <AdminSettingsView
            settings={settings}
            onRefresh={() => {
              fetchPublicData();
            }}
          />
        )}
        {adminTab === 'profile' && <AdminProfileView />}

        {/* Global Add Product Modal from Admin Sidebar */}
        <AdminProductModal
          isOpen={adminProductModalOpen}
          onClose={() => setAdminProductModalOpen(false)}
          product={null}
          categories={categories}
          onSaved={() => {
            fetchPublicData();
            fetchAdminData();
          }}
        />
      </AdminLayout>
    );
  }

  // Render Storefront Views
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Universal Header */}
      <Header
        onNavigate={view => {
          setCurrentView(view);
          if (view === 'home') {
            setSelectedCategory('All');
            setSearchQuery('');
            window.location.hash = '';
          } else if (view === 'track-order') {
            window.location.hash = '#/track-order';
          } else if (view === 'admin') {
            window.location.hash = '#/admin';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearch={query => {
          setSearchQuery(query);
          if (currentView !== 'shop' && currentView !== 'home') {
            setCurrentView('shop');
          }
        }}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW: Product Details Page (Requirement #10) */}
        {currentView === 'product-details' && activeProduct && (
          <ProductDetailsView
            product={activeProduct}
            onBack={() => {
              setCurrentView('home');
              window.location.hash = '';
            }}
            onOrderNow={handleOrderNow}
          />
        )}

        {/* VIEW: Track Order Page */}
        {currentView === 'track-order' && <TrackOrderView />}

        {/* VIEW: Home & Shop Catalogs */}
        {(currentView === 'home' || currentView === 'shop') && (
          <>
            {/* Show Hero Banner on Home */}
            {currentView === 'home' && searchQuery === '' && (
              <HeroBanner
                settings={settings}
                onShopNow={() => {
                  const target = document.getElementById('featured-products-section');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            )}

            {/* Category Selector Bar */}
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={cat => {
                setSelectedCategory(cat);
                const target = document.getElementById('featured-products-section');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Product Grid Section */}
            <section
              id="featured-products-section"
              className="py-12 bg-slate-50/50 min-h-[60vh]"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Catalog Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {selectedCategory === 'All'
                          ? 'Featured Lifestyle & Fashion'
                          : selectedCategory}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Showing {filteredProducts.length} premium products • Cash on Delivery nationwide
                    </p>
                  </div>

                  {searchQuery && (
                    <div className="text-xs font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200">
                      Search results for: <span className="text-emerald-700 font-bold">"{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-2 text-rose-600 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">
                      No products found
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      We couldn't find any products matching "{searchQuery}".
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      Reset Catalog Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={handleViewDetails}
                        onOrderNow={prod => handleOrderNow(prod)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Why Choose Us Trust Section */}
            {currentView === 'home' && <WhyChooseUs />}
          </>
        )}
      </main>

      {/* Cart Drawer Component */}
      <CartDrawer
        onCheckoutProduct={(product, size, color, qty) => {
          handleOrderNow(product, size, color, qty);
        }}
      />

      {/* Order Now Checkout Popup / Modal (Requirement #14 & #15) */}
      {checkoutProduct && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          product={checkoutProduct}
          selectedSize={checkoutSize}
          selectedColor={checkoutColor}
          initialQuantity={checkoutQuantity}
          settings={settings}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Order Confirmation Screen (Requirement #19) */}
      <OrderSuccessModal
        order={successfulOrder}
        onClose={() => setSuccessfulOrder(null)}
        onContinueShopping={() => {
          setSuccessfulOrder(null);
          setCurrentView('home');
          window.location.hash = '';
        }}
      />

      {/* Universal Footer */}
      <Footer
        settings={settings}
        onNavigate={view => {
          setCurrentView(view);
          if (view === 'track-order') {
            window.location.hash = '#/track-order';
          } else if (view === 'admin') {
            window.location.hash = '#/admin';
          } else {
            window.location.hash = '';
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AdminAuthProvider>
  );
}
