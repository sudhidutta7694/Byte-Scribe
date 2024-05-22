const verifyAdmin = (req, res, next) => {
    if (!req.isAdmin) {
        return res.status(403).json("You are not authorized to access this resource!");
    }
    next();
};

module.exports = verifyAdmin;
