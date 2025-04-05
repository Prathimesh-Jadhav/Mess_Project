const mongoose = require("mongoose");

const todaysMealSchema = new mongoose.Schema({
    riceRoti: {
        type: String,
        required: true,
    },
    curry: {
        type: String,
        required: true,
    },
    specialItems: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("TodaysMeal", todaysMealSchema);