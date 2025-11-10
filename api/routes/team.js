const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Personnel = require('../models/Personnel');

router.post('/', async (req, res) => {
    try {
        const item = new Team(req.body);
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

    const total_results = await Team.countDocuments();
    const total_pages = Math.ceil(total_results / limit);

    const results = await Team.find()
        .populate(['organization', 'genres', 'personnel'])
        .skip(skip)
        .limit(limit);

    for (const team of results) {
        team.personnel = await Personnel.find({ team: team._id });
    }
    res.json({ page, results, total_pages, total_results });
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Team.findById(req.params.id).populate([
            'organization',
            'genres',
            'personnel',
        ]);
        if (!item) return res.status(404).json({ message: 'Team not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedItem = await Team.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate(['organization', 'genres', 'personnel']);
        if (!updatedItem) return res.status(404).json({ message: 'Team not found' });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Team.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Team not found' });
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
