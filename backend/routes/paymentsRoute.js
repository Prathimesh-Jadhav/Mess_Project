const express = require("express");
const router = express.Router();
const { getPaymentDetails,handleAmountPaid,getPaymentHistory,getDuePayments } = require("../controllers/paymentsController");
const Payment = require("../models/paymentsModel");

router.post('/paymentDetails',getPaymentDetails);
router.put('/amountPaid',handleAmountPaid)
router.post('/getPaymentHistory',getPaymentHistory)
router.post('/getDuePayments',getDuePayments)

module.exports = router