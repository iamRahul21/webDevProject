# Movie Booking Website System

**Movie Booking Website System** | This full-stack application was developed for the **Software Dev Guild Hackathon-InterIIT 2024**. The system implements a role-based authentication model where admins can modify user permissions. It also uses WebSockets for real-time updates on bookings, Redis for caching frequently accessed data, and integrates external APIs for email notifications and movie data. 

## Features

- **Role-Based Authentication with Admin Control**: 
  - Admins have full control over adding, updating, and deleting movies, theatres, showtimes, and users.
  - Admins can add new admins and remove existing ones, effectively managing permissions and roles.

- **WebSocket Integration**: 
  - Real-time booking updates are pushed to users using WebSockets, ensuring instant feedback on ticket availability and bookings without needing a page refresh.

- **In-Memory Database (Redis)**: 
  - Redis is used as an in-memory caching layer to store frequently accessed data like movie listings, showtimes, and theatre details. This reduces the load on the primary MongoDB database, improving performance.

- **External API Integration**:
  - **SendGrid API**: Integrated to send booking confirmations and notifications via email.
  - **TMDB (The Movie Database) API**: Fetches detailed movie information such as descriptions, posters, covers, and trailers to enhance the movie browsing experience.

- **Online Booking System**: 
  - Customers can browse and book movie tickets online. 
  - Real-time updates via email ensure that once tickets are booked, other users are notified of the availability instantly.

- **Admin Dashboard**: 
  - A comprehensive dashboard for admins to manage movies, theatres, showtimes, reservations, and user roles. Admins can also handle system-wide configurations.

- **Reservations**: 
  - Customers can make and cancel reservations.
  - Admins can view and manage all reservations through the dashboard, ensuring smooth booking operations.

## Setup and Installation

### 1. Download the Codebase

- If you haven't downloaded the codebase yet, get the latest version from [GitHub](https://github.com/iamRahul21/webDevProject/archive/refs/heads/main.zip).
- Locate the zip file of the codebase if you have already downloaded it.

### 2. Extract and Open in VSCode

- Unzip the downloaded folder.
- Open the extracted folder in Visual Studio Code (VSCode).

### 3. Create a `.env` File

- In the root directory of the project, create a file named `.env`.
- Add the following environment variables to the `.env` file. Replace the placeholder values with your own:

  ```dotenv
  MONGODB_URI=mongodb+srv://your_mongodb_username:your_mongodb_password@your_cluster_url/?retryWrites=true&w=majority&appName=MovieInfo
  REDIS_URL=redis://localhost:6379
  PORT=3000

  FIREBASE_API_KEY=your_firebase_api_key
  FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
  FIREBASE_PROJECT_ID=your_firebase_project_id
  FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
  FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
  FIREBASE_APP_ID=your_firebase_app_id
  FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

  SENDGRID_API_KEY=your_sendgrid_api_key
  TMDB_API_KEY=your_tmdb_api_key
  ```

### 4. Install Dependencies

- Open the terminal in VSCode.
- Run the following command to install all necessary dependencies and create the `node_modules` folder:
  ```
  npm install
  ```
### 5. Start the Server

- To start the server, run the following command:
  ```
  npm start
  ```

### 6. Launch the Live Server
- Navigate to `screens/index.html` in your project. Click on "Go Live" in VSCode to start the live server.

## Admin Dashboard Access
Use the following credentials to access the admin dashboard:
- Email: testadmin@gmail.com
- Password: ihavetheADMINaccess

## Key Technologies Used
- Node.js & Express: Back-end framework for handling server-side logic.
- MongoDB: Primary database for storing movies, theatres, showtimes, and reservations.
- Redis: In-memory cache to improve performance.
- WebSockets: Real-time communication between server and client for booking updates.
- Firebase: For authentication and user management.
- SendGrid API: For sending transactional emails such as booking confirmations.
- TMDB API: For displaying detailed movie data including descriptions, posters, and trailers.