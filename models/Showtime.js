// models/Showtime.js
const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    time: Date
});

module.exports = mongoose.model('Showtime', showtimeSchema);
