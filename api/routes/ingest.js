const express = require('express');
const router = express.Router();
const Ingest = require('../models/Ingest');

// CREATE
router.post('/', async (req, res) => {
    try {
        const item = new Ingest(req.body);
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// LIST with pagination + search
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search?.trim() || '';

        const skip = (page - 1) * limit;

        // Build search filter
        const filter = {};

        if (search) {
            filter.$or = [
                { human_ref: { $regex: search, $options: 'i' } },
                { ref: { $regex: search, $options: 'i' } },
                { id: { $regex: search, $options: 'i' } },
                { 'metadata.metadata.tags.title': { $regex: search, $options: 'i' } },
                { 'metadata.metadata.tags.artist': { $regex: search, $options: 'i' } },
            ];
        }

        const total_results = await Ingest.countDocuments(filter);
        const total_pages = Math.ceil(total_results / limit);

        const results = await Ingest.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit);

        res.json({
            page,
            total_pages,
            total_results,
            results,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET SINGLE
router.get('/:id', async (req, res) => {
    try {
        const item = await Ingest.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE
router.patch('/:id', async (req, res) => {
    try {
        const updated = await Ingest.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Ingest.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
