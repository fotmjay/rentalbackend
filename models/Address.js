// Importing modules
const mongoose = require("mongoose");
const Tenant = require("./Tenant");

const AddressSchema = mongoose.Schema({
  streetNumber: {
    type: Number,
    required: true,
  },
  appNumber: {
    type: Number,
    default: null,
  },
  streetName: {
    type: String,
    required: true,
  },
  tenantList: {
    type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Tenant" }],
    required: true,
    default: [],
  },
  rentPrice: {
    type: Number,
    required: true,
  },
  alerts: {
    type: [],
    required: true,
    default: [],
  },
  notes: {
    type: String,
    default: "",
  },
  leased: {
    type: Boolean,
    required: true,
    default: false,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Address", AddressSchema);
