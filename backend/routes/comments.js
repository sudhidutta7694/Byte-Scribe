const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { verifyToken } = require('../middlewares');

// CREATE
router.post("/create", verifyToken, async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ error: "Error creating comment" });
    }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedComment);
    } catch (err) {
        console.error("Error updating comment:", err);
        res.status(500).json({ error: "Error updating comment" });
    }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json("Comment has been deleted!");
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ error: "Error deleting comment" });
    }
});

// GET POST COMMENTS
router.get("/post/:postId", verifyToken, async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.status(200).json(comments);
    } catch (err) {
        console.error("Error fetching post comments:", err);
        res.status(500).json({ error: "Error fetching post comments" });
    }
});

module.exports = router;
