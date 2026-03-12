const mongoose = require("mongoose");

const studentDataSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sleepHours: {
        type: String,
        // required: true
    },
    studyHours: {
        type: String,
        // required: true
    },
    exerciseDays: {
        type: String,
        // required: true
    },
    socialMediaHours: {
        type: String,
        // required: true
    },
    stressLevel: {
        type: String, // 'low', 'medium', 'high'
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const StudentData = mongoose.model("StudentData", studentDataSchema);

// FIX: Changed this line to use CommonJS export
module.exports = StudentData;