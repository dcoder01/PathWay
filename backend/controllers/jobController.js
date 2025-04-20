const ErrorHandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const User = require('../models/userModel')
const Company = require('../models/companyModel')
const cloudinary = require("../config/cloudinary");
const jobModel = require('../models/jobModel');
const redisCache = require('../utils/redisCache');


exports.registerJob = catchAsyncError(async (req, res, next) => {

    const { title, description, requirements, salary, location, jobType, deadline, position, company, recruiter } = req.body;
    const createdBy = req.user._id;

    if (!title || !description || !requirements || !salary || !location || !jobType || !recruiter || !position || !company || !deadline) {
        return next(new ErrorHandler("One or more field required!", 400))
    };
    const job = await jobModel.create({
        title,
        description,
        requirements,
        salary,
        location,
        jobType,
        deadline: new Date(deadline),
        position,
        company,
        createdBy,
        recruiter,
    });
    await redisCache.del("allJobs");
    await redisCache.del(`createdJobs:${createdBy}`);

    return res.status(201).json({
        job,
        success: true
    });

})

//fetch all the jobs for students
exports.fetchAllJobs = catchAsyncError(async (req, res, next) => {

    const cachedJobs = await redisCache.get("allJobs");

    if (cachedJobs) {
        return res.status(200).json({
            jobs: cachedJobs,
            success: true,
            cache: true,
        });
    }

    const keyword = req.query.keyword || null;
    const query = keyword ? {
        $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
        ]
    } : {};
    const jobs = await jobModel.find(query).populate({
        path: "company"
    }).sort({ createdAt: -1 }); //sort by deadline expiring
    if (!jobs) {
        return next(new ErrorHandler("No job found", 404))
    };
    await redisCache.set("allJobs", jobs);
    return res.status(200).json({
        jobs,
        success: true,
        cache: false,
    })


})

//fetch job by id

exports.fetchJobById = catchAsyncError(async (req, res, next) => {
    const jobId = req.params.jobId;
    const job = await jobModel.findById(jobId).populate("applications").populate("company")
        .populate({
            path: "createdBy",
            select: "name"
        })
        .populate({
            path: "recruiter",
            select: "name"
        })
    if (!job) {
        return next(new ErrorHandler("No job found", 404))
    };
    return res.status(200).json({
        job,
        success: true
    });

})

//all the jobs created by the coordinator

exports.fetchAllJobsCoordinator = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
    const createdJobs = await redisCache.get(`createdJobs:${userId}`);
    if (createdJobs) {
        return res.status(200).json({
            jobs: createdJobs,
            success: true,
        });
    }
    const jobs = await jobModel.find({ createdBy: userId }).populate({
        path: 'company',
    }).sort({ createdAt: -1 });
    if (!jobs) {
        return next(new ErrorHandler("No job found", 404))
    };
    await redisCache.set(`createdJobs:${userId}`, jobs);

    return res.status(200).json({
        jobs,
        success: true
    })
})