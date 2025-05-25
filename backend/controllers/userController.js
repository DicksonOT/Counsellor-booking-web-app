import validator from 'validator'
import {v2 as cloudinary} from 'cloudinary'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import counsellorModel from '../models/counsellorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Stripe from 'stripe'


// API to register user
const registerUser = async (req, res)=> {
try {
    const {name, email, password} = req.body


    if(!name || !email || !password){
        return res.json({success:false, message: 'Missing details'})
    }

    if(!validator.isEmail(email)){
        return res.json({success:false, message: 'Invalid email' })
    }

    if(password.length < 8){
        return res.json({success: false, message: 'Enter a strong password'})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    
    const userData = {
        name,
        email,
        password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
    res.json({success: true, token})

} catch (error) {
    console.log(error)
    return res.json({success:false, message: error.message})
}
}

// API for user login
const userLogin = async (req, res) =>{
    try {
        const {email, password} = req.body

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else{
            return res.json({success: false, message: 'Invalid credentials'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API for user profile
const userInfo = async (req, res) => {
      try {
      const userId = req.userId
      const userData = await userModel.findById(userId).select('-password')
      res.json({ success: true, userData })
    } catch (error) {
      console.log(error)
      return res.json({ success: false, message: error.message })
    }
}

// API for updating user profile
const updateProfile = async (req, res) =>{
    try {
        const { name, phone, location, dob, gender} = req.body
        const userId = req.userId
        const imageFile = req.file 

        if(!name || !phone || !dob || !gender || !location){
            return res.json({success: false, message: 'Missing details'})
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, location, dob, gender})

        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image: imageUrl})
        }

        res.json({success: true, message: 'Profile updated'})
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }

}

// API for booking appointment 
const bookAppointment = async (req, res) => {
    try {

        const userId = req.userId
        const {slotTime, slotDate, counId} = req.body

        const counData = await counsellorModel.findById(counId).select('-password')
        
        if (!counData.available){
            return res.json({success: false, message: 'Counsellor not available'})
        }

        let slots_booked = counData.slots_booked 

        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false, message: 'Slot not available'})
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')
        delete counData.slots_booked

        const appointmentData = {
            userId,
            counId,
            slotTime,
            slotDate,
            userData,
            counData,
            amount: counData.fees,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        await counsellorModel.findByIdAndUpdate(counId, {slots_booked})
        res.json({success: true, message: 'Appointment Booked'})

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
} 

// API toget user appointments
const listAppointments = async (req, res) => {
    try {
        const userId = req.userId
        const appointments = await appointmentModel.find({userId})

        if(!appointments){
            return res.json({success:false, message: 'You do not have any appointment'})
        }

        res.json({success: true, appointments})
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}

// API for cancelling appointment 
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId
        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify user
        if(appointmentData.userId !== userId){
            return res.json({success: false, message: 'You are not authorised'})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

        // releasing counsellor slot
        const {counId, slotTime, slotDate} = appointmentData

        const counData = await counsellorModel.findById(counId)

        let slots_booked = counData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter( e=> e !==slotTime)

        await counsellorModel.findByIdAndUpdate(counId, {slots_booked})
        res.json({success: true, message: 'Appointment Cancelled'})

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}
  
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// API for making payment
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId

    const appointmentData = await appointmentModel.findById(appointmentId);

    if(appointmentData.userId !== userId){
        return res.json({success: false, message: 'Unauthorised action'})
    }
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment does not exist or is cancelled' });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY,
            product_data: {
              name: 'Counselling Appointment',
            },
            unit_amount: appointmentData.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/my-appointment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: { appointmentId: appointmentId.toString()}
    })

    res.json({ success: true, url: session.url })

  } catch (error) {
    console.error(error)
    return res.json({ success: false, message: error.message })
  }
}

// Stripe Webhook Handler
const StripeWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature']
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

        let event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)

        console.log(event)
        // Handle successful payment
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            const appointmentId = session.metadata.appointmentId

            // Update appointment status in DB
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true, paymentId: session.payment_intent})
        }  

     res.json({ success: true })
    } catch (error) {
        console.error(error)
        return res.json({ success: false, message: error.message })
    }
}

// API for verifying payment
const verifyPayment = async (req, res) => {
    const { sessionId } = req.body

  if (!sessionId) {
    return res.json({ success: false, message: "No session ID provided" })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
 
    if (session.payment_status === 'paid') {
      await appointmentModel.findByIdAndUpdate(session.metadata.appointmentId,{ payment: true, paymentId: session.payment_intent})
      res.json({ success: true, message: 'Payment confirmed!' })
    } else {
        return res.json({success: false, message: 'Payment failed'})
    }

  } catch (error) {
    console.error(error)
    return res.json({ success:false, message: error.message })
  }
}

export {registerUser, userLogin, userInfo, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentStripe, StripeWebhook, verifyPayment }