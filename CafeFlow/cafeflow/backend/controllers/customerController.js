const Customer = require('../models/Customer');

const generateCustomerId = async () => {
  const count = await Customer.countDocuments();
  return `CUST-${String(count + 1).padStart(4, '0')}`;
};

// @desc    Get all customers (with search & pagination)
// @route   GET /api/customers
const getCustomers = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { customerId: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: customers,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer with purchase history
// @route   GET /api/customers/:id
const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate({
      path: 'purchaseHistory.order',
      select: 'orderId grandTotal status orderDate items',
    });
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Create customer
// @route   POST /api/customers
const createCustomer = async (req, res, next) => {
  try {
    const { name, mobile, email, address } = req.body;
    if (!name || !mobile) {
      res.status(400);
      throw new Error('Name and mobile number are required');
    }

    const existing = await Customer.findOne({ mobile });
    if (existing) {
      res.status(400);
      throw new Error('A customer with this mobile number already exists');
    }

    const customerId = await generateCustomerId();
    const customer = await Customer.create({ customerId, name, mobile, email, address });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }
    const { name, mobile, email, address } = req.body;
    customer.name = name ?? customer.name;
    customer.mobile = mobile ?? customer.mobile;
    customer.email = email ?? customer.email;
    customer.address = address ?? customer.address;
    await customer.save();
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404);
      throw new Error('Customer not found');
    }
    await customer.deleteOne();
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top customers by spending
// @route   GET /api/customers/top/list
const getTopCustomers = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const customers = await Customer.find().sort({ totalSpent: -1 }).limit(Number(limit));
    res.json({ success: true, data: customers });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getTopCustomers,
  generateCustomerId,
};
