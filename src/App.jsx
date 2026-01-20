import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider, useIsAuthenticated } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

// Pages
import HomePage from "./pages/HomePage";
import Login from './pages/Login';
import Register from "./pages/Register";
import ProjectPage from "./pages/ProjectPage";
import LiteraturePage from "./pages/LiteraturePage";
import PrimarySearchPage from "./pages/PrimaryPage";
import PrimaryArticlePage from "./pages/PrimaryArticlePage";
import SecondaryPage from "./pages/SecondaryPage";
import SecondaryResultsPage from "./pages/SecondaryResultsPage";
import Profile from './pages/Profile';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Route Component (redirects to home if already authenticated)
function PublicRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Routes>
      {/* Public routes - redirect to home if authenticated */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes - require authentication */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/project/:id" 
        element={
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/project/:id/literature" 
        element={
          <ProtectedRoute>
            <LiteraturePage />
          </ProtectedRoute>
        } 
      />
      
      {/* PRIMARY SCREENING */}
      <Route 
        path="/project/:id/primary" 
        element={
          <ProtectedRoute>
            <PrimarySearchPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/project/:id/primary/article/:pmid" 
        element={
          <ProtectedRoute>
            <PrimaryArticlePage />
          </ProtectedRoute>
        } 
      />
      
      {/* SECONDARY SCREENING */}
      <Route 
        path="/project/:id/secondary" 
        element={
          <ProtectedRoute>
            <SecondaryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/:id/secondary" 
        element={
          <ProtectedRoute>
            <SecondaryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/:id/secondary/results" 
        element={
          <ProtectedRoute>
            <SecondaryResultsPage />
          </ProtectedRoute>
        } 
      />

      {/* Root path - redirect based on authentication */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Catch all - redirect to home if authenticated, login if not */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MsalProvider>
  );
}

export default App;