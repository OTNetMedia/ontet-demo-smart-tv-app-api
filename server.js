require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

fs.readdirSync('./api/routes').forEach((file) => {
    const route = require(`./api/routes/${file}`);
    const routeName = file.replace('.js', '');
    app.use(`/api/${routeName}`, route);
});

const DEFAULT_PORT = 5001;
const server = app.listen(DEFAULT_PORT, () => {
    console.log(`🚀 Server running on http://localhost:${DEFAULT_PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
