import apiClient from './api';

// Keep all endpoint calls in this service; pages must never call the network directly.
export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const getPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

export const getPostsByUser = async (id) => {
  const response = await apiClient.get('/posts', { params: { userId: id } });
  return response.data;
};

export const getLatestPosts = async (limit = 4) => {
  const posts = await getPosts();
  return [...posts].sort((a, b) => b.id - a.id).slice(0, limit);
};

export const createPost = async (payload) => {
  const response = await apiClient.post('/posts', {
    title: payload.title,
    body: payload.body,
    userId: Number(payload.userId),
  });
  return { status: response.status, data: response.data };
};

// Kept as a named helper for the directory page; it uses the assignment API.
export const getFeaturedDevelopers = getUsers;
