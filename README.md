---
# Byte Scribe
---

Byte Scribe is a blogging platform where users can create, review, and publish blog posts. This project includes user authentication, admin functionalities, and a comprehensive dashboard for managing users and posts.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

## Features

- User Registration and Login
- Authentication with JSON Web Tokens (JWT)
- Role-based access control (Admin and User)
- Create, Edit, Delete, and Review Blog Posts
- Admin Dashboard for managing users and posts
- Modern design

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- MongoDB

### Backend

1. Clone the repository:

    ```sh
    git clone https://github.com/sudhidutta7694/byte-scribe.git
    cd backend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up environment variables (see [Environment Variables](#environment-variables)).

4. Start the server:

    ```sh
    npm start
    ```

### Frontend

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/byte-scribe.git
    cd frontend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up environment variables (see [Environment Variables](#environment-variables)).

4. Start the development server:

    ```sh
    npm run dev
    ```

## Environment Variables

### Backend

Create a `.env` file in the root of the backend project with the following variables:

```plaintext
MONGO_URL=your_mongodb_url
PORT=your_backend_port
SECRET=your_jwt_secret
PRODUCTION_ORIGIN=your_production_url
ADMIN_EMAIL=your_admin_email
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

### Frontend

Create a `.env` file in the root of the frontend project with the following variable:

```plaintext
VITE_API_URL=http://localhost:8080
VITE_API_IF=http://localhost:8080/images
```

> Replace `http://localhost:8080` with your backend URL if it's different.

## Usage

1. Register a new user.
2. Login with the registered user.
3. Create and manage blog posts.
4. Admin can review, approve, or reject posts from the dashboard.
5. Admin can also manage users from the dashboard.

