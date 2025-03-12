const express= require('express')
const { pendingRequests, approveRequests, deleteRequests } = require('../controllers/tpoController')
const { isAuthenticatedUser, authorizedRoles} =require('../middleware/auth')
const router= express.Router()

router.get('/pending-approvals',isAuthenticatedUser, authorizedRoles("tpo") ,  pendingRequests)
router.put('/accept-approval/:userId',isAuthenticatedUser, authorizedRoles("tpo") ,  approveRequests)
router.delete('/reject-approval/:userId',isAuthenticatedUser, authorizedRoles("tpo") ,  deleteRequests)

module.exports= router