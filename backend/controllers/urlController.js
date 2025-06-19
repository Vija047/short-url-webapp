const Url = require("../models/Url");
const validator = require("validator");
const generateCode = require("../utils/generateCode"); // ✅ Fixed import

require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

// POST /shorten
exports.createShortUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!validator.isURL(longUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const code = generateCode();
  const shortUrl = `${BASE_URL}/${code}`;

  try {
    const newUrl = new Url({ code, longUrl });
    await newUrl.save();
    res.json({ shortUrl });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
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
