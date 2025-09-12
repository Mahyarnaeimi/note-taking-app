// seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Note from './models/note.js';
import User from './models/user.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB ✅');

    // پاک کردن داده‌های قبلی
    await Note.deleteMany({});
    console.log('Old notes removed');

    // یک کاربر نمونه
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      user = await User.create({
        email: 'test@example.com',
        password: 'password123', // دقت کن bcrypt در مدل پسورد رو هش کنه
        displayName: 'Seed User',
      });
    }

    // نت‌های نمونه
    const notes = [
      {
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
    ];

    await Note.insertMany(notes);
    console.log('Seed data inserted ✅');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
