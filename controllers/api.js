const User = require("../models/User");
const Address = require("../models/Address");
const Tenant = require("../models/Tenant");
const mongoose = require("mongoose");

module.exports = {
  addressData: async (req, res) => {
    const user = res.locals.user;
    const refreshToken = res.locals.refreshToken;
    const data = await Address.find({ owner: user.id }).populate("tenantList").sort({ streetName: "asc" }).lean();
    res
      .status(200)
      .json({ success: true, refreshToken: refreshToken, message: "Address data available sent.", data: data });
  },
  tenantData: async (req, res) => {
    const user = res.locals.user;
    const refreshToken = res.locals.refreshToken;
    const data = await Tenant.find({ owner: user.id }).sort({ firstName: "asc" }).lean();
    res
      .status(200)
      .json({ success: true, refreshToken: refreshToken, message: "Tenant data available sent.", data: data });
  },
  createTenant: async function (req, res, next) {
    const tenant = req.body.data;
    const refreshToken = res.locals.refreshToken;
    try {
      const newTenant = new Tenant({
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        birthDate: tenant.birthDate,
        email: tenant.email,
        notes: tenant.notes || "",
        addressId: tenant.addressId || null,
        recommended: tenant.recommended,
        owner: res.locals.user.id,
        phoneNumbers: tenant.phoneNumbers,
      });
      const saveToDb = await newTenant.save();
      if (saveToDb) {
        if (tenant.addressId !== "") {
          const relatedAddress = await Address.findById(saveToDb.addressId);
          relatedAddress.tenantList = [...relatedAddress.tenantList, saveToDb._id];
          relatedAddress.save();
        }

        res.status(200).json({ success: true, refreshToken: refreshToken, message: "You added a tenant." });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, error: `${err._message}.` });
    }
  },
  createAddress: async function (req, res, next) {
    const refreshToken = res.locals.refreshToken;
    const address = req.body.data;
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
            const relatedTenant = await Tenant.findById(address.tenantList[i]._id);
            if (relatedTenant) {
              const oldAddressId = relatedTenant.addressId;
              relatedTenant.addressId = saveToDb._id;
              await relatedTenant.save();
              if (oldAddressId) {
                const oldAddress = await Address.findById(oldAddressId);
                oldAddress.tenantList = oldAddress.tenantList.filter(
                  (tenant) => !tenant.toString().includes(saveToDb._id)
                );
                await oldAddress.save();
              }
            }
          }
        }

        res.status(200).json({ success: true, refreshToken: refreshToken, message: "You added an address." });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, error: `${err._message}.` });
    }
  },
  editTenant: async function (req, res, next) {
    const tenant = req.body.data;
    console.log(tenant);
    const refreshToken = res.locals.refreshToken;
    try {
      const updatedTenant = {
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        birthDate: tenant.birthDate,
        email: tenant.email,
        notes: tenant.notes || "",
        addressId: tenant.addressId || null,
        recommended: tenant.recommended,
        owner: res.locals.user.id,
        phoneNumbers: tenant.phoneNumbers,
      };
      const update = await Tenant.findOneAndUpdate({ _id: req.params.id }, updatedTenant);
      if (update) {
        if (update.addressId) {
          // Remove the tenant from the old address tenant list if old address wasn't null.
          // Turn the tenant in the list (array of ObjectIds) to a string and filter it with the ID.
          const oldAddress = await Address.findById(update.addressId);
          oldAddress.tenantList = oldAddress.tenantList.filter((tenant) => !tenant.toString().includes(update._id));
          oldAddress.save();
        }
        if (tenant.addressId) {
          // Add the tenant to the new address tenant list if it's new address is not null.
          const newAddress = await Address.findById(tenant.addressId);
          newAddress.tenantList.push(update._id);
          newAddress.save();
        }
      }
      res.status(200).json({ success: true, refreshToken: refreshToken, message: "You updated a tenant." });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, error: `${err._message}.` });
    }
  },
  editAddress: async function (req, res, next) {
    console.log(req.params.id);
    const refreshToken = res.locals.refreshToken;
    res.status(200).json({ success: true, refreshToken: refreshToken, message: "You updated an address." });
  },
};
