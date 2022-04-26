const mongoose = require('mongoose');
const { Schema } = mongoose;

const doctorSchema = new Schema({
  username:  String, 
  password: String,
  name: String,
  experience: Number,
  education: String,
  patients : [{ type: Schema.Types.ObjectId, ref: 'Patient' }]
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;

