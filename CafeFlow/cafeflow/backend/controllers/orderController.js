const Order = require('../models/Order');
const Customer = require('../models/Customer');
const MenuItem = require('../models/MenuItem');
const Settings = require('../models/Settings');

const generateOrderId = async () => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(
    today.getDate()
  ).padStart(2, '0')}`;
  const count = await Order.countDocuments({
    orderDate: {
      $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    },
  });
  return `ORD-${dateStr}-${String(count + 1).padStart(4, '0')}`;
};

// @desc    Get all orders (search, filter by date/customer/status, pagination)
// @route   GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const { search = '', status = '', date = '', page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'All') query.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.orderDate = { $gte: start, $lt: end };
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('customer', 'name mobile customerId')
      .sort({ orderDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name mobile email customerId');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order (POS billing)
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { customerId, customerName, items, discount = 0, paymentMethod = 'Cash', gstPercent } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('Order must contain at least one item');
    }

    // Build order items with snapshot prices from DB (never trust client price)
    const orderItems = [];
    let subtotal = 0;

    for (const it of items) {
      const menuItem = await MenuItem.findById(it.menuItem);
      if (!menuItem) {
        res.status(404);
        throw new Error(`Menu item not found: ${it.menuItem}`);
      }
      const quantity = Number(it.quantity) || 1;
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      });
      subtotal += menuItem.price * quantity;
      menuItem.timesSold += quantity;
      await menuItem.save();
    }

    const settings = (await Settings.findOne()) || { gstPercent: 5 };
    const effectiveGst = gstPercent ?? settings.gstPercent ?? 5;
    const gstAmount = +((subtotal * effectiveGst) / 100).toFixed(2);
    const grandTotal = +(subtotal + gstAmount - Number(discount || 0)).toFixed(2);

    let customer = null;
    let finalCustomerName = customerName || 'Walk-in Customer';

    if (customerId) {
      customer = await Customer.findById(customerId);
      if (customer) finalCustomerName = customer.name;
    }

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      customer: customer ? customer._id : null,
      customerName: finalCustomerName,
      items: orderItems,
      subtotal: +subtotal.toFixed(2),
      gstPercent: effectiveGst,
      gstAmount,
      discount: Number(discount || 0),
      grandTotal,
      paymentMethod,
      status: 'Completed',
      orderDate: new Date(),
    });

    if (customer) {
      customer.totalOrders += 1;
      customer.totalSpent += grandTotal;
      customer.lastVisit = new Date();
      customer.purchaseHistory.push({ order: order._id, amount: grandTotal, date: new Date() });
      await customer.save();
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    order.status = status;
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    await order.deleteOne();
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus, deleteOrder, generateOrderId };
