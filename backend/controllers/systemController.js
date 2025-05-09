const SystemConfig = require('../models/systemConfig');
const {processMonthlyPaymentsJob} = require('../services/paymentsProcessor');
const {handleMissedMeals} = require('./mealsController');
const Payments = require('../models/paymentsModel');
const Member = require('../models/memberModel');

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

    //check whether any payment record completed 30 days
    const payments = await Payments.find({endDate:today});
    if(payments.length > 0){
      for(let i=0;i<payments.length;i++){
        const payment = payments[i];
        const startDate = new Date(payment.startDate);
        const endDate = new Date(payment.endDate);
        const timeDiff = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // days
        if(diffDays >= 30){
          //access the member of that payment and update the status to inactive
          const member = await Member.findOne({mobileNumber:payment.mobileNumber});
          member.status = 'Subscription Expired';
          await member.save();
        }
      }
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