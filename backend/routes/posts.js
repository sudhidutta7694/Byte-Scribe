const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { verifyToken, verifyTokenAndAdmin } = require('../middlewares');

// CREATE
router.post("/create", verifyToken, async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ postId: req.params.id });
        res.status(200).json("Post has been deleted!");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET POST DETAILS
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET POSTS
router.get("/", verifyToken, async (req, res) => {
    const { search, page = 1, limit = 3 } = req.query;
    try {
        const searchFilter = search ? { title: { $regex: search, $options: "i" } } : {};
        const posts = await Post.find(searchFilter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const totalPosts = await Post.countDocuments(searchFilter);
        const hasMore = totalPosts > page * limit;
        res.status(200).json({ posts, hasMore });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER POSTS
router.get("/user/:userId", verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.userId });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// APPROVE POST
router.put("/approve/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { approved: true, status: "approved" },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(`Error approving post with ID: ${req.params.id}`, err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

// REJECT POST
router.put("/reject/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { approved: false, status: "rejected", suggestions: req.body.suggestions || "" },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Review Post
router.put('/review/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const postId = req.params.id;
        const { suggestions, status } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: { suggestions, status } },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get suggestions for a specific post
router.get('/review/:id/suggestions', verifyTokenAndAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post.suggestions || []);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
