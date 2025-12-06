// Note model definition

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stars: { type: Number, default: 0, min: 0, max: 5 }
});

export default mongoose.model('Note', noteSchema);