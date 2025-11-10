const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const Team = require('../models/Team');

router.post('/', async (req, res) => {
    try {
        const item = new Organization(req.body);
        await item.save();
        res.json(item);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'Organization name must be unique.' });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total_results = await Organization.countDocuments();
    const total_pages = Math.ceil(total_results / limit);

    const results = await Organization.find().populate([]).skip(skip).limit(limit);

    res.json({ page, results, total_pages, total_results });
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Organization.findById(req.params.id).populate([]);
        if (!item) return res.status(404).json({ message: 'Organization not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const updatedItem = await Organization.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate([]);
        if (!updatedItem) return res.status(404).json({ message: 'Organization not found' });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Organization.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Organization not found' });
        res.json({ message: 'Organization deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id/teams', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }

        const teams = await Team.find({ organization: req.params.id }).populate([
            'genres',
            'personnel',
        ]);

        res.json({
            organization,
            teams,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
