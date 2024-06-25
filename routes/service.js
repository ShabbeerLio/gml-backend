const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appends the original file extension
    }
});

const upload = multer({ storage: storage });

// Route 1: Get all services using GET: "/api/service/fetchallservice" - Login required
router.get('/fetchallservice', fetchuser, async (req, res) => {
    try {
        const services = await Service.find({ user: req.user.id });
        res.json(services);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 2: Add new service using POST: "/api/service/addservice" - Login required
router.post('/addservice', fetchuser, upload.single('image'), [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { title } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const service = new Service({
            title, 
            user: req.user.id,
            image: req.file ? req.file.path : null
        });

        const savedService = await service.save();
        res.json(savedService);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 3: Update service using PUT: "/api/service/updateservice/:id" - Login required
router.put('/updateservice/:id', fetchuser, upload.single('image'), async (req, res) => {
    const { title } = req.body;
    try {
        // Create a new service object
        const newService = {};
        if (title) { newService.title = title; }
        if (req.file) { newService.image = req.file.path; }

        // Find the service to be updated and update it
        let service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).send("Not Found");
        }

        if (service.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        service = await Service.findByIdAndUpdate(req.params.id, { $set: newService }, { new: true });
        res.json({ service });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 4: Delete service using DELETE: "/api/service/deleteservice/:id" - Login required
router.delete('/deleteservice/:id', fetchuser, async (req, res) => {
    try {
        // Find the service to be deleted and delete it
        let service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).send("Not Found");
        }

        // Allow deletion only if user owns this service
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
