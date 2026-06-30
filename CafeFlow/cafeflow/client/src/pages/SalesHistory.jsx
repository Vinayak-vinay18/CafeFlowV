import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MdFileDownload, MdTrendingUp, MdTrendingDown, MdStar } from 'react-icons/md';
import StatCard from '../components/common/StatCard';
import { SkeletonStat } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import * as dashboardService from '../services/dashboardService';

const SalesHistory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getSalesAnalytics();
        setData(res.data.data);
      } catch {
        toast.error('Failed to load sales analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportCSV = () => {
    if (!data?.dailyBreakdown?.length) {
      toast.error('No data to export');
      return;
    }
    const header = 'Date,Revenue,Orders\n';
    const rows = data.dailyBreakdown.map((d) => `${d.date},${d.revenue},${d.orders}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cafeflow-sales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sales History</h1>
          <p className="text-sm text-gray-400 mt-1">Analytics and revenue insights</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 justify-center">
          <MdFileDownload size={18} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStat key={i} />)
        ) : (
          <>
            <StatCard icon={MdTrendingUp} label="Daily Sales" value={`₹${data?.dailySales ?? 0}`} color="orange" />
            <StatCard icon={MdTrendingUp} label="Weekly Sales" value={`₹${data?.weeklySales ?? 0}`} color="blue" />
            <StatCard icon={MdTrendingUp} label="Monthly Sales" value={`₹${data?.monthlySales ?? 0}`} color="green" />
            <StatCard icon={MdTrendingUp} label="Total Revenue" value={`₹${data?.totalRevenue ?? 0}`} color="purple" />
          </>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">Revenue Trend (Last 30 Days)</h3>
        <p className="text-xs text-gray-400 mb-4">Monthly revenue overview</p>
        {loading ? (
          <div className="h-64 bg-orange-50 dark:bg-gray-800 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data?.dailyBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fed7aa" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} interval={2} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#ff7a00" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <MdTrendingUp size={18} className="text-emerald-500" /> Most Sold Items
          </h3>
          {!data?.mostSold?.length ? (
            <EmptyState title="No sales data" message="Sales will show here once orders are placed." />
          ) : (
            <div className="space-y-3">
              {data.mostSold.map((item, i) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-light text-primary-600 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-200">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-400">{item.timesSold} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <MdTrendingDown size={18} className="text-red-400" /> Least Sold Items
          </h3>
          {!data?.leastSold?.length ? (
            <EmptyState title="No sales data" message="Sales will show here once orders are placed." />
          ) : (
            <div className="space-y-3">
              {data.leastSold.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-200">{item.name}</span>
                  <span className="text-xs font-medium text-gray-400">{item.timesSold} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <MdStar size={18} className="text-amber-400" /> Top Customers
          </h3>
          {!data?.topCustomers?.length ? (
            <EmptyState title="No customers yet" message="Top spenders will appear here." />
          ) : (
            <div className="space-y-3">
              {data.topCustomers.map((c, i) => (
                <div key={c._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-light text-primary-600 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-200">{c.name}</span>
                  </div>
                  <span className="text-xs font-medium text-primary-600">₹{c.totalSpent?.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
