import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    startTime: Date,
    endTime: Date
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

export default Showtime;