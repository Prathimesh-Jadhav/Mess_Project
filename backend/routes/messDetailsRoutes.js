const express = require('express');

const {getMessDetails,addMess,updateMessDetails} = require('../controllers/messController');
const router = express.Router();

router.get('/getMessDetails',getMessDetails);
router.post('/addMessDetails',addMess);
router.put('/updateMessDetails',updateMessDetails);

module.exports = router