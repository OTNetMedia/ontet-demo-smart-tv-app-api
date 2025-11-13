const express = require('express');
const router = express.Router();

const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const upload = multer({ storage: multer.memoryStorage() });
const { imageSizes } = require('../utils/images');

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const Game = require('../models/Game');

router.post('/', upload.fields([{ name: 'poster' }, { name: 'backdrop' }]), async (req, res) => {
    try {
        const data = Object.assign({}, req.body);

        if (req.files?.poster?.[0]) {
            const buffer = await sharp(req.files.poster[0].buffer)
                .resize(imageSizes.poster.width, imageSizes.poster.height, { fit: 'cover' })
                .jpeg({ quality: 90 })
                .toBuffer();

            const key = `games/posters/${uuidv4()}.jpg`;
            const uploaded = await s3
                .upload({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: 'image/jpeg',
                    ACL: 'public-read',
                })
                .promise();

            data.poster_path = uploaded.Location;
        }

        if (req.files?.backdrop?.[0]) {
            const buffer = await sharp(req.files.backdrop[0].buffer)
                .resize(imageSizes.backdrop.width, imageSizes.backdrop.height, { fit: 'cover' })
                .jpeg({ quality: 90 })
                .toBuffer();

            const key = `games/backdrops/${uuidv4()}.jpg`;
            const uploaded = await s3
                .upload({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    Body: buffer,
                    ContentType: 'image/jpeg',
                    ACL: 'public-read',
                })
                .promise();

            data.backdrop_path = uploaded.Location;
        }

        const item = new Game(data);
        await item.save();
        res.json(item);
    } catch (error) {
        console.error('[Game Upload Error]', error);
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total_results = await Game.countDocuments();
    const total_pages = Math.ceil(total_results / limit);

    const results = await Game.find()
        .populate(['home_team', 'away_team', 'genres', 'personnel'])
        .skip(skip)
        .limit(limit);

    res.json({ page, results, total_pages, total_results });
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Game.findById(req.params.id).populate([
            'home_team',
            'away_team',
            'genres',
            'personnel',
        ]);
        if (!item) return res.status(404).json({ message: 'Game not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/genre/:genreId', async (req, res) => {
    try {
        const genreId = req.params.genreId;

        const results = await Game.find({ genres: genreId }).populate([
            'home_team',
            'away_team',
            'genres',
            'personnel',
        ]);

        res.json({
            count: results.length,
            results,
        });
    } catch (error) {
        console.error('[Game Genre Filter Error]', error);
        res.status(500).json({ error: error.message });
    }
});

router.patch(
    '/:id',
    upload.fields([{ name: 'poster' }, { name: 'backdrop' }]),
    async (req, res) => {
        try {
            const data = Object.assign({}, req.body);

            if (req.files?.poster?.[0]) {
                const buffer = await sharp(req.files.poster[0].buffer)
                    .resize(imageSizes.poster.width, imageSizes.poster.height, { fit: 'cover' })
                    .jpeg({ quality: 90 })
                    .toBuffer();

                const key = `games/posters/${uuidv4()}.jpg`;
                const uploaded = await s3
                    .upload({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: key,
                        Body: buffer,
                        ContentType: 'image/jpeg',
                        ACL: 'public-read',
                    })
                    .promise();

                data.poster_path = uploaded.Location;
            }

            if (req.files?.backdrop?.[0]) {
                const buffer = await sharp(req.files.backdrop[0].buffer)
                    .resize(imageSizes.backdrop.width, imageSizes.backdrop.height, { fit: 'cover' })
                    .jpeg({ quality: 90 })
                    .toBuffer();

                const key = `games/backdrops/${uuidv4()}.jpg`;
                const uploaded = await s3
                    .upload({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: key,
                        Body: buffer,
                        ContentType: 'image/jpeg',
                        ACL: 'public-read',
                    })
                    .promise();

                data.backdrop_path = uploaded.Location;
            }

            const updatedItem = await Game.findByIdAndUpdate(
                req.params.id,
                { $set: data },
                { new: true }
            ).populate(['home_team', 'away_team', 'genres', 'personnel']);

            if (!updatedItem) return res.status(404).json({ message: 'Game not found' });

            res.json(updatedItem);
        } catch (error) {
            console.error('[Game Update Error]', error);
            res.status(400).json({ error: error.message });
        }
    }
);

router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Game.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Game not found' });
        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
