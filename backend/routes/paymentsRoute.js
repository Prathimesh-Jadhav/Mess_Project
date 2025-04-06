const express = require("express");
const router = express.Router();
const { getPaymentDetails,handleAmountPaid,getPaymentHistory,getDuePayments } = require("../controllers/paymentsController");
const Payment = require("../models/paymentsModel");

router.post('/paymentDetails',getPaymentDetails)
// router.post("/", async (req, res) => {
//     try {
//         const payment = new Payment(req.body);
//         await payment.save();
//         res.status(201).json(payment);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });
router.put('/amountPaid',handleAmountPaid)
router.post('/getPaymentHistory',getPaymentHistory)
router.post('/getDuePayments',getDuePayments)

module.exports = router