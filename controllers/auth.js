const User = require("../models/User");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { validateUser } = require("../helpers/validateFields");
require("dotenv").config({ path: "./config/.env" });

module.exports = {
  login: async (req, res, next) => {
    if (!req.body.data.username || !req.body.data.password) {
      res.status(400).json({ success: false, error: "Please supply a username and password." });
      return;
    }
    const username = validator.trim(req.body.data.username).toLowerCase();
    try {
      const exists = await User.findOne({ username: username });
      if (!exists) {
        res.status(400).json({ success: false, error: "Username not found." });
        return;
      } else {
        if (exists.validPassword(req.body.data.password)) {
          const token = jwt.sign(
            { id: exists._id, username: exists.username, loggedOut: false },
            process.env.SECRET_JWT_CODE,
            { expiresIn: process.env.JWT_EXPIRATION }
          );
          res.status(200).json({ success: true, token: token, message: "Successfully logged in!" });
          return;
        } else {
          res.status(400).json({ success: false, error: "Username and password do not match." });
          return;
        }
      }
    } catch (err) {
      console.error(err + " : ERROR ");
      res.status(500).json({ success: false, error: "A network error occured while logging in.  Please try again." });
      return;
    }
  },
  register: async (req, res, next) => {
    // FIELD VALIDATION
    const validated = validateUser(req.body.data);
    if (!validated.success) {
      const validationErrors = [];
      for (let i = 0; i < validated.errors.length; i++) {
        validationErrors.push({ message: validated.errors[i].message });
      }
      console.log(validationErrors);
      res.status(400).json({ success: false, error: validationErrors });
      return;
    }
    try {
      const exists = await User.findOne({
        $or: [{ email: validated.data.email }, { username: validated.data.username }],
      });
      if (exists) {
        res.status(400).json({ success: false, error: "A user with that username or email already exists." });
        return;
      } else {
        let newUser = new User({ username: validated.data.username, email: validated.data.email });
        // Call setPassword function to hash password and set it
        newUser.setPassword(validated.data.password);
        const saved = await newUser.save();
        if (saved) {
          module.exports.login(req, res, next);
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
