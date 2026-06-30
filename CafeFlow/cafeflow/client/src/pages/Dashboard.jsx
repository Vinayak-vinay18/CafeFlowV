import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MdAttachMoney, MdShoppingCart, MdPeople, MdRestaurantMenu, MdArrowForward } from 'react-icons/md';
import toast from 'react-hot-toast';
import StatCard from '../components/common/StatCard';
import { SkeletonStat } from '../components/common/Skeleton';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import * as dashboardService from '../services/dashboardService';
import { useCafe } from '../context/CafeContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useCafe();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Welcome back to {settings?.cafeName || 'CafeFlow'} 👋</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <StatCard icon={MdAttachMoney} label="Today's Revenue" value={`₹${stats?.todayRevenue ?? 0}`} color="orange" />
            <StatCard icon={MdShoppingCart} label="Today's Orders" value={stats?.todayOrders ?? 0} color="blue" />
            <StatCard icon={MdPeople} label="Total Customers" value={stats?.totalCustomers ?? 0} color="green" />
            <StatCard icon={MdRestaurantMenu} label="Total Menu Items" value={stats?.totalMenuItems ?? 0} color="purple" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Revenue (Last 7 Days)</h3>
          <p className="text-xs text-gray-400 mb-4">Daily revenue trend</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats?.revenueGraph || []}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ff7a00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fed7aa" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#ff7a00" strokeWidth={2} fill="url(#revenueFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Orders (Last 7 Days)</h3>
          <p className="text-xs text-gray-400 mb-4">Daily order volume</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats?.revenueGraph || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fed7aa" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#ff9a44" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">Recent Orders</h3>
          <Link to="/orders" className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:underline">
            View All <MdArrowForward size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-orange-50 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !stats?.recentOrders?.length ? (
          <EmptyState title="No orders yet" message="Orders from the POS billing page will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase border-b border-orange-50 dark:border-gray-700">
                  <th className="py-2 pr-4">Order ID</th>
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Items</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className="border-b border-orange-50 dark:border-gray-800 last:border-0">
                    <td className="py-3 pr-4 font-medium text-gray-700 dark:text-gray-200">{o.orderId}</td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{o.customerName}</td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{o.items?.length} items</td>
                    <td className="py-3 pr-4 font-medium text-gray-700 dark:text-gray-200">₹{o.grandTotal}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
