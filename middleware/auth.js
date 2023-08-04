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
        res.status(401).json({ success: false, error: "Invalid token" });
        return;
      }
      if (decoded.loggedOut === true) {
        res.status(401).json({ success: false, error: "Token expired." });
        return;
      }
      const loggedInUser = await User.findById(decoded.id);
      if (loggedInUser) {
        res.locals.user = loggedInUser;
        next();
      } else {
        res.status(401).json({ success: false, error: "The user related to that token does not exist." });
        return;
      }
    } else {
      res.status(401).json({ success: false, error: "Access" });
      return;
    }
  },
};
