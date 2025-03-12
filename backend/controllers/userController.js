const Errohandler = require('../utils/errorhandler')
const catchAsyncError = require('../middleware/catchAsyncErrors')

const User = require('../models/userModel')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')


//register user

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, role, password } = req.body
    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }


    const user = await User.create({
        name, email, password,
         role: role || 'student'
    })
    //creating token
    sendToken(user, 201, res)


})

//login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    //check user has given or not
    if (!email || !password) {
        return next(new Errohandler("please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new Errohandler("Invalid email or password", 401))

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) return next(new Errohandler("Invalid email or password", 401))


    if(!user.isApproved) return next(new Errohandler("Waiting for approval by TPO"), 401)

    sendToken(user, 200, res)

})

//logout

exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });

    res.status(200).json({
        success: true,
        message: "logged out"
    })
})