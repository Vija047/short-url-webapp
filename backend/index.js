const express = require('express');
const dotenv = require('dotenv');
const urlRoutes = require('./routes/urlRoutes');
const connectDB = require('./db'); 
const cors = require('cors');
dotenv.config();

const app = express();

// Enable CORS for your frontend BEFORE routes
app.use(cors({
  origin: "https://short-url-webapp-pjsh.vercel.app/", // Your frontend URL
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

connectDB();

app.use('/', urlRoutes);
app.get("/",(req,res)=>{
  res.send("Welcome to the URL Shortener API");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
