// src/services/api.js

const API_URL = 'http://localhost:8080/api';

export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createProduct = async (product) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${API_URL}/products/search?search=${query}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export const filterByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/products/search?category=${category}`);
    if (!response.ok) {
      throw new Error('Failed to filter products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error filtering products:', error);
    return [];
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8080/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return data.imageUrl;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};