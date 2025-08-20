import mongoose from "mongoose";

const counsellorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Credentials
  gpcNumber: { type: String, required: true },
  degree: { type: String, required: true },

  // Document paths
  cvPath: { type: String },
  certificatePaths: { type: [String] },
  licensePath: { type: String },

  // Experience
  experienceYears: { type: String },
  specialty: { type: String },

  // Final details
  about: { type: String, required: true },
  fees: { type: Number, required: true },
  location: { type: String, required: true },
  image: { type: String },

  // Availability toggle
  available: { type: Boolean, default: true },

  // Session type
  sessionType: {
    type: String,
    enum: ["online", "physical", "hybrid"],
    default: "online"
  },

  // Timezone for slot conversion
  timeZone: { type: String, default: "UTC" },

  // Slots and booking status
  date: { type: Date, default: Date.now },
  slots_booked: { type: Object, default: {} },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // Preferred slot format
  preferredSlots: [
    {
      date: { type: String },  
      start: { type: String },  
      end: { type: String },    
      note: { type: String, default: '' }
    }
  ]
}, { minimize: false, timestamps: true });

const counsellorModel = mongoose.models.counsellors || mongoose.model('Counsellor', counsellorSchema);

export default counsellorModel;
