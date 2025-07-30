import mongoose from 'mongoose';

const scoreHistorySchema = new mongoose.Schema({
  score: { type: Number, required: true},
  source: { type: String, enum: ['chatbot', 'counselor', 'manual'], required: true},
  counId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
  date: { type: Date, default: Date.now}
})

const assessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalScore: { type: Number, default: 0},
  scoreHistory: [scoreHistorySchema]
})

const assessmentModel= mongoose.model('Assessment', assessmentSchema);

export default assessmentModel;
