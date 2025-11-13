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

const port = process.env.PORT || 5000;

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
