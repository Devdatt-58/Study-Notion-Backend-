const mongoose = require('mongoose');
const { create } = require('./User');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*5 // OTP expires in 5 minutes
    }
});

//a function -> to send emails

async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNodtion",otp);
        console.log("Mail Sent Successfully",mailResponse);
    }
    catch(error){
        console.log("Error in sending mail", error);
        throw error;
    }
}

//middleware
OTPSchema.pre('save', async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
});

module.exports = mongoose.model('OTP', OTPSchema);