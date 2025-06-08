import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import counsellorModel from '../models/counsellorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

//API for adding counsellor 
const addCounsellor = async (req, res) => {
    try {
        
     const {name, email, password, specialty, degree, experience, about, fees, location} = req.body
     const imageFile = req.file
     
    //  checking for all data to add to counsellor
    if (!name || !email || !password|| !specialty || !degree || !experience || !about || !fees || !location || !imageFile) {
  return res.json({success:false, message: 'Missing details'})
}

    //  validating email format
     if(!validator.isEmail(email)){
        return res.json({success: false, message: 'Please enter a valid email'})
     }

    //  Validating strong password
    if(password.length < 8){
        return res.json({success: false, message: 'Please enter a strong Password'})
    }

    // hashing counsellor password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
    const imageURL = imageUpload.secure_url

    const counsellorData = {
        name,
        email,
        image: imageURL,
        password: hashedPassword,
        specialty,
        degree,
        experience,
        about,
        fees,
        location,
        date: Date.now()
    }

    const newCounsellor = new counsellorModel(counsellorData)
    await newCounsellor.save()

    res.json({success: true, message: 'Counsellor added'})

    } catch (error) {
     console.log(error)
     res.json({success: false, message: error.message})
    }
 }

// api for admin login
const loginAdmin = async (req, res) => {
    try {
        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token =  jwt.sign(email+password,process.env.JWT_SECRET )
            res.json({success: true, token})

        } else {
            res.json({success: false ,message: 'Invalid credentials'})
        }


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// API to get all counsellors list
const allCounsellors = async (req, res) => {
    try {
        
        const counsellors = await counsellorModel.find({}).select('-password')
        res.json({success: true, counsellors})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
        
    }
}
// API for changing counsellor availability
const changeAvailability = async (req, res) => {
    try {
        const {counId} = req.body
        const counData = await counsellorModel.findById(counId)
        await counsellorModel.findByIdAndUpdate(counId, {available: !counData.available})

        res.json({success: true, message: 'Availability Changed'})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}

// API for getting all appointments
const getAllAppointments = async (req,res) => {
    try {
         const appointmentData = await appointmentModel.find({})
         res.json({success:true, appointmentData})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// API for getting dashboard data
const adminDashboard = async (req, res) => {
    try {
        const counsellors = await counsellorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})   

        const dashboardData={
            counsellors: counsellors.length,
            appointments: appointments.length,
            users: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }
    
        res.json({success: true, dashboardData})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}
export {addCounsellor, loginAdmin, allCounsellors, getAllAppointments, adminDashboard, changeAvailability}


