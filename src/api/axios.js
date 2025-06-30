import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://localhost:7099/api', // use your backend base URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
