import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    time: Date
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

export default Showtime;