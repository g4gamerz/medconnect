import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { 
  initDB, 
  fetchItemsFromDb, 
  fetchTagsFromDb, 
  fetchPublicationTypesFromDb 
} from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

await initDB();

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

app.get('/api/debug-db', async (req, res) => {
  try {
    const db = await getDb();
    const documents = await db.all('SELECT id, name, category FROM documents');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});