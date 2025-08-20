import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  counId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  sessionType: { type: String, enum: ['video', 'audio', 'chat'], required: true },
  duration: { type: Number, required: true }, // in minutes
  scheduledTime: { type: Date, required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { type: String, enum: ['scheduled', 'active', 'completed', 'cancelled'], default: 'scheduled' },
  roomId: { type: String },
  notes: { type: String },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
})

const sessionModel = mongoose.model('Session', sessionSchema);

export default sessionModel

