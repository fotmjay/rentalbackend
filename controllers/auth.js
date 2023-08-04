const User = require("../models/User");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config/.env" });

module.exports = {
  login: async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({ success: false, error: "Please supply a username and password." });
      return;
    }
    const username = validator.trim(req.body.username).toLowerCase();
    const exists = await User.findOne({ username: username });
    if (!exists) {
      res.status(400).json({ success: false, error: "Username not found." });
      return;
    } else {
      if (exists.validPassword(req.body.password)) {
        const token = jwt.sign(
          { id: exists._id, username: exists.username, loggedOut: false },
          process.env.SECRET_JWT_CODE,
          { expiresIn: "1h" }
        );
        res.status(200).json({ success: true, token: token, message: "Successfully logged in!" });
        return;
      } else {
        res.status(400).json({ success: false, error: "Username and password do not match." });
        return;
      }
    }
  },
  register: async (req, res, next) => {
    // FIELD VALIDATION
    console.log("we got here");
    console.log(req.body);
    const validationErrors = [];
    const email = validator.trim(req.body.email).toLowerCase();
    const username = validator.trim(req.body.username).toLowerCase();
    if (username.length < 5) validationErrors.push({ message: "Username needs to be at least 6 characters." });
    if (req.body.password.length < 8) validationErrors.push({ message: "Password needs to be at least 8 characters." });
    if (!validator.isEmail(req.body.email)) validationErrors.push({ message: "Please enter a valid email address." });
    if (req.body.password !== req.body.confirmPass || validator.isEmpty(req.body.password))
      validationErrors.push({ message: "Passwords do not match." });

    if (validationErrors.length > 0) {
      console.log(validationErrors);
      res.status(400).json({ success: false, error: validationErrors });
      return;
    }
    try {
      const exists = await User.findOne({ $or: [{ email: email }, { username: username }] });
      if (exists) {
        res.status(400).json({ success: false, error: "A user with that username or email already exists." });
        return;
      } else {
        let newUser = new User({ username: username, email: email });
        // Call setPassword function to hash password and set it
        newUser.setPassword(req.body.password);
        const saved = await newUser.save();
        if (saved) {
          res.status(200).json({ success: true, message: "Account creation successful, you may now log in." });
          return;
        } else {
          res
            .status(400)
            .json({ success: false, error: "An error occured while creating your account.  Please try again." });
          return;
        }
      }
    } catch (err) {
      console.error(err + " : ERROR ");
      res.status(500).json({ success: false, error: "A network error occured.  Please try again." });
      return;
    }
  },
};
