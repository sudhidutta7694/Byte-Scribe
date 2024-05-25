const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require("path");
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');

// Load environment variables from .env file
dotenv.config();

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully!");
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

// Middlewares
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

// CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    process.env.PRODUCTION_ORIGIN // Use production origin from environment variable
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(cookieParser());

// Debugging cookies
app.use((req, res, next) => {
    console.log('Cookies:', req.cookies); // Debugging cookies
    next();
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// Image upload
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, "images");
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img);
    }
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("Image has been uploaded successfully!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    connectDB();
    console.log(`App is running on port ${PORT}`);
});
