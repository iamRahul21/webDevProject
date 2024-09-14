var $owl = $('.owl-carousel');

// Fetch and load movies into the carousel
async function loadMovies() {
    try {
        const response = await fetch('http://localhost:3000/api/movies');
        const movies = await response.json();

        $owl.trigger('destroy.owl.carousel').empty();

        movies.forEach((movie, index) => {
            const movieItem = `
                <div class="item" data-cover="${movie.cover}" data-id="${movie._id}" data-position="${index}">
                    <img src="${movie.poster}" alt="${movie.title}" style="max-width: 100%; height: auto;">
                    <div class="carousel-text">
                        <h2>${movie.title}</h2>
                        <button class="book-now" data-id="${movie._id}">Book Now</button>
                    </div>
                </div>
            `;
            $owl.append(movieItem);
        });

        $owl.owlCarousel({
            center: true,
            loop: true,
            items: 9,
            margin: 10,
            onInitialized: setDefaultActiveText
        });

    } catch (error) {
        console.error("Failed to load movies:", error);
    }
}

function setDefaultActiveText(event) {
    var $firstItem = $('.owl-item').eq(0);
    $firstItem.find('.carousel-text').show();
}

$(document).ready(function () {
    loadMovies();

    $(document).on('click', '.owl-item>div', function () {
        var $speed = 300;
        var coverUrl = $(this).data('cover');

        $('.carousel-container').css({
            'background': `url(${coverUrl}), #000`,
            'background-position': 'center',
            'background-size': 'cover'
        });

        $owl.trigger('to.owl.carousel', [$(this).data('position'), $speed]);

        $('.carousel-text').hide();
        $(this).find('.carousel-text').fadeIn(300);
    });

    $(document).on('click', '.book-now', function () {
        var movieId = $(this).data('id');
        window.location.href = `/screens/booking.html?movieId=${movieId}`;
    });
});