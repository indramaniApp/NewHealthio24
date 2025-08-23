import StorageHelper from "../../utils/StorageHelper";
import { API_BASE_URL } from "./config/ApiConfig";

const ApiService = {
  request: async (
    url,
    method = 'GET',
    body = null,
    requiresAuth = true,
    isMutipart = true,
  ) => {
    try {
      let token = requiresAuth
        ? await StorageHelper.getItem('USER_TOKEN')
        : null;

      const headers = {
        'Content-Type': isMutipart ? 'multipart/form-data' : 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Log the request URL and body
      console.log('Request URL:', `${API_BASE_URL}${url}`);
      console.log('Request Body:', body,isMutipart);  // Log the request body if it's not multipart

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method,
        headers,
        body: isMutipart ? body : JSON.stringify(body),
      });

      // Log the response data
      const responseData = await response.json();
      console.log('Response Data:', responseData);

      // Check if the response was successful
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },

  get: async (url, requiresAuth = true) => {
    return ApiService.request(url, 'GET', null, requiresAuth);
  },

  post: async (url, body, requiresAuth = true, isMutipart) => {
    return ApiService.request(url, 'POST', body, requiresAuth, isMutipart);
  },

  put: async (url, body, requiresAuth = true) => {
    return ApiService.request(url, 'PUT', body, requiresAuth);
  },

  delete: async (url, requiresAuth = true) => {
    return ApiService.request(url, 'DELETE', null, requiresAuth);
  },
};

export default ApiService;
