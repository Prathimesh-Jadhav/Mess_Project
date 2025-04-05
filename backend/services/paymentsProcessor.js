const Member = require("../models/memberModel");
const Meals = require("../models/mealsModel");
const Payments = require("../models/paymentsModel");
const messModel = require("../models/messModel");

async function processMonthlyPayments(req, res) {
    let paymentsArray = [];
    try {
        //get price 
        const mess = await messModel.find({});
        if (!mess) {
            return res.status(404).json({ message: 'Error fetching mess details', error, success: false });
        }

        const pricePerMeal = mess[0].mealPrice;
        const deductionPerSkippedMeal = mess[0].mealPrice;

        const today = new Date();
        const monthRange = today.toLocaleString("default", { month: "long", year: "numeric" }); // "April 2025"

        // Get members who have completed 30 days
        const members = await Member.find({
            subscibedAt: { $lte: new Date(today.setDate(today.getDate() - 1)) }
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
                startDate: startDate,
                endDate: endDate,
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

            for (let meal of meals) {
                totalMealsHad += meal.totalMealsHad;
                totalMealsSkipped += meal.mealsSkipped;
                mealsHadForPayment += meal.totalMealsHad;

                // Count consecutive skipped meals
                if (meal.mealsSkipped > 1) {
                    consecutiveSkipped += meal.mealsSkipped;
                } else {
                    mealsHadForPayment += meal.mealsSkipped + consecutiveSkipped; // Count meals had
                    consecutiveSkipped = 0; // Reset counter if a meal is had
                }

                // If 8 consecutive meals skipped, count 1 mealSkipped for payments
                if (consecutiveSkipped >= 8) {
                    skippedForPayments++;
                    consecutiveSkipped = 0; // Reset after adding to payments
                }
            }

            // Calculate amounts
            const totalAmount = (mealsHadForPayment + skippedForPayments * 8) * pricePerMeal;
            const deductedAmount = skippedForPayments * deductionPerSkippedMeal;
            const finalAmount = totalAmount - deductedAmount;

            const memberUpdate = await Member.findOneAndUpdate(
                { mobileNumber },
                { $set: { status: "Subscription Completed" } },
                { new: true }
            );

            if(!memberUpdate){
                return res.status(404).json({ message: 'Error updating member status', error, success: false });
            }


            // Save payment record
            paymentsArray.push(
                {
                    mobileNumber,
                    totalMealsHad: mealsHadForPayment + skippedForPayments * 8,
                    startDate: startDate,
                    totalAmount: totalAmount,
                    endDate: endDate,
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

        return res.status(200).json({ message: "Monthly payments processed successfully", success: true }); // Return all processed payments in the required format

    } catch (error) {
        console.error("Error processing payments:", error);
        return { error: "Failed to process payments" };
    }
}

// Run this function daily using a cron job
module.exports = { processMonthlyPayments };
