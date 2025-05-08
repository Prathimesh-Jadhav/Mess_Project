const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const sendRegMail = async (obj) => {
    try {
        console.log("obj", obj);
        console.log("process.env.EMAIL_USER", process.env.EMAIL_USER);
        console.log("process.env.EMAIL_PASS", process.env.EMAIL_PASS);
        
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        //generate a token for the user
        const token = jwt.sign({ ...obj}, process.env.JWT_SECRET, { expiresIn: '5m' });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: obj.email,
            subject: 'Complete your registration',
            text: `Hello ${obj.name},\n\nPlease complete your registration by clicking the link below:\n\n https://mess-project-3os8.onrender.com/verify-email/${token}\n\nThank you!`,
        };

        await transporter.sendMail(mailOptions);
        return {
            message: 'Email sent successfully',
            success: true,
        };
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendRegMail;