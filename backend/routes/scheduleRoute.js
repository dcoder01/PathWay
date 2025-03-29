const express = require('express')

const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')
const router = express.Router()
const multer = require("multer");
const { fetchAllSchedules, createSchedule, updateSchedule, deleteSchedule, fetchSchedules } = require('../controllers/scheduleController');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/fetch', isAuthenticatedUser, authorizedRoles('student','coordinator'),  fetchAllSchedules);
router.post('/create/:jobId/:userId', isAuthenticatedUser, authorizedRoles('recruiter', 'coordinator'),  createSchedule);
router.put('/update/:scheduleId', isAuthenticatedUser, authorizedRoles('recruiter', 'coordinator'),  updateSchedule);
router.delete('/delete/:scheduleId', isAuthenticatedUser, authorizedRoles('recruiter', 'coordinator'),  deleteSchedule);
router.get('/fetch/:jobId', isAuthenticatedUser, authorizedRoles('recruiter', 'coordinator'),  fetchSchedules);




module.exports = router