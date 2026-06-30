const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true }, // e.g. CUST-0001
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    address: { type: String, default: '' },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastVisit: { type: Date, default: null },
    dateJoined: { type: Date, default: Date.now },
    purchaseHistory: [
      {
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        amount: Number,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

customerSchema.index({ name: 'text', mobile: 'text', email: 'text' });

module.exports = mongoose.model('Customer', customerSchema);
