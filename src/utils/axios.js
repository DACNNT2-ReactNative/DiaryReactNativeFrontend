import axios from 'axios';
import { getAccessToken } from './token-config';

const axiosConfig = axios.create({
  baseURL: 'https://5aicueuw8h.execute-api.ap-southeast-1.amazonaws.com/Prod/api/',
  //baseURL: 'https://3be9-115-75-223-23.ap.ngrok.io/api/',
  headers: {
    'content-type': 'application/json',
  },
});
axiosConfig.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
axiosConfig.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      throw error.response.data;
    }
    return error;
  },
);
export default axiosConfig;
