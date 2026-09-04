const express = require("express");
const {
  getDonations,
  getDonationStats,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  updateDonationStatus,
} = require("../controllers/donationController");

const router = express.Router();

router.get("/stats/summary", getDonationStats);
router.route("/").get(getDonations).post(createDonation);
router.route("/:id").get(getDonationById).put(updateDonation).delete(deleteDonation);
router.patch("/:id/status", updateDonationStatus);

module.exports = router;
