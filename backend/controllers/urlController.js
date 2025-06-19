const Url = require("../models/Url");
const validator = require("validator");
const generateCode = require("../utils/generateCode"); // ✅ Fixed import

require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

// POST /shorten
exports.createShortUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    console.log("Received URL:", longUrl);

    if (!longUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    if (!validator.isURL(longUrl)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const code = generateCode();
    const shortUrl = `${BASE_URL}/${code}`;
    console.log("Generated short URL:", shortUrl);

    const newUrl = new Url({ code, longUrl });
    await newUrl.save();
    return res.status(200).json({ shortUrl });
  } catch (err) {
    console.error("Error in createShortUrl:", err);
    return res
      .status(500)
      .json({ error: "Failed to create short URL", details: err.message });
  }
};

// GET /:code
exports.redirectToLongUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ code });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    url.visitCount += 1;
    await url.save();
    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /stats/:code
exports.getUrlStats = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ code });

    if (!url) {
      return res.status(404).json({ error: "Stats not found" });
    }

    res.json({
      longUrl: url.longUrl,
      createdAt: url.createdAt,
      visitCount: url.visitCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
