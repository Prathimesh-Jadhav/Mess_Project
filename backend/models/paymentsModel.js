const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true,
    },
    startDate:{
        type: String,
        required: true,
    },
    endDate: {
        type: String,
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
    totalMealsCount:{
        type: Number, 
    }
});

module.exports = mongoose.model("Payments", paymentSchema);