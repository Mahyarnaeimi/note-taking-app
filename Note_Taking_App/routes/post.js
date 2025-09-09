// routes/post.js
import { Router } from 'express';
import Note from '../models/note.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { ensureAuth } from '../middlewares/auth.js';

const router = Router();

// Get all notes with optional filters
router.get(
  '/',
  ensureAuth,
  asyncHandler(async (req, res) => {
    const { filter } = req.query;
    let query = { owner: req.user._id };
    let sort = { createdAt: -1 }; // default: newest first

    if (filter === 'oldest') {
      sort = { createdAt: 1 }; // oldest first
    } else if (filter === 'starred') {
      query.stars = { $gt: 0 }; // only starred notes
      sort = { stars: -1, createdAt: -1 }; // sort by stars, then newest
    } else if (filter === 'unstarred') {
      query.stars = 0; // only unstarred
      sort = { createdAt: -1 }; // newest first
    }

    const notes = await Note.find(query).sort(sort);
    res.json(notes);
  })
);

// Search notes by title/content
router.get(
  '/search',
  ensureAuth,
  asyncHandler(async (req, res) => {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i'); // case-insensitive

    const notes = await Note.find({
      owner: req.user._id,
      $or: [{ title: regex }, { content: regex }]
    }).sort({ stars: -1, createdAt: -1 });

    res.json(notes);
  })
);

// Create new note
router.post(
  '/',
  ensureAuth,
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const note = await Note.create({ title, content, owner: req.user._id });
    res.status(201).json(note);
  })
);

// Read single note
router.get(
  '/:id',
  ensureAuth,
  asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (!note.owner.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    res.json(note);
  })
);

// Update note
router.put(
  '/:id',
  ensureAuth,
  asyncHandler(async (req, res) => {
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
  })
);

// Delete note
router.delete(
  '/:id',
  ensureAuth,
  asyncHandler(async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  })
);

// Star a note
router.post(
  '/:id/star',
  ensureAuth,
  asyncHandler(async (req, res) => {
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
  })
);

export default router;
