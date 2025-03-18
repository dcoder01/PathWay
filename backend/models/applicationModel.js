const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    status: {
        type: String,
        enum: ["applied", "oa", "interview", "accepted", "rejected"],
        default: "applied"
    },
    resume: {
        type: String,
        required: true
    }, // Cloudinary
    schedule:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
    }
    //schedule--application,from user in fetch applicants
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);
