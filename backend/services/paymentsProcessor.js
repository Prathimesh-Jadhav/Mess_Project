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
            return { message: "Mess not found",success:false };
        }

        const pricePerMeal = mess[0].mealRate;
        const deductionPerSkippedMeal = mess[0].mealRate;
        const today = new Date();
        const monthRange = today.toLocaleString("default", { month: "long", year: "numeric" }); // "April 2025"

        // Get members who have completed 30 days
        const members = await Member.find({
            subscibedAt: { $lte: new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0] },
        });

        for (let member of members) {
            const { mobileNumber, subscibedAt } = member;

            // Define the billing period (30 days from subscription)
            const startDate = new Date(subscibedAt);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 30);

            // Check if payment is already recorded for this range
            const existingPayment = await Payments.findOne({
                mobileNumber,
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
            });

            if (existingPayment) {
                console.log(`Payment already processed for ${mobileNumber} for ${monthRange}. Skipping...`);
                continue; // Skip processing for this user
            }

            // Fetch meals for the last 30 days
            const meals = await Meals.find({
                mobileNumber,
                date: { $gte: startDate.toISOString().split("T")[0], $lte: endDate.toISOString().split("T")[0] }
            });

            //sort the meals by date
            meals.sort((a, b) => new Date(a.date) - new Date(b.date));

            let totalMealsHad = 0;
            let totalMealsSkipped = 0;
            let consecutiveSkipped = 0;
            let skippedForPayments = 0;
            let mealsHadForPayment = 60;

            for (let meal of meals) {
                totalMealsHad += meal.totalMealsHad;
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
            const totalAmount = mealsHadForPayment * Number(pricePerMeal);

            const deductedAmount = skippedForPayments * Number(deductionPerSkippedMeal)*2;
            const finalAmount = totalAmount - deductedAmount;

            const memberUpdate = await Member.findOneAndUpdate(
                { mobileNumber },
                {status:'Subscription Expired'},
                { new: true }
            );

            if(!memberUpdate){
                return { message: "Error updating member",success:false };
            }

            // Save payment record
            paymentsArray.push(
                {
                    mobileNumber,
                    totalMealsHad: mealsHadForPayment,
                    startDate: startDate.toISOString().split("T")[0],
                    totalAmount: totalAmount,
                    endDate: endDate.toISOString().split("T")[0],
                    deductedAmount,
                    mealsSkipped: skippedForPayments,
                    amountToPay: finalAmount,
                    Due: finalAmount,
                    paidAmount: 0,
                    mealRate: mess[0].mealRate,
                }
            )

        }

        if (paymentsArray.length > 0) {
            await Payments.insertMany(paymentsArray); // Save all payments in one go
        }

        console.log("Payments processed successfully:", paymentsArray);

        return { message: "Payments processed successfully", success: true };

    } catch (error) {
        console.error("Error processing payments:", error);
        return { error: "Failed to process payments" };
    }
}

// Run this function daily using a cron job
module.exports = { processMonthlyPaymentsJob };
