const Errohandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncErrors')

const User = require('../models/userModel')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')


exports.pendingRequests = catchAsyncError(async (req, res, next) => {
    const pendingUsers = await User.find({
        isApproved: false,
        role: { $in: ['coordinator', 'recruiter'] }
    })

    res.status(200).json({
        success: true,
        data: {
            pendingUsers
        }
    })
})

exports.approveRequests = catchAsyncError(async (req, res, next) => {
    const userId = req.params.userId;
    const user = await User.findById(userId)
    if (!user) next(new Errohandler("Invalid User", 401))

    if (user.role === 'tpo' || user.role === 'student') {
        return next(new Errohandler("Doesn't need approval", 400))
    }
    user.isApproved = true;
    await user.save();


    res.status(200).json({
        success: true,
        user
    })
})

exports.deleteRequests = catchAsyncError(async (req, res, next) => {
    const userId = req.params.userId;
    const user = await User.findById(userId)
    if (!user) next(new Errohandler("Invalid User", 401))

    if (user.role === 'tpo') {
        return next(new Errohandler("Can't delete a tpo", 400))
    }
  
    await User.findByIdAndDelete(userId);


    res.status(200).json({
        success: true,
    })
})

