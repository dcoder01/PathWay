const catchAsyncError = require('../middleware/catchAsyncErrors')
const User = require('../models/userModel')
const Company = require('../models/companyModel')
const cloudinary = require("../config/cloudinary");
const ErrorHandler = require('../utils/errorhandler');
const redisCache = require('../utils/redisCache');

exports.registerCompany = catchAsyncError(async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return next(new ErrorHandler("Company name is required.", 400))
    }
    let company = await Company.findOne({ name: name, createdBy: req.user._id });
    if (company) {
        return next(new ErrorHandler(`You haave already created the company with the name ${name}`, 400))
    };
    company = await Company.create({
        name: name,
        createdBy: req.user._id
    });

    await redisCache.del("allCompanies");

    return res.status(200).json({ //best practice
        company,
        success: true
    })

})

//update comapnay details

exports.getCompanies = catchAsyncError(async (req, res, next) => {  //---> coordinator will fetch this for job creation


    const allCompanies = await redisCache.get("allCompanies");


    if (allCompanies) {
        return res.status(200).json({
            companies: allCompanies,
            success: true,
        });
    }
    const companies = await Company.find({}).populate("createdBy", "name")

    if (!companies) {
        return next(new ErrorHandler(`No company found`, 404))
    }
    await redisCache.set("allCompanies", companies);

    return res.status(200).json({
        companies,
        success: true
    })

})

//get compnay by recruiter
exports.getCompany = catchAsyncError(async (req, res, next) => {

    const userId = req.user._id;
    const companies = await Company.find({ createdBy: userId });

    if (!companies) {
        return next(new ErrorHandler(`No company found`, 404))
    }
    return res.status(200).json({
        companies,
        success: true
    })


})



//get company by id
exports.getCompanyById = catchAsyncError(async (req, res, next) => {

    const companyId = req.params.companyId;
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new ErrorHandler(`No company found`, 404))
    }
    return res.status(200).json({
        company,
        success: true
    })

})

//update company

exports.updateCompany = catchAsyncError(async (req, res, next) => {
    const { name, description, website } = req.body;
    const companyId = req.params.companyId;



    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (website) updateData.website = website;

    let location = req.body.location;


    if (location) {
        // If it's a string convert to array
        if (typeof location === 'string') {
            // If it looks like JSON, try to parse it
            if (location.startsWith('[')) {
                try {
                    location = JSON.parse(location);
                } catch (error) {
                    location = [location];
                }
            } else {
                location = [location];
            }
        }
        updateData.location = location;
    }


    const file = req.file;
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

        updateData.logo = fileResult.secure_url;
    }

    const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });



    if (!company) {
        return next(new ErrorHandler(`No company found`, 404));
    }
    await redisCache.del("allCompanies");

    return res.status(200).json({
        company,
        success: true
    });
});



