import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import * as customerService from '../../services/customerService';

const emptyForm = { name: '', mobile: '', email: '', address: '' };

const CustomerModal = ({ open, onClose, customer, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email || '',
        address: customer.address || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [customer, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile) {
      toast.error('Name and mobile number are required');
      return;
    }
    setSaving(true);
    try {
      if (customer) {
        await customerService.updateCustomer(customer._id, form);
        toast.success('Customer updated');
      } else {
        await customerService.createCustomer(form);
        toast.success('Customer added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={customer ? 'Edit Customer' : 'Add Customer'}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <textarea rows={2} className="input-field resize-none" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Customer address" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : customer ? 'Update' : 'Add Customer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;
