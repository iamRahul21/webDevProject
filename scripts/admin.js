const apiKey = 'dda0c89a37b24d1043646098c8e9d707';

document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('home');
    const movieList = document.getElementById('movies-container');
    const manageMoviesBtn = document.getElementById('manage-movies');
    const manageTheatresBtn = document.getElementById('manage-theatres');
    const manageShowtimesBtn = document.getElementById('manage-showtimes');
    const manageReservationsBtn = document.getElementById('manage-reservations');
    const manageUsersBtn = document.getElementById('manage-users');

    const moviesSection = document.getElementById('movies-section');
    const theatresSection = document.getElementById('theatres-section');
    const showtimesSection = document.getElementById('showtimes-section');
    const reservationsSection = document.getElementById('reservations-section');
    const usersSection = document.getElementById('users-section');
    const heading = document.getElementById('heading');

    function hideAllSections() {
        moviesSection.style.display = 'none';
        theatresSection.style.display = 'none';
        showtimesSection.style.display = 'none';
        reservationsSection.style.display = 'none';
        usersSection.style.display = 'none';
    }

    loadSimplifiedMovies();
    hideAllSections();

    manageMoviesBtn.addEventListener('click', () => {
        hideAllSections();
        moviesSection.style.display = 'block';
        heading.style.display = 'none';
        movieList.style.display = 'none';
        loadMovies();
    });

    manageTheatresBtn.addEventListener('click', () => {
        hideAllSections();
        theatresSection.style.display = 'block';
        heading.style.display = 'none';
        movieList.style.display = 'none';
        loadTheatres();
    });

    manageShowtimesBtn.addEventListener('click', () => {
        hideAllSections();
        showtimesSection.style.display = 'block';
        heading.style.display = 'none';
        movieList.style.display = 'none';
        loadMoviesForShowtime();
        loadTheatresForShowtime();
        loadShowtimes();
    });

    manageReservationsBtn.addEventListener('click', () => {
        hideAllSections();
        reservationsSection.style.display = 'block';
        heading.style.display = 'none';
        movieList.style.display = 'none';
        loadReservations();
    });

    manageUsersBtn.addEventListener('click', () => {
        hideAllSections();
        usersSection.style.display = 'block';
        heading.style.display = 'none';
        movieList.style.display = 'none';
        loadUsers();
    });

    homeBtn.addEventListener('click', () => {
        hideAllSections();
        heading.style.display = 'block';
        movieList.style.display = 'flex';
        loadSimplifiedMovies();
    });

    // Add Movie
    document.getElementById('movie-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('movie-title').value;
        const startDate = document.getElementById('movie-start-date').value;
        const endDate = document.getElementById('movie-end-date').value;

        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`);
            const data = await response.json();

            if (data.results.length === 0) {
                alert('Movie not found on TMDB.');
                return;
            }

            const movie = data.results[0];

            const movieData = {
                title: movie.title,
                description: movie.overview,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                cover: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
                language: movie.original_language,
                genre: movie.genre_ids.join(', '),
                director: '',
                trailer: '',
                duration: '',
                startDate,
                endDate
            };

            // Send movie data to the server
            const serverResponse = await fetch('http://localhost:3000/api/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movieData)
            });

            if (serverResponse.ok) {
                alert('Movie added successfully!');
                loadMovies();
                document.getElementById('movie-form').reset();
            } else {
                const errorData = await serverResponse.json();
                alert(`Error adding movie: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding movie. Please try again.');
        }
    });

    // Load Movies
    async function loadMovies() {
        try {
            const response = await fetch('http://localhost:3000/api/movies');
            const movies = await response.json();
            const moviesList = document.getElementById('movies-list');
            moviesList.innerHTML = '';

            movies.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('col-md-4', 'mb-4');
                movieItem.innerHTML = `
                    <div class="card shadow-sm">
                        <img src="${movie.cover}" class="card-img-top" alt="${movie.title}" style="max-height: 300px;">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <div class="description-container">
                                <p class="card-text short-description">${movie.description.substring(0, 100)}...</p>
                                <p class="card-text full-description d-none">${movie.description}</p>
                                <a href="#" class="btn btn-link show-more">Show More</a>
                            </div>
                            <p class="card-text"><strong>Language:</strong> ${movie.language}</p>
                            <p class="card-text"><strong>Genre:</strong> ${movie.genre}</p>
                            <p class="card-text"><strong>Director:</strong> ${movie.director}</p>
                            <p class="card-text"><strong>Duration:</strong> ${movie.duration} min</p>
                            <p class="card-text"><strong>Start Date:</strong> ${new Date(movie.startDate).toLocaleDateString()}</p>
                            <p class="card-text"><strong>End Date:</strong> ${new Date(movie.endDate).toLocaleDateString()}</p>
                            <p class="card-text"><strong>Trailer:</strong> <a href="${movie.trailer}" target="_blank">Watch Trailer</a></p>
                            <button data-id="${movie._id}" class="btn btn-danger btn-sm delete-movie">Delete</button>
                        </div>
                    </div>
                `;
                moviesList.appendChild(movieItem);
            });

            document.addEventListener('click', function (event) {
                if (event.target && event.target.matches('.show-more')) {
                    event.preventDefault();
                    const container = event.target.closest('.description-container');
                    const shortDesc = container.querySelector('.short-description');
                    const fullDesc = container.querySelector('.full-description');

                    if (event.target.textContent === 'Show More') {
                        shortDesc.classList.add('d-none');
                        fullDesc.classList.remove('d-none');
                        event.target.textContent = 'Show Less';
                    } else {
                        shortDesc.classList.remove('d-none');
                        fullDesc.classList.add('d-none');
                        event.target.textContent = 'Show More';
                    }
                }
            });

            document.querySelectorAll('.delete-movie').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const movieId = e.target.getAttribute('data-id');
                    const response = await fetch(`http://localhost:3000/api/movies/${movieId}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        loadMovies();
                    } else {
                        alert('Failed to delete movie.');
                    }
                });
            });
        } catch (error) {
            console.error('Error loading movies:', error);
        }
    }

    // Load Simplified Movies for Display Section
    async function loadSimplifiedMovies() {
        try {
            const response = await fetch('http://localhost:3000/api/movies');
            const movies = await response.json();
            const moviesContainer = document.getElementById('movies-container');
            moviesContainer.innerHTML = '';

            movies.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('col-md-4', 'mb-4');
                movieItem.innerHTML = `
                <div class="card shadow-sm">
                    <img src="${movie.cover}" class="card-img-top" alt="${movie.title}" style="max-height: 300px;">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text"><strong>Language:</strong> ${movie.language}</p>
                        <p class="card-text"><strong>Genre:</strong> ${movie.genre}</p>
                    </div>
                </div>
                `;
                moviesContainer.appendChild(movieItem);
            });
        } catch (error) {
            console.error('Error loading simplified movies:', error);
        }
    }

    // Add Theatre
    document.getElementById('theatre-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('theatre-name').value;
        const city = document.getElementById('theatre-city').value;
        const ticketPrice = document.getElementById('theatre-ticket-price').value;
        const seats = document.getElementById('theatre-seats').value;

        try {
            const response = await fetch('http://localhost:3000/api/theatres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, city, ticketPrice, seats })
            });

            if (response.ok) {
                alert('Theatre added successfully!');
                loadTheatres();
                document.getElementById('theatre-form').reset();
            } else {
                const errorData = await response.json();
                alert(`Error adding theatre: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding theatre. Please try again.');
        }
    });

    // Load Theatres
    async function loadTheatres() {
        try {
            const response = await fetch('http://localhost:3000/api/theatres');
            const theatres = await response.json();
            const theatresList = document.getElementById('theatres-list');
            theatresList.innerHTML = '';

            theatres.forEach(theatre => {
                const theatreItem = document.createElement('div');
                theatreItem.classList.add('col-md-4', 'mb-4');
                theatreItem.innerHTML = `
                <div class="card shadow-sm">
                    <div class="card-body">
                        <p class="card-text"><strong>Name:</strong> ${theatre.name}</p>
                        <p class="card-text"><strong>Location:</strong> ${theatre.city}</p>
                        <p class="card-text"><strong>Capacity:</strong> ${theatre.seats}</p>
                        <p class="card-text"><strong>Ticket Price: ₹</strong> ${theatre.ticketPrice}</p>
                    </div>
                </div>
            `;
                theatresList.appendChild(theatreItem);
            });
        } catch (error) {
            console.error('Error loading theatres:', error);
        }
    }

    // Showtime dropdown - Movies
    async function loadMoviesForShowtime() {
        try {
            const response = await fetch('http://localhost:3000/api/movies');
            const movies = await response.json();
            const movieSelect = document.getElementById('showtime-movie');
            movieSelect.innerHTML = '<option value="" disabled selected>Select Movie</option>';

            movies.forEach(movie => {
                const option = document.createElement('option');
                option.value = movie._id;
                option.textContent = movie.title;
                movieSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading movies for showtime:', error);
        }
    }

    // Showtime dropdown - Theatres
    async function loadTheatresForShowtime() {
        try {
            const response = await fetch('http://localhost:3000/api/theatres');
            const theatres = await response.json();
            const theatreSelect = document.getElementById('showtime-theatre');
            theatreSelect.innerHTML = '<option value="" disabled selected>Select Theatre</option>';

            theatres.forEach(theatre => {
                const option = document.createElement('option');
                option.value = theatre._id;
                option.textContent = theatre.name;
                theatreSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading theatres for showtime:', error);
        }
    }

    // Add Showtime
    document.getElementById('showtime-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const movieId = document.getElementById('showtime-movie').value;
        const theatreId = document.getElementById('showtime-theatre').value;
        const startTime = document.getElementById('showtime-start-time').value;
        const endTime = document.getElementById('showtime-end-time').value;

        try {
            const response = await fetch('http://localhost:3000/api/showtimes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ movieId, theatreId, startTime, endTime })
            });

            if (response.ok) {
                alert('Showtime added successfully!');
                loadShowtimes();
                document.getElementById('showtime-form').reset();
            } else {
                const errorData = await response.json();
                alert(`Error adding showtime: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding showtime. Please try again.');
        }
    });

    // Load Showtimes
    async function loadShowtimes() {
        try {
            const [showtimeResponse, movieResponse, theatreResponse] = await Promise.all([
                fetch('http://localhost:3000/api/showtimes'),
                fetch('http://localhost:3000/api/movies'),
                fetch('http://localhost:3000/api/theatres')
            ]);

            const showtimes = await showtimeResponse.json();
            const movies = await movieResponse.json();
            const theatres = await theatreResponse.json();

            const showtimesList = document.getElementById('showtimes-list');
            showtimesList.innerHTML = '';

            function getMovieTitle(movieId) {
                const movie = movies.find(movie => movie._id === movieId);
                return movie ? movie.title : 'Unknown Movie';
            }

            function getTheatreName(theatreId) {
                const theatre = theatres.find(theatre => theatre._id === theatreId);
                return theatre ? theatre.name : 'Unknown Theatre';
            }

            showtimes.forEach(showtime => {
                const showtimeItem = document.createElement('div');
                showtimeItem.classList.add('col-md-4', 'mb-4');

                const movieTitle = showtime.movie ? showtime.movie.title : 'Unknown Movie';
                const theatreName = showtime.theatre ? showtime.theatre.name : 'Unknown Theatre';

                const formattedStartTime = new Date(showtime.startTime).toLocaleString();
                const formattedEndTime = new Date(showtime.endTime).toLocaleString();

                showtimeItem.innerHTML = `
                <div class="card shadow-sm">
                    <div class="card-body">
                        <p class="card-text"><strong>Movie:</strong> ${movieTitle}</p>
                        <p class="card-text"><strong>Theatre:</strong> ${theatreName}</p>
                        <p class="card-text"><strong>Start:</strong> ${formattedStartTime}</p>
                        <p class="card-text"><strong>End:</strong> ${formattedEndTime}</p>
                        <button class="btn btn-primary btn-sm edit-showtime" data-id="${showtime._id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-showtime" data-id="${showtime._id}">Delete</button>
                    </div>
                </div>
            `;
                showtimesList.appendChild(showtimeItem);
            });

            document.querySelectorAll('.edit-showtime').forEach(button => {
                button.addEventListener('click', editShowtime);
            });
            document.querySelectorAll('.delete-showtime').forEach(button => {
                button.addEventListener('click', deleteShowtime);
            });

        } catch (error) {
            console.error('Error loading showtimes:', error);
        }
    }

    // Edit Showtime Function
    async function editShowtime(e) {
        const showtimeId = e.target.getAttribute('data-id');
        const newStartTime = prompt('Enter new start time (yyyy-mm-ddThh:mm):');
        const newEndTime = prompt('Enter new end time (yyyy-mm-ddThh:mm):');

        if (newStartTime && newEndTime) {
            try {
                const response = await fetch(`http://localhost:3000/api/showtimes/${showtimeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ startTime: newStartTime, endTime: newEndTime })
                });

                if (response.ok) {
                    alert('Showtime updated successfully!');
                    loadShowtimes();
                } else {
                    const errorData = await response.json();
                    alert(`Error updating showtime: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error updating showtime:', error);
                alert('Error updating showtime. Please try again.');
            }
        }
    }

    // Delete Showtime Function
    async function deleteShowtime(e) {
        const showtimeId = e.target.getAttribute('data-id');

        if (confirm('Are you sure you want to delete this showtime?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/showtimes/${showtimeId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Showtime deleted successfully!');
                    loadShowtimes();
                } else {
                    const errorData = await response.json();
                    alert(`Error deleting showtime: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error deleting showtime:', error);
                alert('Error deleting showtime. Please try again.');
            }
        }
    }

    // Load Reservations
    async function loadReservations() {
        try {
            const response = await fetch('http://localhost:3000/api/reservations');
            const reservations = await response.json();
            const reservationsList = document.getElementById('reservations-list');
            reservationsList.innerHTML = '';

            reservations.forEach(reservation => {
                const reservationItem = document.createElement('div');
                reservationItem.classList.add('col-md-4', 'mb-4');
                reservationItem.innerHTML = `
                <div class="card shadow-sm">
                    <div class="card-body">
                        <p class="card-text"><strong>User:</strong> ${reservation.userEmail}</p>
                        <p class="card-text"><strong>Movie:</strong> ${reservation.movieTitle}</p>
                        <p class="card-text"><strong>Theatre:</strong> ${reservation.theatreName}</p>
                        <p class="card-text"><strong>Showtime:</strong> ${new Date(reservation.showtime).toLocaleString()}</p>
                        <p class="card-text"><strong>Seats:</strong> ${reservation.seats.join(', ')}</p>
                    </div>
                </div>
            `;
                reservationsList.appendChild(reservationItem);
            });
        } catch (error) {
            console.error('Error loading reservations:', error);
        }
    }

    // Load Users
    async function loadUsers() {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            const users = await response.json();
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';

            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.classList.add('col-md-4', 'mb-4');
                userItem.innerHTML = `
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <p class="card-text"><strong>Email:</strong> ${user.email}</p>
                            <p class="card-text"><strong>Role:</strong> ${user.role}</p>
                            <button data-id="${user._id}" class="btn btn-primary btn-sm edit-role">Edit Role</button>
                            <button data-id="${user._id}" class="btn btn-danger btn-sm delete-user">Delete</button>
                        </div>
                    </div>
                `;
                usersList.appendChild(userItem);
            });

            document.querySelectorAll('.edit-role').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const userId = e.target.getAttribute('data-id');
                    const newRole = prompt('Enter new role (e.g., admin, user):');
                    if (newRole) {
                        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ role: newRole })
                        });
                        if (response.ok) {
                            loadUsers();
                        } else {
                            alert('Failed to update user role.');
                        }
                    }
                });
            });

            document.querySelectorAll('.delete-user').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const userId = e.target.getAttribute('data-id');
                    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        loadUsers();
                    } else {
                        alert('Failed to delete user.');
                    }
                });
            });
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }
});