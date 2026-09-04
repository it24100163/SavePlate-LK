require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/db");
const donationRoutes = require("./routes/donationRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
const port = process.env.PORT || 5001;
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(Object.assign(new Error("Origin is not allowed by CORS."), { status: 403 }));
    },
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "SavePlate LK API is running." });
});
app.use("/api/donations", donationRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: "API route not found." }));
app.use(errorMiddleware);

connectDatabase()
  .then(() => {
    app.listen(port, () => console.log(`SavePlate LK API listening on port ${port}`));
  })
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  });

module.exports = app;
