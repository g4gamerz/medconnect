import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';

/// Config
dotenv.config();
const dbName = path.join(process.env.VERCEL ? '/tmp' : '.', 'db.sqlite');

/// Singleton DB
let db;


async function seedKonsilium(db, filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    for (const contentBlock of data.Inhalte) {
      const diseaseTag = contentBlock.Erkrankung;
      for (const item of contentBlock.FragenUndAntworten) {
        await db.run(
          `INSERT OR IGNORE INTO documents (id, name, description, category, full_data)
           VALUES (?, ?, ?, ?, ?)`,
          [item.FrageID, item.Headline, item.Antwort, 'KONSILIUM', JSON.stringify(item)]
        );
        await db.run(
          `INSERT OR IGNORE INTO tags (document_id, tag) VALUES (?, ?)`,
          [item.FrageID, diseaseTag]
        );
      }
    }
  } catch (error) {
    console.error(`*** ERROR seeding KONSILIUM from ${filePath}: ${error.message}`);
  }
}

async function seedCategory(db, category, filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const items = JSON.parse(content);
    let drugIdCounter = 200;
    let guidelineIdCounter = 0;

    for (const item of items) {
      let id, name, description, tags, fullData;
      fullData = JSON.stringify(item);

      if (category === 'DRUG') {
        id = drugIdCounter++;
        name = item.Produktname;
        description = item.Zusammenfassung;
        tags = item.Tags || [];
      } else if (category === 'PAPER') {
        id = item.PMID;
        name = item.Title;
        description = item.Abstract;
        tags = item.Disease ? [item.Disease] : [];
        
        if (item.PublicationTypes) {
          let simplifiedType = 'Original Article';
          if (item.PublicationTypes.toLowerCase().includes('review')) {
            simplifiedType = 'Review';
          }
          await db.run('INSERT OR IGNORE INTO publication_types (document_id, publication_type) VALUES (?, ?)', [id, simplifiedType]);
        }

      } else if (category === 'GUIDELINE') {
        id = `GL-${guidelineIdCounter++}`; 
        name = item.Indication;
        description = `Guideline from ${item.Stand}.`;
        tags = item.Tags || [];
      }

      await db.run(
        `INSERT OR IGNORE INTO documents (id, name, description, category, full_data)
         VALUES (?, ?, ?, ?, ?)`,
        [id, name, description, category, fullData]
      );

      for (const tag of tags) {
        if (tag) {
          await db.run(`INSERT OR IGNORE INTO tags (document_id, tag) VALUES (?, ?)`, [id, tag]);
        }
      }
    }
  } catch (error) {
    console.error(`*** ERROR seeding ${category} from ${filePath}: ${error.message}`);
  }
}

async function initializeDatabase(dbInstance) {
    console.log('Database not found or empty. Initializing and seeding...');
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('PAPER', 'GUIDELINE', 'DRUG', 'KONSILIUM')),
        full_data TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS tags (
        document_id TEXT NOT NULL,
        tag TEXT NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
        PRIMARY KEY (document_id, tag)
      );
      CREATE TABLE IF NOT EXISTS publication_types (
        document_id TEXT NOT NULL,
        publication_type TEXT NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
        PRIMARY KEY (document_id, publication_type)
      );
    `);
  
    // Seed data from local files
    await seedCategory(dbInstance, 'PAPER', './api/demo-data/pubs.json');
    await seedCategory(dbInstance, 'GUIDELINE', './api/demo-data/guidelines.json');
    await seedCategory(dbInstance, 'DRUG', './api/demo-data/drugs.json');
    await seedKonsilium(dbInstance, './api/demo-data/Konsilium.json');
    console.log('Database initialization complete.');
}


// --- UPDATED getDb FUNCTION ---

export async function getDb() {
  if (db) return db; // Return cached instance

  // Open a connection
  const newDb = await open({ filename: dbName, driver: sqlite3.Database });
  
  // Check if the database is initialized
  const tableCheck = await newDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='documents'");

  if (!tableCheck) {
    await initializeDatabase(newDb);
  }

  db = newDb; // Cache the instance
  return db;
}


/// Fetch documents with advanced filtering
export async function fetchItemsFromDb({ tags = [], pubTypes = [] }) {
  const db = await getDb();
  let baseSql = `
    SELECT
      d.id, d.category, d.full_data,
      (SELECT '[' || GROUP_CONCAT('"' || t.tag || '"') || ']' FROM tags t WHERE t.document_id = d.id) AS tags
    FROM documents d
  `;
  const params = [];
  const whereClauses = [];

  if (tags.length > 0) {
    const placeholders = tags.map(() => '?').join(',');
    whereClauses.push(`d.id IN (SELECT document_id FROM tags WHERE tag IN (${placeholders}))`);
    params.push(...tags);
  }
  if (pubTypes.length > 0) {
    const placeholders = pubTypes.map(() => '?').join(',');
    whereClauses.push(`d.id IN (SELECT document_id FROM publication_types WHERE publication_type IN (${placeholders}))`);
    params.push(...pubTypes);
  }

  if (whereClauses.length > 0) {
    baseSql += ` WHERE ${whereClauses.join(' AND ')}`;
  }
  baseSql += ' ORDER BY d.id';

  const docs = await db.all(baseSql, params);
  const parsedDocs = docs.map(doc => {
    const fullData = JSON.parse(doc.full_data);
    const itemTags = JSON.parse(doc.tags || '[]');
    const name = fullData.Title || fullData.Headline || fullData.Produktname || fullData.Indication || fullData.name;
    const description = fullData.description || fullData.Abstract || fullA.Antwort || fullA.Zusammenfassung;
    delete fullData.category;
    return { ...fullData, id: doc.id, name, description, tags: itemTags, category: doc.category };
  });

  return {
    papers: parsedDocs.filter(doc => doc.category === 'PAPER'),
    guidelines: parsedDocs.filter(doc => doc.category === 'GUIDELINE'),
    drugs: parsedDocs.filter(doc => doc.category === 'DRUG'),
    konsilium: parsedDocs.filter(doc => doc.category === 'KONSILIUM'),
  };
}

/// Fetch all tags from db
export async function fetchTagsFromDb() {
  const db = await getDb();
  const rows = await db.all(`
    SELECT DISTINCT t.tag 
    FROM tags t
    JOIN documents d ON t.document_id = d.id
    WHERE d.category = 'PAPER'
    ORDER BY t.tag ASC
  `);
  return rows.map(r => r.tag);
}

export async function fetchPublicationTypesFromDb() {
  const db = await getDb();
  const rows = await db.all('SELECT DISTINCT publication_type FROM publication_types ORDER BY publication_type ASC');
  return rows.map(r => r.publication_type);
}