const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


const login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;
        const user = await userModel.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let passwordRight = await bcrypt.compare(password, user.password)
        if (!passwordRight) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token =  jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({ message: "Login successful", data:user,token:token,success:true }); 
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const addAdmin = async (req, res) => {
    try {
        const { name, mobileNumber, password,email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, mobileNumber, password: hashedPassword, role:'admin',email });
        return res.status(201).json({ message: "Admin created successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const getAdmin = async (req, res) => {
    try {
        const admin = await userModel.findOne({ role: 'admin' });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({ message: "Admin details", data:admin,success:true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.find({mobileNumber:id});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User details", data:user,success:true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const {password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.findOneAndUpdate({ mobileNumber: id }, {password: hashedPassword }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully", data:user,success:true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error,success:false });
    }
};

const forgotPassword = async (req, res) => {
    const { mobileNumber } = req.body;
    console.log(mobileNumber)

  try {
    const user = await userModel.findOne({ mobileNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const resetLink = `https://mess-project.vercel.app/reset-password/${token}`;

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"Buddy\'s Kitchen" <no-reply@dineflow.com>',
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
    });

    res.status(200).json({ message: 'Reset link sent to your email',success:true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error',success:false });
  }
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await userModel.findByIdAndUpdate(decoded.id, { password: hashedPassword });
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid or expired token' });
    }
}


module.exports = { login,addAdmin,getAdmin,getUser,updateUser,forgotPassword,resetPassword };