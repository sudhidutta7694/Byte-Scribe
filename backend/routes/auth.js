const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const isAdmin = (username === 'admin' && email === 'admin@example.com' && password === 'admin1234#');

        const newUser = new User({ username, email, password: hashedPassword, isAdmin });
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Error registering user" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isAdminCredentials = (email === 'admin@example.com' && password === 'admin1234#');
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ error: "Wrong credentials" });
        }

        const tokenData = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        if (isAdminCredentials) {
            tokenData.isAdmin = true;
        }

        const token = jwt.sign(tokenData, process.env.SECRET, { expiresIn: "3d" });
        const { password: _, ...userInfo } = user._doc;

        res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true }).status(200).json(userInfo);
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Error logging in" });
    }
});

// LOGOUT
router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).send("User logged out successfully!");
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).json({ error: "Error logging out" });
    }
});

// REFETCH USER
router.get("/refetch", (req, res) => {
    try {
        const token = req.cookies.token;

        jwt.verify(token, process.env.SECRET, {}, (err, data) => {
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
