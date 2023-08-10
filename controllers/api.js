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
    try {
      const newTenant = new Tenant({
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        birthDate: tenant.birthDate,
        email: tenant.email,
        notes: tenant.notes || "",
        addressId: tenant.currentAddress || null,
        recommended: tenant.recommended,
        owner: res.locals.user.id,
        phoneNumbers: tenant.phoneNumbers,
      });
      const saveToDb = await newTenant.save();
      if (saveToDb) {
        if (tenant.currentAddress !== "") {
          const relatedAddress = await Address.findById(saveToDb.addressId);
          relatedAddress.tenantList = [...relatedAddress.tenantList, saveToDb._id];
          relatedAddress.save();
        }

        res.status(200).json({ success: true, message: "You added a tenant." });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, error: `${err._message}.` });
    }
  },
  createAddress: async function (req, res, next) {
    console.log(req.body);
    const address = req.body.address;
    try {
      const newAddress = new Address({
        streetNumber: address.streetNumber,
        appNumber: address.appNumber,
        streetName: address.streetName,
        tenantList: address.tenantList,
        rentPrice: address.rentPrice,
        alerts: address.alerts,
        leased: address.leased,
        notes: address.notes || "",
        owner: res.locals.user.id,
      });
      const saveToDb = await newAddress.save();

      if (saveToDb) {
        if (address.tenantList.length > 0) {
          for (let i = 0; i < address.tenantList.length; i++) {
            console.log(address.tenantList[i]._id);
            const relatedTenant = await Tenant.findById(address.tenantList[i]._id);
            if (relatedTenant) {
              const oldAddressId = relatedTenant.addressId;
              relatedTenant.addressId = saveToDb._id;
              await relatedTenant.save();
              if (oldAddressId) {
                const oldAddress = await Address.findById(oldAddressId);
                oldAddress.tenantList = oldAddress.tenantList.filter((tenant) => tenant._id === saveToDb._id);
                await oldAddress.save();
              }
            }
          }
        }

        res.status(200).json({ success: true, message: "You added an address." });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, error: `${err._message}.` });
    }
  },
};
