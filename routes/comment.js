const express = require('express');
const router = express.Router({mergeParams: true});
const commentControllers = require('../controllers/commentControllers');
// const authMiddleware = require('../middleware/authMiddleware');

// router.post('/:postId/comments', authMiddleware.authenticate, commentControllers.addComment);
// router.delete('/:postId/comments/:commentId', authMiddleware.authenticate, commentControllers.deleteComment);

router.get('/' , commentControllers.getComments);
router.post('/' , commentControllers.addComment);
router.delete('/:commentId', commentControllers.deleteComment);

module.exports = router;