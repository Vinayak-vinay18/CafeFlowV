const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    cafeName: { type: String, default: 'CafeFlow' },
    gstPercent: { type: Number, default: 5 },
    logoUrl: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
