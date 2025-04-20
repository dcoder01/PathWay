const Errohandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const User = require('../models/userModel')
const Company = require('../models/companyModel')
const cloudinary = require("../config/cloudinary");
const ErrorHandler = require('../utils/errorhandler');
const ApplicationModel = require('../models/ApplicationModel');
const jobModel = require('../models/jobModel');
const userModel = require('../models/userModel');
const redisCache = require('../utils/redisCache');

exports.applyJob = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
    const jobId = req.params.jobId;
    const file = req.file;


    if (!jobId || !file) {
        return next(new Errohandler("One or more fields are required.", 400))
    };
    const existingApplication = await ApplicationModel.findOne({ job: jobId, student: userId });

    if (existingApplication) {
        return next(new Errohandler("You have already applied for this jobs", 400))
    }
    //check if the jobs exists
    const job = await jobModel.findById(jobId);
    if (!job) {
        return next(new Errohandler("Job not found", 400))
    }
    const user = await userModel.findById(userId)
    if (!user) return next(new ErrorHandler("User not found", 404))


    //cloudinary upload
    let resume = null
    if (file) {
        const originalFilename = file.originalname.split('.')[0];
        const uniqueFilename = `${originalFilename}_${Date.now()}`;

        const fileResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                folder: 'pathway',
                public_id: uniqueFilename,
                use_filename: false,
                unique_filename: false,
            }, (error, result) => {
                if (error) {
                    return reject(new ErrorHandler('File upload failed', 500));
                }
                resolve(result);
            }).end(file.buffer);
        });

        resume = fileResult.secure_url;
    }

    const newApplication = await ApplicationModel.create({
        student: userId,
        job: jobId,
        applicant: userId,
        resume
    });

    job.applications.push(newApplication._id);
    await job.save();

    user.applications = newApplication._id
    await user.save()
    await redisCache.del(`myApplications:${userId}`);
    await redisCache.del(`applicants:${jobId}`);
    await redisCache.del(`createdJobs:${job.createdBy}`);

    return res.status(200).json({
        success: true
    })

})


//get all the applied jobs by yourself --> student 
//TODO:we can directly get the appliedJobs of astudent by appliedjobs field
exports.fetchAppliedJobs = catchAsyncError(async (req, res, next) => {

    const userId = req.user._id;

    const myApplications = await redisCache.get(`myApplications:${userId}`);
    if (myApplications) {
        return res.status(200).json({
            applications: myApplications,
            success: true,
        });
    }
    const applications = await ApplicationModel.find({ student: userId }).sort({ createdAt: -1 }).populate({
        path: 'job',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'company',
            options: { sort: { createdAt: -1 } },
        }
    });
    if (!applications) {
        return next(new ErrorHandler('No Applications', 400));
    };

    await redisCache.set(`myApplications:${userId}`, applications);
    return res.status(200).json({
        applications,
        success: true
    })

})

//fetch applicants by coordinator and recruiter
exports.fetchApplicants = catchAsyncError(async (req, res, next) => {
    const jobId = req.params.jobId;
    const applicants = await redisCache.get(`applicants:${jobId}`);
    if (applicants) {
        return res.status(200).json({
            job: applicants,
            success: true,
        });
    }
    const job = await jobModel.findById(jobId).populate({
        path: 'applications',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'student'
        }
    });
    if (!job) {
        return next(new ErrorHandler('Job not found', 400));
    };
    await redisCache.set(`applicants:${jobId}`, job);

    return res.status(200).json({
        job,
        succees: true
    });

})

//update status by coordinator and recruiter
exports.updateStatus = catchAsyncError(async (req, res, next) => {
    const { status } = req.body;
    const applicationId = req.params.applicationId;
    if (!status) {
        return next(new ErrorHandler('status is required', 400));
    };


    const application = await ApplicationModel.findOne({ _id: applicationId });
    if (!application) {
        return next(new ErrorHandler('Application not found', 404));
    };

    application.status = status.toLowerCase();
    await application.save();
    await redisCache.del(`myApplications:${application.student}`);
    await redisCache.del(`applicants:${application.job}`);

    return res.status(200).json({
        message: "Status updated successfully.",
        success: true
    });

})