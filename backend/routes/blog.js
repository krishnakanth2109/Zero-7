// File: backend/routes/blog.js

import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import Blog from '../models/Blog.js';

const router = express.Router();
const upload = multer({ storage });

// GET all blog posts
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        // --- ADD THIS LINE ---
        console.error("ERROR FETCHING BLOGS:", err);
        res.status(500).json({ message: err.message });
    }
});

// POST a new blog post
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            // This checks if the upload failed silently
            throw new Error("File upload failed. req.file is undefined.");
        }
        const { title, description } = req.body;
        const imageUrl = req.file.path;

        const newBlog = new Blog({
            title,
            description,
            imageUrl
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        // --- THIS IS THE MOST IMPORTANT CHANGE ---
        console.error("ERROR ADDING NEW BLOG:", err);
        res.status(400).json({ message: err.message });
    }
});

// GET a single blog post by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) {
        // --- ADD THIS LINE ---
        console.error("ERROR FETCHING SINGLE BLOG:", err);
        res.status(500).json({ message: err.message });
    }
});

// UPDATE a blog post
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedData = { title, description };

        if (req.file) {
            updatedData.imageUrl = req.file.path;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json(updatedBlog);
    } catch (err) {
        // --- ADD THIS LINE ---
        console.error("ERROR UPDATING BLOG:", err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE a blog post
router.delete('/:id', async (req, res) => {
    try {
        const removedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!removedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        // --- ADD THIS LINE ---
        console.error("ERROR DELETING BLOG:", err);
        res.status(500).json({ message: err.message });
    }
});

export default router;