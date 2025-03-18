const express= require('express')

const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth')

const router= express.Router()
const multer = require("multer");
const { registerJob, fetchAllJobs, fetchJobById, fetchAllJobsCoordinator } = require('../controllers/jobController');


const upload = multer({ storage: multer.memoryStorage() });

//post job by coordinator
router.post('/register',isAuthenticatedUser, authorizedRoles("coordinator") ,  registerJob)
router.get('/fetch',isAuthenticatedUser, fetchAllJobs)
router.get('/fetch/:jobId',isAuthenticatedUser, fetchJobById)
router.get('/fetchJobs',isAuthenticatedUser, authorizedRoles("coordinator"), fetchAllJobsCoordinator)

module.exports = router;