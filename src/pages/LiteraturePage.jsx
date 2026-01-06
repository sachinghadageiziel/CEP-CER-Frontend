import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Card,
  Stack,
  Container,
  Fade,
  Zoom,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { FileSearch, Download, Upload, Database, AlertCircle, RefreshCw, X } from "lucide-react";
import Layout from "../Layout/Layout";
import LiteraturePopup from "../components/LiteraturePopup";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

export default function LiteraturePage() {
  const { id: PROJECT_ID } = useParams();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [applyDateFilter, setApplyDateFilter] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filters, setFilters] = useState({
    abstract: false,
    freeFullText: false,
    fullText: false,
  });
  const [databases, setDatabases] = useState({
    pubmed: true,
    cochrane: false,
    googleScholar: false,
  });
  const [masterData, setMasterData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [excelBlob, setExcelBlob] = useState(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Error handling states
  const [error, setError] = useState(null);
  const [partialResults, setPartialResults] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, [PROJECT_ID]);

  const loadExistingData = () => {
    fetch(
      `http://localhost:5000/api/literature/existing?project_id=${PROJECT_ID}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data?.masterSheet?.length) return;

        setColumns(
          Object.keys(data.masterSheet[0]).map((key) => ({
            field: key,
            headerName: key,
            flex: 1,
            minWidth: 160,
          }))
        );

        setMasterData(
          data.masterSheet.map((row, i) => ({ id: i + 1, ...row }))
        );

        setExcelBlob(data.excelFile);
      })
      .catch((err) => {
        console.error("Error loading existing data:", err);
      });
  };

  const handleUpload = (e) => setFile(e.target.files[0]);

  const handleSearch = async (isRetry = false) => {
    if (!file && !isRetry) return;

    const form = new FormData();
    form.append("project_id", PROJECT_ID);
    form.append("keywordsFile", file);
    form.append("applyDateFilter", applyDateFilter.toString());
    form.append("fromDate", fromDate);
    form.append("toDate", toDate);
    form.append("abstract", filters.abstract.toString());
    form.append("freeFullText", filters.freeFullText.toString());
    form.append("fullText", filters.fullText.toString());

    setRunning(true);
    setProgress(5);
    setOpen(false);
    setError(null);
    setPartialResults(false);
    setShowRetry(false);

    // Realistic progress simulation
    let fake = 5;
    const timer = setInterval(() => {
      fake += Math.random() * 3;
      if (fake < 85) setProgress(Math.floor(fake));
    }, 1000);

    try {
      const response = await fetch("http://localhost:5000/api/literature/run", {
        method: "POST",
        body: form,
      });

      clearInterval(timer);

      // Handle different response types
      if (response.ok) {
        const data = await response.json();
        
        // Check if partial results (status 206)
        if (response.status === 206 || data.status === "partial") {
          setPartialResults(true);
          setError(data.message || "Search completed with some errors. Partial results available.");
          setShowRetry(true);
        }

        setProgress(100);

        // Load the results
        const res = await fetch(
          `http://localhost:5000/api/literature/existing?project_id=${PROJECT_ID}`
        );
        const resultData = await res.json();

        if (resultData.masterSheet && resultData.masterSheet.length > 0) {
          setColumns(
            Object.keys(resultData.masterSheet[0]).map((key) => ({
              field: key,
              headerName: key,
              flex: 1,
              minWidth: 160,
            }))
          );

          setMasterData(
            resultData.masterSheet.map((row, i) => ({ id: i + 1, ...row }))
          );

          setExcelBlob(resultData.excelFile);
        }

        setTimeout(() => setRunning(false), 600);
        
      } else {
        // Handle error responses
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Search failed with status ${response.status}`);
      }

    } catch (err) {
      clearInterval(timer);
      setRunning(false);
      setProgress(0);
      
      const errorMessage = err.message || "Literature search failed due to a network error";
      setError(errorMessage);
      setShowRetry(true);
      
      console.error("Literature search error:", err);
      
      // Check if any partial results exist
      loadExistingData();
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleSearch(true);
  };

  const handleCancelSearch = async () => {
    try {
      await fetch(`http://localhost:5000/api/literature/cancel/${PROJECT_ID}`, {
        method: "POST"
      });
      setRunning(false);
      setProgress(0);
    } catch (err) {
      console.error("Error cancelling search:", err);
    }
  };

  const downloadExcel = () => {
    if (!excelBlob) return;

    const bytes = atob(excelBlob);
    const buffer = new Uint8Array([...bytes].map((c) => c.charCodeAt(0)));

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "All-Merged.xlsx";
    link.click();
  };

  return (
    <Layout>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in timeout={600}>
            <div>
              <BreadcrumbsBar
                items={[
                  { label: "Home", to: "/" },
                  { label: "Project", to: `/project/${PROJECT_ID}` },
                  { label: "Literature Search" },
                ]}
              />

              {/* Header Section */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", md: "center" },
                  gap: 2,
                  mb: 4,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(37, 99, 235, 0.25)",
                    }}
                  >
                    <FileSearch color="#fff" size={28} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: "#1e293b",
                        fontSize: { xs: "1.5rem", md: "2rem" }
                      }}
                    >
                      Literature Search
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ color: "#64748b", mt: 0.5 }}
                    >
                      Project ID: {PROJECT_ID}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  disabled={running}
                  onClick={() => setOpen(true)}
                  startIcon={<Upload size={20} />}
                  sx={{
                    background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                    color: "#fff",
                    px: 3,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                    },
                    "&:disabled": {
                      background: "#cbd5e1",
                      color: "#94a3b8",
                    }
                  }}
                >
                  Upload Keywords & Start Search
                </Button>
              </Box>

              {/* Error Alert */}
              {error && (
                <Zoom in>
                  <Alert 
                    severity={partialResults ? "warning" : "error"}
                    action={
                      showRetry && (
                        <Button 
                          color="inherit" 
                          size="small"
                          onClick={handleRetry}
                          startIcon={<RefreshCw size={16} />}
                        >
                          Retry
                        </Button>
                      )
                    }
                    onClose={() => setError(null)}
                    sx={{ mb: 3 }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {partialResults ? "Partial Results Available" : "Search Error"}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontSize: "0.875rem" }}>
                        {error}
                      </Typography>
                      {retryCount > 0 && (
                        <Typography variant="caption" sx={{ mt: 1, display: "block", opacity: 0.8 }}>
                          Retry attempt: {retryCount}
                        </Typography>
                      )}
                    </Box>
                  </Alert>
                </Zoom>
              )}

              {/* Progress Section */}
              {running && (
                <Zoom in>
                  <Card 
                    sx={{ 
                      p: 3, 
                      mb: 4,
                      borderRadius: 3,
                      border: "1px solid #e0e7ff",
                      background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
                      <Database size={24} color="#2563eb" />
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body1" 
                          sx={{ fontWeight: 600, color: "#1e293b" }}
                        >
                          Processing Literature Search...
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ color: "#64748b", mt: 0.5 }}
                        >
                          Searching databases and compiling results
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${progress}%`}
                        sx={{
                          background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={handleCancelSearch}
                        startIcon={<X size={16} />}
                        sx={{ ml: 1 }}
                      >
                        Cancel
                      </Button>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(37, 99, 235, 0.1)",
                        "& .MuiLinearProgress-bar": {
                          background: "linear-gradient(90deg, #2563eb 0%, #14b8a6 100%)",
                          borderRadius: 4,
                        }
                      }}
                    />
                  </Card>
                </Zoom>
              )}

              {/* Results Section */}
              {masterData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Search Results
                      </Typography>
                      <Chip 
                        label={`${masterData.length} articles found`}
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                      {partialResults && (
                        <Chip 
                          label="Partial Results"
                          color="warning"
                          size="small"
                          icon={<AlertCircle size={14} />}
                        />
                      )}
                    </Box>
                    
                    <Button
                      onClick={downloadExcel}
                      startIcon={<Download size={18} />}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderWidth: 2,
                        "&:hover": {
                          borderWidth: 2,
                          transform: "translateY(-2px)",
                        }
                      }}
                    >
                      Download Excel
                    </Button>
                  </Box>

                  <Card 
                    sx={{ 
                      height: 600,
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                      border: "1px solid #e2e8f0",
                      overflow: "hidden",
                    }}
                  >
                    <DataGrid
                      rows={masterData}
                      columns={columns}
                      disableRowSelectionOnClick
                      pageSizeOptions={[10, 25, 50, 100]}
                      sx={{
                        border: "none",
                        "& .MuiDataGrid-cell": {
                          borderColor: "#f1f5f9",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          bgcolor: "#f8fafc",
                          borderColor: "#e2e8f0",
                          fontWeight: 700,
                          color: "#475569",
                        },
                        "& .MuiDataGrid-row:hover": {
                          bgcolor: "#f8fafc",
                        }
                      }}
                    />
                  </Card>
                </motion.div>
              )}

              {masterData.length === 0 && !running && (
                <Card
                  sx={{
                    p: 8,
                    textAlign: "center",
                    borderRadius: 3,
                    border: "2px dashed #cbd5e1",
                    bgcolor: "#f8fafc",
                  }}
                >
                  <FileSearch size={64} color="#94a3b8" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: "#64748b", mb: 1, fontWeight: 600 }}>
                    No literature data yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Upload keywords and start your literature search to see results
                  </Typography>
                </Card>
              )}
            </div>
          </Fade>
        </Container>

        <LiteraturePopup
          open={open}
          onClose={() => setOpen(false)}
          file={file}
          onFileUpload={handleUpload}
          applyDateFilter={applyDateFilter}
          setApplyDateFilter={setApplyDateFilter}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          filters={filters}
          setFilters={setFilters}
          databases={databases}
          setDatabases={setDatabases}
          onSearch={handleSearch}
          running={running}
          progress={progress}
        />
      </Box>
    </Layout>
  );
}