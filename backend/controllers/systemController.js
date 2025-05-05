const SystemConfig = require('../models/systemConfig');
const {processMonthlyPaymentsJob} = require('../services/paymentsProcessor');
const {handleMissedMeals} = require('./mealsController');

async function runDailyAdminTask() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  let config = await SystemConfig.findOne({ date: today });

  if (!config || config.date !== today) {
    console.log('Running daily task for admin login...');

    
    const mealUpdateResponse = await handleMissedMeals();

    if(!mealUpdateResponse.success){
    return {message:mealUpdateResponse.message,success:false};
    }
    
    
    const paymentsResponse = await processMonthlyPaymentsJob();

    console.log(paymentsResponse)

    if(!paymentsResponse.success){
    return {message:paymentsResponse.message,success:false};
    }


    if (!config) {
      await SystemConfig.deleteMany({});
      await SystemConfig.create({date: today});
    } else {
      config.value = today;
      await config.save();
    }

    return {message:'Updated meals and Payments of Today',success:true};

  } else {
    return {success:true};
  }
}

module.exports = { runDailyAdminTask };