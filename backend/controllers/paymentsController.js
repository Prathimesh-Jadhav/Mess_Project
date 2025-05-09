const paymentsModel = require('../models/paymentsModel');
const mealsModel = require('../models/mealsModel');
const messModel = require('../models/messModel');
const Member = require('../models/memberModel')
const { processMonthlyPaymentsJob } = require('../services/paymentsProcessor');


const getPaymentDetails = async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        const payments = await paymentsModel.find({ mobileNumber });

        if (!payments) {
            return res.status(404).json({ message: 'Error fetching payment details', error, success: false });
        }
        res.status(200).json({ data: payments, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment details', error, success: false });
    }
};



const handleAmountPaid = async (req, res) => {
    console.log("handleAmountPaid", req.body)
    const { mobileNumber, startDate, endDate, paidAmount, amount ,totalMealsHad, mealsSkipped,totalAmount,deductedAmount} = req.body;
    const startingDate = new Date(startDate).toISOString().split('T')[0];
    const endingDate = new Date(endDate).toISOString().split('T')[0];
    const Due = amount - Number(paidAmount);

    const mess = await messModel.find({});

    if (!mess) {
        return { message: "Mess not found", success: false };
    }

    try{
       //find the payment record with mobile number and startDate
        const payment = await paymentsModel.findOneAndUpdate(
            { mobileNumber, startDate: startingDate },
            {
                paidAmount: Number(paidAmount),
                Due: Number(Due)
            },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Error updating payment details', success: false });
        }

        // if due is 0 then make the member status inactive make the meals deleted which falls under startDate and endDate
        if (Due === 0) {

            
            //delete the current accessed payment
            const payment = await paymentsModel.deleteMany({ mobileNumber, startDate: startingDate });
            if (!payment) {
                return res.status(404).json({ message: 'Error deleting payment', success: false });
            }
            const member = await Member.findOne({ mobileNumber });
            if (!member) {
                return res.status(404).json({ message: 'Member not found', success: false });
            }
            member.status = 'Inactive';
            await member.save();
            //delete the meals which falls under startDate and endDate
            const meals = await mealsModel.deleteMany({ mobileNumber, date: { $gte: startingDate, $lte: endingDate } });
            if (!meals) {
                return res.status(404).json({ message: 'Error deleting meals', success: false });
            }

        }
        
        res.status(200).json({ message: 'Payment details updated successfully', data: payment, success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating payment details', error, success: false });
    }
};

const getPaymentHistory = async (req, res) => {
    const { mobileNumber } = req.body;
    try {
        const paymentsHistory = await paymentsModel.find({ mobileNumber, Due: 0 });
        if (!paymentsHistory) {
            return res.status(404).json({ message: 'Error fetching payment history', success: false });
        }
        res.status(200).json({ data: paymentsHistory, success: true });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error fetching payment history', err, success: false });
    }
}

const getDuePayments = async (req, res) => {
    const { mobileNumber } = req.body;
    try {
        const duePayments = await paymentsModel.find({ mobileNumber, Due: { $gt: 0 } });
        if (!duePayments) {
            return res.status(404).json({ message: 'Error fetching payment history', success: false });
        }
        res.status(200).json({ data: duePayments, success: true });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error fetching payment history', err, success: false });
    }
}

const processMonthlyPayments = async (req, res) => {
    try {
        const result = await processMonthlyPaymentsJob();

        if (result.data.success === false) {
            return res.status(500).json({ message: result.data.message, success: false });
        }

        return res.status(200).json({ message: result.data.messsage, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Error processing payments", error });
    }
};





module.exports = { getPaymentDetails, handleAmountPaid, getPaymentHistory, getDuePayments, processMonthlyPayments };