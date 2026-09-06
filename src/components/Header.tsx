import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Phone, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreSettings } from '../types';

interface HeaderProps {
  settings: StoreSettings | null;
  onNavigate: (view: string, data?: any) => void;
  currentView: string;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onNavigate,
  currentView,
  onSearch,
  searchQuery
}) => {
  const { cartCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
    if (currentView !== 'shop') {
      onNavigate('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-900 text-emerald-50 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-4 text-center sm:text-left font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>⚡ Cash on Delivery Available Across 64 Districts in Bangladesh</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200">
            <a
              href={`tel:${settings?.contact_number || '+8801712345678'}`}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings?.contact_number || '+880 1712-345678'}</span>
            </a>
            <span className="hidden md:inline text-emerald-600">|</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-emerald-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo Treatment */}
          <div
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            id="brand-logo-btn"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              BD
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">
                SHOP <span className="text-emerald-600">BD</span> BAZAR
              </span>
              <span className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase mt-1">
                Authentic Lifestyle & Fashion
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg mx-4 relative"
          >
            <input
              type="text"
              placeholder="Search products, panjabis, watches, sharees..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 pl-11 pr-24 py-2.5 rounded-full text-sm font-medium border border-transparent focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-hidden"
              id="desktop-search-input"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
            >
              Search
            </button>
          </form>

          {/* Desktop Navigation Links & Cart Button */}
          <div className="flex items-center gap-2 sm:gap-6">
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
              <button
                onClick={() => onNavigate('home')}
                className={`hover:text-emerald-600 transition-colors pb-1 ${
                  currentView === 'home' ? 'text-emerald-600 border-b-2 border-emerald-600' : ''
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className={`hover:text-emerald-600 transition-colors pb-1 ${
                  currentView === 'shop' ? 'text-emerald-600 border-b-2 border-emerald-600' : ''
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => onNavigate('categories')}
                className={`hover:text-emerald-600 transition-colors pb-1 ${
                  currentView === 'categories' ? 'text-emerald-600 border-b-2 border-emerald-600' : ''
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => onNavigate('track-order')}
                className={`hover:text-emerald-600 transition-colors pb-1 ${
                  currentView === 'track-order' ? 'text-emerald-600 border-b-2 border-emerald-600' : ''
                }`}
              >
                Track Order
              </button>
            </nav>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center gap-2 font-semibold text-sm transition-colors border border-emerald-200/60"
              id="header-cart-button"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <span className="hidden sm:inline">Cart</span>
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              id="mobile-menu-toggle"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products in Bangladesh..."
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 pl-10 pr-20 py-2 rounded-full text-sm border border-slate-200 focus:border-emerald-500 focus:bg-white outline-hidden"
              id="mobile-search-input"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => {
              onNavigate('shop');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>All Products</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => {
              onNavigate('categories');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>Browse Categories</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => {
              onNavigate('track-order');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>Track Order (SBB-1000X)</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-semibold text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Admin Panel Login
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
