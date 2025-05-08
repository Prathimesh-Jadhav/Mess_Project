const userModel = require("../models/userModel"); // Adjust the path as per your folder structure
const memberModel = require("../models/memberModel");
const paymentsModel = require("../models/paymentsModel");
const mealsModel = require("../models/mealsModel");
const bcrypt = require("bcryptjs");
const sendRegMail = require("../services/sendRegMail"); // Adjust the path as per your folder structure
const jwt = require("jsonwebtoken");


const registerMember = async (req, res) => {
    try {
        const { name, mobileNumber, password, college, permanentAddress, hostelAddress, status,email } = req.body;

        // Validate required fields
        if (!name || !mobileNumber || !password || !college || !permanentAddress || !hostelAddress || status === undefined || !email) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Check if mobile number already exists in User model
        const existingUser = await userModel.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({
                message: "Mobile number already registered",
                success: false,
            });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        //send a mail to the user with the password
        const obj = {
            name,
            mobileNumber,
            status,
            joinDate: new Date().toISOString().split("T")[0], // Today's date
            subscibedAt: new Date().toISOString().split("T")[0], // Today's date
            college,
            permanentAddress,
            hostelAddress,
            email,
            password: hashedPassword,
            role: "user",
        }

        console.log("obj", obj);

        const response = await sendRegMail(obj);

        console.log("response", response);

        if (!response.success) {
            return res.status(500).json({
                message: response.message || "Internal Server Error",
                success: false,
            });
        }

        // Send a response to the client
        return res.status(200).json({
            message: response.message || "Email sent successfully",
            success: true,
        });
     
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};

const completeRegistration = async (req, res) => {
    try {

        //extract the data from the token
        const {token} = req.params;
        if(!token) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
            });
        }

        const body =  jwt.verify(token, process.env.JWT_SECRET);

        console.log(body);

        console.log("body", body);
        
           // Save user data
        const newUser = new userModel({
            name:body.name,
            email:body.email,
            mobileNumber: body.mobileNumber,
            password: body.password,
            role: "user",
        });

        const savedUser = await newUser.save();

        // Save member data
        const newMember = new memberModel({
            name:body.name,
            mobileNumber: body.mobileNumber,
            status:body.status,
            joinDate: body.joinDate, // Today's date
            subscibedAt: body.subscibedAt, // Today's date
            college:body.college,
            permanentAddress: body.permanentAddress,
            hostelAddress: body.hostelAddress,
        });

        const savedMember = await newMember.save();

        return res.redirect(process.env.CORS_ORIGIN);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};


const getMemberDetails = async (req, res) => {
    const {mobileNumber} = req.body;
    try {
        const members = await memberModel.find({mobileNumber});
        res.status(200).json({ data: members, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching member details', error, success: false });
    }
};

const getAllMembers = async (req, res) => {
    try {
        const members = await memberModel.find();
        res.status(200).json({ data: members, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching member details', error, success: false });
    }
};

const updateMembers = async (req, res) => {
    console.log(req.body);
    try {
        const updatedMember = await memberModel.findOneAndUpdate(
            { mobileNumber: req.body.mobileNumber },  // Find by mobileNumber
            req.body,  // Update with request body
            { new: true }  // Return the updated document
        );

        if (!updatedMember) {
            return res.status(404).json({ message: 'Member not found', success: false });
        }

        res.status(200).json({ message: 'Member updated successfully', data: updatedMember, success: true });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ message: 'Error updating member details', error, success: false });
    }
};

const deleteMember = async (req, res) => {
    const { mobileNumber } = req.params;

    try {
        // Delete member
        const member = await memberModel.findOneAndDelete({ mobileNumber });
        if (!member) {
            return res.status(404).json({ message: 'Member not found', success: false });
        }

        // Delete user
        const user = await userModel.findOneAndDelete({ mobileNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        // Delete meals
        const mealDeleteResult = await mealsModel.deleteMany({ mobileNumber });
        const mealsDeleted = mealDeleteResult.deletedCount;

        // Delete payments
        const paymentDeleteResult = await paymentsModel.deleteMany({ mobileNumber });
        const paymentsDeleted = paymentDeleteResult.deletedCount;

        return res.status(200).json({
            success: true,
            message: 'Deletion successful',
        });
    } catch (error) {
        console.error('Error deleting member:', error);
        return res.status(500).json({ message: 'Error deleting member', error, success: false });
    }
};




module.exports = { registerMember,getMemberDetails,getAllMembers,updateMembers,deleteMember,completeRegistration };
