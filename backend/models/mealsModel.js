const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    totalMealsHad: {
        type: Number,
        required: true,
    },
    mealsSkipped: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("Meals", mealSchema);