import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get('/admin/dashboard');
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { stats, recent_orders } = data;

  const statusCards = [
    { label: "Today's Orders", value: stats.today_orders, icon: <ShoppingBag size={20} />, color: "blue" },
    { label: "Pending", value: stats.pending_orders, icon: <Clock size={20} />, color: "amber" },
    { label: "Delivered", value: stats.delivered_orders, icon: <CheckCircle size={20} />, color: "emerald" },
    { label: "Cancelled", value: stats.cancelled_orders, icon: <XCircle size={20} />, color: "rose" },
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" />
            Admin Overview
          </h1>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statusCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 
              ${card.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                card.color === 'amber' ? 'bg-amber-50 text-amber-600' : 
                card.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                'bg-rose-50 text-rose-600'}`}>
              {card.icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Products & Qty</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recent_orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{order.user?.name}</span>
                        <span className="text-xs text-slate-400">{order.user?.email}</span>
                      </div>
                    </td>
                    
                    {/* Products & Quantity Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {order.items?.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="inline-flex items-center bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-100"
                          >
                            <span className="mr-1">{item.quantity}×</span>
                            <span className="max-w-[120px] truncate">{item.product?.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${order.total}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                          order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          order.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Sidebar */}
        <div className="space-y-8">
          <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-200 text-white relative overflow-hidden">
            <TrendingUp className="absolute right-[-10px] bottom-[-10px] text-indigo-500 w-32 h-32 opacity-20" />
            <p className="text-indigo-100 text-sm font-medium mb-1">Total Sales Revenue</p>
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight">${stats.total_sales}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl">
                <p className="text-xs text-indigo-100">Total Users</p>
                <p className="text-lg font-bold">{stats.total_users}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl">
                <p className="text-xs text-indigo-100">Products</p>
                <p className="text-lg font-bold">{stats.total_products}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}