import mongoose from "mongoose";

const CrisisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
  name: { type: String },        
  email: { type: String },       
  phone: { type: String },     
  urgent: { type: Boolean, default: true }, 
  category: { type: String },    
  description: { type: String, required: true },
  attachments: [{ url: String, public_id: String }], 
  status: { type: String, enum: ['open','in-progress','resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  notified: { type: Boolean, default: false } 
});

const crisisModel= mongoose.model('Crisis', CrisisSchema);

export default crisisModel
