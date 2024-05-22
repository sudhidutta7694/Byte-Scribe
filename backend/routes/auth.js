const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body
        const salt = await bcrypt.genSalt(10)

        const isAdmin = (username === 'admin' && email=== 'admin@example.com' && password === 'admin1234#');

        const hashedPassword = bcrypt.hashSync(password, salt)
        const newUser = new User({ username, email, password: hashedPassword, isAdmin: isAdmin })
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)

    }
    catch (err) {
        res.status(500).json(err)
    }

})


//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json("User not found!")
        }

        // Check if the credentials are for an admin user
        const isAdminCredentials = (req.body.email === 'admin@example.com' && req.body.password === 'admin1234#');

        const match = await bcrypt.compare(req.body.password, user.password)

        if (!match) {
            return res.status(401).json("Wrong credentials!")
        }
        
        const tokenData = {
            _id: user._id,
            username: user.username,
            email: user.email
        };

        if (isAdminCredentials) {
            tokenData.isAdmin = true;
        }

        const token = jwt.sign(tokenData, process.env.SECRET || ";0Ma)/ymOGFKC0QQ$1t4`^W*B^UMJk4D{22P58F?bI.$r}&FE-#|krQHW/jz!>K", { expiresIn: "3d" })
        const { password, ...info } = user._doc
        res.cookie("token", token).status(200).json(info)

    }
    catch (err) {
        // res.status(500).json(err)
        res.json(err)
    }
})




//LOGOUT
router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).send("User logged out successfully!")

    }
    catch (err) {
        res.status(500).json(err)
    }
})

//REFETCH USER
router.get("/refetch", (req, res) => {
    const token = req.cookies.token
    jwt.verify(token, process.env.SECRET || ";0Ma)/ymOGFKC0QQ$1t4`^W*B^UMJk4D{22P58F?bI.$r}&FE-#|krQHW/jz!>K", {}, async (err, data) => {
        if (err) {
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})



module.exports = router