import express from 'express'
import upload from '../middlewares/multer.js'
import { addCounsellor } from '../controllers/adminControllers.js'
import { appointmentCancelled, appointmentComplete, counsellorAppointments, counsellorList, counsellorLogin, dashBoard, profileData, updateProfile } from '../controllers/counsellorController.js'
import authCounsellor from '../middlewares/authCounsellor.js'

const counsellorRouter = express.Router()

counsellorRouter.post('/login', counsellorLogin)
counsellorRouter.get('/list', counsellorList)
counsellorRouter.get('/counsellor-appointments', authCounsellor, counsellorAppointments)
counsellorRouter.post('/cancel-appointment', authCounsellor, appointmentCancelled)
counsellorRouter.post('/complete-appointment', authCounsellor, appointmentComplete)
counsellorRouter.get('/counsellor-dashboard', authCounsellor, dashBoard)
counsellorRouter.get('/profile', authCounsellor, profileData)
counsellorRouter.post('/update-profile', authCounsellor, updateProfile)
export default counsellorRouter 