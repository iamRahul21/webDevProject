document.addEventListener('DOMContentLoaded', () => {
    let selectedDate = null;
    let selectedTime = null;
    const selectedSeats = new Set();

    // Handle seat selection
    const seats = document.querySelectorAll('.seat');
    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            if (!seat.classList.contains('booked') && !seat.classList.contains('blank')) {
                seat.classList.toggle('selected');
                if (seat.classList.contains('selected')) {
                    selectedSeats.add(seat.textContent.trim());
                } else {
                    selectedSeats.delete(seat.textContent.trim());
                }
            }
        });
    });

    // Handle date selection
    const dates = document.querySelectorAll('.date-span');
    dates.forEach(date => {
        date.addEventListener('click', () => {
            if (date.classList.contains('selected')) {
                date.classList.remove('selected');
                selectedDate = null;
            } else {
                dates.forEach(d => d.classList.remove('selected'));
                date.classList.add('selected');
                selectedDate = date.textContent.trim();
            }
        });
    });

    // Handle time selection
    const times = document.querySelectorAll('.time-span');
    times.forEach(time => {
        time.addEventListener('click', () => {
            if (time.classList.contains('selected')) {
                time.classList.remove('selected');
                selectedTime = null;
            } else {
                times.forEach(t => t.classList.remove('selected'));
                time.classList.add('selected');
                selectedTime = time.textContent.trim();
            }
        });
    });

    // Handle Checkout button click
    const checkoutButton = document.getElementById('checkout');
    const checkoutCard = document.getElementById('checkout-card');
    const purchaseButton = document.getElementById('purchase');
    const orderFormContainer = document.getElementById('orderFormContainer');
    const closeCheckoutButton = document.getElementById('closeCheckoutButton');
    const selectedSeatsContainer = document.getElementById('selected-seats');
    const dateElement = document.createElement('div');
    const timeElement = document.createElement('div');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (selectedDate && selectedTime && selectedSeats.size > 0) {
                const selectedSeatsList = Array.from(selectedSeats).map(seat => `<div>${seat}</div>`).join('');
                selectedSeatsContainer.innerHTML = `<div>Seat No.: ${selectedSeatsList}</div>
                                                    <div>Date: ${selectedDate}</div>
                                                    <div>Time: ${selectedTime}</div>`;
                document.getElementById('time-left').textContent = 'Time left to purchase: 30 minutes';
                checkoutCard.style.display = 'flex';
            } else {
                alert('Please select a date, time, and at least one seat.');
            }
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

            const seatDetails = Array.from(selectedSeats);

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const promo = document.getElementById('promo').value;
            const phone = document.getElementById('phone').value;
            const cardNumber = document.getElementById('card').value;

            const costPerSeat = 12;
            const totalCost = seatDetails.length * costPerSeat;

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