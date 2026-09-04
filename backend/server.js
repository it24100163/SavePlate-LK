require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/db");
const donationRoutes = require("./routes/donationRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
<<<<<<< HEAD
const port = process.env.PORT || 5002;
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean);
=======
const port = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:4173",
].filter(Boolean);
>>>>>>> ba31daf9cc7b3f1d98f3164ed23b0af81e54ce47

app.use(
  cors({
    origin(origin, callback) {
<<<<<<< HEAD
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
=======
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      const isLocalDevOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalDevOrigin) return callback(null, true);
>>>>>>> ba31daf9cc7b3f1d98f3164ed23b0af81e54ce47
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
