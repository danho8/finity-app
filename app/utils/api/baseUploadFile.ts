import { BASE_URL } from 'app/config/api-config';
import axios from 'axios';
import { Platform } from 'react-native';
import { storage } from '../../store/storage';

const BaseUploadFile = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

BaseUploadFile.interceptors.request.use(
  async config => {
    let token;
    let language;
    try {
      token = await storage.getItem('token');
      language = await storage.getItem('language');
      config.headers['X-platform'] = Platform.OS;
      config.headers['X-localization'] = language == 'kr' ? 'ko' : language || 'en';
    } catch (e) {}
    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  },
);

// after send request
BaseUploadFile.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  },
);

export default BaseUploadFile;
