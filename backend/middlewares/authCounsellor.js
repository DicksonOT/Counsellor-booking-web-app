import jwt from "jsonwebtoken";

const authCounsellor = async (req, res, next) => {
   try {
  
          const {ctoken} = req.headers
          
          if(!ctoken){
              return res.json({success: false, message: "Not authorised. Log in"})
          } 
  
          const decodedToken = jwt.verify(ctoken, process.env.JWT_SECRET)
          
          req.counId = decodedToken._id 
          next()
      } catch (error) {
          console.log(error)
          res.json({success:false, message: error.message})
      }
}

export default authCounsellor
