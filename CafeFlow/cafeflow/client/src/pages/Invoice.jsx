import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdArrowBack, MdPrint, MdCoffee, MdReceiptLong } from 'react-icons/md';
import * as orderService from '../services/orderService';
import { useCafe } from '../context/CafeContext';

const Invoice = () => {
  const { id } = useParams();
  const { settings } = useCafe();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrder(id);
        setOrder(res.data.data);
      } catch {
        toast.error('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="card h-96 animate-pulse" />;
  if (!order) return <p className="text-center text-gray-400 py-10">Invoice not found.</p>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between print:hidden">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600">
          <MdArrowBack size={17} /> Back to Orders
        </Link>
        <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
          <MdPrint size={18} /> Print / Download PDF
        </button>
      </div>

      <div ref={printRef} className="card print:shadow-none print:border-0" id="invoice-print">
        <div className="flex items-start justify-between border-b border-dashed border-orange-200 dark:border-gray-700 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-gradient flex items-center justify-center text-white">
              <MdCoffee size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{settings?.cafeName || 'CafeFlow'}</h2>
              <p className="text-xs text-gray-400">{settings?.address || 'Smart Cafe Billing & Management'}</p>
              {settings?.phone && <p className="text-xs text-gray-400">{settings.phone}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Invoice No.</p>
            <p className="text-sm font-bold text-primary-600">{order.orderId}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(order.orderDate).toLocaleDateString()}</p>
            <p className="text-xs text-gray-400">{new Date(order.orderDate).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-1">Billed To</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{order.customerName}</p>
          {order.customer?.mobile && <p className="text-xs text-gray-400">{order.customer.mobile}</p>}
        </div>

        <table className="w-full text-sm mb-5">
          <thead>
            <tr className="text-left text-gray-400 text-xs uppercase border-b border-orange-50 dark:border-gray-700">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-orange-50 dark:border-gray-800 last:border-0">
                <td className="py-2.5 text-gray-700 dark:text-gray-200">{item.name}</td>
                <td className="py-2.5 text-center text-gray-500">{item.quantity}</td>
                <td className="py-2.5 text-right text-gray-500">₹{item.price}</td>
                <td className="py-2.5 text-right font-medium text-gray-700 dark:text-gray-200">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-full sm:w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>GST ({order.gstPercent}%)</span>
              <span>₹{order.gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Discount</span>
              <span>- ₹{order.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-800 dark:text-white pt-2 border-t border-orange-100 dark:border-gray-700">
              <span>Grand Total</span>
              <span className="text-primary-600">₹{order.grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 pt-1">
              <span>Payment Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-5 border-t border-dashed border-orange-200 dark:border-gray-700">
          <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300">
            <MdReceiptLong size={16} /> Thank You! Visit Again 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
