// models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seats: [String]
});

module.exports = mongoose.model('Reservation', reservationSchema);
