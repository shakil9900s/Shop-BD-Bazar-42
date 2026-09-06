import React from 'react';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onContinueShopping
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-8"
        id="order-success-modal"
      >
        {/* Top Success Banner */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 bg-white/10 px-3 py-1 rounded-full">
            Order Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Order Successfully Placed!
          </h2>
          <p className="text-sm text-emerald-100 mt-1">
            Thank you for shopping with SHOP BD BAZAR
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-6">
          {/* Order ID & Delivery Notice */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Order Tracking ID
              </span>
              <p className="text-xl font-black text-slate-900 font-mono tracking-wide">
                #{order.order_id}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Status: {order.status}</span>
            </div>
          </div>

          {/* Cash on Delivery reminder box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-emerald-950">
                Payment Method: Cash on Delivery
              </p>
              <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
                Payment will be collected in cash when the order is safely delivered to your doorstep. Please keep the exact amount ready.
              </p>
            </div>
          </div>

          {/* Snapshot Product Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ordered Product (Historical Snapshot)
            </h3>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={order.product_image_snapshot}
                alt={order.product_name_snapshot}
                className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {order.product_name_snapshot}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-600">
                  {order.selected_size && (
                    <span className="font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      Size: {order.selected_size}
                    </span>
                  )}
                  {order.selected_color && (
                    <span className="font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      Color: {order.selected_color}
                    </span>
                  )}
                  <span className="font-semibold text-slate-800">
                    Qty: {order.quantity}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Price</span>
                <p className="text-sm font-black text-slate-900">
                  ৳{(order.product_price_snapshot * order.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Customer & Delivery Destination
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">Customer Name:</span>
                <span className="font-bold text-slate-900 text-sm">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Mobile Phone:</span>
                <span className="font-bold text-slate-900 font-mono">{order.phone}</span>
              </div>
              <div className="sm:col-span-2 pt-1 border-t border-slate-200/60">
                <span className="text-slate-400 block">Delivery Address:</span>
                <span className="font-semibold text-slate-800">
                  {order.address}
                  {order.area ? `, ${order.area}` : ''}, {order.upazila}, {order.district}, {order.division}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Product Subtotal:</span>
              <span className="font-semibold">
                ৳{(order.product_price_snapshot * order.quantity).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charge ({order.division}):</span>
              <span className="font-semibold">৳{order.delivery_charge}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="text-emerald-700 text-lg font-black">
                ৳{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Actions: Continue Shopping & Print Receipt */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onContinueShopping}
              className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="py-3.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
