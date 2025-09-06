// app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import path from 'path';
import { fileURLToPath } from 'url';

import postsRouter from './routes/post.js';
import authRouter from './routes/auth.js';
import { configurePassport } from './config/passport.js';

// برای درست کردن __dirname توی ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// env
dotenv.config();

// app
const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
  })
);

// passport
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// static
app.use(express.static(path.join(__dirname, 'public')));

// view engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routes
app.use('/posts', postsRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render('index', { user: req.user || null });
});

// DB connect & server start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error(err));
