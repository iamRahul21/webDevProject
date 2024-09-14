import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import firebaseConfig from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    // Login with email and password
    loginForm.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Send login request to the server
        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.role) {
                    localStorage.setItem('role', data.role);

                    if (data.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'home.html';
                    }
                } else {
                    console.error('Login failed:', data.error);
                }
            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
    });

    // Sign up with email, password, and confirm password
    signupForm.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const userData = {
                    email: userCredential.user.email,
                    password
                };

                const response = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    const errorData = await response.json();
                    alert(`Error saving user data to MongoDB: ${errorData.error}`);
                }
            })
            .catch(error => {
                console.error(error);
                alert(`Sign up failed: ${error.message}`);
            });
    });

    // Google login
    document.getElementById('google-login').onclick = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const response = await fetch('http://localhost:3000/api/google-signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email })
            });

            if (response.ok) {
                window.location.href = 'home.html';
            } else {
                const errorData = await response.json();
                console.error(`Error saving Google user data to MongoDB: ${errorData.error}`);
                alert(`Error saving Google user data to MongoDB: ${errorData.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('Google login failed. Please try again.');
        }
    };

    // Google sign-up
    document.getElementById('google-signin').onclick = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const response = await fetch('http://localhost:3000/api/google-signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: user.email })
            });

            if (response.ok) {
                window.location.href = 'home.html';
            } else {
                const errorData = await response.json();
                console.error(`Error saving Google user data to MongoDB: ${errorData.error}`);
                alert(`Error saving Google user data to MongoDB: ${errorData.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('Google sign-up failed. Please try again.');
        }
    };

    // Show forgot password form
    document.getElementById('show-forgot').addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        forgotPasswordForm.style.display = 'block';
    });

    // Show login form from forgot password
    document.getElementById('show-login-from-forgot').addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Handle forgot password form submission
    document.getElementById('forgot-password').addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('forgot-password-email').value;

        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Password reset email sent. Please check your inbox.');
                forgotPasswordForm.style.display = 'none';
                loginForm.style.display = 'block';
            })
            .catch(error => {
                console.error(error);
                alert('Error sending password reset email. Please try again.');
            });
    });

    // Show signup form
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });

    // Show login form from signup
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
});