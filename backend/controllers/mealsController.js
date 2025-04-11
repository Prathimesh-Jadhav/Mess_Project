const Meals = require("../models/mealsModel");
const cron = require("node-cron");
const paymentsModel = require("../models/paymentsModel");
const membersModel = require("../models/memberModel");
const User = require("../models/userModel");
const messModel = require("../models/messModel");
const mealsModel = require('../models/mealsModel')

const addMeal = async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        const today = new Date().toISOString().split("T")[0];
        

        let meal = await Meals.findOne({ mobileNumber, date: today });

        if (meal) {
            if (meal.totalMealsHad >= 2) {
                return res.json({ message: "Meal limit reached for today.",success:false });
            }
            
            meal.totalMealsHad += 1;
            await meal.save();
            return res.status(200).json({ message: "Meal count updated successfully.", data:meal,success:true });
        } else {
            const newMeal = new Meals({
                mobileNumber,
                date: today,
                totalMealsHad: 1,
                mealsSkipped: 0
            });
            await newMeal.save();
            return res.status(201).json({ message: "New meal record created.", data: newMeal,success:true });
        }
    } catch (error) {
        console.error("Error updating meal count:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Schedule the job to run at 12:00 AM every night
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

const getAllMealsOfMember = async (req, res) => {

    try {
        const { mobileNumber } = req.body;
        const meals = await mealsModel.find({ mobileNumber });
        res.status(200).json({ data: meals, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching meal details', error, success: false });
    }
};

const getAllMeals = async (req, res) => {
    try {
        const meals = await Meals.find();
        res.status(200).json({ data: meals, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching meal details', error, success: false });
    }
};

const fetchUserMealDetails = async (req,res) => {
    try {
        // Fetch all users
        const users = await User.find();
        let userDetails = [];

        for (let user of users) {
            const mobileNumber = user.mobileNumber;

            // Fetch member details to get subscribedAt
            const member = await membersModel.findOne({ mobileNumber });
            if (!member) continue;

            const subscribedAt = member.subscibedAt;

            // Define the 30-day range
            const startDate = new Date(subscribedAt);
            let endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 30);
            
            // Fetch meal records within the 30-day range
            const meals = await Meals.find({
                mobileNumber,
                date: { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] },
            });    

            // Calculate totalMealsHad
            const totalMealsHad = meals.reduce((sum, meal) => sum + meal.totalMealsHad, 0);
            

            // Fetch all payment records
            const payments = await paymentsModel.find({ mobileNumber });

            // Calculate total paid amount, paidAmount, and get mealRate
            let totalPaidAmount = 0;
            let totalPaid = 0;

            for (let payment of payments) {
                totalPaidAmount += payment.amountToPay; // Summing all paid amounts
                totalPaid += payment.paidAmount; // Summing paidAmount separately
                // mealRate = payment.mealRate; // Assuming mealRate remains the same
            }

            const messDetails = await messModel.findOne();
            if(!messDetails){
                return res.status(500).json({ message: 'Error fetching mess details', success: false });
            }


            const totalAmount =  totalPaidAmount;

            // Store user details
            userDetails.push({
                name: user.name,
                mobileNumber,
                totalMealsHad,
                totalAmount,
                paidAmount: totalPaid,
                due: totalAmount - totalPaid // Added paidAmount calculation
            });
        }

        return res.status(200).json({ data: userDetails, success: true });
    } catch (error) {
        console.error("Error fetching user meal details:", error);
    }
};

const getTotalDueForMembers = async (req, res) => {
    try {
        const members = await membersModel.find();
        let result = [];
        
        for (let member of members) {
            const totalDue = await paymentsModel.aggregate([
                { $match: { mobileNumber: member.mobileNumber } },
                { $group: { _id: "$mobileNumber", totalDue: { $sum: "$Due" } } }
            ]);
            
            result.push({
                name: member.name,
                mobileNumber: member.mobileNumber,
                college: member.college,
                permanentAddress: member.permanentAddress,
                hostelAddress: member.hostelAddress,
                due: totalDue.length > 0 ? totalDue[0].totalDue : 0
            });
        }
        
        return res.json({ data: result, success: true });
    } catch (error) {
        console.error("Error fetching total due for members:", error);
        return [];
    }
};

   // Meals model

const getMealDetails = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        // Fetch the member details
        const member = await membersModel.findOne({ mobileNumber });
        if (!member) {
            return res.status(404).json({ message: 'Member not found', success: false });
        }

        const startDate = new Date(member.subscibedAt); // Using subscribedAt as startDate
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 30); // 30-day range

        // Fetch meals within the 30-day range
        const meals = await mealsModel.find({
            mobileNumber,
            date: { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] }
        }).sort({ date: 1 }); // Sorting by date

        let totalMealsHad = 0;
        let skippedCount = 0;

        // Process meals to check skipped pattern
        for (let i = 0; i < meals.length; i++) {
            totalMealsHad += meals[i].totalMealsHad;
            
            if (meals[i].mealsSkipped > 0) {
                skippedCount++;
            } else {
                skippedCount = 0; // Reset counter
            }

        }

        // Return the required data
        return res.status(200).json({
            data:{name: member.name,
            mobileNumber: member.mobileNumber,
            joinDate: member.joinDate,
            startDate: member.subscibedAt,
            totalMealsHad,
            mealsSkippedContinuously:skippedCount,
            status: member.status},
            success: true
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching member details', success: false });
    }
}

const handleMissedMeals =  async (req,res) => {
    try {
        console.log("Running meal monitoring job at 1:00 AM...");

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate()); // Subtract 1 to get yesterday
        yesterday.setHours(0, 0, 0, 0); // Normalize to start of the day
        const yesterdayString = yesterday.toISOString().split("T")[0]; // Format to YYYY-MM-DD

        const meals = await mealsModel.find({ date: yesterdayString });

        for (let meal of meals) {
            if ((meal.totalMealsHad + meal.mealsSkipped) <2 && meal.totalMealsHad < 2) {
                meal.mealsSkipped = 2 - meal.totalMealsHad;
                await meal.save();
            }
        }

      return {message:'meals Update successfully for Today',success:true}   
    } catch (error) {
        return {messsage:'error in updating meals',error,success:false}
    }

}




module.exports = { addMeal,getAllMeals,fetchUserMealDetails,getTotalDueForMembers,getMealDetails,getAllMealsOfMember,handleMissedMeals };
