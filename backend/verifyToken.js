const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json("You are not authenticated!");
    }
    jwt.verify(token, process.env.SECRET || ";0Ma)/ymOGFKC0QQ$1t4`^W*B^UMJk4D{22P58F?bI.$r}&FE-#|krQHW/jz!>K", async (err, data) => {
        if (err) {
            return res.status(403).json("Token is not valid!");
        }
        
        req.userId = data._id;
        req.isAdmin = data.isAdmin;  // Add isAdmin to request
        
        next();
    });
};

module.exports = verifyToken;
