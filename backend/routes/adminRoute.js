import express from 'express';
import { addCounsellor, adminDashboard, allCounsellors, updateCounsellorStatus, changeAvailability, getAllAppointments, loginAdmin, getPendingCounsellors, addProgram, getAllPrograms, updateProgram, deleteProgram, createCommunity, getDonationAnalytics, getDonations, exportDonations, getCounsellorsWithRevenue, getCounsellorRevenue, assignCounsellor, getAllChatRooms, unassignCounsellor } from '../controllers/adminControllers.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';


const adminRouter = express.Router();

adminRouter.post('/add-counsellor', authAdmin, upload.single('image'), addCounsellor)
adminRouter.post('/login', loginAdmin)

adminRouter.patch('/approve/:id', authAdmin, updateCounsellorStatus)
adminRouter.get('/pending-counsellors', authAdmin, getPendingCounsellors);

adminRouter.post('/all-counsellors', authAdmin, allCounsellors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)

adminRouter.get('/get-all-appointments', authAdmin, getAllAppointments)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

adminRouter.post("/add-program", authAdmin, addProgram);
adminRouter.get("/programs", authAdmin, getAllPrograms);
adminRouter.put("/update-program/:id", authAdmin, updateProgram);
adminRouter.delete("/delete-program/:id", authAdmin, deleteProgram);

adminRouter.post("/create-community", authAdmin, upload.single('image'), createCommunity)

adminRouter.get('/donation-analytics', authAdmin, getDonationAnalytics);
adminRouter.get('/donations', authAdmin, getDonations);
adminRouter.get('/export-donations', authAdmin, exportDonations);

adminRouter.get('/revenue-overview', authAdmin, getCounsellorsWithRevenue)
adminRouter.get('/revenue/:counsellorId', authAdmin, getCounsellorRevenue)

// chat management routes
adminRouter.get("/chat-rooms", authAdmin, getAllChatRooms);
adminRouter.post("/program/:programId/assign-counsellor", authAdmin, assignCounsellor);
adminRouter.delete("/program/:programId/unassign-counsellor/:counsellorId", authAdmin, unassignCounsellor );

export default adminRouter