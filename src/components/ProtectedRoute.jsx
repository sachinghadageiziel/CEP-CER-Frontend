import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 * 
 * Usage:
 * <Route path="/projects" element={
 *   <ProtectedRoute>
 *     <ProjectPage />
 *   </ProtectedRoute>
 * } />
 */
export default function ProtectedRoute({ children }) {
  const { accounts } = useMsal();
  
  // Check if user is authenticated
  const isAuthenticated = accounts.length > 0;
  
  if (!isAuthenticated) {
    // Not authenticated - redirect to home/login
    return <Navigate to="/" replace />;
  }
  
  // Authenticated - render children
  return children;
}