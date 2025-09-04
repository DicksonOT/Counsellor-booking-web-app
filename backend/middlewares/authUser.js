import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorised. Log in" })
        } 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id

        // Fetch user with role
        const user = await userModel.findById(decoded.id).select('email role name')
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Attach full user object for later use
        req.user = user  

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, message: "Unauthorized" })
    }
}

export default authUser
