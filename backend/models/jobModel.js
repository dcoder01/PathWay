const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: Number,
        required: true
    },
    location: [{
        type: String,
        required: true
    }],
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    createdBy: { //this will be the coordinator
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);
