const express = require("express");
const router = express.Router();
const {addMeal,getAllMeals,fetchUserMealDetails,getTotalDueForMembers,getMealDetails,getAllMealsOfMember} = require("../controllers/mealsController")
const mealsModel = require('../models/mealsModel')

router.post("/addMeal",addMeal)
router.get("/getAllMeals",getAllMeals)
router.post('/getMealDetails',getMealDetails);
router.get("/fetchUserMealDetails",fetchUserMealDetails)
router.get("/getTotalDueForMembers",getTotalDueForMembers)
router.post("/getAllMealsOfMember",getAllMealsOfMember);
module.exports = router