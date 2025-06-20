const express = require("express");
const dotenv = require("dotenv");
const urlRoutes = require("./routes/urlRoutes");
const connectDB = require("./db");
const cors = require("cors");

dotenv.config();

const app = express();

// Single CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

connectDB();

app.use("/", urlRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the URL Shortener API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
