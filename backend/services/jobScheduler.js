const cron = require("node-cron");
const { processMonthlyPayments } = require("./paymentsProcessor");
const Meals = require("../models/mealsModel");

const startScheduler = () => {
    // Schedule the job to run at 12:00 AM every night
    cron.schedule("0 0 * * *", async () => {
        try {
            console.log("Running monthly payment processing...");
            await processMonthlyPayments();
        } catch (error) {
            console.error("Error processing monthly payments:", error);
        }
    });

    cron.schedule("0 0 * * *", async () => {
        try {
            console.log("Running meal monitoring job...");

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0); // Normalize to start of the day

            const meals = await Meals.find({ date: yesterday });

            for (let meal of meals) {
                if (meal.totalMealsHad < 2) {
                    meal.mealsSkipped = 2 - meal.totalMealsHad;
                    await meal.save();
                }
            }

            console.log("Meal monitoring job completed.");
        } catch (error) {
            console.error("Error running meal monitoring job:", error);
        }
    });

};

module.exports = { startScheduler };

