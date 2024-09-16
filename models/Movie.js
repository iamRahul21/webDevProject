import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    poster: { type: String },
    cover: { type: String },
    language: { type: String },
    genre: { type: String },
    director: { type: String, required: false },
    trailer: { type: String, required: false },
    duration: { type: Number, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;