import React, { useState } from 'react';
import { Search, Eye, Phone, MapPin, Calendar, Clock, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminOrdersViewProps {
  orders: Order[];
  onRefresh: () => void;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({ orders, onRefresh }) => {
  const { token } = useAdminAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.order_id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.product_name_snapshot.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.data);
        }
      } else {
        alert(data.error || 'Failed to update order status.');
      }
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Order Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          View, verify, update delivery statuses, and print invoices for customer orders.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Order ID (e.g. SBB-10001), Customer, Phone, or Product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-hidden font-medium text-slate-700"
        >
          <option value="All">All Statuses</option>
          {statuses.map(st => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Product Snapshot</th>
                <th className="py-3.5 px-4">Variants</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 text-sm block">
                        #{order.order_id}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{order.customer_name}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                        {order.upazila}, {order.district}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {order.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <img
                          src={order.product_image_snapshot}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <span className="font-medium text-slate-800 truncate">
                          {order.product_name_snapshot}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="block font-semibold text-slate-700">
                        Size: {order.selected_size || 'N/A'}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        Color: {order.selected_color || 'N/A'} • Qty: {order.quantity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-emerald-700 text-sm">
                        ৳{order.total.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        (Del: ৳{order.delivery_charge})
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {/* Status Dropdown selector */}
                      <select
                        value={order.status}
                        disabled={updating}
                        onChange={e => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border outline-hidden cursor-pointer ${getBadgeClass(
                          order.status
                        )}`}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-emerald-400">
                  #{selectedOrder.order_id}
                </span>
                <span className="text-xs text-slate-400">• Full Order Specification</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
              {/* Status Update Bar in Modal */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                    Update Delivery Status
                  </span>
                  <p className="text-xs text-slate-700 mt-0.5">
                    Changes reflect immediately on customer's tracking screen.
                  </p>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={e => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className={`text-xs font-black px-3 py-2 rounded-xl border outline-hidden ${getBadgeClass(
                    selectedOrder.status
                  )}`}
                >
                  {statuses.map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer and Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                    Customer Information
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedOrder.customer_name}</p>
                  <p className="font-mono text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedOrder.phone}</span>
                  </p>
                  {selectedOrder.alternative_phone && (
                    <p className="font-mono text-slate-500">
                      Alt: {selectedOrder.alternative_phone}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                    Destination Address
                  </span>
                  <p className="text-slate-900 font-semibold leading-relaxed">
                    {selectedOrder.address}
                    {selectedOrder.area ? `, ${selectedOrder.area}` : ''}
                  </p>
                  <p className="text-slate-600">
                    Upazila: <span className="font-medium text-slate-900">{selectedOrder.upazila}</span>, District: <span className="font-medium text-slate-900">{selectedOrder.district}</span>
                  </p>
                  <p className="text-slate-600">
                    Division: <span className="font-medium text-slate-900">{selectedOrder.division}</span>
                  </p>
                  {selectedOrder.delivery_note && (
                    <p className="text-amber-800 bg-amber-50 p-1.5 rounded-md border border-amber-200 mt-1">
                      Note: {selectedOrder.delivery_note}
                    </p>
                  )}
                </div>
              </div>

              {/* Immutable Snapshot Product Details (Requirement #30) */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                  Historical Product Snapshot
                </span>
                <div className="flex gap-4 items-center">
                  <img
                    src={selectedOrder.product_image_snapshot}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900">
                      {selectedOrder.product_name_snapshot}
                    </h4>
                    <div className="flex gap-3 text-slate-600 mt-1">
                      <span>Size: <strong className="text-slate-900">{selectedOrder.selected_size || 'N/A'}</strong></span>
                      <span>Color: <strong className="text-slate-900">{selectedOrder.selected_color || 'N/A'}</strong></span>
                      <span>Quantity: <strong className="text-slate-900">{selectedOrder.quantity}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Product Price Snapshot (x{selectedOrder.quantity}):</span>
                  <span className="font-bold">৳{selectedOrder.product_price_snapshot * selectedOrder.quantity}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-bold">৳{selectedOrder.delivery_charge}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total to Collect (Cash on Delivery):</span>
                  <span className="text-emerald-700 text-base font-black">
                    ৳{selectedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions: Print and Close */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 font-bold flex items-center gap-1.5 text-slate-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
