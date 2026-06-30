import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdRestaurantMenu } from 'react-icons/md';
import { motion } from 'framer-motion';
import MenuItemModal from '../components/menu/MenuItemModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/Skeleton';
import * as menuService from '../services/menuService';
import useDebounce from '../hooks/useDebounce';

const categories = ['All', 'Coffee', 'Tea', 'Snacks', 'Desserts', 'Beverages'];

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('name');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await menuService.getMenuItems({ search: debouncedSearch, category, sort });
      setItems(res.data.data);
    } catch (err) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sort]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await menuService.deleteMenuItem(deleteTarget._id);
      toast.success('Item deleted');
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Menu Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your cafe's menu items</p>
        </div>
        <button
          onClick={() => {
            setEditItem(null);
            setModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <MdAdd size={19} /> Add Item
        </button>
      </div>

      <div className="card flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
          <input
            className="input-field pl-10"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field md:w-44" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="input-field md:w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Sort: Name (A-Z)</option>
          <option value="priceAsc">Sort: Price (Low to High)</option>
          <option value="priceDesc">Sort: Price (High to Low)</option>
          <option value="newest">Sort: Newest First</option>
          <option value="popular">Sort: Most Popular</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card">
          <EmptyState icon={MdRestaurantMenu} title="No menu items found" message="Try adjusting your search or filters, or add a new item." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card hover:shadow-lg transition-shadow duration-200 flex flex-col"
            >
              <div className="h-28 rounded-xl bg-orange-light flex items-center justify-center text-5xl mb-3">
                {item.image || '🍽️'}
              </div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                <span
                  className={`badge text-[10px] ${item.available ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}
                >
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2 flex-1">{item.description || 'No description'}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="badge bg-orange-light text-primary-600">{item.category}</span>
                <span className="font-bold text-primary-600">₹{item.price}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditItem(item);
                    setModalOpen(true);
                  }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-1.5 py-2 text-sm"
                >
                  <MdEdit size={16} /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="btn-danger flex-1 flex items-center justify-center gap-1.5 py-2 text-sm"
                >
                  <MdDelete size={16} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <MenuItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editItem}
        onSaved={fetchItems}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default MenuManagement;
