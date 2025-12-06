# Note-Taking App

**Midterm assignment by Mahyar Naeimi**

A full-stack Note-Taking App built with Node.js, Express, MongoDB, and EJS. This project demonstrates server-side JavaScript, RESTful API creation, authentication (local & Google OAuth), and front-end integration.

## Features

- **User Authentication**
  - Local login & registration (email + password)
  - Google OAuth 2.0 login with Passport
- **CRUD Operations**
  - Create, read, update, and delete personal notes
  - Notes are private to each logged-in user
  - Star rating system (0-5 stars)
- **Security**
  - Passwords hashed with bcryptjs
  - Session handling with express-session and MongoDB store
  - Server-side validation and error handling
- **Front-End**
  - EJS templating with TailwindCSS
  - Responsive design

## Project Structure

```
Note-Taking-App/
├── config/
│   └── passport.js           # Google OAuth + Passport config
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── postController.js     # Notes CRUD logic
├── middlewares/
│   ├── asyncHandler.js       # Async error handling
│   ├── auth.js               # Authentication middleware
│   └── error.js              # Global error handlers
├── models/
│   ├── note.js               # Note schema
│   ├── user.js               # User schema
│   └── seeder.js             # Database seeder
├── routes/
│   ├── auth.js               # Auth routes (login, register, OAuth)
│   └── post.js               # Notes CRUD routes
├── views/
│   ├── index.ejs             # Login page
│   ├── register.ejs          # Register page
│   ├── dashboard.ejs         # Main dashboard
│   └── forgot-password.ejs   # Password reset page
├── public/                   # Static assets (CSS, images)
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
└── package.json
```

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Mahyarnaeimi/Note-taking-app
cd Note-taking-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=3500
MONGO_URI=mongodb://localhost:27017/note_taker
SESSION_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3500/auth/google/callback
```

### 4. Seed the database (optional)

Creates a test user and sample notes:

```bash
npm run seed
```

### 5. Run the server

```bash
npm run dev
```

Server will be running at: http://localhost:3500

## API Endpoints

All note routes require authentication (`ensureAuth` middleware).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts/` | Get all notes for user |
| POST | `/posts/` | Create a new note |
| GET | `/posts/:id` | Get a single note by ID |
| PUT | `/posts/:id` | Update a note (owner only) |
| DELETE | `/posts/:id` | Delete a note (owner only) |
| POST | `/posts/:id/star` | Set star rating (0-5) |
| GET | `/posts/search?q=` | Search notes by title/content |

## Authentication Routes

| Route | Description |
|-------|-------------|
| `POST /auth/login` | Login with email & password |
| `GET /auth/register` | Register page |
| `POST /auth/register` | Register new user |
| `GET /auth/google` | Login with Google |
| `GET /auth/logout` | Logout user |
| `GET /auth/forgot-password` | Forgot password page |

## Error Handling

| Status | Description |
|--------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not logged in |
| 403 | Forbidden - Accessing another user's note |
| 404 | Not Found - Resource doesn't exist |

## Technologies Used

| Technology | Purpose |
|------------|---------|
| Node.js + Express | Server & routing |
| MongoDB + Mongoose | Database & models |
| Passport.js | Authentication (local + Google OAuth) |
| express-session | Session handling |
| connect-mongo | MongoDB session store |
| bcryptjs | Password hashing |
| EJS | Templating engine |
| TailwindCSS | UI styling |
| morgan | Request logging |

## Scripts

```bash
npm start      # Start production server
npm run dev    # Start development server (nodemon)
npm run seed   # Seed database with test data
npm test       # Run tests
```

## Security Notes

- Passwords are always hashed before storing in the database
- Use HTTPS and secure cookie flags in production
- Session secrets should be strong and kept private
