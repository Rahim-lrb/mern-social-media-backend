const Like = require('../models/Like');

exports.likePost = async (req, res) => {
    console.log("like post")
};

exports.unlikePost = async (req, res) => {
    console.log("unlike post")
};


exports.hasLikedPost = async (req, res) => {
    try {
      const { userId, postId } = req.query; // Assuming userId and postId are provided as query parameters
        const existingLike = await Like.findOne({ user: userId, post: postId });
        res.status(200).json({ hasLiked: !!existingLike });
    } catch (err) {
        console.error('Error checking like status:', err);
        res.status(500).json({ message: 'Error checking like status.' });
    }
};