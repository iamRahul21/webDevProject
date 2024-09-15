// models/Movie.js
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    poster: { type: String },
    cover: { type: String },
    language: { type: String },
    genre: { type: String },
    director: { type: String, required: false }, // Make this optional
    trailer: { type: String, required: false },  // Make this optional
    duration: { type: Number, required: false }, // Make this optional
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Movie', movieSchema);
