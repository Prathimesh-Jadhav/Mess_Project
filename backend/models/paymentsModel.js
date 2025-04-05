const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true,
    },
    startDate:{
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    totalAmount:{
        type: Number,
        required: true,
    },
    paidAmount:{
        type: Number,
        required: true,
    },
    amountToPay:{
        type: Number,
        required: true,
    },
    Due:{
        type: Number,
        required: true,
    },
    mealRate:{
        type: Number,  
        required: true,
    },
    mealsSkipped:{
        type: Number,
    },
    deductedAmount:{
        type: Number,
    },
    totalMealsHad:{
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("Payments", paymentSchema);