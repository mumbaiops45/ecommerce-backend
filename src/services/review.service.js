import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import Review from "../models/review.model.js";
import Order from "../models/Order.model.js";
export const createUserReview =async (userId,productId,data) =>{
  const { rating, comment } = data;

  
    // Validate product id
  if (
    !mongoose.Types.ObjectId.isValid(
      productId
    )
  ) {
    throw new Error(
      "Invalid product ID"
    );
  }

  // Product exists?
  const product =
    await Product.findById(productId);

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }
   // User bought and received product?
  const order =
    await Order.findOne({
      user: userId,
      paymentStatus: "paid",
      orderStatus: "delivered",
      "items.product": productId,
    });

  if (!order) {
    throw new Error(
      "You can review only delivered products."
    );
  }
  const alreadyReview = await Review.findOne({
    user:userId,
    product:productId
  })
  if (alreadyReview) {
    throw new Error("you already revieved this Product");
    
  }
  const review = await Review.create({
    user:userId,
    product:productId,
    rating,
    comment
  })
  return review

}
export const getProductReviews = async (productId) => {
  return Review.find({ product: productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
};


export const updateUserReview = async (
  userId,
  reviewId,
  data
) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // ensure only owner can update
  if (review.user.toString() !== userId.toString()) {
    throw new Error("You can only edit your own review");
  }

  // prevent empty update
  if (!data.rating && !data.comment) {
    throw new Error("Nothing to update");
  }

  // rating validation (safe correction)
  if (data.rating !== undefined) {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    review.rating = data.rating;
  }

  // comment update
  if (data.comment !== undefined) {
    review.comment = data.comment.trim();
  }

  await review.save();

  return review;
};