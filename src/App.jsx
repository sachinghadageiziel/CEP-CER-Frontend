import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";

// Pages for each step
import LiteraturePage from "./pages/LiteraturePage";
import PrimaryPage from "./pages/PrimaryPage";
import SecondaryPage from "./pages/SecondaryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Project Overview */}
        <Route path="/project/:id" element={<ProjectPage />} />

        {/* Step Pages */}
        <Route path="/project/:id/literature" element={<LiteraturePage />} />
        <Route path="/project/:id/primary" element={<PrimaryPage />} />
        <Route path="/project/:id/secondary" element={<SecondaryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
