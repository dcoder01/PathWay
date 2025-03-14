const express= require('express')
const { registerUser, loginUser, logout, updateProfile} = require('../controllers/userController')
const { isAuthenticatedUser } = require('../middleware/auth')
const router= express.Router()
// const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth')


router.post('/register',registerUser )
router.post('/login',loginUser )
router.get('/logout', logout)
router.put('/update-profile',isAuthenticatedUser, updateProfile)

// router.get('/me', isAuthenticatedUser,getUserDetails)

// router.get("/check-auth", isAuthenticatedUser, (req, res) => {
//     const user = req.user;
//     res.status(200).json({
//       success: true,
//       message: "Authenticated user!",
//       user,
//     });
//   });

module.exports=router