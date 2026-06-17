import Coupon from "../models/Coupon.model.js"
export const getAllCoupons = async()=>{
const coupons = await Coupon.find()
return coupons
}
export const createCoupons = async(data)=>{
const coupon = await Coupon.create(data)
return coupon
}
export const updateAnCouponById = async(id,data)=>{
const coupon = await Coupon.findByIdAndUpdate(id,data, {
      new: true,
      runValidators: true,
    })
    if (!coupon) {
  throw new Error("Coupon not found");
}
return coupon
}