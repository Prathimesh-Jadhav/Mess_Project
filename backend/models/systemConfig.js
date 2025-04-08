// models/SystemConfig.js
const mongoose = require('mongoose');

const SystemConfigSchema = new mongoose.Schema({
  date:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('SystemConfig', SystemConfigSchema);