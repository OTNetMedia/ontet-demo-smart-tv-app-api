const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const Personnel = require('../models/Personnel');

const { imageSizes } = require('../utils/images');

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });

const mongoose = require('mongoose');
const Team = require('../models/Team');

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const data = Object.assign({}, req.body);

        if (!mongoose.Types.ObjectId.isValid(data.team)) {
            return res.status(400).json({ error: 'Invalid team ID' });
        }

        const teamExists = await Team.findById(data.team);
        if (!teamExists) {
            return res.status(400).json({ error: 'Team not found' });
        }

        if (req.file) {
            const processedImage = await sharp(req.file.buffer)
                .resize(imageSizes.poster.width, imageSizes.poster.height, {
                    fit: 'cover',
                    position: 'center',
                })
                .jpeg({ quality: 90 })
                .toBuffer();

            const key = `personnel/${uuidv4()}.jpg`;

            const uploadResult = await s3
                .upload({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    Body: processedImage,
                    ContentType: 'image/jpeg',
                    ACL: 'public-read',
                })
                .promise();

            data.image = uploadResult.Location;
        }

        const item = new Personnel(data);
        await item.validate();
        await item.save();

        console.log('[Debug] New item saved with ID:', item._id);

        res.json(item);
    } catch (error) {
        console.error('[Image Upload Error]', error);
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total_results = await Personnel.countDocuments();
    const total_pages = Math.ceil(total_results / limit);

    const results = await Personnel.find().populate(['team']).skip(skip).limit(limit);

    res.json({ page, results, total_pages, total_results });
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Personnel.findById(req.params.id).populate(['team']);
        if (!item) return res.status(404).json({ message: 'Personnel not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', upload.single('image'), async (req, res) => {
    try {
        const data = Object.assign({}, req.body);

        if (data.team && !mongoose.Types.ObjectId.isValid(data.team)) {
            return res.status(400).json({ error: 'Invalid team ID' });
        }

        if (req.file) {
            const processedImage = await sharp(req.file.buffer)
                .resize(imageSizes.poster.width, imageSizes.poster.height, {
                    fit: 'cover',
                    position: 'center',
                })
                .jpeg({ quality: 90 })
                .toBuffer();

            const key = `personnel/${uuidv4()}.jpg`;

            const uploadResult = await s3
                .upload({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    Body: processedImage,
                    ContentType: 'image/jpeg',
                    ACL: 'public-read',
                })
                .promise();

            data.image = uploadResult.Location;
        }

        const updatedItem = await Personnel.findByIdAndUpdate(
            req.params.id,
            { $set: data },
            { new: true }
        ).populate(['team']);

        if (!updatedItem) return res.status(404).json({ message: 'Personnel not found' });

        res.json(updatedItem);
    } catch (error) {
        console.error('[Update Error]', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Personnel.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Personnel not found' });
        res.json({ message: 'Personnel deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
