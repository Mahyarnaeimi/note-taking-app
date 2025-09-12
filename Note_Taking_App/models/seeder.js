// seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Note from './note.js';
import User from './user.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // delete existing data
    await Note.deleteMany();
    await User.deleteMany();
    console.log('Old data removed');

    // create test user


    // create test user
    const hash = await bcrypt.hash('123456', 12);
    const user = await User.create({
      email: 'test@example.com',
      password: hash,
      displayName: 'Test User'
    });


    // create multiple notes
    const notes = await Note.insertMany([ {
        title: 'First Starred Note',
        content: 'This is a note with 5 stars',
        stars: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 روز قبل
        owner: user._id,
      },
      {
        title: 'Second Note',
        content: 'This note has no stars',
        stars: 0,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 روز قبل
        owner: user._id,
      },
      {
        title: 'Another Starred Note',
        content: 'This one has 3 stars',
        stars: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 روز قبل
        owner: user._id,
      },
      {
        title: 'Newest Note',
        content: 'Latest note without stars',
        stars: 0,
        createdAt: new Date(), // همین الان
        owner: user._id,
      },
    ]);

    await Note.insertMany(notes);
    
    console.log('🌱 Seeding done!');
    console.log({
      user,
      notes
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();