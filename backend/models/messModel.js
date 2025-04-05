const mongoose = require("mongoose");

const messSchema = new mongoose.Schema({
    messName: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    mealRate: {
        type: String,
        required: true,
    },
    lunchTiming:{
        type: String,
        required: true,
    },
    dinnerTiming: {
        type: String,
        required: true,
    },
    contact:{
        type: String,
        required: true,
    },
    mealPrice:{
        type: Number,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    totalMembers:{
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("MessDetails", messSchema);