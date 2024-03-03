const OTP = require('../models/otpModel')
const User = require('../models/userModel')
const { createToken, verifyToken } = require("../utils/Token")
const { hashData } = require("../utils/hashData")
const cloudinary = require("../utils/cloudinary")
const errorResponse = require("../utils/errorResponse")

const loginUser = async (req, res, next) => {
  console.log("login")
  const {email, password} = req.body
  console.log(email, password)
  try {
    const user = await User.login(email, password)
    const token = await createToken( email, process.env.TOKEN_KEY, process.env.TOKEN_EXPIRY )

    const options = {
      expires: new Date( Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true
    };

    res
    .status(200)
    .cookie("token", token, options)
    .json({email, token})
  } catch (error) {
    res.status(error.statusCode || 500 ).json({ success: false, error: error.message || "server error" })
    // next(new errorResponse("invalid password", 401))
  }
}


const signupUser = async (req, res, next) => {
  console.log("sign up");
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }


  try {
    let image;
    // Upload image to cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }
    console.log("image")
    console.log(image)
    console.log("image")
    // Signup user
    const newUser = await User.signup(name, email, password, image);

    // Create JWT token
    const token = await createToken(email, process.env.TOKEN_KEY, process.env.TOKEN_EXPIRY);

    // Set cookie with token and send user data along with token in response
    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true
    };
    res.status(200).cookie("token", token, options).json({ user: newUser, token });
  } catch (error) {
    res.status(error.statusCode || 500 ).json({ success: false, error: error.message || "server error" })
  }
};

const logout = async (req, res) => {
  // clear the cookie and then make it expire (get deleted)
  console.log("logout")
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
  
    res.status(200).json({
      success: true,
      data: {}
    });
    } catch (err) {
      res.status(error.statusCode || 500 ).json({ success: false, error: error.message || "server error" })
    }
}



const forgetPassword = async (req, res) => {
  console.log("forget password and send otp to the email")
  const { email } = req.body
  if (!email) throw Error("an email is required")
  // check if the user exists
  const existingUser = await User.findOne({email})
  if (!existingUser) throw Error("no account for the provided email")
  const otpDetails = { email, subject: "password reset", message: "enter the code below to reset the password", duration: 1 }
  const createdOtp = await OTP.sendOtp(otpDetails)
  console.log(createdOtp)
  // save it in db
  res.status(200).json({status: "pending", message: "a reset verification code is sent"})
}


const resetPassword = async (req, res) => {
  console.log("password reset")
  const { email, resetOtp, newPassword } = req.body;
  console.log(email, resetOtp, newPassword)
  try {
    if (!(email && resetOtp && newPassword)) {
      throw Error("empty credentials aren't allowed")
    }
    // verify the user otp (email verification)
    const validOtp = await OTP.verifyOtp({email, otp: resetOtp})
    console.log(validOtp)
    // reset the password
    if (newPassword.length < 8) {
      throw Error("password is short")
    }
    const newHashedPassword = await hashData(newPassword)
    await User.updateOne({email}, {password: newHashedPassword})
    await OTP.deleteOtp({ email })
    res.status(200).json({email, passwordReset: true})
    } catch (err) {
      res.status(400).json({error: err.message})
    }
}

module.exports = { signupUser, loginUser, logout, forgetPassword, resetPassword }