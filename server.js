require("dotenv").config({ path: "./config/.env" });
const cors = require("cors");

// CONSTANTS
const PORT = process.env.PORT || 3000;

//ROUTES
const mainRoutes = require("./routes/main");
const apiRoutes = require("./routes/api");

// MODULES
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const jsonwebtoken = require("jsonwebtoken");

// INITIALIZATIONS
const app = express();

// CONFIGS
const connectDB = require("./config/database");

// CONNECT TO DATABASE
connectDB();

// BODY PARSERS
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//MIDDLEWARE
app.use(morgan("dev"));

// ROUTES
app.use("/api", apiRoutes);
app.use("/", mainRoutes);

// SERVER LAUNCH

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
