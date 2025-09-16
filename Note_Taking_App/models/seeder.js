// models/seeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Note from './note.js';
import User from './user.js';

dotenv.config();

// The refactored function
export const seedDB = async () => {
  try {
    // Check if a connection is already established
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB ✅');
    }

    // Delete previous data
    await Note.deleteMany({});
    await User.deleteMany({}); // Also delete users to ensure a clean state
    console.log('Old data removed');

    // Sample user
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Seed User',
    });

    // Sample notes
    const notes = [
      {
        title: 'First Starred Note',
        content: 'This is a note with 5 stars',
        stars: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        owner: user._id,
      },
      {
        title: 'Second Note',
        content: 'This note has no stars',
        stars: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        owner: user._id,
      },
      {
        title: 'Another Starred Note',
        content: 'This one has 3 stars',
        stars: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        owner: user._id,
      },
      {
        title: 'Newest Note',
        content: 'Latest note without stars',
        stars: 0,
        createdAt: new Date(),
        owner: user._id,
      },
    ];

    await Note.insertMany(notes);
    console.log('Seed data inserted ✅');

    // Return the created user for use in tests
    return user;
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error; // Rethrow the error to be caught by the test runner
  }
};