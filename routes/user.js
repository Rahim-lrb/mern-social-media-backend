const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const { protect } = require("../middleware/protect")



router.get('/', userControllers.getAllUsers);
router.get('/me', protect, userControllers.getUserById);

router.put('/:userId', userControllers.updateUserById);
router.delete('/:userId', userControllers.deleteUserById);
module.exports = router;