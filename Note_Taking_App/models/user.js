// Note_Taking_App/models/user.js
// User model definition

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function () { return !this.googleId; }, select: false },
  googleId: { type: String, required: function () { return !this.password; } },
  displayName: { type: String } }, { timestamps: true });


const User = mongoose.model("User", userSchema);

export default User;
