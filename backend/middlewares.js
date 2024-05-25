const jwt = require('jsonwebtoken');

// Common token verification function
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "You are not authenticated!" });
    }

    jwt.verify(token, process.env.SECRET, (err, data) => {
        if (err) {
            return res.status(403).json({ message: "Token is not valid!" });
        }
        
        req.userId = data._id;
        req.isAdmin = data.isAdmin;  
        req.user = data;  
        
        next();
    });
};

// Middleware to verify token and admin status
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.isAdmin) {
            return res.status(403).json({ message: "Admin access only!" });
        }
        
        next();
    });
};

module.exports = { verifyToken, verifyTokenAndAdmin };
