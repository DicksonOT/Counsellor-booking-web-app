import express from 'express'
import upload from '../middlewares/multer.js'
import { addCounsellor } from '../controllers/adminControllers.js'
import { counsellorList, counsellorLogin } from '../controllers/counsellorController.js'
import authCounsellor from '../middlewares/authCounsellor.js'

const counsellorRouter = express.Router()

counsellorRouter.post('/login', counsellorLogin)
counsellorRouter.post('/add-counsellor', authCounsellor, upload.single('image'), addCounsellor)
counsellorRouter.get('/list', counsellorList)

export default counsellorRouter 