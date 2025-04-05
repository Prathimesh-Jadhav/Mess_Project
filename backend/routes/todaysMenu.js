const express = require("express");
const router = express.Router();
const {addTodaysMenu,getTodaysMenu} = require("../controllers/todaysMenuController")

router.post("/addTodaysMenu",addTodaysMenu)
router.get("/getTodaysMenu",getTodaysMenu)

module.exports = router