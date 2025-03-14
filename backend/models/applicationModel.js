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
        enum: ["Applied", "OA", "Interview", "Accepted", "Rejected"],
        default: "Applied"
    },
    resume: {
        type: String,
        required: true
    }, // Cloudinary
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);
