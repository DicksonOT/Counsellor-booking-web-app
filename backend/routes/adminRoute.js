import express from 'express';
import { addCounsellor, adminDashboard, allCounsellors, updateCounsellorStatus, changeAvailability, getAllAppointments, loginAdmin , getPendingCounsellors} from '../controllers/adminControllers.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';


const adminRouter = express.Router();

adminRouter.post('/add-counsellor', authAdmin, upload.single('image'), addCounsellor)
adminRouter.post('/login', loginAdmin)

adminRouter.patch('/approve/:id', authAdmin, updateCounsellorStatus)
adminRouter.get('/pending-counsellors', authAdmin, getPendingCounsellors);

adminRouter.post('/all-counsellors', authAdmin, allCounsellors)
adminRouter.post('/change-availability', authAdmin, changeAvailability )

adminRouter.get('/get-all-appointments', authAdmin, getAllAppointments)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter