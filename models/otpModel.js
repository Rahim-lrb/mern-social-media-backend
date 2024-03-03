const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sendEmail = require("../utils/mailer");
const { hashData, verifyHashedData } = require("../utils/hashData");

const otpSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    otp: String,
    createdAt: Date,
    expiresAt: Date
});



otpSchema.statics.sendOtp = async function({ email, subject, message, duration = 1 }) {
    try {
        if (!(email && subject && message)) {
            throw Error("provide values for email, subject, and message");
        }
        await this.deleteOne({ email });

        // generate and hash OTP
        const generatedOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const hashedOtp = await hashData(generatedOtp);

        // send email to the user
        const mailOptions = {
            from: "rahim.rodruigez16@gmail.com", // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: `<p>${message}: ${generatedOtp}</p>
            <p>expires in: ${duration} minute</p>`,
        };
        await sendEmail(mailOptions);

        const newOtp = await this.create({ email, otp: hashedOtp, createdAt: Date.now(), 
            expiresAt: Date.now() + duration * 60 * 1000 });

        return newOtp;
    } catch (err) {
        throw err;
    }
};

otpSchema.statics.verifyOtp = async function({ email, otp }) {
    try {
        if (!(email && otp)) {
            throw Error("provide email and otp");
        }
        // ensure otp exists 
        const matchedOtpRecord = await this.findOne({ email });
        if (!matchedOtpRecord) {
            throw Error("no otp found");
        }

        const { expiresAt } = matchedOtpRecord;
        if (expiresAt < Date.now()) {
            await this.deleteOne({ email });
            throw Error("otp is expired request a new one");
        }

        // verify the value
        const hashedOtp = matchedOtpRecord.otp;
        const validOtp = await verifyHashedData(otp, hashedOtp);
        return validOtp;
    } catch (err) {
        throw err;
    }
};

otpSchema.statics.deleteOtp = async function({ email }) {
    try {
        await this.deleteOne({ email });
    } catch (err) {
        throw err;
    }
};

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;




/*
! as an outer function
const OTP = require("../models/otpModel")
const sendEmail = require("../utils/mailer")
const { hashData, verifyHashedData } = require("./hashData")


const generateOtp = () => {
    try {
        return `${Math.floor(1000 + Math.random() * 9000)}`;
    } catch (err) {
        throw err;
    }
};


const sendOtp = async ( {email, subject,message, duration = 1}) => {
    try {
        if (!(email && subject && message)) {
            throw Error("provide values for email, subject and message")
        }
        // clear any old record
        await OTP.deleteOne({email})
        // generate otp
        const generatedOtp = generateOtp();

        // send email to the user
        const mailOptions = {
            from: "rahim.rodruigez16@gmail.com", // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: `<p>${message}: ${generatedOtp}</p>
            <p>expires in: ${duration} minute</p>`,
        }
        await sendEmail(mailOptions)
        // save otp record in db , hash it
        const hashedOtp = await hashData(generatedOtp);
        console.log(hashedOtp); 


        const newOtp = await new OTP({email, otp: hashedOtp, createdAt: Date.now(), expiresAt: Date.now() + 3600000 + duration })

        const createdOtpRecord = await newOtp.save();
        return createdOtpRecord;
    }
    catch (err) {
        throw err
    }
}


const verifyOtp = async ({email, otp}) => {
    console.log(email, otp)
    try {
        if (!(email && otp)) {
            throw Error("provide email and otp")
        }
        // ensure otp exists 
        const matchedOtpRecord = await OTP.findOne({email})
        if (!matchedOtpRecord) {
            throw Error("no otp found")
        }


        const {expiresAt} = matchedOtpRecord
        if (expiresAt < Date.now()) {
            await OTP.deleteOne({email})
            throw Error("otp is expired request a new one")
        }

        // verify the value
        const hashedOtp = matchedOtpRecord.otp
        const validOtp = await verifyHashedData(otp, hashedOtp)
        return validOtp
    } catch(err) {
        console.log(err)
        throw err
    }
}


const deleteOtp = async ({email}) => {
    try {
        await OTP.deleteOne({email})
    } catch(err) {
        throw err
    }
}



module.exports = { generateOtp, sendOtp, verifyOtp, deleteOtp };

*/ 