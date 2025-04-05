const express = require('express');
const {registerMember,getMemberDetails,getAllMembers, updateMembers} = require('../controllers/membersController')
const router = express.Router();

router.post('/registerMember',registerMember)
router.post('/getMemberDetails',getMemberDetails)
router.get('/getAllMembers',getAllMembers)
router.put('/updateMembers',updateMembers)

module.exports = router