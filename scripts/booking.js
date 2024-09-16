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
                const selectedSeatsList = Array.from(selectedSeats)
                    .map(seat => `<div class="seat-item">${seat}</div>`)
                    .join('');

                selectedSeatsContainer.innerHTML = `
                <div class="checkout-info">
                    <h4>Selected Seats:</h4>
                    <div class="seat-list">${selectedSeatsList}</div>
                    <div class="info-detail">
                        <strong>Date:</strong> ${selectedDate}
                    </div>
                    <div class="info-detail">
                        <strong>Time:</strong> ${selectedTime}
                    </div>
                </div>
            `;

                document.getElementById('time-left').textContent = 'Time left to purchase: 10 minutes';
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
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        line-height: 1.6;
                        margin: 0;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        margin: 10px 0;
                    }
                    .highlight {
                        color: #a81c1d;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Movie Booking Confirmation</h1>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Promo Code Applied:</strong> ${promo}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Card Number:</strong> ${cardNumber}</p>
                    <p><strong>Seats:</strong> ${seatDetails.join(', ')}</p>
                    <p><strong>Total Cost:</strong> $${totalCost}</p>
                    <p><strong>Date:</strong> ${selectedDate} September</p>
                    <p><strong>Time:</strong> ${selectedTime}</p>
                    <p class="highlight">Thank you for your booking!</p>
                </div>
            </body>
            </html>
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