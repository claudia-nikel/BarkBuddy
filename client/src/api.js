const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const fetchDogs = async () => {
  const response = await fetch(`${apiUrl}/api/dogs`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};