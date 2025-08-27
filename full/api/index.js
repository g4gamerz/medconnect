import express from 'express';
import cors from 'cors';
import { fetchItemsFromDb, fetchTagsFromDb, fetchPublicationTypesFromDb } from './db.js';

// Initialize the express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON request bodies

// --- Define API Routes ---

// POST /api/fetchItems
app.post('/api/fetchItems', async (req, res) => {
  try {
    // The filters (tags, pubTypes) are in the request body
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

// Export the app for Vercel
export default app;