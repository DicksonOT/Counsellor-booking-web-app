import mongoose from "mongoose";

const wellnessActivitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    activityType: { 
        type: String, 
        enum: ["daily_reflection", "mood_checking", "challenge", "meditation", "exercise", "journaling"], 
        required: true 
    },
    duration: { type: Number }, // in minutes
    difficulty: { 
        type: String, 
        enum: ["beginner", "intermediate", "advanced"], 
        default: "beginner" 
    },
    instructions: [{ type: String }],
    resources: [{
        type: { type: String }, // "article", "video", "audio", "pdf"
        url: { type: String },
        title: { type: String }
    }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participantCount: { type: Number, default: 0 },
    completions: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        completedAt: { type: Date, default: Date.now },
        reflection: { type: String },
        rating: { type: Number, min: 1, max: 5 }
    }],
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor' },
    
    // Add this new field for template-specific data
    templateData: {
        promptQuestions: [{ type: String }],
        moodScale: [{
            value: { type: Number },
            label: { type: String },
            color: { type: String }
        }],
        techniques: [{ type: String }],
        exerciseTypes: [{ type: String }],
        journalPrompts: [{ type: String }],
        challengeTypes: [{ type: String }]
    }
}, { 
    timestamps: true 
});

const WellnessActivity = mongoose.model('WellnessActivity', wellnessActivitySchema);
export default WellnessActivity;
