import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';

// Pages
import HomePage from "./pages/HomePage";
import Login from './pages/login';
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

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* All other routes - Authentication handled by HomePage redirect */}
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/project/:id/literature" element={<LiteraturePage />} />
          
          {/* PRIMARY SCREENING */}
          <Route path="/project/:id/primary" element={<PrimarySearchPage />} />
          <Route path="/project/:id/primary/article/:pmid" element={<PrimaryArticlePage />} />
          
          {/* SECONDARY SCREENING */}
          <Route path="/project/:id/secondary" element={<SecondaryPage />} />
          <Route path="/projects/:id/secondary" element={<SecondaryPage />} />
          <Route path="/projects/:id/secondary/results" element={<SecondaryResultsPage />} />
        </Routes>
      </BrowserRouter>
    </MsalProvider>
  );
}

export default App;