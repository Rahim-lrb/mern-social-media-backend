const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/postControllers');
const commentRouter = require("../routes/comment")
const upload = require("../utils/multer")


// ! merge
router.use('/comments', commentRouter);


router.route('/')
    .get(postControllers.getAllPosts)
    .post(upload.single("file") ,postControllers.createPost)

router.route('/:postId')
    .get(postControllers.getPostById)
    // .put(postControllers.updatePostById)
    .delete(postControllers.deletePostById);

router.post('/:postId/like', postControllers.likePost);


router.post("/like", postControllers.likePost)
router.post("/unlike", postControllers.unlikePost)

router.get("/user/:userId", postControllers.getPostsByUserId)


module.exports = router;