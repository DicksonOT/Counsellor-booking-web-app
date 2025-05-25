import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongoDB.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import counsellorRouter from './routes/counsellorRoute.js'
import userRouter from './routes/userRoute.js'

// app config
const app=express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
app.use(cors())


// Apply express.json() to all routes EXCEPT Stripe webhook
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl === '/api/user/stripe-webhook') {
        req.rawBody = buf.toString() // Preserve raw body for Stripe
      }
    },
  })
)

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/counsellor', counsellorRouter)
app.use('/api/user', userRouter)

app.get('/', (req,res)=>{
    res.send('API WORKING very well')
})

app.listen(port, ()=> console.log('Server started', port))