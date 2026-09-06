import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface CartDrawerProps {
  onCheckoutProduct: (product: Product, size?: string, color?: string, qty?: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckoutProduct }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Shopping Cart ({cartCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Discover our exclusive Eid collection, casual shirts, and gadgets with Cash on Delivery nationwide.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}_${item.selected_size}_${item.selected_color}_${index}`}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex gap-3 sm:gap-4 relative"
                >
                  <img
                    src={item.product.images[0] || ''}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                      {item.product.name}
                    </h4>

                    {/* Variant Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-slate-600">
                      {item.selected_size && (
                        <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                          {item.selected_size}
                        </span>
                      )}
                      {item.selected_color && (
                        <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                          {item.selected_color}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-sm font-extrabold text-emerald-700">
                        ৳{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors self-start"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ৳{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Delivery Charge:</span>
                  <span>Calculated at checkout (৳70 - ৳120)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-base font-extrabold text-slate-900">
                <span>Cart Subtotal:</span>
                <span className="text-xl font-black text-emerald-700">
                  ৳{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Instant Checkout First Cart Item or open checkout */}
              <button
                onClick={() => {
                  if (cart.length > 0) {
                    const first = cart[0];
                    closeCart();
                    onCheckoutProduct(first.product, first.selected_size, first.selected_color, first.quantity);
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery across Bangladesh</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
