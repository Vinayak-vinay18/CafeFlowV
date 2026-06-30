/**
 * Seed script - populates MongoDB with a default admin account and sample menu items.
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const MenuItem = require('../models/MenuItem');
const Settings = require('../models/Settings');

const menuItems = [
  // Coffee
  { name: 'Espresso', category: 'Coffee', price: 90, description: 'Strong and bold single shot espresso', image: '☕' },
  { name: 'Cappuccino', category: 'Coffee', price: 140, description: 'Espresso topped with steamed milk foam', image: '☕' },
  { name: 'Latte', category: 'Coffee', price: 150, description: 'Smooth espresso with steamed milk', image: '☕' },
  { name: 'Americano', category: 'Coffee', price: 120, description: 'Espresso diluted with hot water', image: '☕' },
  { name: 'Mocha', category: 'Coffee', price: 160, description: 'Espresso with chocolate and steamed milk', image: '☕' },
  { name: 'Cold Coffee', category: 'Coffee', price: 130, description: 'Chilled coffee blended with ice cream', image: '🧊' },
  // Tea
  { name: 'Masala Tea', category: 'Tea', price: 40, description: 'Classic Indian spiced tea', image: '🍵' },
  { name: 'Green Tea', category: 'Tea', price: 60, description: 'Light and refreshing antioxidant-rich tea', image: '🍵' },
  { name: 'Lemon Tea', category: 'Tea', price: 50, description: 'Zesty tea with fresh lemon', image: '🍵' },
  // Snacks
  { name: 'Sandwich', category: 'Snacks', price: 110, description: 'Grilled veg sandwich with cheese', image: '🥪' },
  { name: 'French Fries', category: 'Snacks', price: 100, description: 'Crispy golden fries with seasoning', image: '🍟' },
  { name: 'Garlic Bread', category: 'Snacks', price: 120, description: 'Toasted bread with garlic butter and herbs', image: '🍞' },
  { name: 'Burger', category: 'Snacks', price: 150, description: 'Juicy patty burger with fresh veggies', image: '🍔' },
  { name: 'Pizza', category: 'Snacks', price: 220, description: 'Wood-fired pizza with melted cheese', image: '🍕' },
  { name: 'Veg Puff', category: 'Snacks', price: 40, description: 'Flaky pastry with spiced vegetable filling', image: '🥐' },
  { name: 'Samosa', category: 'Snacks', price: 30, description: 'Crispy fried pastry with spiced potato filling', image: '🥟' },
  // Desserts
  { name: 'Brownie', category: 'Desserts', price: 130, description: 'Rich chocolate fudge brownie', image: '🍫' },
  { name: 'Ice Cream', category: 'Desserts', price: 90, description: 'Creamy vanilla ice cream scoop', image: '🍨' },
  { name: 'Donut', category: 'Desserts', price: 70, description: 'Glazed soft donut', image: '🍩' },
  { name: 'Chocolate Cake', category: 'Desserts', price: 150, description: 'Moist chocolate layered cake slice', image: '🍰' },
  // Beverages
  { name: 'Fresh Juice', category: 'Beverages', price: 90, description: 'Seasonal fresh fruit juice', image: '🧃' },
  { name: 'Milkshake', category: 'Beverages', price: 140, description: 'Thick and creamy flavored milkshake', image: '🥤' },
  { name: 'Soft Drinks', category: 'Beverages', price: 60, description: 'Chilled carbonated soft drink', image: '🥤' },
];

const seed = async () => {
  try {
    await connectDB();

    // Seed default admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cafeflow.com';
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      await Admin.create({
        name: 'Cafe Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
      });
      console.log(`✅ Default admin created -> ${adminEmail} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    } else {
      console.log('ℹ️  Admin already exists, skipping');
    }

    // Seed default settings
    const settingsExist = await Settings.findOne();
    if (!settingsExist) {
      await Settings.create({ cafeName: 'CafeFlow', gstPercent: 5 });
      console.log('✅ Default settings created');
    }

    // Seed menu items
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      await MenuItem.insertMany(menuItems);
      console.log(`✅ Seeded ${menuItems.length} menu items`);
    } else {
      console.log('ℹ️  Menu items already exist, skipping');
    }

    console.log('🎉 Seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
