const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        enum: ['online', 'ccd', 'cse'],
        default: "online",
    }
}, { timestamps: true });

module.exports = mongoose.model("Schedule", ScheduleSchema);
