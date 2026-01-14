import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add authentication token
 * This automatically adds the Bearer token to all requests
 */
api.interceptors.request.use(
  (config) => {
    // Get token from sessionStorage (where MSAL stores it)
    const accounts = JSON.parse(sessionStorage.getItem('msal.account.keys') || '[]');
    if (accounts.length > 0) {
      const accountKey = accounts[0];
      const tokenKey = `msal.${accountKey}.accesstoken`;
      const tokenData = sessionStorage.getItem(tokenKey);
      
      if (tokenData) {
        try {
          const parsed = JSON.parse(tokenData);
          const token = parsed.secret;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.error('Error parsing token:', e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      console.error('Authentication failed - please login again');
      // You can dispatch a logout action here if needed
    }
    return Promise.reject(error);
  }
);

/**
 * Auth API calls
 */
export const authAPI = {
  // Get current user info
  getCurrentUser: () => api.get('/api/auth/me'),
  
  // Get all users (admin only)
  getAllUsers: () => api.get('/api/auth/users'),
  
  // Update user role (admin only)
  updateUserRole: (userId, role) => 
    api.patch(`/api/auth/users/${userId}/role`, { role }),
  
  // Deactivate user (admin only)
  deactivateUser: (userId) => 
    api.delete(`/api/auth/users/${userId}`),
};

/**
 * Project API calls
 */
export const projectAPI = {
  // Create new project
  createProject: (formData) => 
    api.post('/api/projects/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Get all projects
  getProjects: () => api.get('/api/projects/list'),
  
  // Get single project
  getProject: (projectId) => api.get(`/api/projects/${projectId}`),
};

/**
 * Literature API calls
 */
export const literatureAPI = {
  // Run literature search
  runSearch: (formData) => 
    api.post('/api/literature/run', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Get existing literature data
  getExisting: (projectId) => 
    api.get(`/api/literature/existing?project_id=${projectId}`),
  
  // Get search status
  getStatus: (projectId) => 
    api.get(`/api/literature/status/${projectId}`),
  
  // Cancel search
  cancelSearch: (projectId) => 
    api.post(`/api/literature/cancel/${projectId}`),
};

/**
 * Primary screening API calls
 */
export const primaryAPI = {
  // Run primary screening
  runScreening: (formData) => 
    api.post('/api/primary/run', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Get existing results
  getExisting: (projectId) => 
    api.get(`/api/primary/existing?project_id=${projectId}`),
  
  // Get specific article
  getArticle: (projectId, pmid) => 
    api.get(`/api/primary/article?project_id=${projectId}&pmid=${pmid}`),
  
  // Update decision
  updateDecision: (formData) => 
    api.post('/api/primary/decision', formData),
  
  // Get paginated results
  getPage: (projectId, page, size) => 
    api.get(`/api/primary/page?project_id=${projectId}&page=${page}&size=${size}`),
  
  // Export results
  exportResults: (projectId) => 
    api.get(`/api/primary/export?project_id=${projectId}`, {
      responseType: 'blob'
    }),
};

/**
 * Secondary screening API calls
 */
export const secondaryAPI = {
  // PDF download
  downloadPDFs: (formData) => 
    api.post('/api/secondary/pdf-download', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Get existing PDF download status
  getExistingPDFDownload: (projectId) => 
    api.get(`/api/secondary/pdf-download/existing?project_id=${projectId}`),
  
  // Get PDF list
  getPDFList: (projectId) => 
    api.get(`/api/secondary/pdf-list?project_id=${projectId}`),
  
  // Open PDF
  openPDF: (projectId, filename) => 
    api.get(`/api/secondary/open-pdf?project_id=${projectId}&filename=${filename}`, {
      responseType: 'blob'
    }),
  
  // PDF to text conversion
  convertPDFToText: (formData) => 
    api.post('/api/secondary/pdf-to-text', formData),
  
  // Get selected data
  getSelectedData: (formData) => 
    api.post('/api/secondary/get-selected-data', formData),
  
  // Run secondary screening
  runScreening: (formData) => 
    api.post('/api/secondary/secondary-runner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Get existing results
  getExisting: (projectId) => 
    api.get(`/api/secondary/existing?project_id=${projectId}`),
};

export default api;