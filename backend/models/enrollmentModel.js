import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  progress: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "completed"], default: "active" }
}, { timestamps: true });
 
const enrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

export default enrollmentModel 