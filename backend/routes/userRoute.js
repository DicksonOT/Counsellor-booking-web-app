import express from 'express'
import { bookAppointment, cancelAppointment, listAppointments, paymentStripe, registerUser, StripeWebhook, updateProfile, userInfo, userLogin, verifyPayment } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import rawBody from '../middlewares/rawBody.js'


const userRouter = express.Router()

userRouter.get('/payment-success', (req, res) => {
  const { session_id } = req.query
  res.redirect(`${process.env.FRONTEND_URL}/payment-success?session_id=${session_id}`)
})

userRouter.post('/register', registerUser)
userRouter.post('/login', userLogin)


userRouter.get('/info', authUser, userInfo)
userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile)

userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments',authUser, listAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)

userRouter.post ('/payment-stripe', authUser, paymentStripe)
userRouter.post('/stripe-webhook', rawBody, StripeWebhook)
userRouter.post('/verify-payment', verifyPayment)


export default userRouter