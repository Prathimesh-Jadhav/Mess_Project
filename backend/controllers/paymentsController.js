const paymentsModel = require('../models/paymentsModel');
const mealsModel =  require('../models/mealsModel');
const { processMonthlyPaymentsJob } = require('../services/paymentsProcessor');

const getPaymentDetails = async (req, res) => {
    const { mobileNumber } = req.body;
    try {
        const payments = await paymentsModel.find({mobileNumber});
        if(!payments){
            return res.status(404).json({ message: 'Error fetching payment details', error, success: false });
        }
        res.status(200).json({ data: payments, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment details', error, success: false });
    }
};


const handleAmountPaid = async (req, res) => {
    const { mobileNumber, startDate, endDate, paidAmount, amount } = req.body;
    const startingDate = new Date(startDate).toISOString().split('T')[0];
    const endingDate = new Date(endDate).toISOString().split('T')[0];
    const Due = amount - Number(paidAmount);

    try {
        const payment = await paymentsModel.findOne({mobileNumber,startDate,endDate});
        if(!payment){
            return res.status(404).json({ message: 'Error updating payment details', success: false });
        }

        const newpaidAmount = payment.paidAmount + Number(paidAmount);

        // Update the payment details
        const payments = await paymentsModel.findOneAndUpdate(
            { mobileNumber, startDate, endDate },
            { paidAmount:newpaidAmount, Due },
            { new: true }
        );

        if (!payments) {
            return res.status(404).json({ message: 'Error updating payment details', success: false });
        }

        // If Due is 0, delete meals within the date range
        if (Due === 0) {
            await mealsModel.deleteMany({
                mobileNumber,
                date: { $gte: new Date(startingDate).toISOString().split('T')[0], $lte: new Date(endingDate).toISOString().split('T')[0] }
            });
        }

        res.status(200).json({ data: payments, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment details', error, success: false });
    }
};

const getPaymentHistory = async (req, res) => {
    const { mobileNumber } = req.body;
    try{
        const paymentsHistory = await paymentsModel.find({mobileNumber,Due:0});
        if(!paymentsHistory){
            return res.status(404).json({ message: 'Error fetching payment history', success: false });
        }
        res.status(200).json({ data: paymentsHistory, success: true });
    }
    catch(err){
        return res.status(500).json({ message: 'Error fetching payment history', err, success: false });
    }
}

const getDuePayments = async (req, res) => {
    const { mobileNumber } = req.body;
    try{
        const duePayments = await paymentsModel.find({mobileNumber,Due:{$gt:0}});
        if(!duePayments){
            return res.status(404).json({ message: 'Error fetching payment history', success: false });
        }
        res.status(200).json({ data: duePayments, success: true });
    }
    catch(err){
        return res.status(500).json({ message: 'Error fetching payment history', err, success: false });
    }
}

const processMonthlyPayments = async (req, res) => {
    try {
        const result = await processMonthlyPaymentsJob();

        if(result.data.success === false){
            return res.status(500).json({ message: result.data.message, success: false });
        }

        return res.status(200).json({ message: result.data.messsage, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Error processing payments", error });
    }
};





module.exports = { getPaymentDetails,handleAmountPaid,getPaymentHistory,getDuePayments,processMonthlyPayments };