// run-seed.js

import { seedDB } from './models/seeder.js';

seedDB()
  .then(() => {
    console.log('Database seeding complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Database seeding failed:', err);
    process.exit(1);
  });