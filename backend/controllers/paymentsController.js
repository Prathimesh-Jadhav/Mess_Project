const paymentsModel = require('../models/paymentsModel');
const mealsModel = require('../models/mealsModel');
const messModel = require('../models/messModel');
const Member = require('../models/memberModel')
const { processMonthlyPaymentsJob } = require('../services/paymentsProcessor');


async function currentMonth(mobile) {

    let paymentsArray = [];

    //get price 
    const mess = await messModel.find({});

    if (!mess) {
        return { message: "Mess not found", success: false };
    }

    const pricePerMeal = mess[0].mealRate;
    const deductionPerSkippedMeal = mess[0].mealRate;
    const today = new Date();
    const monthRange = today.toLocaleString("default", { month: "long", year: "numeric" }); // "April 2025"

    // Get members who falls in the range of 
    const members = await Member.find({
        subscibedAt: { $gt: new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0] },
        mobileNumber: mobile,
        status: 'Active'
    });

    for (let member of members) {
        const { mobileNumber, subscibedAt } = member;

        // Define the billing period (30 days from subscription)
        const startDate = new Date(subscibedAt);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30);

        // Check if payment is already recorded for this range
        const existingPayment = await paymentsModel.findOne({
            mobileNumber,
            startDate: startDate.toISOString().split("T")[0],
        });

        if (existingPayment) {
            console.log(`Payment already processed for ${mobileNumber} for ${monthRange}. Skipping...`);
            continue; // Skip processing for this user
        }

        // Fetch meals for the last 30 days
        const meals = await mealsModel.find({
            mobileNumber,
            date: { $gte: startDate.toISOString().split("T")[0], $lte: endDate.toISOString().split("T")[0] }
        });

        //sort the meals by date
        meals.sort((a, b) => new Date(a.date) - new Date(b.date));

        console.log("meals", meals)

        let totalMealsHad = 0;
        let totalMealsSkipped = 0;
        let consecutiveSkipped = 0;
        let skippedForPayments = 0;
        let mealsHadForPayment = 60;

        for (let meal of meals) {
            totalMealsHad += meal.totalMealsHad + meal.mealsSkipped;
            totalMealsSkipped += meal.mealsSkipped;

            // Count consecutive skipped meals
            if (meal.mealsSkipped > 1) {
                consecutiveSkipped += meal.mealsSkipped;
            } else {// Count meals had
                consecutiveSkipped = 0; // Reset counter if a meal is had
            }

            // If 8 consecutive meals skipped, count 1 mealSkipped for payments
            if (consecutiveSkipped >= 8) {
                skippedForPayments++;
                consecutiveSkipped = 0; // Reset after adding to payments
            }
        }

        // Calculate amounts
        const totalAmount = totalMealsHad * Number(pricePerMeal);
        const deductedAmount = skippedForPayments * Number(deductionPerSkippedMeal) * 2;
        const finalAmount = totalAmount - deductedAmount;

        // Save payment record
        paymentsArray.push(
            {
                mobileNumber,
                totalMealsHad: totalMealsHad,
                startDate: startDate.toISOString().split("T")[0],
                totalAmount: totalAmount,
                endDate: new Date().toISOString().split("T")[0],
                deductedAmount,
                mealsSkipped: skippedForPayments,
                amountToPay: finalAmount,
                Due: finalAmount,
                paidAmount: 0,
                mealRate: mess[0].mealRate,
                currentMonth: true
            }
        )

    }

    return paymentsArray
}

const getPaymentDetails = async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        const payments = await paymentsModel.find({ mobileNumber });
        const currentMonthBill = await currentMonth(mobileNumber)

        console.log("currentMonthBill", currentMonthBill)

        if (currentMonthBill.length > 0) {
            payments.unshift(...currentMonthBill)
        }

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

    //calculate the last 30 days back date
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    try {

        if (startDate > last30Days.toISOString().split('T')[0]) {
            //check whether any payment is already available with this start Date for this user
            const existingPayment = await paymentsModel.findOne({ mobileNumber, startDate: startDate });
            if (existingPayment) {
                //update its paid amount and due amount
                const newpaidAmount = existingPayment.paidAmount + Number(paidAmount);
                const newDue = existingPayment.Due - Number(paidAmount);
                const updatedPayment = await paymentsModel.findOneAndUpdate(
                    { mobileNumber, startDate },
                    { paidAmount: newpaidAmount, Due: newDue },
                    { new: true }
                );
                if (!updatedPayment) {
                    return res.status(404).json({ message: 'Error updating payment details', success: false });
                }
                return res.status(200).json({ data: updatedPayment, success: true });
            }
            else {
                //create a new payment record for this user
                const newPayment = await paymentsModel.create({
                    mobileNumber,
                    startDate,
                    endDate,
                    totalMealsHad,
                    deductedAmount: mealsSkipped * 2 * Number(mess[0].mealRate),
                    mealsSkipped,
                    paidAmount: Number(paidAmount),
                    Due: totalMealsHad * Number(mess[0].mealRate) - (mealsSkipped * 2 * Number(mess[0].mealRate)) - Number(paidAmount),
                    totalAmount: totalMealsHad * Number(mess[0].mealRate),
                    amountToPay: totalMealsHad * Number(mess[0].mealRate) - (mealsSkipped * 2 * Number(mess[0].mealRate)),
                    mealRate: mess[0].mealRate,
                });

                if (!newPayment) {
                    return res.status(404).json({ message: 'Error creating payment details', success: false });
                }

                return res.status(200).json({ data: newPayment, success: true });
            }
        }
        else {
            const payment = await paymentsModel.findOne({ mobileNumber, startDate, endDate });
            if (!payment) {
                return res.status(404).json({ message: 'Error updating payment details', success: false });
            }

            const newpaidAmount = payment.paidAmount + Number(paidAmount);

            // Update the payment details
            const payments = await paymentsModel.findOneAndUpdate(
                { mobileNumber, startDate, endDate },
                { paidAmount: newpaidAmount, Due },
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
        }

    } catch (error) {
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