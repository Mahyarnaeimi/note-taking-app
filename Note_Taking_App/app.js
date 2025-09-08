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
import configurePassport from './config/passport.js';
import { notFound, errorHandler } from './middlewares/error.js';
import { ensureAuth } from './middlewares/auth.js';
import Note from './models/note.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

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
  res.render('index', { 
    user: req.user || null,
    error: req.query.error || null
  });
});

app.get('/dashboard', ensureAuth, async (req, res, next) => {
  try {
    const notes = await Note.find({ owner: req.user._id }).sort({ stars: -1, createdAt: -1 });
    res.render('dashboard', { user: req.user, notes });
  } catch (err) {
    next(err); // بره توی errorHandler
  }
});

// error handlers
app.use(notFound);
app.use(errorHandler);

// DB connect & server start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error(err));
