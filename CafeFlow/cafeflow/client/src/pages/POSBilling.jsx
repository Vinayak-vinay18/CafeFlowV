import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdSearch, MdAdd, MdRemove, MdDeleteOutline, MdPerson, MdShoppingCart, MdReceiptLong } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerSelectModal from '../components/billing/CustomerSelectModal';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/Skeleton';
import * as menuService from '../services/menuService';
import * as orderService from '../services/orderService';
import { useCafe } from '../context/CafeContext';
import useDebounce from '../hooks/useDebounce';

const categories = ['All', 'Coffee', 'Tea', 'Snacks', 'Desserts', 'Beverages'];

const POSBilling = () => {
  const navigate = useNavigate();
  const {
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    cartSubtotal,
    selectedCustomer,
    setSelectedCustomer,
    settings,
  } = useCafe();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [placing, setPlacing] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const gstPercent = settings?.gstPercent ?? 5;

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await menuService.getMenuItems({ search: debouncedSearch, category, available: true });
      setItems(res.data.data);
    } catch {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const gstAmount = +((cartSubtotal * gstPercent) / 100).toFixed(2);
  const grandTotal = +(cartSubtotal + gstAmount - Number(discount || 0)).toFixed(2);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty. Add items to proceed.');
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        customerId: selectedCustomer?._id || null,
        customerName: selectedCustomer?.name,
        items: cart.map((c) => ({ menuItem: c.menuItem, quantity: c.quantity })),
        discount: Number(discount || 0),
        paymentMethod,
        gstPercent,
      };
      const res = await orderService.createOrder(payload);
      toast.success('Order placed successfully!');
      clearCart();
      setDiscount(0);
      navigate(`/invoice/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 h-full">
      {/* LEFT: Menu */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">POS Billing</h1>
          <p className="text-sm text-gray-400 mt-1">Select items to add to the order</p>
        </div>

        <div className="card flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
            <input
              className="input-field pl-10"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  category === c
                    ? 'bg-orange-gradient text-white shadow-soft'
                    : 'bg-orange-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="card">
            <EmptyState title="No items found" message="Try a different search term or category." />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <motion.button
                key={item._id}
                whileTap={{ scale: 0.96 }}
                onClick={() => addToCart(item)}
                className="card text-left hover:shadow-lg hover:border-primary-300 transition-all duration-150"
              >
                <div className="h-20 rounded-xl bg-orange-light flex items-center justify-center text-4xl mb-2">
                  {item.image || '🍽️'}
                </div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white truncate">{item.name}</h4>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-primary-600 font-bold text-sm">₹{item.price}</span>
                  <span className="w-6 h-6 rounded-full bg-orange-gradient text-white flex items-center justify-center">
                    <MdAdd size={14} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Cart */}
      <div className="card flex flex-col h-fit xl:sticky xl:top-20 max-h-[calc(100vh-7rem)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <MdShoppingCart size={19} /> Current Order
          </h3>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs text-red-500 hover:underline">Clear All</button>
          )}
        </div>

        <button
          onClick={() => setCustomerModalOpen(true)}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-orange-300 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors mb-4"
        >
          <div className="w-9 h-9 rounded-full bg-orange-light text-primary-600 flex items-center justify-center flex-shrink-0">
            <MdPerson size={18} />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
              {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
            </p>
            <p className="text-xs text-gray-400">{selectedCustomer ? selectedCustomer.mobile : 'Tap to select customer'}</p>
          </div>
        </button>

        <div className="flex-1 overflow-y-auto space-y-3 min-h-[120px]">
          <AnimatePresence>
            {cart.length === 0 ? (
              <EmptyState icon={MdShoppingCart} title="Cart is empty" message="Tap menu items to add them here." />
            ) : (
              cart.map((c) => (
                <motion.div
                  key={c.menuItem}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50/60 dark:bg-gray-800"
                >
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                    {c.image || '🍽️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{c.name}</p>
                    <p className="text-xs text-gray-400">₹{c.price} x {c.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => decreaseQty(c.menuItem)} className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 border border-orange-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300">
                      <MdRemove size={13} />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{c.quantity}</span>
                    <button onClick={() => increaseQty(c.menuItem)} className="w-6 h-6 rounded-full bg-orange-gradient text-white flex items-center justify-center">
                      <MdAdd size={13} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(c.menuItem)} className="text-gray-400 hover:text-red-500">
                    <MdDeleteOutline size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {cart.length > 0 && (
          <div className="mt-4 pt-4 border-t border-orange-100 dark:border-gray-700 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-text text-xs">Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="input-field py-2 text-sm"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div>
                <label className="label-text text-xs">Payment</label>
                <select className="input-field py-2 text-sm" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Wallet</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>GST ({gstPercent}%)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Discount</span>
                <span>- ₹{Number(discount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-800 dark:text-white pt-2 border-t border-orange-100 dark:border-gray-700">
                <span>Grand Total</span>
                <span className="text-primary-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <MdReceiptLong size={19} />
              {placing ? 'Generating Bill...' : 'Generate Bill'}
            </button>
          </div>
        )}
      </div>

      <CustomerSelectModal
        open={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        onSelect={setSelectedCustomer}
      />
    </div>
  );
};

export default POSBilling;
