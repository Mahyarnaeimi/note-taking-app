// Note_Taking_App/models/user.js
// User model definition

import { Mongoose } from "mongoose";

const userSchema = new Mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = Mongoose.model("User", userSchema);

export default User;
