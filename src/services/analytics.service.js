import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";

export const getAnalyticsData =
  async () => {

    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments({
        isActive: true,
      });

    const totalOrders =
      await Order.countDocuments();

    const totalRevenue =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue:
        totalRevenue[0]?.revenue || 0,
    };
  };