// Importing modules
const mongoose = require("mongoose");
const Address = require("./Address");

const TenantSchema = mongoose.Schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: [Date],
    required: true,
    default: undefined,
  },
  email: {
    type: String,
    required: true,
    default: "",
  },
  phoneNumbers: {
    type: [],
    default: [],
  },
  addressId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Address",
  },
  notes: {
    type: String,
    required: true,
    default: "",
  },
  recommended: {
    type: Boolean,
    required: true,
    default: true,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Tenant", TenantSchema);
