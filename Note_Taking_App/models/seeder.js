// seeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Note from './models/Note.js';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // delete existing data
    await Note.deleteMany();
    await User.deleteMany();

    // create test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: '123456', // In production, passwords should be hashed
    });

    // create multiple notes
    const notes = await Note.insertMany([
      { title: 'First Note', content: 'This is my first note.', owner: user._id },
      { title: 'Second Note', content: 'This is my second note.', owner: user._id },
    ]);

    console.log('🌱 Seeding done!');
    console.log({ user, notes });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
