const todaysMealModel = require("../models/todaysMenu");

const addTodaysMenu = async (req, res) => {
    const { riceRoti, curry, specialItems } = req.body;
    try {
        const previousMeal = await todaysMealModel.find();
        if(previousMeal.length > 0){
            await todaysMealModel.deleteMany({});
        }
        const todaysMeal = await todaysMealModel.create({ riceRoti, curry, specialItems });
        res.status(201).json({ message: "Todays meal added successfully", data: todaysMeal, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error adding todays meal", error, success: false });
    }
};

const getTodaysMenu = async (req, res) => {
    try {
        const todaysMeals = await todaysMealModel.find();
        res.status(200).json({ data: todaysMeals, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching todays meals", error, success: false });
    }
};

module.exports = { addTodaysMenu, getTodaysMenu };