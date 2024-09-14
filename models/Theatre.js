// models/Theatre.js
const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    seats: { type: Number, required: true }
});

module.exports = mongoose.model('Theatre', theatreSchema);