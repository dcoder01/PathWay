const express = require('express')
const { pendingRequests, approveRequests, deleteRequests, getAllUsers } = require('../controllers/tpoController')
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth')
const router = express.Router()

router.get('/pending-approvals', isAuthenticatedUser, authorizedRoles("tpo"), pendingRequests)
router.put('/accept-approval/:userId', isAuthenticatedUser, authorizedRoles("tpo"), approveRequests)
router.delete('/reject-approval/:userId', isAuthenticatedUser, authorizedRoles("tpo"), deleteRequests)
router.get('/users', isAuthenticatedUser, authorizedRoles("tpo", "coordinator"), getAllUsers) //for coordinator it will be an extra feature if omplemeted to find the studs by branch

module.exports = router