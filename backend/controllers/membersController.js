const userModel = require("../models/userModel"); // Adjust the path as per your folder structure
const memberModel = require("../models/memberModel");
const bcrypt = require("bcryptjs");
const { get } = require("mongoose");

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

        // Save user data
        const newUser = new userModel({
            name,
            email,
            mobileNumber,
            password: hashedPassword,
            role: "user",
        });

        const savedUser = await newUser.save();

        // Save member data
        const newMember = new memberModel({
            name,
            mobileNumber,
            status,
            joinDate: new Date().toISOString().split("T")[0], // Today's date
            subscibedAt: new Date().toISOString().split("T")[0], // Today's date
            college,
            permanentAddress,
            hostelAddress,
        });

        const savedMember = await newMember.save();

        return res.status(201).json({
            message: "Member registered successfully",
            success: true,
            data: {
                user: savedUser,
                member: savedMember,
            },
        });
    } catch (error) {
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


module.exports = { registerMember,getMemberDetails,getAllMembers,updateMembers };
