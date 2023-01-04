const mongoose=require('mongoose');

let Schema=mongoose.Schema;

var otpSchema = new Schema({
    patientId:String,
    otp:String
  });

module.exports=mongoose.model('otp',otpSchema,'OTP');