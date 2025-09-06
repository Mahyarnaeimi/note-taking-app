import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const app = express();

connectDB();

app.use(morgan('dev'));
app.use(express.json());

app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    // Here you would typically save the note to a database
    res.status(201).json({ message: 'Note created', note: { title, content } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});