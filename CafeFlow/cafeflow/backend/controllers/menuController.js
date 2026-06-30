const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items (search, filter by category, sort, pagination)
// @route   GET /api/menu
const getMenuItems = async (req, res, next) => {
  try {
    const { search = '', category = '', sort = 'name', available } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;
    if (available !== undefined) query.available = available === 'true';

    let sortOption = { name: 1 };
    if (sort === 'priceAsc') sortOption = { price: 1 };
    if (sort === 'priceDesc') sortOption = { price: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { timesSold: -1 };

    const items = await MenuItem.find(query).sort(sortOption);
    res.json({ success: true, data: items, count: items.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
const getMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create menu item
// @route   POST /api/menu
const createMenuItem = async (req, res, next) => {
  try {
    const { name, category, price, image, description, available } = req.body;
    if (!name || !category || price === undefined) {
      res.status(400);
      throw new Error('Name, category and price are required');
    }
    const item = await MenuItem.create({ name, category, price, image, description, available });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }
    Object.assign(item, req.body);
    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }
    await item.deleteOne();
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get most & least sold items
// @route   GET /api/menu/stats/popularity
const getPopularityStats = async (req, res, next) => {
  try {
    const mostSold = await MenuItem.find().sort({ timesSold: -1 }).limit(5);
    const leastSold = await MenuItem.find().sort({ timesSold: 1 }).limit(5);
    res.json({ success: true, data: { mostSold, leastSold } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getPopularityStats,
};
