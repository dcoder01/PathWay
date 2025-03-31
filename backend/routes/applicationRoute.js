const express = require('express')

const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')
const router = express.Router()
const multer = require("multer");
const { applyJob, fetchAppliedJobs, fetchApplicants, updateStatus } = require('../controllers/applicationController');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/apply/:jobId', isAuthenticatedUser, authorizedRoles('student','coordinator'), upload.single('file'), applyJob);
router.get('/fetch', isAuthenticatedUser,authorizedRoles('student', 'coordinator'), fetchAppliedJobs);
router.get('/fetch/:jobId', isAuthenticatedUser,authorizedRoles("recruiter", "coordinator"), fetchApplicants);
router.put('/updatestatus/:applicationId', isAuthenticatedUser,authorizedRoles("recruiter", "coordinator"), updateStatus);




module.exports = router