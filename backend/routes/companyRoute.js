const express= require('express')

const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth')
const { registerCompany } = require('../controllers/companyController')
const router= express.Router()

router.post('/register',isAuthenticatedUser, authorizedRoles("recruiter") ,  registerCompany)


module.exports= router