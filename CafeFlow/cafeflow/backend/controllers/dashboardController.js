const Order = require('../models/Order');
const Customer = require('../models/Customer');
const MenuItem = require('../models/MenuItem');

const startOfDay = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
};

// @desc    Dashboard summary stats + recent orders + graph data
// @route   GET /api/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const today = startOfDay();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayOrders, totalCustomers, totalMenuItems, recentOrders] = await Promise.all([
      Order.find({ orderDate: { $gte: today, $lt: tomorrow }, status: { $ne: 'Cancelled' } }),
      Customer.countDocuments(),
      MenuItem.countDocuments(),
      Order.find().sort({ orderDate: -1 }).limit(8).populate('customer', 'name'),
    ]);

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);

    // Last 7 days revenue/orders graph
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const day = daysAgo(i);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      last7.push({ day, nextDay });
    }

    const revenueGraph = await Promise.all(
      last7.map(async ({ day, nextDay }) => {
        const orders = await Order.find({
          orderDate: { $gte: day, $lt: nextDay },
          status: { $ne: 'Cancelled' },
        });
        return {
          date: day.toISOString().slice(0, 10),
          revenue: +orders.reduce((s, o) => s + o.grandTotal, 0).toFixed(2),
          orders: orders.length,
        };
      })
    );

    res.json({
      success: true,
      data: {
        todayRevenue: +todayRevenue.toFixed(2),
        todayOrders: todayOrders.length,
        totalCustomers,
        totalMenuItems,
        recentOrders,
        revenueGraph,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sales analytics - daily/weekly/monthly + most/least sold + top customers
// @route   GET /api/sales
const getSalesAnalytics = async (req, res, next) => {
  try {
    const today = startOfDay();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekStart = daysAgo(6);
    const monthStart = daysAgo(29);

    const [dailyOrders, weeklyOrders, monthlyOrders, allOrders] = await Promise.all([
      Order.find({ orderDate: { $gte: today, $lt: tomorrow }, status: { $ne: 'Cancelled' } }),
      Order.find({ orderDate: { $gte: weekStart, $lt: tomorrow }, status: { $ne: 'Cancelled' } }),
      Order.find({ orderDate: { $gte: monthStart, $lt: tomorrow }, status: { $ne: 'Cancelled' } }),
      Order.find({ status: { $ne: 'Cancelled' } }),
    ]);

    const sum = (orders) => +orders.reduce((s, o) => s + o.grandTotal, 0).toFixed(2);

    // Daily breakdown for last 30 days (for monthly chart)
    const dailyBreakdown = [];
    for (let i = 29; i >= 0; i--) {
      const day = daysAgo(i);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const dayOrders = monthlyOrders.filter((o) => o.orderDate >= day && o.orderDate < next);
      dailyBreakdown.push({
        date: day.toISOString().slice(0, 10),
        revenue: sum(dayOrders),
        orders: dayOrders.length,
      });
    }

    const mostSold = await MenuItem.find().sort({ timesSold: -1 }).limit(5);
    const leastSold = await MenuItem.find().sort({ timesSold: 1 }).limit(5);
    const topCustomers = await Customer.find().sort({ totalSpent: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        dailySales: sum(dailyOrders),
        weeklySales: sum(weeklyOrders),
        monthlySales: sum(monthlyOrders),
        totalRevenue: sum(allOrders),
        totalOrders: allOrders.length,
        dailyBreakdown,
        mostSold,
        leastSold,
        topCustomers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getSalesAnalytics };
