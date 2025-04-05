
const express = require("express");
const { login,addAdmin ,getAdmin,getUser,updateUser,forgotPassword,resetPassword} = require("../controllers/userController");

const router = express.Router();

router.post('/login',login)
router.post('/addAdmin',addAdmin)
router.get('/getAdmin',getAdmin)
router.get('/getUser/:id',getUser)
router.put('/updateUser/:id',updateUser)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router