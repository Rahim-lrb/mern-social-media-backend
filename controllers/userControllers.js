const User = require('../models/userModel');
const errorResponse = require("../utils/errorResponse")
const mongoose = require("mongoose")

// Get user by ID from the token
exports.getUserById = async (req, res) => {
  console.log("get me or the currentUser");
  console.log(req.currentUser._id);
  
  try {
    console.log("the user Id from the cookie");
    const userId = mongoose.Types.ObjectId(req.currentUser._id);
    console.log(userId)
    const user = await User.findById(userId).populate('posts');
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message || "server error" });
  }
};

// Update user by ID
exports.updateUserById = async (req, res) => {
  console.log("update account")
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { name, email, role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
      res.status(error.statusCode || 500 ).json({ success: false, error: error.message || "server error" })
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  console.log("delete account")
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(error.statusCode || 500 ).json({ success: false, error: error.message || "server error" })
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(error.statusCode || 500 ).json({ success: false, error: error.message || "server error" })
  }
}