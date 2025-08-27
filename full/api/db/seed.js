import { initDB } from './db.js';

console.log('Starting database seeding...');
initDB().then(() => {
  console.log('Database seeding complete.');
}).catch(err => {
  console.error('Database seeding failed:', err);
  process.exit(1);
});