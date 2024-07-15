const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const cloudinary = require("../helper/cloudinaryconfig");
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        format: async (req, file) => 'png', // supports promises as well
        public_id: (req, file) => `image-${Date.now()}`,
    },
});

const upload = multer({ storage: storage });

// Get all services
router.get('/fetchallservice', fetchuser, async (req, res) => {
    try {
        const services = await Service.find({ user: req.user.id });
        res.json(services);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Add a new service
router.post('/addservice', fetchuser, upload.single('imageUrl'), [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title } = req.body;
        const imageUrl = req.file.path;  // Cloudinary already provides the URL

        if (!imageUrl) {
            return res.status(400).json({ errors: [{ msg: 'Image URL is required' }] });
        }

        const service = new Service({
            title,
            imageUrl,
            user: req.user.id
        });

        const savedService = await service.save();
        res.json(savedService);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Update a service
router.put('/updateservice/:id', fetchuser, upload.single('imageUrl'), async (req, res) => {
    const { title } = req.body;
    let imageUrl = null;

    try {
        // Cloudinary automatically uploads the file if provided
        if (req.file) {
            imageUrl = req.file.path;  // Cloudinary already provides the URL
        }

        const newService = {};
        if (title) newService.title = title;
        if (imageUrl) newService.imageUrl = imageUrl;

        // Find the service by ID
        let service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).send("Not Found");
        }

        // Check if the user is authorized to update the service
        if (service.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Update the service
        service = await Service.findByIdAndUpdate(req.params.id, { $set: newService }, { new: true });
        res.json(service);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Delete a service
router.delete('/deleteservice/:id', fetchuser, async (req, res) => {
    try {
        let service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).send("Not Found");
        }

        if (service.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        service = await Service.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Service has been deleted", service: service });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
