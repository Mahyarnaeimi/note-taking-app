// routes/post.js
import { Router } from 'express';
import { getPosts, getSearch, postNote, getNote, putNote, delNote, postStar } from '../controllers/postController.js';
import { ensureAuth } from '../middlewares/auth.js';

const router = Router();

// Get all notes with optional filters
router.get('/', ensureAuth, getPosts);

// Search notes by title/content
router.get('/search', ensureAuth, getSearch);

// Create new note
router.post('/', ensureAuth, postNote);

// Read single note
router.get('/:id', ensureAuth, getNote);

// Update note
router.put('/:id', ensureAuth, putNote);

// Delete note
router.delete('/:id', ensureAuth, delNote);

// Star a note
router.post('/:id/star', ensureAuth, postStar);

export default router;
