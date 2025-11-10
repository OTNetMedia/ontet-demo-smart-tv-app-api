const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    personnel: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personnel' }],
});

module.exports = mongoose.model('Team', TeamSchema);
