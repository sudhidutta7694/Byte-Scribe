const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { verifyToken, verifyTokenAndAdmin } = require('../middlewares');

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Error fetching users" });
    }
});

// UPDATE USER
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...updateData } = req.body;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            console.error(`User with ID ${id} not found`);
            return res.status(404).json({ error: `User with ID ${id} not found` });
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Error updating user" });
    }
});

// DELETE USER
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);
        await Post.deleteMany({ userId: id });
        await Comment.deleteMany({ userId: id });

        res.status(200).json("User has been deleted!");
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Error deleting user" });
    }
});

// GET USER BY ID
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            console.error(`User with ID ${id} not found`);
            return res.status(404).json({ error: `User with ID ${id} not found` });
        }

        const { password, ...info } = user._doc;
        res.status(200).json(info);
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Error fetching user" });
    }
});

module.exports = router;
