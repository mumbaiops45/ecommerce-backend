import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";


export const getAnalyticsData =
  async () => {

    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments()
    ])



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

    const revenueLast30Days = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          revenue: {
            $sum: "$totalAmount"
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }
    ])

  const orderStatusDistribution = await Order.aggregate([
  {
    $group: {
      _id: "$orderStatus",
      count: {
        $sum: 1
      }
    }
  }
]);
    const distributionInPercentage = orderStatusDistribution.map((item) => ({
      status: item._id,
      percentage: ((item.count / totalOrders) * 100).toFixed(2)
    }))

    // new user this month

    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )
    const newUserThisMonth = await User.countDocuments({
      createdAt: {
        $gte: firstDayOfMonth
      }
    })
    // top selling product
    const topSellingProduct = await Order.aggregate([
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: "$items.product",

          name: {
            $first: "$items.name"
          },
          soldQuantity: {
            $sum: "$items.quantity"
          },
          revenue: {
            $sum: {
              $multiply: [
                "$items.quantity",
                "$items.price"
              ]
            }
          }
        }
      },
      {
        $sort: {
          soldQuantity: -1
        }
      },
      {
        $limit: 5
      }

    ])

    // resent order
    const resentOrder = await Order.find()
      .populate(
        "user",
        "name email"
      ).sort({
        createdAt: -1
      }).limit(5)

    // Low stock product

    const lowStockProduct = await Product.find().select("title stock image").sort({
      stock: 1
    }).limit(10)

    // monthly revenew

    const last12Months = new Date();
last12Months.setMonth(last12Months.getMonth() - 11);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
         createdAt : {
          $gte : last12Months
         }
        }
      },
      {
        $group: {
          _id: {
          year : {$year:"$createdAt"},
          month : {$month:"$createdAt"}
          },
          revenue:{
            $sum : "$totalAmount"
          }

        }
      },
      {
        $sort :{
          "_id.year" : 1,
          "_id.month": 1
        }
      }

    ])

    // Average Order Value
const avgOrderResult =
  await Order.aggregate([
    {
      $group: {
        _id: null,
        averageOrderValue: {
          $avg: "$totalAmount"
        }
      }
    }
  ]);


    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue:
        totalRevenue[0]?.revenue || 0,
      newUserThisMonth,
      revenueLast30Days,
      distributionInPercentage,
      topSellingProduct,
      lowStockProduct,
      monthlyRevenue,
      avgOrderResult :   avgOrderResult[0]?.averageOrderValue || 0,
       recentOrders: resentOrder
    };
  };