const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json("You are not authenticated!");
    }
    jwt.verify(token, process.env.SECRET, async (err, data) => {
        if (err) {
            return res.status(403).json("Token is not valid!");
        }
        
        req.userId = data._id;
        req.isAdmin = data.isAdmin;  // Add isAdmin to request
        
        next();
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    if (!user.isAdmin) return res.status(403).json({ message: 'Admin access only' });
    
    req.user = user;
    next();
  });
};

module.exports = { verifyToken, verifyTokenAndAdmin };
