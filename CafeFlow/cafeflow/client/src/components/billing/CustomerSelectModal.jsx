import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { MdSearch, MdPersonAdd } from 'react-icons/md';
import Modal from '../common/Modal';
import * as customerService from '../../services/customerService';
import useDebounce from '../../hooks/useDebounce';

const CustomerSelectModal = ({ open, onClose, onSelect }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMode, setNewMode] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', email: '', address: '' });
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerService.getCustomers({ search: debouncedSearch, limit: 8 });
      setResults(res.data.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (open && !newMode) fetchCustomers();
  }, [open, newMode, fetchCustomers]);

  useEffect(() => {
    if (!open) {
      setNewMode(false);
      setSearch('');
      setForm({ name: '', mobile: '', email: '', address: '' });
    }
  }, [open]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile) {
      toast.error('Name and mobile number are required');
      return;
    }
    setSaving(true);
    try {
      const res = await customerService.createCustomer(form);
      toast.success('Customer added');
      onSelect(res.data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add customer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Select Customer">
      {!newMode ? (
        <div className="space-y-4">
          <div className="relative">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
            <input
              autoFocus
              className="input-field pl-10"
              placeholder="Search by name or mobile number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setNewMode(true)}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <MdPersonAdd size={18} /> Add New Customer
          </button>

          <button
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            className="text-xs text-gray-400 hover:text-primary-600 w-full text-center"
          >
            Continue as Walk-in Customer
          </button>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {loading ? (
              <p className="text-sm text-gray-400 text-center py-4">Searching...</p>
            ) : results.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No customers found</p>
            ) : (
              results.map((c) => (
                <button
                  key={c._id}
                  onClick={() => {
                    onSelect(c);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-orange-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.mobile}</p>
                  </div>
                  <span className="text-xs text-primary-600 font-medium">{c.customerId}</span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Customer name" />
          </div>
          <div>
            <label className="label-text">Mobile Number</label>
            <input className="input-field" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="10-digit mobile number" />
          </div>
          <div>
            <label className="label-text">Email (optional)</label>
            <input className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="customer@email.com" />
          </div>
          <div>
            <label className="label-text">Address (optional)</label>
            <input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Customer address" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setNewMode(false)} className="btn-secondary flex-1">Back</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Add & Select'}</button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default CustomerSelectModal;
