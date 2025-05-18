import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api', // ✅ Make sure /api is included here
  withCredentials: false
});

export default axiosClient;
