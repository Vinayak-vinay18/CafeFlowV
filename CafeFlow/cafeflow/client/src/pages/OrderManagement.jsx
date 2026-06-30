import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdSearch, MdReceiptLong, MdVisibility } from 'react-icons/md';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { SkeletonRow } from '../components/common/Skeleton';
import * as orderService from '../services/orderService';
import useDebounce from '../hooks/useDebounce';

const statuses = ['All', 'Pending', 'Completed', 'Cancelled'];

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const debouncedSearch = useDebounce(search, 350);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderService.getOrders({ search: debouncedSearch, status, date, page, limit: 10 });
      setOrders(res.data.data);
      setPages(res.data.pagination.pages || 1);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, date, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, date]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (order, newStatus) => {
    setUpdatingId(order._id);
    try {
      await orderService.updateOrderStatus(order._id, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Order Management</h1>
        <p className="text-sm text-gray-400 mt-1">View, search, and manage all orders</p>
      </div>

      <div className="card flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
          <input
            className="input-field pl-10"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field md:w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input type="date" className="input-field md:w-48" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase border-b border-orange-50 dark:border-gray-700">
                <th className="py-3 pr-4">Order ID</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Items</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={MdReceiptLong} title="No orders found" message="Orders placed via POS Billing will appear here." />
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-b border-orange-50 dark:border-gray-800 last:border-0 hover:bg-orange-50/40 dark:hover:bg-gray-800/50">
                    <td className="py-3 pr-4 font-medium text-primary-600">{o.orderId}</td>
                    <td className="py-3 pr-4 text-gray-700 dark:text-gray-200">{o.customerName}</td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{o.items?.length} items</td>
                    <td className="py-3 pr-4 font-medium text-gray-700 dark:text-gray-200">₹{o.grandTotal}</td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                      {new Date(o.orderDate).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={o.status}
                        disabled={updatingId === o._id}
                        onChange={(e) => handleStatusChange(o, e.target.value)}
                        className="text-xs font-medium rounded-lg border border-orange-200 dark:border-gray-700 bg-transparent px-2 py-1.5"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <Link to={`/invoice/${o._id}`} className="text-gray-400 hover:text-primary-600 inline-flex" title="View Invoice">
                        <MdVisibility size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default OrderManagement;
