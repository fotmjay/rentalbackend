const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config({ path: "./config/.env" });

module.exports = {
  ensureAuth: async function (req, res, next) {
    if (req.headers?.authorization) {
      let authorization = req.headers.authorization;
      let decoded;
      try {
        decoded = jwt.verify(authorization, process.env.SECRET_JWT_CODE);
      } catch (e) {
        if (e.name === "TokenExpiredError") {
          res.status(401).json({ success: false, error: "Authorization expired, please log back in." });
        } else {
          res.status(401).json({ success: false, error: "Invalid token." });
        }
        return;
      }
      const loggedInUser = await User.findById(decoded.id);
      if (loggedInUser) {
        res.locals.user = loggedInUser;
        res.locals.refreshToken = jwt.sign(
          { id: loggedInUser._id, username: loggedInUser.username },
          process.env.SECRET_JWT_CODE,
          { expiresIn: process.env.JWT_EXPIRATION }
        );
        next();
      } else {
        res.status(401).json({ success: false, error: "The user related to that token does not exist." });
      }
    } else {
      res.status(401).json({ success: false, error: "Please log in." });
    }
  },
};
