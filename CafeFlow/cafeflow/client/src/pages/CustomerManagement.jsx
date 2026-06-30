import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdPeople, MdVisibility } from 'react-icons/md';
import CustomerModal from '../components/customers/CustomerModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { SkeletonRow } from '../components/common/Skeleton';
import * as customerService from '../services/customerService';
import useDebounce from '../hooks/useDebounce';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerService.getCustomers({ search: debouncedSearch, page, limit: 10 });
      setCustomers(res.data.data);
      setPages(res.data.pagination.pages || 1);
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await customerService.deleteCustomer(deleteTarget._id);
      toast.success('Customer deleted');
      setDeleteTarget(null);
      fetchCustomers();
    } catch {
      toast.error('Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Management</h1>
          <p className="text-sm text-gray-400 mt-1">View and manage your cafe's customers</p>
        </div>
        <button
          onClick={() => {
            setEditCustomer(null);
            setModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <MdAdd size={19} /> Add Customer
        </button>
      </div>

      <div className="card">
        <div className="relative mb-4">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
          <input
            className="input-field pl-10"
            placeholder="Search by name, mobile or customer ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase border-b border-orange-50 dark:border-gray-700">
                <th className="py-3 pr-4">Customer ID</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Mobile</th>
                <th className="py-3 pr-4">Total Orders</th>
                <th className="py-3 pr-4">Total Spent</th>
                <th className="py-3 pr-4">Last Visit</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={MdPeople} title="No customers found" message="Add your first customer to get started." />
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="border-b border-orange-50 dark:border-gray-800 last:border-0 hover:bg-orange-50/40 dark:hover:bg-gray-800/50">
                    <td className="py-3 pr-4 font-medium text-primary-600">{c.customerId}</td>
                    <td className="py-3 pr-4 text-gray-700 dark:text-gray-200">{c.name}</td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{c.mobile}</td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">{c.totalOrders}</td>
                    <td className="py-3 pr-4 font-medium text-gray-700 dark:text-gray-200">₹{c.totalSpent?.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-gray-500 dark:text-gray-400">
                      {c.lastVisit ? new Date(c.lastVisit).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/customers/${c._id}`} className="text-gray-400 hover:text-primary-600" title="View profile">
                          <MdVisibility size={18} />
                        </Link>
                        <button
                          onClick={() => {
                            setEditCustomer(c);
                            setModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-primary-600"
                          title="Edit"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button onClick={() => setDeleteTarget(c)} className="text-gray-400 hover:text-red-500" title="Delete">
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>

      <CustomerModal open={modalOpen} onClose={() => setModalOpen(false)} customer={editCustomer} onSaved={fetchCustomers} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete customer "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default CustomerManagement;
