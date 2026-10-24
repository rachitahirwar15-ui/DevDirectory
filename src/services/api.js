import axios from 'axios';

// All HTTP traffic in this app must go through this configured Axios client.
const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;