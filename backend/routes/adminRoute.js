import express from 'express';
import { addCounsellor, adminDashboard, allCounsellors, getAllAppointments, loginAdmin } from '../controllers/adminControllers.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/counsellorController.js';

const adminRouter = express.Router();

adminRouter.post('/add-counsellor', authAdmin, upload.single('image'), addCounsellor)
adminRouter.post('/login', loginAdmin)

adminRouter.post('/all-counsellors', authAdmin, allCounsellors)
adminRouter.post('/change-availability', authAdmin, changeAvailability )

adminRouter.get('/get-all-appointments', authAdmin, getAllAppointments)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter