// routes/post.js
import { Router } from 'express';
import Note from '../models/note.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import { ensureAuth } from '../middlewares/auth.js';

const router = Router();

// Get all notes (برای یوزر لاگین‌شده)
router.get(
  '/',
  ensureAuth,
  asyncHandler(async (req, res) => {
    const notes = await Note.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  })
);

// Create new note
router.post(
  '/',
  ensureAuth,
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;
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
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
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

export default router;
