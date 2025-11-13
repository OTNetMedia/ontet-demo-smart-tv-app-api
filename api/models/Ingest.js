const mongoose = require('mongoose');

const IngestSchema = new mongoose.Schema({
    spec: String,
    id: String,
    ref: String,
    human_ref: String,
    location: String,
    protocol: String,
    drm: mongoose.Schema.Types.Mixed,

    entrypoint: { type: String, required: true },

    duration: Number,

    resources: {
        poster: String,
        bif: String,
        waveform: String,
        metadata: String,
    },

    metadata: {
        asset_ref: String,
        title: String,
        description: String,
        tempo: Number,
        duration: Number,
        sections: Array,
        customMetadata: Array,
        metadata: mongoose.Schema.Types.Mixed, // nested huge object (audio, tags, etc)
    },

    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Ingest', IngestSchema);
