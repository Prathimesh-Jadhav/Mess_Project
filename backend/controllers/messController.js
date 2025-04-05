const messModel = require("../models/messModel"); 
const userModel = require("../models/userModel");  


const addMess = async (req, res) => {
    const { messName, ownerName, mealRate, lunchTiming, dinnerTiming, contact,address } = req.body;
    try {
        const mess = await messModel.create({ messName, ownerName, mealRate, lunchTiming, dinnerTiming, contact,totalMembers:0,address}); 
        res.status(201).json({ message: 'Mess added successfully', mess, success: true }); 
    } catch (error) {
        res.status(500).json({ message: 'Error adding mess', error, success: false }); 
    }
};

const getMessDetails = async (req, res) => {
    try {
        const mess = await messModel.find(); 
        return res.status(200).json({ data:mess, success: true }); 
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching mess details', error, success: false }); 
    }
};

const updateMessDetails = async (req, res) => {
    const {ownerName,mobileNumber} = req.body;
    try {
        const user = await userModel.findOneAndUpdate({mobileNumber},{role:'admin',name:ownerName,mobileNumber},{new:true});
        const mess = await messModel.findOneAndUpdate({}, req.body, { new: true }); 
        res.status(200).json({ message: 'Mess details updated successfully', data:mess, success: true }); 
    } catch (error) {
        res.status(500).json({ message: 'Error updating mess details', error, success: false }); 
    }
};


module.exports = { addMess,getMessDetails,updateMessDetails };