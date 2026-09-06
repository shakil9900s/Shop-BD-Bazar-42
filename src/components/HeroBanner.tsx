import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroBannerProps {
  settings: StoreSettings | null;
  onShopNow: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ settings, onShopNow }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-950 text-white py-12 md:py-20">
      {/* Decorative background glow circles */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Promotional Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{settings?.banner_badge || 'Cash on Delivery Across All 64 Districts'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {settings?.banner_title || 'Exclusive Lifestyle & Eid Collection 2026'}
            </h1>

            {/* Promotional Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {settings?.banner_subtitle ||
                'Premium quality handcrafted panjabis, authentic leather gear, and smart gadgets with Cash on Delivery nationwide.'}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                id="hero-shop-now-btn"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 border border-white/10 px-4 py-3 rounded-xl backdrop-blur-xs">
                <span className="text-emerald-400 font-bold text-sm">৳70</span>
                <span>Inside Dhaka delivery • Pay cash at your door</span>
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-6 border-t border-slate-700/60 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">100% Genuine</h4>
                  <p className="text-[10px] text-slate-400 hidden sm:block">Quality guaranteed</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Fast Dispatch</h4>
                  <p className="text-[10px] text-slate-400 hidden sm:block">24-48h Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Cash on Delivery</h4>
                  <p className="text-[10px] text-slate-400 hidden sm:block">Check before pay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Showcase Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Featured Image Card with glowing border */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-800/80 group">
                <img
                  src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=1000&auto=format&fit=crop&q=80"
                  alt="Exclusive Panjabi Collection"
                  className="w-full h-80 sm:h-96 object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                
                {/* Floating Product Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Featured Pick</span>
                    <h3 className="text-sm font-bold truncate">Premium Slim-Fit Panjabi</h3>
                    <p className="text-xs text-slate-300">Sizes M, L, XL, XXL available</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through">৳2,450</span>
                    <p className="text-lg font-extrabold text-emerald-400">৳1,850</p>
                  </div>
                </div>
              </div>

              {/* Decorative mini badge */}
              <div className="absolute -top-4 -left-4 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-lg border border-emerald-400/40">
                Eid Special Offer
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
