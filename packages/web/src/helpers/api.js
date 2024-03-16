import axios from 'axios';

import appConfig from 'config/app.js';
import * as URLS from 'config/urls.js';
import { getItem, removeItem } from 'helpers/storage.js';

const api = axios.create({
  ...axios.defaults,
  baseURL: appConfig.restApiUrl,
  headers: {
    Authorization: getItem('token'),
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      removeItem('token');

      // hard reload to clear all state
      if (window.location.pathname !== URLS.LOGIN) {
        window.location.href = URLS.LOGIN;
      }
    }

    // re-throw what's already intercepted here.
    throw error;
  },
);

export default api;
