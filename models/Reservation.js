import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seats: [String],
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;