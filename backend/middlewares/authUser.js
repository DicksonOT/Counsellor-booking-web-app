import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) =>{
    try {

        const {token} = req.headers
        if(!token){
            return res.json({success: false, message: "Not authorised. Log in"})
        } 

        const decode_token = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = decode_token.id

        next()
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export default authUser