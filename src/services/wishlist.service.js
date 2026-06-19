import Wishlist from "../models/wishlist.js"
export const createUserwishlist = async (UserId, data) => {
    const isProductExist = await Wishlist.findOne({
        user:UserId,
        product: data.productId
    })

    if(isProductExist){
        throw new Error("product already added in Wishlist");
        
    }
    const wishlist = await Wishlist.create({
        user: UserId,
        product: data.productId
    })
    return wishlist
}
export const getUserwishlist = async (Userid) => {
    const wishlist = await Wishlist.find({
        user: Userid,
    }).populate("product");
    return wishlist
}
export const DeleteUserwishlist = async (id) => {
    const wishlist = await Wishlist.findByIdAndDelete(id);
    return wishlist
}