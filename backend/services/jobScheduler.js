const cron = require("node-cron");
const { processMonthlyPaymentsJob } = require("./paymentsProcessor");
const Meals = require("../models/mealsModel");

const startScheduler = () => {
    // Schedule the job to run at 12:00 AM every night
    cron.schedule("* 2 * * *", async () => {
        try {
            console.log("Running payment processing every 1 minute...");
            await processMonthlyPaymentsJob();  
        } catch (error) {
            console.error("Error processing payments from CRON:", error);
        }
    });
    

    cron.schedule("* 1 * * *", async () => {
        try {
            console.log("Running meal monitoring job...");
    
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate());
            yesterday.setHours(0, 0, 0, 0); // Normalize to start of the day
            const yesterdayString = yesterday.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    
            const meals = await Meals.find({ date: yesterdayString });
    
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

