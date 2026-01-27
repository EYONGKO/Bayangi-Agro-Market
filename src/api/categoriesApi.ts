const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
console.log('API_BASE_URL:', API_BASE_URL);
console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const url = `${API_BASE_URL}/api/categories`;
    console.log('Fetching categories from:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Categories data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
