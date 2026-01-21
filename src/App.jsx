import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';
import { useState, useEffect } from 'react';

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

// Loading Component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const location = useLocation();
  
  // Wait for MSAL to finish initialization
  if (inProgress !== 'none') {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    // Save the attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// Public Route Component (redirects to home if already authenticated)
function PublicRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const location = useLocation();
  
  // Wait for MSAL to finish initialization
  if (inProgress !== 'none') {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated) {
    // Redirect to the page they were trying to access, or home
    const from = location.state?.from?.pathname || '/home';
    return <Navigate to={from} replace />;
  }
  
  return children;
}

function AppRoutes() {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();

  // Show loading screen while MSAL is initializing
  if (inProgress !== 'none') {
    return <LoadingScreen />;
  }

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
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize MSAL and handle redirects
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();
        await msalInstance.handleRedirectPromise();
      } catch (error) {
        console.error('MSAL initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeMsal();
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MsalProvider>
  );
}

export default App;