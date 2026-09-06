import React, { useState } from 'react';
import { Search, PackageCheck, Truck, Clock, CheckCircle, XCircle, AlertCircle, Phone } from 'lucide-react';
import { Order } from '../types';

export const TrackOrderView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);
    setOrder(null);

    try {
      // Normalize query (e.g. #SBB-10001 or SBB-10001)
      const cleanId = query.trim().replace(/^#/, '');
      const res = await fetch(`/api/orders/${cleanId}`);
      const data = await res.json();

      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        setError(data.error || 'No order found with this tracking ID. Please check the ID and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock,
          label: 'Order Placed (Pending Confirmation)'
        };
      case 'Confirmed':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: CheckCircle,
          label: 'Order Confirmed by Store'
        };
      case 'Processing':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          icon: PackageCheck,
          label: 'Packaging in Warehouse'
        };
      case 'Shipped':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: Truck,
          label: 'Dispatched with Courier Rider'
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle,
          label: 'Delivered & Cash Received'
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: XCircle,
          label: 'Order Cancelled'
        };
    }
  };

  return (
    <div className="bg-slate-50 min-h-[80vh] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
            Real-Time Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Track Your Order
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your Order ID (e.g. <span className="font-mono font-semibold text-slate-700">SBB-10001</span>) to check current delivery status.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Enter Order ID (e.g. SBB-10001)"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 font-mono text-sm uppercase outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors shrink-0 disabled:opacity-75"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Example IDs to test:</span>
            <button
              type="button"
              onClick={() => setQuery('SBB-10001')}
              className="text-emerald-600 hover:underline font-mono"
            >
              SBB-10001
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setQuery('SBB-10002')}
              className="text-emerald-600 hover:underline font-mono"
            >
              SBB-10002
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setQuery('SBB-10003')}
              className="text-emerald-600 hover:underline font-mono"
            >
              SBB-10003
            </button>
          </div>
        </form>

        {/* Error Notice */}
        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details Result */}
        {order && (
          <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Order ID
                </span>
                <h3 className="text-xl font-black text-slate-900 font-mono">
                  #{order.order_id}
                </h3>
                <p className="text-xs text-slate-500">
                  Placed on: {new Date(order.created_at).toLocaleDateString()} at{' '}
                  {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {(() => {
                const badge = getStatusBadge(order.status);
                const Icon = badge.icon;
                return (
                  <div className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 ${badge.bg}`}>
                    <Icon className="w-4 h-4" />
                    <span>{badge.label}</span>
                  </div>
                );
              })()}
            </div>

            {/* Product Snapshot */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={order.product_image_snapshot}
                alt={order.product_name_snapshot}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-white"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {order.product_name_snapshot}
                </h4>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-1">
                  {order.selected_size && (
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
                      Size: {order.selected_size}
                    </span>
                  )}
                  {order.selected_color && (
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold">
                      Color: {order.selected_color}
                    </span>
                  )}
                  <span className="font-semibold">Quantity: {order.quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total</span>
                <p className="text-base font-extrabold text-emerald-700">
                  ৳{order.total.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-medium">Customer:</span>
                <span className="font-bold text-slate-900 text-sm">{order.customer_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Phone:</span>
                <span className="font-bold text-slate-900 font-mono">{order.phone}</span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                <span className="text-slate-400 block font-medium">Delivery Address:</span>
                <span className="font-semibold text-slate-800">
                  {order.address}{order.area ? `, ${order.area}` : ''}, {order.upazila}, {order.district}, {order.division}
                </span>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-slate-500">
              Payment Method: <span className="font-bold text-emerald-700">Cash on Delivery</span> • For any questions, call support at +880 1712-345678.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
