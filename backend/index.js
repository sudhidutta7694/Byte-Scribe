const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const multer = require('multer')
const path = require("path")
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')

//database
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://sudhidutta7694:Xvnrnc1ggoQQFFyR@cluster0.fnfspwz.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
        console.log("database is connected successfully!")

    }
    catch (err) {
        console.log(err)
    }
}



//middlewares
dotenv.config()
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")))
const allowedOrigins = [
    'http://localhost:5173',  // Add your development origin
    'https://byte-scribe.vercel.app' // Add your production origin
];

app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(cookieParser())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/comments", commentRoute)

//image upload
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, "images")
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img)
        // fn(null,"image1.jpg")
    }
})

const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})


app.listen(8080, () => {
    connectDB()
    console.log("app is running on port " + 8080)
})