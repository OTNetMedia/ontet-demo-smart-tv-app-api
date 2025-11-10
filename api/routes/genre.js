const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');

router.post('/', async (req, res) => {
    try {
        const item = new Genre(req.body);
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total_results = await Genre.countDocuments();
    const total_pages = Math.ceil(total_results / limit);

    const results = await Genre.find().populate([]).skip(skip).limit(limit);

    res.json({ page, results, total_pages, total_results });
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Genre.findById(req.params.id).populate([]);
        if (!item) return res.status(404).json({ message: 'Genre not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedItem = await Genre.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate([]);
        if (!updatedItem) return res.status(404).json({ message: 'Genre not found' });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Genre.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Genre not found' });
        res.json({ message: 'Genre deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
