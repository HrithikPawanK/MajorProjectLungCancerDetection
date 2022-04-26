const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
  username:  String, 
  password: String,
  name: String,
  age: Number,
  gender: String,
  data : [{ img : String, result : String}]
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;

