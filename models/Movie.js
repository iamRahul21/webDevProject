// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    cover: { type: String, required: true },
    language: { type: String, required: true },
    genre: { type: String, required: true },
    director: { type: String, required: true },
    trailer: { type: String, required: true },
    duration: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Movie', movieSchema);
