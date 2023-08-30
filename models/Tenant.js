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
    type: Date,
    default: undefined,
  },
  email: {
    type: String,
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
