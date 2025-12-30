import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import LiteraturePage from "./pages/LiteraturePage";
import PrimarySearchPage from "./pages/PrimaryPage";
import PrimaryArticlePage from "./pages/PrimaryArticlePage";
import SecondaryPage from "./pages/SecondaryPage";
import SecondaryResultsPage from "./pages/SecondaryResultsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/project/:id/literature" element={<LiteraturePage />} />

        {/* PRIMARY */}
        <Route path="/project/:id/primary" element={<PrimarySearchPage />} />
        <Route
          path="/project/:id/primary/article/:pmid"
          element={<PrimaryArticlePage />}
        />

        {/* SECONDARY */}
        <Route path="/project/:id/secondary" element={<SecondaryPage />} />
        <Route path="/projects/:id/secondary" element={<SecondaryPage />} />
<Route
  path="/projects/:id/secondary/results"
  element={<SecondaryResultsPage />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
