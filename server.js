const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Showtime = require('./models/Showtime');
const Reservation = require('./models/Reservation');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'screens')));
app.use(express.static(path.join(__dirname, 'styles')));
app.use(express.static(path.join(__dirname, 'scripts')));

mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});

// Endpoint for regular sign-up
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });

        await newUser.save();
        res.status(201).send({ message: 'User created successfully!' });
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: 'Error creating user. Email may already exist.' });
    }
});

// Endpoint for Google sign-in/sign-up
app.post('/api/google-signin', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send({ message: 'User already exists in MongoDB', role: existingUser.role });
        }

        const newUser = new User({ email }); // Role will default to 'user'
        await newUser.save();
        res.status(201).send({ message: 'Google sign-in user saved to MongoDB!', role: newUser.role });
    } catch (err) {
        console.error(err);
        res.status(400).send({ error: 'Error saving Google user to MongoDB' });
    }
});

// Endpoint for regular login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Users with Google sign-in may not have a password
        if (!user.password) {
            return res.status(400).send({ error: 'No password set for this user. Please log in with Google.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({ error: 'Invalid password' });
        }

        res.status(200).send({ message: 'Login successful', role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server error during login' });
    }
});

// Endpoint to reset password
app.post('/api/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).send({ error: 'Email and new password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await User.updateOne({ email }, { password: hashedPassword });

        if (result.nModified > 0) {
            res.status(200).send({ message: 'Password updated successfully!' });
        } else {
            res.status(404).send({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Error updating password. Please try again.' });
    }
});

// Endpoint to update password using token (assume you have a decodeTokenToGetEmail function)
app.post('/api/update-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const email = decodeTokenToGetEmail(token); // Implement this function

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.updateOne({ email }, { $set: { password: hashedPassword } });
        res.status(200).send('Password updated successfully');
    } catch (error) {
        console.error('Error updating password in MongoDB:', error);
        res.status(500).json({ error: 'Error updating password' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Endpoint for editing user roles
app.put('/api/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['user', 'admin'];
    if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role provided' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Update user role
app.patch('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role || user.role;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint for deleting users
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Movies CRUD
app.get('/api/movies', async (req, res) => {
    const movies = await Movie.find();
    res.json(movies);
});

app.post('/api/movies', async (req, res) => {
    try {
        const { title, description, poster, cover, language, genre, director, trailer, duration, startDate, endDate } = req.body;

        const movie = new Movie({
            title,
            description,
            poster,
            cover,
            language,
            genre,
            director,
            trailer,
            duration,
            startDate,
            endDate
        });

        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add movie.' });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

// Fetch a specific movie by its ID
app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Theatres CRUD
app.get('/api/theatres', async (req, res) => {
    const theatres = await Theatre.find();
    res.json(theatres);
});

app.post('/api/theatres', async (req, res) => {
    try {
        const { name, city, ticketPrice, seats } = req.body;

        const theatre = new Theatre({
            name,
            city,
            ticketPrice,
            seats
        });

        await theatre.save();
        res.status(201).json(theatre);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add theatre.' });
    }
});

app.delete('/api/theatres/:id', async (req, res) => {
    await Theatre.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

// Showtimes CRUD
app.get('/api/showtimes', async (req, res) => {
    const showtimes = await Showtime.find().populate('movie').populate('theatre');
    res.json(showtimes);
});

app.post('/api/showtimes', async (req, res) => {
    const { movieId, theatreId, time } = req.body;
    const showtime = new Showtime({ movie: movieId, theatre: theatreId, time });
    await showtime.save();
    res.status(201).json(showtime);
});

app.delete('/api/showtimes/:id', async (req, res) => {
    await Showtime.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

// Reservations READ
app.get('/api/reservations', async (req, res) => {
    const reservations = await Reservation.find().populate('movie').populate('theatre').populate('showtime').populate('user');
    res.json(reservations);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});