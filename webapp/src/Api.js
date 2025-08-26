/// Api request to fetch documents with multiple filters
export async function fetchItems(filters) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/fetchItems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  });
  return await response.json();
}

/// Api request to fetch all available Tags (Diseases/Specialties)
export async function fetchTags() {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/fetchTags`);
  return await response.json();
}

/// Api request to fetch all available Publication Types
export async function fetchPublicationTypes() {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/fetchPublicationTypes`);
  return await response.json();
}