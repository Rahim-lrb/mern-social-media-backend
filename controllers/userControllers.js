const User = require('../models/userModel');


exports.getMe = async (req, res) => {
  console.log('me')
  const user = req.currentUser;
  res.json({ user });
}



// Get user by ID from the token
exports.getUserById = async (req, res) => {
  console.log("get me")
  try {
    const { userId } = req.params;
    console.log(userId)

    // const user = await User.findById(userId);
    const user = await User.findById(userId).populate('posts');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}