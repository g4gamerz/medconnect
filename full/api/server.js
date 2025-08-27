import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  fetchItemsFromDb, 
  fetchTagsFromDb, 
  fetchPublicationTypesFromDb 
} from './db.js'; // Path is now relative to this file

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// NOTE: We no longer call initDB() here. It runs during the build step.

app.post('/api/fetchItems', async (req, res) => {
  const items = await fetchItemsFromDb(req.body || {});
  res.json(items);
});

app.get('/api/fetchTags', async (req, res) => {
  const tags = await fetchTagsFromDb();
  res.json(tags);
});

app.get('/api/fetchPublicationTypes', async (req, res) => {
  const pubTypes = await fetchPublicationTypesFromDb();
  res.json(pubTypes);
});

// The debug endpoint is no longer needed for deployment
// app.get('/api/debug-db', ...);

// CRITICAL: DO NOT use app.listen(). Export the app object instead.
export default app;