import express from 'express';
import cors from 'cors';
// Correct the path to db.js, it's inside the 'db' folder
import { fetchItemsFromDb, fetchTagsFromDb, fetchPublicationTypesFromDb } from './db/db.js';

const app = express();
app.use(cors());
app.use(express.json());

// POST /fetchItems
app.post('/fetchItems', async (req, res) => {
  try {
    const filters = req.body;
    const items = await fetchItemsFromDb(filters);
    res.status(200).json(items);
  } catch (error) {
    console.error('*** ERROR in /fetchItems:', error);
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// GET /fetchTags
app.get('/fetchTags', async (req, res) => {
  try {
    const tags = await fetchTagsFromDb();
    res.status(200).json(tags);
  } catch (error)
 {
    console.error('*** ERROR in /fetchTags:', error);
    res.status(500).json({ message: 'Error fetching tags', error: error.message });
  }
});

// GET /fetchPublicationTypes
app.get('/fetchPublicationTypes', async (req, res) => {
  try {
    const pubTypes = await fetchPublicationTypesFromDb();
    res.status(200).json(pubTypes);
  } catch (error) {
    console.error('*** ERROR in /fetchPublicationTypes:', error);
    res.status(500).json({ message: 'Error fetching publication types', error: error.message });
  }
});

export default app;