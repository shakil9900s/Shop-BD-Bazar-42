import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings | null;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black text-lg shadow-md">
                BD
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                SHOP <span className="text-emerald-400">BD</span> BAZAR
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Bangladesh's trusted destination for genuine men's fashion, ethnic wear, accessories, and modern smart lifestyle gadgets with Cash on Delivery nationwide.
            </p>
            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <a
                href={settings?.social_facebook || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings?.social_instagram || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings?.social_youtube || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-emerald-400 transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-emerald-400 transition-colors">
                  Product Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-emerald-400 transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Customer Policy</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Cash on Delivery (COD)</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Return & Exchange Policy</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Delivery Information</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Terms & Conditions</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings?.store_address || 'Level 4, Banani, Dhaka-1213, Bangladesh'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings?.contact_number || '+8801712345678'}`} className="hover:text-emerald-400">
                  {settings?.contact_number || '+880 1712-345678'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings?.email || 'support@shopbdbazar.com'}`} className="hover:text-emerald-400">
                  {settings?.email || 'support@shopbdbazar.com'}
                </a>
              </li>
              <li className="pt-1 text-xs text-slate-500">
                Support Hours: 9:00 AM - 10:00 PM (Daily)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright and Payment Method Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} SHOP BD BAZAR. All rights reserved. Made for Bangladesh.</p>
          <div className="flex items-center gap-3">
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[11px] font-semibold">
              Cash on Delivery
            </span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-[11px] font-semibold">
              Steadfast Courier / Pathao / RedX
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
