// User model definition

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () { return !this.googleId; },
    select: false
  },
  googleId: {
    type: String,
    required: function () { return !this.password; }
  },
  displayName: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
