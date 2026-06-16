import { createUserReview,getProductReviews,updateUserReview } from "../services/review.service.js";
export const createReview = async (req, res) => {
  try {
    const review = await createUserReview(req.user._id,req.params.productId,req.body);
    res.status(200).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getReviews = async (req, res) => {
  try {
    const reviews = await getProductReviews(req.params.productId);

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
export const updateReview = async (req, res) => {
  try {
    const review = await updateUserReview(
      req.user._id,
      req.params.reviewId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};