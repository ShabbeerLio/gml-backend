const express = require('express');
const router = express.Router();
const Blog = require('../models/Blogs');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


// Route 1: Get all blogs for a user
router.get('/fetchallblog', fetchuser, async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id });
        res.json(blogs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 2: post blogs 
router.post('/addblog', upload.single('image'), async (req, res) => {
    try {
        const { category, subcategories } = req.body;
        const newSubcategories = JSON.parse(subcategories).map(sub => ({
            ...sub,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
        }));

        const newBlog = new Blog({ category, subcategories: newSubcategories });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/updateblog/:id', upload.single('image'), async (req, res) => {
    try {
        const { category, subcategories } = req.body;
        const updatedSubcategories = JSON.parse(subcategories).map(sub => ({
            ...sub,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : sub.imageUrl,
        }));

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { category, subcategories: updatedSubcategories },
            { new: true }
        );
        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route 4: Delete a blog
router.delete('/deleteblog/:id', fetchuser, async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Not Found");
        }
        if (blog.user.toString() !== req.user.id) {
            return res.status(403).send("Not Allowed");
        }

        blog = await Blog.findByIdAndDelete(req.params.id);
        res.json({ Success: "Blog has been deleted", blog });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 5: Add subcategory to a blog
router.post('/:blogId/subcategories', upload.single('image'), async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const { name, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!imageUrl) {
            return res.status(400).json({ errors: [{ msg: 'Image URL is required' }] });
        }

        blog.subcategories.push({ name, description, imageUrl });
        await blog.save();

        res.status(201).json({ message: "Subcategory added successfully" });
    } catch (error) {
        console.error("Error adding subcategory:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route 6: Update subcategory in a blog
router.put('/:blogId/subcategories/:subcategoryId', upload.single('image'), async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const { name, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const subcategory = blog.subcategories.find(sub => sub._id.toString() === req.params.subcategoryId);
        if (subcategory) {
            subcategory.name = name || subcategory.name;
            subcategory.description = description || subcategory.description;
            subcategory.imageUrl = imageUrl || subcategory.imageUrl;
            await blog.save();
            res.json({ message: "Subcategory updated successfully" });
        } else {
            res.status(404).json({ error: "Subcategory not found" });
        }
    } catch (error) {
        console.error("Error updating subcategory:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route 7: Delete subcategory in a blog
router.delete('/:blogId/subcategories/:subcategoryId', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const subcategoryIndex = blog.subcategories.findIndex(sub => sub._id.toString() === req.params.subcategoryId);
        if (subcategoryIndex !== -1) {
            blog.subcategories.splice(subcategoryIndex, 1);
            await blog.save();
            res.json({ Success: "Subcategory deleted successfully" });
        } else {
            res.status(404).json({ error: "Subcategory not found" });
        }
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
