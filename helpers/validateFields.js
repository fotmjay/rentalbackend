const validator = require("validator");

function validateUser(data) {
  const validationErrors = [];
  data.email = validator.trim(data.email).toLowerCase();
  data.username = validator.trim(data.username).toLowerCase();
  if (data.username.length < 5) validationErrors.push({ message: "Username needs to be at least 6 characters." });
  if (data.password.length < 8) validationErrors.push({ message: "Password needs to be at least 8 characters." });
  if (!validator.isEmail(data.email)) validationErrors.push({ message: "Please enter a valid email address." });
  if (data.password !== data.confirmPass || validator.isEmpty(data.password))
    validationErrors.push({ message: "Passwords do not match." });
  if (validationErrors.length > 0) {
    return { success: false, errors: validationErrors };
  } else {
    return { success: true, data };
  }
}

module.exports = { validateUser };
