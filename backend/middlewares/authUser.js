import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: "Not authorised. Log in" })
        } 

        const decode_token = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decode_token.id

        const userData = await userModel.findById(decode_token.id).select('email')
        if (userData) {
            req.userEmail = userData.email
        }

        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser