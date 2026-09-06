import React from 'react';
import { ShoppingBag, Eye, Zap, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onOrderNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onOrderNow
}) => {
  const { addToCart } = useCart();
  const [addedAnimation, setAddedAnimation] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.status === 'Out of Stock' || product.stock <= 0) return;
    
    // Default to first size and color if available
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    
    addToCart(product, defaultSize, defaultColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isOutOfStock = product.status === 'Out of Stock' || product.stock <= 0;

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Section */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-100">
        <img
          src={
            product.images && product.images.length > 0
              ? product.images[0]
              : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
          }
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'grayscale opacity-75' : ''
          }`}
        />

        {/* Discount Badge */}
        {product.discount && product.discount > 0 && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-md tracking-wider">
            {product.discount}% OFF
          </div>
        )}

        {/* Out of stock badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-lg shadow-lg tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
          {product.category}
        </div>

        {/* Quick View overlay button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
          <span className="bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-md">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-lg sm:text-xl font-extrabold text-emerald-700">
              ৳{product.price.toLocaleString('en-IN')}
            </span>
            {product.previous_price && product.previous_price > product.price && (
              <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                ৳{product.previous_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Available Sizes preview */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400">Sizes:</span>
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 4).map((s, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {s}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="text-[10px] text-slate-500 font-semibold">
                    +{product.sizes.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Available Colors preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400">Colors:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {product.colors.slice(0, 3).map((col, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200 truncate max-w-[90px]"
                    title={col}
                  >
                    {col}
                  </span>
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[10px] text-slate-400">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Order Now & Add to Cart & View Details */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {/* Order Now (Primary CTA) */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={e => {
              e.stopPropagation();
              onOrderNow(product);
            }}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/20 hover:shadow-md'
            }`}
            id={`order-now-btn-${product.id}`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>ORDER NOW</span>
          </button>

          {/* Secondary Buttons: View Details & Add to Cart */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-colors ${
                isOutOfStock
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : addedAnimation
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
              id={`add-to-cart-btn-${product.id}`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="py-2 px-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
