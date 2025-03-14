const mongoose = require("mongoose");
// const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ['student', 'coordinator', 'recruiter', 'tpo'],
            default: 'student'
        },
        isApproved: {
            type: Boolean,
            default: function () {
                // Students are auto-approved, others need TPO approval
                return this.role === 'student' || this.role === 'tpo';
            }
        },
        appiledJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            }
        ],
        schedules: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Schedule',
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        },
        profile: {
            fullName:{type:String},
            dob: { type: Date },
            workEmail: { type: String },
            phone: { type: String },
            enrollment: { type: String },
            registration: { type: String },
            branch: { type: String },
            cgpa: { type: Number, min: 0, max: 10 },
            address: { type: String },
            gender: { type: String, enum: ["Male", "Female", "Other"] },
            resumeLink: { type: String },
            gapYear: { type: Number, default: 0 },
            tenthPercentage: { type: Number, min: 0, max: 100 },
            twelfthPercentage: { type: Number, min: 0, max: 100 },
            activeBacklogs: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model("User", userSchema);
