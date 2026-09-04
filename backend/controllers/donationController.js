const mongoose = require("mongoose");
const Donation = require("../models/Donation");

const PHONE_PATTERN = /^(?:\+94|0)7\d{8}$/;
const CATEGORIES = ["Bakery", "Prepared Meals", "Fruits & Vegetables", "Groceries", "Beverages", "Other"];
const QUANTITY_UNITS = ["Items", "Packs", "Meals", "Kg", "Boxes", "Bags", "Bottles"];
const EDITABLE_FIELDS = [
  "providerName",
  "foodName",
  "category",
  "quantity",
  "quantityUnit",
  "location",
  "contactNumber",
  "availableUntil",
  "description",
];

const validateDonation = (values, requireAll = true) => {
  const required = [
    ["providerName", "Please enter the food provider name."],
    ["foodName", "Please enter the food name."],
    ["category", "Please select a food category."],
    ["quantityUnit", "Please select a quantity unit."],
    ["location", "Please enter a pickup location."],
    ["contactNumber", "Please enter a contact number."],
    ["availableUntil", "Please select when the food will be available until."],
    ["description", "Please enter a description."],
  ];

  for (const [field, message] of required) {
    if (requireAll && (values[field] === undefined || String(values[field]).trim() === "")) return message;
  }

  if (requireAll && (values.quantity === undefined || values.quantity === "")) return "Please enter a quantity.";
  if (values.category !== undefined && !CATEGORIES.includes(values.category)) return "Please select a valid food category.";
  if (values.quantityUnit !== undefined && !QUANTITY_UNITS.includes(values.quantityUnit)) return "Please select a valid quantity unit.";
  if (values.quantity !== undefined && (!Number.isFinite(Number(values.quantity)) || Number(values.quantity) < 1)) {
    return "Quantity must be at least 1.";
  }
  if (values.contactNumber !== undefined && !PHONE_PATTERN.test(String(values.contactNumber).replace(/[\s-]/g, ""))) {
    return "Please enter a valid Sri Lankan contact number.";
  }
  if (values.description !== undefined && String(values.description).trim().length > 300) {
    return "Description cannot exceed 300 characters.";
  }
  if (values.availableUntil !== undefined) {
    const pickupTime = new Date(values.availableUntil);
    if (Number.isNaN(pickupTime.getTime())) return "Please enter a valid available-until time.";
    if (pickupTime <= new Date()) return "Available-until time must be in the future.";
  }
  return null;
};

const getDonations = async (req, res) => {
  const donations = await Donation.find().sort({ createdAt: -1 });
  res.json({ success: true, data: donations });
};

const getDonationStats = async (req, res) => {
  const [summary] = await Donation.aggregate([
    {
      $group: {
        _id: null,
        totalDonations: { $sum: 1 },
        available: { $sum: { $cond: [{ $eq: ["$status", "AVAILABLE"] }, 1, 0] } },
        reserved: { $sum: { $cond: [{ $eq: ["$status", "RESERVED"] }, 1, 0] } },
        collected: { $sum: { $cond: [{ $eq: ["$status", "COLLECTED"] }, 1, 0] } },
        activeDonations: {
          $sum: { $cond: [{ $in: ["$status", ["AVAILABLE", "RESERVED"]] }, 1, 0] },
        },
        totalItemsRescued: {
          $sum: { $cond: [{ $eq: ["$status", "COLLECTED"] }, "$quantity", 0] },
        },
      },
    },
  ]);

  const fallback = {
    totalDonations: 0,
    available: 0,
    reserved: 0,
    collected: 0,
    activeDonations: 0,
    totalItemsRescued: 0,
  };

  res.json({
    success: true,
    data: summary ? { ...fallback, ...summary } : fallback,
  });
};

const getDonationById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Donation not found." });
  }
  const donation = await Donation.findById(req.params.id);
  if (!donation) return res.status(404).json({ success: false, message: "Donation not found." });
  res.json({ success: true, data: donation });
};

const createDonation = async (req, res) => {
  const validationMessage = validateDonation(req.body);
  if (validationMessage) return res.status(400).json({ success: false, message: validationMessage });

  const data = Object.fromEntries(EDITABLE_FIELDS.map((field) => [field, req.body[field]]));
  data.contactNumber = String(data.contactNumber).replace(/[\s-]/g, "");
  const donation = await Donation.create(data);
  res.status(201).json({ success: true, message: "Donation created successfully.", data: donation });
};

const updateDonation = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Donation not found." });
  }
  const donation = await Donation.findById(req.params.id);
  if (!donation) return res.status(404).json({ success: false, message: "Donation not found." });

  const nextValues = Object.fromEntries(EDITABLE_FIELDS.map((field) => [field, req.body[field] ?? donation[field]]));
  const validationMessage = validateDonation(nextValues);
  if (validationMessage) return res.status(400).json({ success: false, message: validationMessage });

  EDITABLE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) donation[field] = req.body[field];
  });
  donation.contactNumber = donation.contactNumber.replace(/[\s-]/g, "");
  await donation.save();
  res.json({ success: true, message: "Donation updated successfully.", data: donation });
};

const deleteDonation = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Donation not found." });
  }
  const donation = await Donation.findByIdAndDelete(req.params.id);
  if (!donation) return res.status(404).json({ success: false, message: "Donation not found." });
  res.json({ success: true, message: "Donation deleted successfully." });
};

const updateDonationStatus = async (req, res) => {
  const { status } = req.body;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Donation not found." });
  }
  const donation = await Donation.findById(req.params.id);
  if (!donation) return res.status(404).json({ success: false, message: "Donation not found." });

  const allowedNextStatus = { AVAILABLE: "RESERVED", RESERVED: "COLLECTED" }[donation.status];
  if (status !== allowedNextStatus) {
    return res.status(400).json({
      success: false,
      message: `Cannot change status from ${donation.status} to ${status || "an empty status"}.`,
    });
  }
  if (donation.status === "AVAILABLE" && donation.availableUntil <= new Date()) {
    return res.status(400).json({ success: false, message: "Pickup time has passed. This donation cannot be reserved." });
  }

  donation.status = status;
  await donation.save();
  const message = status === "RESERVED" ? "Donation reserved successfully." : "Donation marked as collected.";
  res.json({ success: true, message, data: donation });
};

module.exports = {
  getDonations,
  getDonationStats,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  updateDonationStatus,
};
