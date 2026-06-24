import {
  getAnalyticsData,
} from "../services/analytics.service.js";

export const getDashboardAnalytics =
  async (req, res) => {
    try {
      const data =
        await getAnalyticsData();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };