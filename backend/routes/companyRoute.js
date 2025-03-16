const express= require('express')

const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth')
const { registerCompany, getCompanyById, getCompanies } = require('../controllers/companyController')
const router= express.Router()

router.post('/register',isAuthenticatedUser, authorizedRoles("recruiter") ,  registerCompany)
router.get('/fetch',isAuthenticatedUser, authorizedRoles("coordinator") ,  getCompanies)
router.get('/fetch/:companyId',isAuthenticatedUser,  getCompanyById) //authorozedRole have to check in future


module.exports= router