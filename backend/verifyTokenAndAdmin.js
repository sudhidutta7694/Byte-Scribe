const jwt = require('jsonwebtoken');

const verifyTokenAndAdmin = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || ";0Ma)/ymOGFKC0QQ$1t4`^W*B^UMJk4D{22P58F?bI.$r}&FE-#|krQHW/jz!>K", (err, user) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    if (!user.isAdmin) return res.status(403).json({ message: 'Admin access only' });
    
    req.user = user;
    next();
  });
};

module.exports = { verifyTokenAndAdmin };
