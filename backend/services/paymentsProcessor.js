const Member = require("../models/memberModel");
const Meals = require("../models/mealsModel");
const Payments = require("../models/paymentsModel");
const messModel = require("../models/messModel");


async function processMonthlyPaymentsJob() {
    let paymentsArray = [];
    try {

        //get price 
        const mess = await messModel.find({});

        if (!mess) {
            return { message: "Mess not found", success: false };
        }

        //find the members whose status is Active
        const membersData = await Member.find({ status: 'Active' });

        if (!membersData) {
            return { message: "No active members found", success: false };
        }


        // access each member's mobile number and update the endDate to todays date
        for (let member of membersData) {
            const { mobileNumber } = member;
            const payments = await Payments.find({ mobileNumber , startDate: member.subscibedAt });
            if (payments.length > 0) {
                const payment = payments[0];
                const updatedPayment = await Payments.findOneAndUpdate(
                    { mobileNumber, startDate: member.subscibedAt },
                    { endDate: new Date().toISOString().split("T")[0] },
                    { new: true }
                );
            }
            else{
                continue;
            }

            //calculate the number of days between startDate and endDate
            const startDate = new Date(member.subscibedAt);
            const endDate = new Date(new Date().toISOString().split("T")[0]);
            const timeDiff = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // days

            // calculate the number of meals had 
            const totalMealsCount = diffDays * 2; // 2 meals per day
            const totalAmountForPayment = totalMealsCount *mess[0].mealRate; // total amount for payment

            //calculate the number of consecutive meals skipped between startDate and endDate for four consecutive days
            const meals = await Meals.find({ mobileNumber, date: { $gte: member.subscibedAt, $lte: new Date().toISOString().split("T")[0] } });
            if (!meals) {
                return { message: "No meals found", success: false };
            }
            let consecutiveSkippedMeals = 0;
            let skippedMeals = 0;
            let mealsHad = 0;
            let mealsHadForPayment = 0;
            let skippedForPayments = 0;
            let consecutiveSkipped = 0;
            for (let meal of meals) {
                if (meal.mealsSkipped > 1) {
                    consecutiveSkipped += meal.mealsSkipped;
                } else {
                    mealsHad += meal.totalMealsHad;
                    consecutiveSkipped = 0; // Reset counter if a meal is had
                }

                // If 8 consecutive meals skipped, count 1 mealSkipped for payments
                if (consecutiveSkipped >= 8) {
                    skippedForPayments++;
                    consecutiveSkipped = 0; // Reset after adding to payments
                }
            }

            const deductedAmount = skippedForPayments * Number(mess[0].mealRate) * 2; // 2 meals per day
            const paidAmount = payments[0].paidAmount; // get the paid amount from the payment record
        
            //update the payment record with the new values
            const updatedPayment = await Payments.findOneAndUpdate(
                { mobileNumber, startDate: member.subscibedAt },
                {
                    totalMealsHad: totalMealsCount,
                    totalAmount: totalAmountForPayment,
                    deductedAmount,
                    mealsSkipped: skippedForPayments,
                    amountToPay: totalAmountForPayment - deductedAmount,
                    Due: totalAmountForPayment - deductedAmount - paidAmount,
                },
                { new: true }
            );

            if (!updatedPayment) {
                return { message: "Failed to update payment record", success: false };
            }


        }

        console.log("Payments processed successfully:", paymentsArray);
        return { message: "Payments processed successfully", success: true };

    } catch (error) {
        console.error("Error processing payments:", error);
        return { message: "Failed to process payments", success: false };
    }
}

// Run this function daily using a cron job
module.exports = { processMonthlyPaymentsJob };
