// controllers/postController.js

import Note from '../models/note.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// GET '/'   --->  Get all notes with optional filters
export const getPosts = asyncHandler(async (req, res) => {
  const { filter } = req.query;
  let query = { owner: req.user._id };
  let sort = { createdAt: -1 }; // newest first

  if (filter === 'oldest') {
    sort = { createdAt: 1 };
  } else if (filter === 'starred') {
    query.stars = { $gt: 0 };
    sort = { stars: -1, createdAt: -1 };
  } else if (filter === 'unstarred') {
    query.stars = 0;
    sort = { createdAt: -1 };
  }

  const notes = await Note.find(query).sort(sort);
  res.json(notes);
});

// GET '/search'  ----> Search notes by title/content
export const getSearch = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const regex = new RegExp(q, 'i'); // case-insensitive

  const notes = await Note.find({
    owner: req.user._id,
    $or: [{ title: regex }, { content: regex }]
  }).sort({ stars: -1, createdAt: -1 });

  res.json(notes);
});

// POST  '/' ----> create new note
export const postNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  const note = await Note.create({ title, content, owner: req.user._id });
  res.status(201).json(note);
});

// GET  '/:id'  ----> read a single note
export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Not found' });
  if (!note.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  res.json(note);
});

// PUT  '/:id'  ----> update a single note
export const putNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { title, content },
    { new: true, runValidators: true }
  );
  if (!note) return res.status(404).json({ message: 'Not found' });
  res.json(note);
});

// DELETE  '/:id'  ----> delete a single note
export const delNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!note) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

// POST '/:id/star' ----> star a single note
export const postStar = asyncHandler(async (req, res) => {
  const { stars } = req.body;

  if (stars < 0 || stars > 5) {
    return res.status(400).json({ message: 'Stars must be between 0 and 5' });
  }

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { stars },
    { new: true, runValidators: true }
  );

  if (!note) return res.status(404).json({ message: 'Note not found' });

  res.json(note);
});
