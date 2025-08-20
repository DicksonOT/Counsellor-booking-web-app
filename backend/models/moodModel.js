import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, required: true }, 
  note: { type: String },
  date: { type: Date, default: Date.now }
})

const moodModel = mongoose.model('Mood', moodSchema);

export default moodModel