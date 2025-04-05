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

router.post('/test',async (req,res)=>{
    try{
       const response = await mealsModel.insertMany(req.body); 
       if(!response){
        console.log('added successfully')
       }
       res.status(200).json(response)
    }
    catch(err){
       console.log('error')
       res.status(500).json({message:'error',err})
    }
})
module.exports = router