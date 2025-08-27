// The base URL for the API, provided by the Vercel environment variable.
const API_URL = process.env.REACT_APP_API_URL;

/// Api request to fetch documents with multiple filters
export async function fetchItems(filters) {
  const response = await fetch(`${API_URL}/api/fetchItems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  });
  if (!response.ok) {
    console.error("API fetch failed:", response.status, response.statusText);
    const text = await response.text();
    console.error("Response body:", text);
    return { papers: [], guidelines: [], drugs: [], konsilium: [] };
  }
  return await response.json();
}

/// Api request to fetch all available Tags (Diseases/Specialties)
export async function fetchTags() {
  const response = await fetch(`${API_URL}/api/fetchTags`);
  if (!response.ok) {
    console.error("API fetch failed for tags:", response.status, response.statusText);
    return [];
  }
  return await response.json();
}

/// Api request to fetch all available Publication Types
export async function fetchPublicationTypes() {
  const response = await fetch(`${API_URL}/api/fetchPublicationTypes`);
  if (!response.ok) {
    console.error("API fetch failed for pub types:", response.status, response.statusText);
    return [];
  }
  return await response.json();
}