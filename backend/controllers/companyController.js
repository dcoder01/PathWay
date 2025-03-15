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


