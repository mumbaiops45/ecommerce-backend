import { getAllCoupons,createCoupons,updateAnCouponById} from "../services/coupon.service.js";
export const getAllCoupon = async(req,res) =>{
 try {
    const coupons = await getAllCoupons();
    return res.status(200).json({ success: true,coupons});
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
export const createCoupon = async(req,res) =>{
 try {
    const coupons = await createCoupons(req.body);
    return res.status(200).json({ success: true,coupons});
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
export const updateCouponById = async(req,res) =>{
 try {
    const coupon = await updateAnCouponById(req.params.id,req.body);
    return res.status(200).json({ success: true,coupon});
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}