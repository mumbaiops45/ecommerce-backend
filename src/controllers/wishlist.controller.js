import { createUserwishlist, getUserwishlist, DeleteUserwishlist} from "../services/wishlist.service.js"

export const createwishlist = async (req, res) => {
    try {
        const wishlist = await createUserwishlist(req.user._id, req.body)
        res.json({ success: true, wishlist })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const getwishlist = async (req, res) => {
    try {
        const wishlist = await getUserwishlist(req.user._id)
        res.json({ success: true, wishlist })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const Deletewishlist = async (req, res) => {
    try {
        const wishlist = await DeleteUserwishlist(req.params.Id)
        res.json({ success: true, wishlist })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}