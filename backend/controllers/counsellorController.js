import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import counsellorModel from '../models/counsellorModel.js'
import validator from 'validator'
import appointmentModel from '../models/appointmentModel.js'

// API for counsellor register
// const registerCounsellor = async (req, res) => {
//     try {
//         const {name, email, password} = req.body
//         if(!name || !email || !password){
//             return res.json({success: false, message: 'Missing details'})
//         }

//         if(!validator.isEmail(email)){
//             return res.json({success: false, message: 'Invalid email'})
//         }

//         if(password.length < 8){
//             return res.json({success: false, message: 'Choose a strong password'})
//         }

//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(password, salt)

//         const counsellorData = {
//             name: name,
//             email: email,
//             password: hashedPassword
//         }

//         const newCounsellor = await counsellorModel(counsellorData)
//         await newCounsellor.save()

//         const counsellorData = await counsellorModel.find({})-

//     } catch (error) {
//         console.log(error.message)
//         res.json({success:false, message: error.message})
//     }
// }

// API for counsellor login
const counsellorLogin = async (req, res) => {
    try {
        const {email, password } = req.body

        const counsellor = await counsellorModel.findOne({email})

        if (!counsellor){
            return res.json({success: false, message: 'Counsellor does not exist' })
        }

        const isMatch = await bcrypt.compare(password, counsellor.password)

        if (isMatch){
            const token = jwt.sign({_id: counsellor._id}, process.env.JWT_SECRET)
            return res.json({success: true, token})
        } else{
            return res.json({success: false, message: 'Invalid credentials'})
        }
       
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

const changeAvailability = async (req, res) => {
    try {
        const counId = req.counId

        const counData = await counsellorModel.findById(counId)
        await counsellorModel.findByIdAndUpdate(counId, {available: !counData.available})

        res.json({success: true, message: 'Availability Changed'})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

const counsellorList = async (req, res) => {
    try {
        
        const counsellors = await counsellorModel.find({}).select(['-password', '-email'])
        res.json({success: true, counsellors})

    } catch (error) {
        console.log(error)
        return res.json({success: false, messsage: error.message})
    }
}

const counsellorAppointments = async (req, res)=>{
    try {
        const counId = req.counId
        
        const appointments = await appointmentModel.find({counId})
        res.json({success: true, appointments})

    } catch (error) {
        console.log(error)
       return res.json({success: false, messsage: error.message})
    }
}

// API for completing appointment
const appointmentComplete = async(req, res) => {
    try {
        const counId = req.counId
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.counId === counId){
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true})
            res.json({success: true, message: 'Appointment completed'})
        } else {
            return res.json({success: false, messsage: 'Mark failed'})
        }

    } catch (error) {
        console.log(error)
        return res.json({success: false, messsage: error.message})
    }
}
// API for cancelling appointments
const appointmentCancelled = async(req, res) => {
    try {
        const counId = req.counId 
        const {appointmentId} = req.body 
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.counId === counId){
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true})
            res.json({success: true, message: 'Appointment cancelled'})
        } else {
            
            return res.json({success: false, message: 'Cancellation failed'})
        }

    } catch (error) {
        console.log(error) 
        res.json({success: false, message: error.message}) 
    }
}

// API for admin dashboard
const dashBoard = async(req, res) => {
    try {
        const counId = req.counId

        const appointments = await appointmentModel.find({counId})
        let earnings = 0

        appointments.map((item)=>{
            if(item.isCompleted || item.payment) {
                earnings += Math.floor(item.amount - 0.1*item.amount)
            }
        })
         
        let clients=[]
        appointments.map((item)=> {
            if(!clients.includes(item.userId)){
                clients.push(item.userId)
            }
        })
        
        const dashData ={
            earnings,
            appointments: appointments.length,
            clients: clients.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success: true, dashData})
    } catch (error) {
        console.log(error) 
        res.json({success: false, message: error.message}) 
    }
}

// API for admin profile
const profileData = async (req, res) => {
    try {
        const counId = req.counId
        const profile = await counsellorModel.findById(counId).select('-password')

        res.json({success: true, profile})
    } catch (error) {
        console.log(error) 
        res.json({success: false, message: error.message}) 
    }
}

// API for admin project
const updateProfile = async (req, res) => {
    try {
        const counId = req.counId

        const {name, degree, experience, about, fees, location, available} = req.body

        await counsellorModel.findByIdAndUpdate(counId, {name, degree, experience, about, fees, location, available})
        res.json({success: true, message: 'Profile updated'})
    } catch (error) {
        console.log(error) 
        res.json({success: false, message: error.message}) 
    }
}
export {counsellorLogin,counsellorList,changeAvailability, counsellorAppointments, appointmentComplete, appointmentCancelled, dashBoard, profileData, updateProfile}