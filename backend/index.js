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
      "https://short-url-webapp-bj5nd.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

connectDB();

app.use("/", urlRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the URL Shortener API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
