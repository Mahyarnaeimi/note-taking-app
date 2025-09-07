// Note_Taking_App/models/user.js
// User model definition

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: function () { return !this.googleId; }},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function () { return !this.googleId; }},
    googleId: { type: String, required: function () { return !this.password; }},
});

const User = mongoose.model("User", userSchema);

export default User;
