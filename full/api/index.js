import express from 'express';
import cors from 'cors';
import { fetchItemsFromDb, fetchTagsFromDb, fetchPublicationTypesFromDb } from './db/db.js';

const app = express();
app.use(cors());
app.use(express.json());

// --- Define API Routes with the full path ---

// POST /api/fetchItems
app.post('/api/fetchItems', async (req, res) => {
  try {
    const filters = req.body;
    const items = await fetchItemsFromDb(filters);
    res.status(200).json(items);
  } catch (error) {
    console.error('*** ERROR in /api/fetchItems:', error);
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// GET /api/fetchTags
app.get('/api/fetchTags', async (req, res) => {
  try {
    const tags = await fetchTagsFromDb();
    res.status(200).json(tags);
  } catch (error) {
    console.error('*** ERROR in /api/fetchTags:', error);
    res.status(500).json({ message: 'Error fetching tags', error: error.message });
  }
});

// GET /api/fetchPublicationTypes
app.get('/api/fetchPublicationTypes', async (req, res) => {
  try {
    const pubTypes = await fetchPublicationTypesFromDb();
    res.status(200).json(pubTypes);
  } catch (error) {
    console.error('*** ERROR in /api/fetchPublicationTypes:', error);
    res.status(500).json({ message: 'Error fetching publication types', error: error.message });
  }
});

export default app;