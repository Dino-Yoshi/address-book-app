 import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true // this sends cookies like the auth token
});

export default instance;
