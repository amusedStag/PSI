const Website = require('../models/Website');
const WebsitePage = require('../models/WebsitePage');
const asyncHandler = require('express-async-handler');
const { websiteStatus } = require("../utils/evalUtils");


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
        website.monitorState = websiteStatus(website);
        await website.save();

        res.status(201).json(website);
    } catch (err) {
        console.error("Error updating website pages:", err);
        res.status(500).json({ message: "Error updating website pages" });
    }
});

exports.website_delete_post = asyncHandler(async (req, res) => {
    const websiteId = req.params.id;

    try {
        const website = await Website.findById(websiteId);
        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        await WebsitePage.deleteMany({ website: websiteId });
        await Website.findByIdAndDelete(websiteId);

        res.json({ message: 'Website deleted successfully' });
    } catch (err) {
        console.error("Error deleting website:", err);
        res.status(500).json({ message: "Error deleting website" });
    }
});

exports.website_delete_page = asyncHandler(async (req, res) => {
    const { websiteId, webpageId } = req.params;

    try {
        //meter populate algures?
        const website = await Website.findByIdAndUpdate(websiteId, {
            $pull: { webpages: webpageId }
        }, { new: true });

        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }

        const webpage = await WebsitePage.findByIdAndDelete(webpageId);
        if (!webpage) {
            return res.status(404).json({ message: "Webpage not found" });
        }

        const updatedWebsite = await Website.findById(websiteId).populate('webpages');
        updatedWebsite.monitorState = websiteStatus(updatedWebsite);
        await updatedWebsite.save();

        res.json({ message: 'Webpage deleted successfully', webpage });
    } catch (err) {
        console.error("Error deleting webpage:", err);
        res.status(500).json({ message: "Error deleting webpage" });
    }
});

exports.webpage_detail = asyncHandler(async (req, res) => {
    const webpageId = req.params.id;

    try {
        const webpage = await WebsitePage.findById(webpageId);
        if (!webpage) {
            return res.status(404).json({ message: "Webpage not found" });
        }
        res.json(webpage);
    } catch (err) {
        console.error("Error fetching webpage details:", err);
        res.status(500).json({ message: "Error fetching webpage details" });
    }
});


