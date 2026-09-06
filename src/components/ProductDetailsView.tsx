import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import {
  Zap,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Share2,
  AlertCircle
} from 'lucide-react';

interface ProductDetailsViewProps {
  product: Product;
  onBack: () => void;
  onOrderNow: (product: Product, size?: string, color?: string, quantity?: number) => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  product,
  onBack,
  onOrderNow
}) => {
  const { addToCart } = useCart();

  // Active gallery image
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  );

  // Selected Size
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );

  // Selected Color
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );

  // Quantity
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const isOutOfStock = product.status === 'Out of Stock' || product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleOrderNow = () => {
    if (isOutOfStock) return;
    onOrderNow(product, selectedSize, selectedColor, quantity);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Link Copied!' : 'Share Product'}</span>
          </button>
        </div>

        {/* Product Details Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-4/5 sm:aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {product.discount && product.discount > 0 && !isOutOfStock && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-md tracking-wider">
                  {product.discount}% DISCOUNT
                </div>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="bg-rose-600 text-white font-bold text-sm uppercase px-4 py-2 rounded-xl shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails (Up to 4 images) */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 scale-95'
                        : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info, Variants & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Stock Tag */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {isOutOfStock ? (
                    <span className="text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Unavailable
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      In Stock ({product.stock} units left)
                    </span>
                  )}
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Pricing section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-black text-emerald-700">
                  ৳{product.price.toLocaleString('en-IN')}
                </span>
                {product.previous_price && product.previous_price > product.price && (
                  <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                    ৳{product.previous_price.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discount && product.discount > 0 && (
                  <span className="text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                    Save ৳{((product.previous_price || 0) - product.price).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* 1. Size Selection (if product has sizes) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Select Size: <span className="text-emerald-700 font-extrabold">{selectedSize}</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                          selectedSize === s
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Color Selection (if product has colors) */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Select Color: <span className="text-emerald-700 font-extrabold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-2 ${
                          selectedColor === c
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                        <span>{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-4">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-extrabold text-slate-900 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {/* ORDER NOW Primary Button */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleOrderNow}
                className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                  isOutOfStock
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                }`}
                id="details-order-now-btn"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>ORDER NOW (CASH ON DELIVERY)</span>
              </button>

              {/* Add to Cart Secondary Button */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base border flex items-center justify-center gap-2 transition-all ${
                  isOutOfStock
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs'
                }`}
                id="details-add-to-cart-btn"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-700" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-emerald-700" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Trust Badges under buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24-48h Delivery</span>
                </div>
              </div>
            </div>

            {/* Specifications Table */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Product Specifications
                </h3>
                <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val], idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}
                        >
                          <td className="py-2.5 px-3 font-semibold text-slate-600 border-r border-slate-200 w-1/3">
                            {key}
                          </td>
                          <td className="py-2.5 px-3 text-slate-800 font-medium">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
