export const CATEGORIES = ["Bakery", "Prepared Meals", "Fruits & Vegetables", "Groceries", "Beverages", "Other"];
export const QUANTITY_UNITS = ["Items", "Packs", "Meals", "Kg", "Boxes", "Bags", "Bottles"];
export const LOCATIONS = ["Colombo", "Nugegoda", "Kandy", "Galle", "Negombo", "Maharagama", "Dehiwala"];

export const formatDate = (dateValue) =>
  new Intl.DateTimeFormat("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));

export const toDateTimeLocal = (dateValue) => {
  const date = new Date(dateValue);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const getMinimumDateTimeLocal = (dateValue = new Date()) => {
  const minimum = new Date(dateValue);
  minimum.setSeconds(0, 0);
  minimum.setMinutes(minimum.getMinutes() + 1);
  return toDateTimeLocal(minimum);
};

export const isExpired = (donation) => donation.status === "AVAILABLE" && new Date(donation.availableUntil) <= new Date();

export const getCategoryIcon = (category) =>
  ({
    Bakery: "🥖",
    "Prepared Meals": "🍛",
    "Fruits & Vegetables": "🥬",
    Groceries: "🛍️",
    Beverages: "🧃",
    Other: "🍽️",
  })[category] || "🍽️";

export const initialFormValues = {
  providerName: "",
  foodName: "",
  category: "",
  quantity: "",
  quantityUnit: "",
  location: "",
  contactNumber: "",
  availableUntil: "",
  description: "",
};

export const validateDonationForm = (values) => {
  const errors = {};
  if (!values.providerName.trim()) errors.providerName = "Please enter the food provider name.";
  if (!values.foodName.trim()) errors.foodName = "Please enter the food name.";
  if (!values.category) errors.category = "Please select a food category.";
  if (!values.quantity || Number(values.quantity) < 1) errors.quantity = "Quantity must be at least 1.";
  if (!values.quantityUnit) errors.quantityUnit = "Please select a quantity unit.";
  if (!values.location.trim()) errors.location = "Please enter a pickup location.";
  if (!/^(?:\+94|0)7\d{8}$/.test(values.contactNumber.replace(/[\s-]/g, ""))) {
    errors.contactNumber = "Please enter a valid Sri Lankan contact number.";
  }
  if (!values.availableUntil) errors.availableUntil = "Please select when the food will be available until.";
  else if (new Date(values.availableUntil) <= new Date()) errors.availableUntil = "Available-until time must be in the future.";
  if (!values.description.trim()) errors.description = "Please enter a description.";
  else if (values.description.trim().length > 300) errors.description = "Description cannot exceed 300 characters.";
  return errors;
};
