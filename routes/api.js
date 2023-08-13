const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api");
const { ensureAuth } = require("../middleware/auth");

// Main app page
router.get("/address", ensureAuth, apiController.addressData);
router.get("/tenant", ensureAuth, apiController.tenantData);

// CREATE ADDRESS AND TENANT ROUTES
router.post("/createTenant", ensureAuth, apiController.createTenant);
router.post("/createAddress", ensureAuth, apiController.createAddress);

router.put("edit/tenant/:id", ensureAuth, apiController.editTenant);
router.put("edit/address/:id", ensureAuth, apiController.editAddress);

module.exports = router;
