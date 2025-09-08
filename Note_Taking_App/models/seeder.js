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

    // create test user


    // create test user
    const hash = await bcrypt.hash('123456', 12);
    const user = await User.create({
      email: 'test@example.com',
      password: hash,
      displayName: 'Test User'
    });


    // create multiple notes
    const notes = await Note.insertMany([{
        title: 'First Note',
        content: 'This is my first note.',
        owner: user._id
      },
      {
        title: 'Second Note',
        content: 'This is my second note.',
        owner: user._id
      },
    ]);

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