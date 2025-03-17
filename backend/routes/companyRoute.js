const express= require('express')

const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth')
const { registerCompany, getCompanyById, getCompanies, updateCompany, getCompany } = require('../controllers/companyController')
const router= express.Router()
const multer = require("multer");


const upload = multer({ storage: multer.memoryStorage() });
router.post('/register',isAuthenticatedUser, authorizedRoles("recruiter") ,  registerCompany)
router.get('/fetch',isAuthenticatedUser, authorizedRoles("coordinator") ,  getCompanies) //to fetch all the companies to register a job.
router.get('/fetch/:companyId',isAuthenticatedUser,  getCompanyById) //authorozedRole have to check in future
router.put('/update/:companyId', isAuthenticatedUser, authorizedRoles('recruiter'),upload.single('file'), updateCompany);
router.get('/compnayByRecruiter', isAuthenticatedUser, authorizedRoles('recruiter'), getCompany) //to see the comany he/she has created

module.exports= router