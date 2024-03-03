const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.addComment = async (req, res) => {
    console.log("add comment");
    const { userId, postId, content } = req.body;
    console.log(userId)
    console.log(postId)
    console.log(content)


    if (!postId || !userId || !content) {
        return res.status(400).json({ message: "Post ID, user ID, and content are required." });
    }

    try {
        // Create the comment
        const comment = await Comment.create({ post: postId, user: userId, content });

        // Update the post document to include the new comment
        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

        res.status(201).json(comment);
    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).json({ message: "Error adding comment." });
    }
};

exports.getComments = async (req, res) => {
    console.log("get post comments");
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ post: postId }).populate('user'); // Populate the 'user' field to get user details

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this post' });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteComment = async (req, res) => {
    console.log("delete comment");
    try {
        const { commentId } = req.params;
        
        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        // Find the post to which the comment belongs and remove the comment ID from its 'comments' array
        await Post.updateOne({ comments: commentId }, { $pull: { comments: commentId } });

        // Remove the comment document
        await comment.remove();

        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
