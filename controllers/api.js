const User = require("../models/User");
const Address = require("../models/Address");
const Tenant = require("../models/Tenant");

module.exports = {
  addressData: async (req, res) => {
    const user = res.locals.user;
    const data = await Address.find({ owner: user.id }).populate("tenantList").sort({ streetName: "asc" }).lean();
    res.status(200).json({ success: true, message: "Address data available sent.", data: data });
  },
  tenantData: async (req, res) => {
    const user = res.locals.user;
    const data = await Tenant.find({ owner: user.id }).sort({ firstName: "asc" }).lean();
    res.status(200).json({ success: true, message: "Tenant data available sent.", data: data });
  },
  createTenant: async function (req, res, next) {
    const tenant = req.body.tenant;
    console.log(tenant);
    console.log(tenant.phoneNumbers);
    try {
      const newTenant = new Tenant({
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        birthDate: tenant.birthDate,
        email: tenant.email,
        notes: tenant.notes,
        recommended: tenant.recommended,
        owner: res.locals.user.id,
        phoneNumbers: tenant.phoneNumbers,
      });
      if (tenant.currentAddress !== "") {
        newTenant.addressId = tenant.currentAddress;
      }
      const saveToDb = await newTenant.save();
      console.log(saveToDb);
      if (saveToDb) {
        const relatedAddress = await Address.findById(saveToDb.addressId);
        console.log(relatedAddress);
        relatedAddress.tenantList = [...relatedAddress.tenantList, saveToDb._id];
        relatedAddress.save();
        res.status(200).json({ success: true, message: "You added a tenant." });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, error: `${err._message}.` });
    }
  },
  createAddress: async function (req, res, next) {
    const newAddress = new Address({
      streetNumber: 22,
      appNumber: 3,
      streetName: "des ormes",
      tenantList: [],
      rentPrice: 775,
      alerts: [],
      leased: true,
      notes: "neighbors are whiny",
      owner: res.locals.user.id,
    });
    Address.create(newAddress);
    res.status(200).json({ success: true, message: "You added an address." });
  },
};
