import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import counsellorModel from '../models/counsellorModel.js'
import validator from 'validator'

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
            const token = jwt.sign({id: counsellor._id}, process.env.JWT_SECRET)
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
        const {counId} = req.body

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
         res.json({success: false, messsage: error.message})
    }
}
export {counsellorLogin,counsellorList,changeAvailability }