const Post = require('../models/Post');
const User = require("../models/userModel")
const cloudinary = require("../utils/cloudinary")


exports.createPost = async (req, res) => {
    console.log("create post");
    // console.log(req.file)
    const { userId, title, content } = req.body;
    if (!userId || !title || !content) {
        return res.status(400).json({ message: "User ID, title, and content are required." });
    }
    try {
        let image;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            image = result.secure_url;
        }
        
        // create the post
        const newPostData = { user: userId , title, content };
        if (image) {
            newPostData.image = image;
        }
        const newPost = await Post.create(newPostData);
        // Update the user document to include the created post
        await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Error creating post." });
    }
};



exports.getAllPosts = async (req, res) => {
    console.log("get all posts");
    try {
        const posts = await Post.find().populate({ 
            path: 'comments', 
            options: { sort: { createdAt: -1 } },
            populate: { 
                path: 'user', 
                select: 'name image'
            } 
        }).populate('user').populate('likes').sort({ createdAt: -1 });

        res.status(200).json(posts);
        
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.getPostById = async (req, res) => {
    console.log("get post by id");
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId).populate("user").populate("comments"); // Populate the 'user' field
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updatePostById = async (req, res) => {
    console.log("update post by id")
    // const { postId } = req.params;
    // const { content } = req.body; // Assuming you're updating the post content

    // try {
    //     const updatedPost = await Post.findByIdAndUpdate(postId, { content }, { new: true });

    //     if (!updatedPost) {
    //         return res.status(404).json({ message: "Post not found" });
    //     }

    //     res.status(200).json(updatedPost);
    // } catch (err) {
    //     if (err.name === 'CastError') {
    //         return res.status(400).json({ message: "Invalid post ID" });
    //     }
    //     res.status(400).json({ message: err.message });
    // }
};

exports.deletePostById = async (req, res) => {
    console.log("delete post by id");
    const { postId } = req.params;

    try {
        // Find the post to get the image URL
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Delete the image from Cloudinary
        if (post.image) {
            const publicId = post.image.split('/').pop().split('.')[0]; // Extract public_id from the image URL
            await cloudinary.uploader.destroy(publicId); // Delete the image from Cloudinary
        }

        // Delete the post
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Remove the post ID from the user's posts array
        await User.findByIdAndUpdate(deletedPost.user, { $pull: { posts: postId } });

        res.status(200).json(deletedPost);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid post ID" });
        }
        res.status(400).json({ message: err.message });
    }
};


exports.likePost = async (req, res) => {
    console.log("like post")
    const { postId, userId } = req.body;
    console.log(postId, userId)

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.likes = post.likes || []; // Check if likes array exists, if not, initialize it as an empty array
        if (!post.likes.includes(userId)) {
            post.likes.push(userId); // Add userId to likes array if it's not already there
            const updatedPost = await post.save(); // Save the updated post
            return res.status(200).json(updatedPost);
        } else {
            return res.status(400).json({ message: "User already liked the post" }); // If user already liked the post, return error
        }
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Error liking post" });
    }
};

exports.unlikePost = async (req, res) => {
    const { postId, userId } = req.body;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const index = post.likes.indexOf(userId);
        if (index !== -1) {
        post.likes.splice(index, 1); // Remove userId from likes array if it exists
        }

        post.likes.splice(index, 1);
        const updatedPost = await post.save();

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error("Error unliking post:", error);
        res.status(500).json({ message: "Error unliking post" });
    }
};


exports.getPostsByUserId = async (req, res) => {
    console.log("posts user")
    const { userId } = req.params;
    console.log(userId)

    try {
        const posts = await Post.find({ user: userId });

        if (!posts) {
            return res.status(404).json({ message: 'Posts not found for the user' });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};
exports.getPostsByUserId = async (req, res) => {
    console.log("posts user");
    const { userId } = req.params;
    console.log(userId);

    try {
        const posts = await Post.find().populate({ 
            path: 'comments', 
            options: { sort: { createdAt: -1 } },
            populate: { 
                path: 'user'
            } 
        }).populate({ 
            path: 'user' 
        }).populate('likes').sort({ createdAt: -1 });

        if (!posts) {
            return res.status(404).json({ message: 'Posts not found for the user' });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};