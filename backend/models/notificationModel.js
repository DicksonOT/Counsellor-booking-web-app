import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['session_scheduled', 'session_updated', 'message', 'payment', 'general'], required: true },
  data: { type: Object, default: {} }, 
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const notificationModel = mongoose.model('Notification', notificationSchema);

export default notificationModel