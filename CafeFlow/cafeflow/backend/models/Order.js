const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: String, // snapshot at time of order
    price: Number, // snapshot price
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true }, // e.g. ORD-20260630-0001
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    customerName: { type: String, default: 'Walk-in Customer' },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    gstPercent: { type: Number, default: 5 },
    gstAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Wallet'],
      default: 'Cash',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Completed',
    },
    orderDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

orderSchema.index({ orderId: 'text', customerName: 'text' });

module.exports = mongoose.model('Order', orderSchema);
