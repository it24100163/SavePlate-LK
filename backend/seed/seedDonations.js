require("dotenv").config();
const connectDatabase = require("../config/db");
const Donation = require("../models/Donation");

const futureDate = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000);

const donations = [
  { providerName: "Perera Bakery", foodName: "Bread Loaves", category: "Bakery", quantity: 18, quantityUnit: "Items", location: "Nugegoda", contactNumber: "0710000001", availableUntil: futureDate(10), description: "Freshly baked loaves remaining after the day’s service.", status: "AVAILABLE" },
  { providerName: "Green Leaf Restaurant", foodName: "Vegetable Rice Packs", category: "Prepared Meals", quantity: 15, quantityUnit: "Meals", location: "Colombo", contactNumber: "0710000002", availableUntil: futureDate(6), description: "Packed vegetable rice portions ready for an arranged pickup.", status: "AVAILABLE" },
  { providerName: "Colombo Community Cafe", foodName: "Fresh Bananas", category: "Fruits & Vegetables", quantity: 8, quantityUnit: "Kg", location: "Dehiwala", contactNumber: "0710000003", availableUntil: futureDate(18), description: "Ripe bananas suitable for prompt collection and use.", status: "RESERVED" },
  { providerName: "Galle Bake House", foodName: "Pastry Boxes", category: "Bakery", quantity: 6, quantityUnit: "Boxes", location: "Galle", contactNumber: "0710000004", availableUntil: futureDate(8), description: "Assorted savoury pastries packed into convenient boxes.", status: "AVAILABLE" },
  { providerName: "Sunrise Foods", foodName: "Rice and Curry Meals", category: "Prepared Meals", quantity: 22, quantityUnit: "Meals", location: "Maharagama", contactNumber: "0710000005", availableUntil: futureDate(4), description: "Vegetarian rice and curry meals prepared today.", status: "RESERVED" },
  { providerName: "Fresh Basket Cafe", foodName: "Fruit Packs", category: "Fruits & Vegetables", quantity: 12, quantityUnit: "Packs", location: "Kandy", contactNumber: "0710000006", availableUntil: futureDate(15), description: "Mixed seasonal fruit portions in sealed takeaway packs.", status: "AVAILABLE" },
  { providerName: "Harbour Food Shop", foodName: "Vegetable Boxes", category: "Groceries", quantity: 9, quantityUnit: "Boxes", location: "Negombo", contactNumber: "0710000007", availableUntil: futureDate(12), description: "Assorted vegetables grouped into family-size boxes.", status: "COLLECTED" },
  { providerName: "Lotus Event Kitchen", foodName: "Bottled Juice", category: "Beverages", quantity: 24, quantityUnit: "Bottles", location: "Colombo", contactNumber: "0710000008", availableUntil: futureDate(20), description: "Unopened fruit juice bottles remaining from a fictional event.", status: "COLLECTED" },
];

const seed = async () => {
  try {
    await connectDatabase();
    await Donation.deleteMany({});
    await Donation.insertMany(donations);
    console.log(`Seeded ${donations.length} fictional donations.`);
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
