const mongoose = require("mongoose");

const CATEGORIES = [
  "Bakery",
  "Prepared Meals",
  "Fruits & Vegetables",
  "Groceries",
  "Beverages",
  "Other",
];

const QUANTITY_UNITS = ["Items", "Packs", "Meals", "Kg", "Boxes", "Bags", "Bottles"];
const STATUSES = ["AVAILABLE", "RESERVED", "COLLECTED"];

const donationSchema = new mongoose.Schema(
  {
    providerName: { type: String, required: true, trim: true },
    foodName: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES },
    quantity: { type: Number, required: true, min: 1 },
    quantityUnit: { type: String, required: true, enum: QUANTITY_UNITS },
    location: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    availableUntil: { type: Date, required: true },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    status: { type: String, enum: STATUSES, default: "AVAILABLE" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.QUANTITY_UNITS = QUANTITY_UNITS;
