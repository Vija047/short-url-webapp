const express = require("express");
const dotenv = require("dotenv");
const urlRoutes = require("./routes/urlRoutes");
const connectDB = require("./db");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "https://short-url-webapp-pjsh.vercel.app",
      "https://short-url-webapp-blond.vercel.app",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

app.use(
  cors({
    origin: "*", // Allow all origins temporarily to debug
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  })
);

connectDB();

app.use("/", urlRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the URL Shortener API");
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Server error", message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
