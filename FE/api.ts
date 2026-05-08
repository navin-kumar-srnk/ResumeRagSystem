import axios from 'axios';

// Create an instance for your local FastAPI backend
const axiosIns = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default axiosIns;

