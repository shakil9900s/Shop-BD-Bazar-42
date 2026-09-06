import React from 'react';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  Clock,
  TrendingUp,
  Truck,
  CheckCircle2,
  XCircle,
  Banknote,
  ArrowRight
} from 'lucide-react';
import { Order } from '../../types';

interface DashboardMetrics {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSales: number;
  recentOrders: Order[];
}

interface AdminDashboardViewProps {
  metrics: DashboardMetrics | null;
  onNavigate: (tab: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  metrics,
  onNavigate
}) => {
  if (!metrics) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading administrative metrics...
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Sales',
      value: `৳${metrics.totalSales.toLocaleString('en-IN')}`,
      icon: Banknote,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      label: 'Total Orders',
      value: metrics.totalOrders,
      icon: ShoppingBag,
      color: 'text-slate-800',
      bg: 'bg-white border-slate-200'
    },
    {
      label: 'Pending Orders',
      value: metrics.pendingOrders,
      icon: Clock,
      color: 'text-amber-700',
      bg: 'bg-amber-50/70 border-amber-200'
    },
    {
      label: 'Confirmed Orders',
      value: metrics.confirmedOrders,
      icon: CheckCircle,
      color: 'text-blue-700',
      bg: 'bg-blue-50/70 border-blue-200'
    },
    {
      label: 'Processing Orders',
      value: metrics.processingOrders,
      icon: TrendingUp,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50/70 border-indigo-200'
    },
    {
      label: 'Shipped Orders',
      value: metrics.shippedOrders,
      icon: Truck,
      color: 'text-purple-700',
      bg: 'bg-purple-50/70 border-purple-200'
    },
    {
      label: 'Delivered Orders',
      value: metrics.deliveredOrders,
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50/70 border-emerald-200'
    },
    {
      label: 'Cancelled Orders',
      value: metrics.cancelledOrders,
      icon: XCircle,
      color: 'text-rose-700',
      bg: 'bg-rose-50/70 border-rose-200'
    },
    {
      label: 'Total Products',
      value: metrics.totalProducts,
      icon: Package,
      color: 'text-slate-700',
      bg: 'bg-white border-slate-200'
    },
    {
      label: 'Active Products',
      value: metrics.activeProducts,
      icon: CheckCircle,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50/50 border-emerald-200'
    },
    {
      label: 'Out of Stock',
      value: metrics.outOfStockProducts,
      icon: AlertTriangle,
      color: 'text-rose-700',
      bg: 'bg-rose-50/70 border-rose-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Summary */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Admin Performance Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time metrics for inventory, orders, and sales across Bangladesh.
        </p>
      </div>

      {/* Grid of Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`p-4 sm:p-5 rounded-2xl border shadow-2xs flex items-center gap-3.5 ${c.bg}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white/80 shadow-xs flex items-center justify-center shrink-0 ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {c.label}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">
                  {c.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest Cash on Delivery orders placed nationwide</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Product Snapshot</th>
                <th className="py-3.5 px-4">Variants</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                metrics.recentOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #{ord.order_id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {ord.customer_name}
                      <span className="block text-[10px] text-slate-400">{ord.district}, {ord.division}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {ord.phone}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {ord.product_name_snapshot}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {ord.selected_size || 'N/A'} / {ord.selected_color || 'N/A'} (x{ord.quantity})
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      ৳{ord.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : ord.status === 'Shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : ord.status === 'Processing'
                            ? 'bg-indigo-100 text-indigo-800'
                            : ord.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
