import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    seats: { type: Number, required: true }
});

const Theatre = mongoose.model('Theatre', theatreSchema);

export default Theatre;