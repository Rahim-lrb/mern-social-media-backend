# Backend Social Media Project

Welcome to the backend repository of our MERN stack social media project! This repository contains the server-side code for our social media platform.

## Demo

Explore the project live [here](https://wex-backend.onrender.com/)!

## Features

- **User Authentication**: Secure user authentication system to register, login, and manage user accounts.
- **Post Management**: Create, read, update, and delete posts.
- **Comment System**: Allow users to comment on posts.
- **Like System**: Implement a feature for users to like posts.
- **User Profile**: Enable users to view and update their profiles.
- **Follow System**: Implement the ability for users to follow and unfollow each other.
- **Search Functionality**: Implement search functionality to find users and posts.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- Multer for handling file uploads (for profile pictures, post images, etc.)
- Cloudinary for storing and serving images

## API Endpoints

- `/api/auth`: Authentication endpoints (register, login, logout)
- `/api/users`: User endpoints (get user profile)
- `/api/posts`: Post endpoints (create, read, update, delete posts, like/unlike posts)
- `/api/comments`: Comment endpoints (create, read, comments)


## Future Improvements

- delete comments , edit profile , follow and unfollow...etc
- Implement real-time updates using WebSockets for features like notifications.
- build and Improve search functionality with more advanced filters and sorting options.
- Enhance security measures, such as rate limiting and input validation.
- Optimize database queries for better performance.
- Implement pagination for endpoints returning large amounts of data.



## Getting Started

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up environment variables (e.g., MongoDB URI, JWT secret key, Cloudinary credentials).
4. Run the server using `npm start`.
