const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    video: { type: Boolean, required: true },
    media_type: { type: String, required: true },
    original_language: { type: String, required: true },
    original_title: { type: String, required: true },
    overview: { type: String, required: false },
    popularity: { type: Number, required: true },
    poster_path: { type: String, required: false },
    backdrop_path: { type: String, required: false },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
    date_played: { type: String, required: false },
    home_score: { type: Number, required: false },
    away_score: { type: Number, required: false },
    played: { type: Boolean, required: true },
    home_team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    away_team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    personnel: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personnel' }],
});

module.exports = mongoose.model('Game', GameSchema);
