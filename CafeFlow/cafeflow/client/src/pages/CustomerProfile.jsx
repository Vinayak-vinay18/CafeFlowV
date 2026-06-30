import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdArrowBack, MdPhone, MdEmail, MdLocationOn, MdShoppingBag, MdCalendarToday } from 'react-icons/md';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import * as customerService from '../services/customerService';

const CustomerProfile = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await customerService.getCustomer(id);
        setCustomer(res.data.data);
      } catch {
        toast.error('Failed to load customer profile');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className="card h-64 animate-pulse" />;
  }

  if (!customer) {
    return <EmptyState title="Customer not found" message="This customer may have been removed." />;
  }

  return (
    <div className="space-y-6">
      <Link to="/customers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600">
        <MdArrowBack size={17} /> Back to Customers
      </Link>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-orange-gradient text-white flex items-center justify-center text-3xl font-bold shadow-soft flex-shrink-0">
            {customer.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{customer.name}</h1>
            <p className="text-sm text-primary-600 font-medium">{customer.customerId}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><MdPhone size={15} /> {customer.mobile}</span>
              {customer.email && <span className="flex items-center gap-1.5"><MdEmail size={15} /> {customer.email}</span>}
              {customer.address && <span className="flex items-center gap-1.5"><MdLocationOn size={15} /> {customer.address}</span>}
              <span className="flex items-center gap-1.5">
                <MdCalendarToday size={14} /> Joined {new Date(customer.dateJoined).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-xs text-gray-400 mb-1">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{customer.totalOrders}</h3>
        </div>
        <div className="card text-center">
          <p className="text-xs text-gray-400 mb-1">Total Spending</p>
          <h3 className="text-2xl font-bold text-primary-600">₹{customer.totalSpent?.toFixed(2)}</h3>
        </div>
        <div className="card text-center">
          <p className="text-xs text-gray-400 mb-1">Last Visit</p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : '—'}
          </h3>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <MdShoppingBag size={18} /> Purchase History
        </h3>
        {!customer.purchaseHistory?.length ? (
          <EmptyState title="No purchases yet" message="Orders placed by this customer will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase border-b border-orange-50 dark:border-gray-700">
                  <th className="py-2 pr-4">Order ID</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Items</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...customer.purchaseHistory].reverse().map((p, i) => (
                  <tr key={i} className="border-b border-orange-50 dark:border-gray-800 last:border-0">
                    <td className="py-3 pr-4 font-medium text-gray-700 dark:text-gray-200">
                      {p.order?.orderId || '—'}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                      {p.order?.items?.length ?? '—'} items
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-700 dark:text-gray-200">₹{p.amount?.toFixed(2)}</td>
                    <td className="py-3 pr-4">{p.order?.status && <StatusBadge status={p.order.status} />}</td>
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

export default CustomerProfile;
