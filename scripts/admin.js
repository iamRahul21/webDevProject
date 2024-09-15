const apiKey = 'dda0c89a37b24d1043646098c8e9d707';

document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('home');
    const movieList = document.getElementById('movies-container');
    const manageMoviesBtn = document.getElementById('manage-movies');
    const manageTheatresBtn = document.getElementById('manage-theatres');
    const manageShowtimesBtn = document.getElementById('manage-showtimes');
    const manageReservationsBtn = document.getElementById('manage-reservations');

    const moviesSection = document.getElementById('movies-section');
    const theatresSection = document.getElementById('theatres-section');
    const showtimesSection = document.getElementById('showtimes-section');
    const reservationsSection = document.getElementById('reservations-section');
    const heading = document.getElementById('heading');

    function hideAllSections() {
        moviesSection.style.display = 'none';
        theatresSection.style.display = 'none';
        showtimesSection.style.display = 'none';
        reservationsSection.style.display = 'none';
    }

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
        loadShowtimes();
    });

    manageReservationsBtn.addEventListener('click', () => {
        hideAllSections();
        reservationsSection.style.display = 'block';
        heading.style.display = 'none';
        movieList.style.display = 'none';
        loadReservations();
    });

    homeBtn.addEventListener('click', () => {
        hideAllSections();
        heading.style.display = 'block';
        movieList.style.display = 'flex';
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
                director: movie.director || '', 
                trailer: movie.trailer || '', 
                duration: movie.duration || '', 
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
                loadMovies(); // Refresh the movie list
                document.getElementById('movie-form').reset(); // Reset form fields
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
    }

    // Load Simplified Movies for Display Section
    async function loadSimplifiedMovies() {
        try {
            const response = await fetch('http://localhost:3000/api/movies');
            const movies = await response.json();
            const moviesContainer = document.getElementById('movies-container');
            moviesContainer.innerHTML = ''; // Clear previous content

            movies.forEach(movie => {
                const movieItem = document.createElement('div');
                movieItem.classList.add('col-md-4', 'mb-4');
                movieItem.innerHTML = `
                <div class="card shadow-sm">
                    <img src="${movie.cover}" class="card-img-top" alt="${movie.title}" style="max-height: 300px;">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                    </div>
                </div>
            `;
                moviesContainer.appendChild(movieItem);
            });
        } catch (error) {
            console.error('Error loading simplified movies:', error);
        }
    }
    loadSimplifiedMovies();

    // Add Theatre
    document.getElementById('theatre-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('theatre-name').value;
        const city = document.getElementById('theatre-city').value;
        const ticketPrice = document.getElementById('theatre-ticket-price').value;
        const seats = document.getElementById('theatre-seats').value;

        const theatreData = {
            name,
            city,
            ticketPrice,
            seats
        };

        try {
            const response = await fetch('http://localhost:3000/api/theatres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(theatreData)
            });

            if (response.ok) {
                loadTheatres();
            } else {
                alert('Failed to add theatre.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the theatre.');
        }
    });

    // Load Theatres
    async function loadTheatres() {
        const response = await fetch('http://localhost:3000/api/theatres');
        const theatres = await response.json();
        const theatresList = document.getElementById('theatres-list');
        theatresList.innerHTML = '';

        theatres.forEach(theatre => {
            const theatreItem = document.createElement('div');
            theatreItem.classList.add('theatre-item', 'p-3', 'mb-3', 'bg-white', 'shadow-sm', 'rounded');
            theatreItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h3 class="mb-0">${theatre.name}</h3>
                <button data-id="${theatre._id}" class="btn btn-danger btn-sm delete-theatre">Delete</button>
            </div>
            <p class="mb-1"><strong>City:</strong> ${theatre.city}</p>
            <p class="mb-1"><strong>Ticket Price:</strong> ₹${theatre.ticketPrice}</p>
            <p class="mb-0"><strong>Seats:</strong> ${theatre.seats}</p>
        `;
            theatresList.appendChild(theatreItem);
        });

        document.querySelectorAll('.delete-theatre').forEach(button => {
            button.addEventListener('click', async (e) => {
                const theatreId = e.target.getAttribute('data-id');
                const response = await fetch(`http://localhost:3000/api/theatres/${theatreId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    loadTheatres();
                } else {
                    alert('Failed to delete theatre.');
                }
            });
        });
    }

    // Add Showtime
    document.getElementById('showtime-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const movieId = document.getElementById('showtime-movie').value;
        const theatreId = document.getElementById('showtime-theatre').value;
        const time = document.getElementById('showtime-time').value;

        const response = await fetch('http://localhost:3000/api/showtimes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ movieId, theatreId, time })
        });

        if (response.ok) {
            loadShowtimes();
        } else {
            alert('Failed to add showtime.');
        }
    });

    // Load Showtimes
    async function loadShowtimes() {
        const moviesResponse = await fetch('http://localhost:3000/api/movies');
        const movies = await moviesResponse.json();
        const theatresResponse = await fetch('http://localhost:3000/api/theatres');
        const theatres = await theatresResponse.json();
        const showtimesResponse = await fetch('http://localhost:3000/api/showtimes');
        const showtimes = await showtimesResponse.json();

        const showtimeMovieSelect = document.getElementById('showtime-movie');
        const showtimeTheatreSelect = document.getElementById('showtime-theatre');
        const showtimesList = document.getElementById('showtimes-list');

        showtimeMovieSelect.innerHTML = '';
        showtimeTheatreSelect.innerHTML = '';
        showtimesList.innerHTML = '';

        movies.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie._id;
            option.textContent = movie.title;
            showtimeMovieSelect.appendChild(option);
        });

        theatres.forEach(theatre => {
            const option = document.createElement('option');
            option.value = theatre._id;
            option.textContent = theatre.name;
            showtimeTheatreSelect.appendChild(option);
        });

        showtimes.forEach(showtime => {
            const showtimeItem = document.createElement('div');
            showtimeItem.classList.add('showtime-item');
            showtimeItem.innerHTML = `
                <h3>${showtime.movie.title}</h3>
                <p>Theatre: ${showtime.theatre.name}</p>
                <p>Time: ${new Date(showtime.time).toLocaleString()}</p>
                <button data-id="${showtime._id}" class="delete-showtime">Delete</button>
            `;
            showtimesList.appendChild(showtimeItem);
        });

        document.querySelectorAll('.delete-showtime').forEach(button => {
            button.addEventListener('click', async (e) => {
                const showtimeId = e.target.getAttribute('data-id');
                const response = await fetch(`http://localhost:3000/api/showtimes/${showtimeId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    loadShowtimes();
                } else {
                    alert('Failed to delete showtime.');
                }
            });
        });
    }

    // Load Reservations
    async function loadReservations() {
        const response = await fetch('http://localhost:3000/api/reservations');
        const reservations = await response.json();
        const reservationsList = document.getElementById('reservations-list');
        reservationsList.innerHTML = '';

        reservations.forEach(reservation => {
            const reservationItem = document.createElement('div');
            reservationItem.classList.add('reservation-item');
            reservationItem.innerHTML = `
                <h3>${reservation.movie.title}</h3>
                <p>Theatre: ${reservation.theatre.name}</p>
                <p>Showtime: ${new Date(reservation.showtime.time).toLocaleString()}</p>
                <p>User: ${reservation.user.email}</p>
                <p>Seats: ${reservation.seats.join(', ')}</p>
            `;
            reservationsList.appendChild(reservationItem);
        });
    }
});