import jwt from "jsonwebtoken";

const authCounsellor = async (req, res, next) => {
  try {
    const token = req.headers

    if(!token){
      return res.json({success: false, message: 'Unauthorised login'})
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    counId.req = decodedToken._id

    next()
  } catch (error) {
    return res.json({message:error.message})
  }
};

export default authCounsellor
