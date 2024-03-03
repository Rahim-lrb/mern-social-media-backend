const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { verifyToken } = require("../utils/Token");

const protect = async (req, res, next) => {
    console.log("protect routes");

    const tokenFromCookie = req.cookies.token;
    const tokenFromBody = req.body.token;
    const tokenFromQuery = req.query.token;
    const tokenFromHeader = req.headers["x-access-token"];
    const authorizationHeader = req.headers.authorization;
    const tokenFromBearerHeader = authorizationHeader && authorizationHeader.startsWith('Bearer ') ? authorizationHeader.split(' ')[1] : null;

    const token = tokenFromBody || tokenFromQuery || tokenFromHeader || tokenFromBearerHeader || tokenFromCookie;
    console.log(token)
    try {
        if (!token) {
            throw new Error('Authentication token is required');
        }

        const decoded = await verifyToken(token, process.env.TOKEN_KEY);

        // Fetch the user from the database using the email obtained from the decoded token
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            throw new Error('User not found');
        }
        // Attach the user information to the req object so it can be used in 
        req.currentUser = user;
        // console.log("Authenticated User:", req.currentUser);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Authorization failed. Invalid or expired token.' });
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.currentUser.role)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      next();
    };
  };
  


module.exports = { protect, authorize };


/*
! req.currentUser
* other routes
app.get('/profile', protect, (req, res) => {
    . we do the job to preview what want want 
    . but only if the user is authenticated
    . Access user information from req.currentUser
    const user = req.currentUser;
    res.json({ user });
});
* Authorization Checks: only authenticated users and isAdmin true can access this route
app.post('/admin-action', protect, (req, res) => {
    . Check if the user has admin privileges
    if (req.currentUser && req.currentUser.isAdmin) {
        . Perform admin action
        res.json({ message: 'Admin action performed' });
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

*
*/ 