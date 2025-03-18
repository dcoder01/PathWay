const Errohandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const User = require('../models/userModel')
const Company = require('../models/companyModel')
const cloudinary = require("../config/cloudinary");
const ErrorHandler = require('../utils/errorhandler');
const ApplicationModel = require('../models/ApplicationModel');
const jobModel = require('../models/jobModel');

exports.applyJob = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
    const jobId = req.params.jobId;
    const file=req.file;

    
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

    //cloudinary upload
    let resume=null
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
        student:userId,
        job: jobId,
        applicant: userId,
        resume
    });

    job.applications.push(newApplication._id);
    await job.save();


    return res.status(200).json({
        success: true
    })

})