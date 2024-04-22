const Website = require('../models/Website');
const WebsitePage = require('../models/WebsitePage');
const asyncHandler = require('express-async-handler');

exports.website_list = asyncHandler(async (req, res) => {
    try {
        const websites = await Website.find().populate('webpages');
        res.json(websites);
    } catch (err) {
        console.error("Error fetching website list:", err);
        res.status(500).json({ message: "Error fetching website list" });
    }
});

exports.website_detail = asyncHandler(async (req, res) => {
    const websiteId = req.params.id;

    try {
        const website = await Website.findById(websiteId).populate('webpages');
        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }
        res.json(website);
    } catch (err) {
        console.error("Error fetching website details:", err);
        res.status(500).json({ message: "Error fetching website details" });
    }
});

exports.website_create_post = asyncHandler(async (req, res) => {
    const { url } = req.body;

    try {
        if (!url) {
            return res.status(400).json({ message: "URL is required" });
        }
        const website = new Website({ url });
        await website.save();
        res.status(201).json(website);
    } catch (err) {
        console.error("Error creating website:", err);
        res.status(500).json({ message: "Error creating website" });
    }
});

exports.website_update_pages = asyncHandler(async (req, res) => {
    const websiteId = req.params.id;
    const { url } = req.body;

    try {
        const website = await Website.findById(websiteId);
        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        const webpage = new WebsitePage({ url, website: websiteId });
        await webpage.save();

        website.webpages.push(webpage);
        await website.save();

        res.status(201).json(website);
    } catch (err) {
        console.error("Error updating website pages:", err);
        res.status(500).json({ message: "Error updating website pages" });
    }
});
