const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check for missing fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const isAdmin = (username === process.env.ADMIN_USERNAME && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD);

        const newUser = new User({ username, email, password: hashedPassword, isAdmin });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Error registering user" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Wrong credentials" });
        }

        const tokenData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin || false
        };

        const token = jwt.sign(tokenData, process.env.SECRET, { expiresIn: "3d" });
        const { password: _, ...userInfo } = user._doc;

        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("token", token, { 
            httpOnly: true, 
            sameSite: isProduction ? "none" : "lax", 
            secure: isProduction 
        }).status(200).json(userInfo);
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Error logging in" });
    }
});

// LOGOUT
router.get("/logout", async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie("token", { 
            sameSite: isProduction ? "none" : "lax", 
            secure: isProduction 
        }).status(200).send("User logged out successfully!");
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).json({ error: "Error logging out" });
    }
});

// REFETCH USER
router.get("/refetch", (req, res) => {
    try {
        console.log("Cookies:", req.cookies);
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({ error: "Token not provided" });
        }

        jwt.verify(token, process.env.SECRET, (err, data) => {
            if (err) {
                console.error("Error verifying token:", err);
                return res.status(403).json({ error: "Token verification failed" });
            }

            res.status(200).json(data);
        });
    } catch (err) {
        console.error("Error refetching user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
