import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  initDB, 
  getDb,
  fetchItemsFromDb, 
  fetchTagsFromDb, 
  fetchPublicationTypesFromDb 
} from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- NEW LOGGING MIDDLEWARE ---
// This will log details for EVERY request that comes into the server.
app.use((req, res, next) => {
  console.log('--------------------------------');
  console.log(`Request Received: ${req.method} ${req.originalUrl}`);
  console.log('Request Headers:', req.headers);
  if (req.method === 'POST') {
    console.log('Request Body:', req.body);
  }
  next(); // Pass the request to the next handler
});
// ------------------------------

await initDB();

app.post('/api/fetchItems', async (req, res) => {
  console.log('--- Handling /api/fetchItems ---');
  const items = await fetchItemsFromDb(req.body || {});
  console.log(`Returning ${items.papers?.length || 0} papers.`);
  res.json(items);
});

app.get('/api/fetchTags', async (req, res) => {
  console.log('--- Handling /api/fetchTags ---');
  const tags = await fetchTagsFromDb();
  console.log(`Returning ${tags.length} tags.`);
  res.json(tags);
});

app.get('/api/fetchPublicationTypes', async (req, res) => {
  console.log('--- Handling /api/fetchPublicationTypes ---');
  const pubTypes = await fetchPublicationTypesFromDb();
  console.log(`Returning ${pubTypes.length} publication types.`);
  res.json(pubTypes);
});

app.get('/api/debug-db', async (req, res) => {
  // ... (debug route remains the same)
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});