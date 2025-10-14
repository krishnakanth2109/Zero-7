// File: backend/routes/blog.js

import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// GET all blog posts
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        console.error("ERROR FETCHING BLOGS:", err);
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
});

// POST a new blog post
router.post('/', async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;

        // Basic validation
        if (!title || !description || !imageUrl) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newBlog = new Blog({
            title,
            description,
            imageUrl
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        console.error("ERROR ADDING NEW BLOG:", err);
        res.status(400).json({ message: 'Failed to create blog post' });
    }
});

// GET a single blog post by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) {
        console.error("ERROR FETCHING SINGLE BLOG:", err);
        res.status(500).json({ message: 'Failed to fetch blog post' });
    }
});

// UPDATE a blog post
router.put('/:id', async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        const updatedData = { title, description, imageUrl };

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json(updatedBlog);
    } catch (err) {
        console.error("ERROR UPDATING BLOG:", err);
        res.status(400).json({ message: 'Failed to update blog post' });
    }
});

// DELETE a blog post
router.delete('/:id', async (req, res) => {
    try {
        const removedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!removedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.error("ERROR DELETING BLOG:", err);
        res.status(500).json({ message: 'Failed to delete blog' });
    }
});

export default router;