const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String, 
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
    },
    joinDate: {
        type: Date,
        required: true,
    },
    subscibedAt: {
        type: Date,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    permanentAddress: {
        type: String,
        required: true,
    },
    hostelAddress: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Member', memberSchema);
