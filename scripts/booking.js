document.addEventListener('DOMContentLoaded', () => {
    // Handle seat selection
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            if (!seat.classList.contains('booked') && !seat.classList.contains('blank')) {
                seat.classList.toggle('selected');
            }
        });
    });

    // Handle date selection
    const dates = document.querySelectorAll('#date-span');
    dates.forEach(date => {
        date.addEventListener('click', () => {
            if (date.classList.contains('selected')) {
                date.classList.remove('selected');
            } else {
                dates.forEach(d => d.classList.remove('selected'));
                date.classList.add('selected');
            }
        });
    });

    // Handle time selection
    const times = document.querySelectorAll('#time-span');
    times.forEach(time => {
        time.addEventListener('click', () => {
            if (time.classList.contains('selected')) {
                time.classList.remove('selected');
            } else {
                times.forEach(t => t.classList.remove('selected'));
                time.classList.add('selected');
            }
        });
    });

    // Handle Checkout button click
    const checkoutButton = document.getElementById('checkout');
    const checkoutCard = document.getElementById('checkout-card');
    const purchaseButton = document.getElementById('purchase');
    const orderFormContainer = document.getElementById('orderFormContainer');
    const closeCheckoutButton = document.getElementById('closeCheckoutButton');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            checkoutCard.style.display = 'flex';
        });
    }

    if (purchaseButton) {
        purchaseButton.addEventListener('click', () => {
            orderFormContainer.style.display = 'flex';
        });
    }

    if (closeCheckoutButton) {
        closeCheckoutButton.addEventListener('click', () => {
            checkoutCard.style.display = 'none';
        });
    }

    if (document.getElementById('closeButton')) {
        document.getElementById('closeButton').addEventListener('click', () => {
            orderFormContainer.style.display = 'none';
        });
    }

    if (document.getElementById('orderForm')) {
        document.getElementById('orderForm').addEventListener('submit', async function (event) {
            event.preventDefault();

            // Get selected seat details
            const selectedSeats = document.querySelectorAll('#selected-seats .seat'); // Corrected selector
            let seatDetails = [];
            selectedSeats.forEach(seat => {
                seatDetails.push(seat.textContent.trim());
            });

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const promo = document.getElementById('promo').value;
            const phone = document.getElementById('phone').value;
            const cardNumber = document.getElementById('card').value;

            const costPerSeat = 12;
            const totalCost = seatDetails.length * costPerSeat;

            const selectedDate = document.querySelector('#date-span.selected')?.textContent;
            const selectedTime = document.querySelector('#time-span.selected')?.textContent;

            // Email content
            const emailContent = `
                Name: ${name}\n
                Email: ${email}\n
                Promo Code: ${promo}\n
                Phone: ${phone}\n
                Card Number: ${cardNumber}\n
                Seats: ${seatDetails.join(', ')}\n
                Total Cost: $${totalCost}\n
                Date: ${selectedDate}\n
                Time: ${selectedTime}
            `;

            // Send email via server
            try {
                const response = await fetch('http://localhost:3001/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: email,
                        subject: 'Your Movie Booking Confirmation',
                        content: emailContent
                    })
                });

                if (response.ok) {
                    alert('Order submitted successfully!');
                } else {
                    alert('Failed to submit order.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to submit order.');
            }
        });
    }

    if (document.getElementById('applyPromo')) {
        document.getElementById('applyPromo').addEventListener('click', () => {
            const promoCode = document.getElementById('promo').value;
            if (promoCode) {
                alert('Promo code applied: ' + promoCode);
            } else {
                alert('Please enter a promo code.');
            }
        });
    }

    async function loadMovieDetails() {
        const movieId = getQueryParam('movieId');

        if (movieId) {
            try {
                const response = await fetch(`http://localhost:3000/api/movies/${movieId}`);
                const movie = await response.json();

                document.querySelector('.container img').src = movie.poster;
                document.querySelector('.container img').alt = movie.title;

            } catch (error) {
                console.error("Failed to load movie details:", error);
            }
        } else {
            console.error("Movie ID not found in the URL.");
        }
    }

    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    loadMovieDetails();
});