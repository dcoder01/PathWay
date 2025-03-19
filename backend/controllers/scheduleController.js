const Errohandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const User = require('../models/userModel')
const Company = require('../models/companyModel')
const cloudinary = require("../config/cloudinary");
const ErrorHandler = require('../utils/errorhandler');
const ApplicationModel = require('../models/ApplicationModel');
const jobModel = require('../models/jobModel');
const userModel = require('../models/userModel');
const scheduleModel = require('../models/scheduleModel');

exports.fetchAllSchedules = catchAsyncError(async (req, res, next) => {

    const userId = req.user._id;
    if (!userId) return next(new ErrorHandler("User not found", 404))
    const application = await userModel.findById({ _id: userId }).populate({
        path: 'schedules',
        populate: {
            path: 'job',
            select:"title company"
        }
    });

    if (!application || !application.schedules) {
        return next(new Errohandler("No schedule found", 400))
    }
    return res.status(200).json({
        schedules:application.schedules,
        success: true
    })

})

//create sch
exports.createSchedule = catchAsyncError(async (req, res, next) => {

    const { jobId, userId } = req.params;
    const { date, time, location } = req.body;
    const createdBy = req.user._id;

    if (!jobId || !userId || !date || !time) {
        return next(new ErrorHandler("One or more fields are required", 400));
    }


    const job = await jobModel.findById(jobId);
    const user = await userModel.findById(userId)
    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    if (!user) return next(new ErrorHandler("User not found", 404));
    const newSchedule = await scheduleModel.create({
        job: jobId,
        createdBy,
        student: userId,
        date: new Date(date),
        time,
        location
    });

    const application = await ApplicationModel.findOneAndUpdate(
        { job: jobId, student: userId },  
        { schedule: newSchedule._id },   
        { new: true }           
    );

    if (!application) {
        return next(new ErrorHandler("Application not found for the given job and user", 404));
    }

    user.schedules.push(newSchedule._id)
    await user.save();
    return res.status(201).json({
        success: true,
        schedule: newSchedule
    });
});

//update
exports.updateSchedule = async (req, res, next) => {

    const { scheduleId } = req.params;
    const { date, time, location } = req.body;

    const updatedSchedule = await scheduleModel.findByIdAndUpdate(
        scheduleId,
        {
            date: date ? new Date(date) : undefined,
            time,
            location,
        },
        { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
        return next(new ErrorHandler("Schedule not found", 404));
    }

    return res.status(200).json({
        success: true,
        schedule: updatedSchedule
    });

};

//delete--> in the all schedule page by the coordinator he can deelte one
exports.deleteSchedule = async (req, res, next) => {

    const { scheduleId } = req.params;
    const schedule = await scheduleModel.findById(scheduleId);
    if (!schedule) {
        return next(new ErrorHandler("Schedule not found", 404));
    }
  
    await userModel.findByIdAndUpdate(schedule.student, {
        $pull: { schedules: scheduleId }
    });

    await ApplicationModel.findOneAndUpdate(
        { student: schedule.student, job: schedule.job },
        { $unset: { schedule: "" } } 
    );

    await scheduleModel.findByIdAndDelete(scheduleId);

    return res.status(200).json({
        success: true,
        message: "Schedule deleted successfully"
    });

};
///fetch all schedules
exports.fetchSchedules = async (req, res, next) => {
    const { jobId } = req.params;

    const schedules = await scheduleModel.find({ job: jobId })
        .populate("student", "name email")
        .sort({ date: 1, time: 1 });

    if (!schedules || schedules.length === 0) {
        return next(new ErrorHandler("No schedule found for this job", 404));
    }

    return res.status(200).json({
        success: true,
        schedules,
    });


};


