const Errohandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const User = require('../models/userModel')
const Company = require('../models/companyModel')


exports.registerCompany = catchAsyncError(async (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return next(new Errohandler("Company name is required.", 400))
    }
    let company = await Company.findOne({ name: name, createdBy: req.user._id });
    if (company) {
        return next(new Errohandler(`You haave already created the company with the name ${name}`, 400))
    };
    company = await Company.create({
        name: name,
        createdBy: req.user._id
    });


    return res.status(200).json({ //best practice
        company,
        success: true
    })

})

//update comapnay details

exports.getCompanies = catchAsyncError(async (req, res, next) => {  //---> coordinator will fetch this for job creation

    // const companies = await Company.find({}).populate([{
    //     path: "createdBy",
    //     select: "name"
    // }])
    const companies = await Company.find({}).populate("createdBy", "name")

    if (!companies) {
        return next(new Errohandler(`No company found`, 404))
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
        return next(new Errohandler(`No company found`, 404))
    }
    return res.status(200).json({
        company,
        success: true
    })

})

