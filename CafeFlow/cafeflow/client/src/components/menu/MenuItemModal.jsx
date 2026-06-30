import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import * as menuService from '../../services/menuService';

const categories = ['Coffee', 'Tea', 'Snacks', 'Desserts', 'Beverages'];
const emojiMap = {
  Coffee: '☕',
  Tea: '🍵',
  Snacks: '🍔',
  Desserts: '🍰',
  Beverages: '🥤',
};

const emptyForm = { name: '', category: 'Coffee', price: '', description: '', image: '', available: true };

const MenuItemModal = ({ open, onClose, item, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description || '',
        image: item.image || '',
        available: item.available,
      });
    } else {
      setForm(emptyForm);
    }
  }, [item, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Please fill in item name and price');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), image: form.image || emojiMap[form.category] };
      if (item) {
        await menuService.updateMenuItem(item._id, payload);
        toast.success('Menu item updated');
      } else {
        await menuService.createMenuItem(payload);
        toast.success('Menu item added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit Menu Item' : 'Add Menu Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-text">Item Name</label>
          <input
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Cappuccino"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Category</label>
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Price (₹)</label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Emoji / Image URL</label>
          <input
            className="input-field"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder={`Default: ${emojiMap[form.category]}`}
          />
        </div>

        <div>
          <label className="label-text">Description</label>
          <textarea
            rows={3}
            className="input-field resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short description of the item"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="w-4 h-4 accent-primary-500"
          />
          Available for sale
        </label>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MenuItemModal;
