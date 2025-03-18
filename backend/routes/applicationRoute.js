const express = require('express')

const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')
const router = express.Router()
const multer = require("multer");
const { applyJob } = require('../controllers/applicationController');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/apply/:jobId', isAuthenticatedUser, authorizedRoles('student'), upload.single('file'), applyJob);


module.exports = router