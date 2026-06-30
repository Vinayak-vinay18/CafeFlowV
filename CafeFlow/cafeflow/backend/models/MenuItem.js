const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Coffee', 'Tea', 'Snacks', 'Desserts', 'Beverages'],
    },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' }, // URL or emoji-based placeholder
    description: { type: String, default: '' },
    available: { type: Boolean, default: true },
    timesSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

menuItemSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
