const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const { protect } = require("../middleware/protect")
// const authMiddleware = require('../middleware/authMiddleware');

// User routes
// router.get('/:userId', userControllers.getUserById);
// router.put('/:userId', authMiddleware.authenticate, userControllers.updateUserById);
// router.delete('/:userId', authMiddleware.authenticate, userControllers.deleteUserById);

router.get('/', userControllers.getAllUsers);
router.get('/me', protect,userControllers.getMe);

router.get('/:userId', userControllers.getUserById);
router.put('/:userId', userControllers.updateUserById);
router.delete('/:userId', userControllers.deleteUserById);
module.exports = router;