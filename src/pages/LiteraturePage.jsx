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
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileSearch, 
  Download, 
  Upload, 
  Database, 
  AlertCircle, 
  RefreshCw, 
  X,
  CheckCircle,
  Info,
  Filter,
  Trash2,
  Edit,
  MoreVertical,
  FileDown,
} from "lucide-react";
import Layout from "../Layout/Layout";
import LiteraturePopup from "../components/LiteraturePopup";
import BreadcrumbsBar from "../components/BreadcrumbsBar";
import LiteratureRecordModal from "../components/LiteratureRecordModal";

export default function LiteraturePage() {
  const { id: PROJECT_ID } = useParams();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [masterData, setMasterData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Error & Success handling
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Record modal states
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Filter state
  const [uniqueOnly, setUniqueOnly] = useState(true);
  const [applyDateFilter, setApplyDateFilter] = useState(false);
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

const [filters, setFilters] = useState({
  abstract: true,
  freeFullText: false,
  fullText: false,
});

const [databases, setDatabases] = useState({
  pubmed: true,
});
  
  // Export menu
  const [exportAnchor, setExportAnchor] = useState(null);
  const exportMenuOpen = Boolean(exportAnchor);

  useEffect(() => {
    loadExistingData();
  }, [PROJECT_ID, uniqueOnly]);

  const loadExistingData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/literature/literature-screen?project_id=${PROJECT_ID}&unique_only=${uniqueOnly}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to load literature data");
      }

      const data = await response.json();
      
      if (data.exists && data.masterSheet && data.masterSheet.length > 0) {
        // Create columns dynamically
        const cols = Object.keys(data.masterSheet[0]).map((key) => ({
          field: key,
          headerName: key,
          flex: 1,
          minWidth: key === "Abstract" ? 300 : 160,
        }));
        
        setColumns(cols);
        setMasterData(data.masterSheet.map((row, i) => ({ id: i + 1, ...row })));
      } else {
        setColumns([]);
        setMasterData([]);
      }
    } catch (err) {
      console.error("Error loading existing data:", err);
      setError("Failed to load existing literature data");
    }
  };

  const handleUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleSearch = async () => {
    if (!file) {
      setError("Please upload a keywords file first");
      return;
    }

    setRunning(true);
    setProgress(5);
    setOpen(false);
    setError(null);
    setShowSuccess(false);

    // Progress simulation
    let fakeProgress = 5;
    const timer = setInterval(() => {
      fakeProgress += Math.random() * 3;
      if (fakeProgress < 85) setProgress(Math.floor(fakeProgress));
    }, 1000);

    try {
      // Step 1: Upload keywords
      const keywordForm = new FormData();
      keywordForm.append("project_id", PROJECT_ID);
      keywordForm.append("keywordsFile", file);

      const keywordResponse = await fetch(
        "http://localhost:5000/api/literature/keywords",
        {
          method: "POST",
          body: keywordForm,
        }
      );

      if (!keywordResponse.ok) {
        const errorData = await keywordResponse.json();
        throw new Error(errorData.detail || "Failed to upload keywords");
      }

      const keywordResult = await keywordResponse.json();
      console.log("✅ Keywords uploaded:", keywordResult);

      // Step 2: Run literature screening
      const screenForm = new FormData();
      screenForm.append("project_id", PROJECT_ID);

      const screenResponse = await fetch(
        "http://localhost:5000/api/literature/literature-screen",
        {
          method: "POST",
          body: screenForm,
        }
      );

      clearInterval(timer);

      if (!screenResponse.ok) {
        const errorData = await screenResponse.json();
        throw new Error(errorData.detail || "Literature screening failed");
      }

      const screenResult = await screenResponse.json();
      console.log("✅ Literature screening completed:", screenResult);

      setProgress(100);
      setSuccessMessage(
        `Successfully found ${screenResult.records_saved} literature records!`
      );
      setShowSuccess(true);

      // Reload data
      await loadExistingData();
      
      setTimeout(() => setRunning(false), 600);
    } catch (err) {
      clearInterval(timer);
      setRunning(false);
      setProgress(0);
      setError(err.message || "Literature search failed");
      console.error("Literature search error:", err);
    }
  };

  const handleExportClick = (event) => {
    setExportAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchor(null);
  };

  const handleExport = async (exportType) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/literature/export-literature-screen?project_id=${PROJECT_ID}&export_type=${exportType}`
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Literature_${exportType}_Project_${PROJECT_ID}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      setSuccessMessage(`Successfully exported ${exportType} records!`);
      setShowSuccess(true);
    } catch (err) {
      setError("Failed to export literature data");
      console.error("Export error:", err);
    }
    
    handleExportClose();
  };

  const handleRowClick = (params) => {
    setSelectedRecord(params.row);
    setModalOpen(true);
  };

  const handleDeleteRecord = async (pmid) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/literature/${PROJECT_ID}/${pmid}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      setSuccessMessage("Record deleted successfully");
      setShowSuccess(true);
      loadExistingData();
    } catch (err) {
      setError("Failed to delete record");
      console.error("Delete error:", err);
    }
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

                <Tooltip 
                  title={running ? "Search in progress..." : "Upload keywords file to begin search"}
                  arrow
                >
                  <span>
                    <Button
                      variant="contained"
                      disabled={running}
                      onClick={() => setOpen(true)}
                      startIcon={<Upload size={20} />}
                      sx={{
                        background: running 
                          ? "#cbd5e1" 
                          : "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                        color: "#fff",
                        px: 3,
                        py: 1.2,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: running 
                          ? "none" 
                          : "0 4px 16px rgba(37, 99, 235, 0.3)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: running ? "none" : "translateY(-2px)",
                          boxShadow: running 
                            ? "none" 
                            : "0 8px 24px rgba(37, 99, 235, 0.4)",
                        },
                        "&:disabled": {
                          background: "#cbd5e1",
                          color: "#94a3b8",
                        }
                      }}
                    >
                      Upload Keywords & Start Search
                    </Button>
                  </span>
                </Tooltip>
              </Box>

              {/* Success Snackbar */}
              <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert 
                  onClose={() => setShowSuccess(false)} 
                  severity="success"
                  sx={{ width: '100%' }}
                  icon={<CheckCircle size={20} />}
                >
                  {successMessage}
                </Alert>
              </Snackbar>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert 
                      severity="error"
                      action={
                        <IconButton
                          size="small"
                          onClick={() => setError(null)}
                          sx={{ color: "inherit" }}
                        >
                          <X size={18} />
                        </IconButton>
                      }
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Section */}
              <AnimatePresence>
                {running && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      sx={{ 
                        p: 3, 
                        mb: 4,
                        borderRadius: 3,
                        border: "1px solid #e0e7ff",
                        background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
                        boxShadow: "0 8px 24px rgba(37, 99, 235, 0.15)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Database size={24} color="#2563eb" />
                        </motion.div>
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
                            fontSize: "0.875rem",
                            height: 32,
                          }}
                        />
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
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Section */}
              {masterData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2,
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Search Results
                      </Typography>
                      <Badge 
                        badgeContent={masterData.length} 
                        color="primary"
                        max={9999}
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }
                        }}
                      >
                        <Chip 
                          label="Articles"
                          sx={{ 
                            bgcolor: "#e0e7ff",
                            color: "#2563eb",
                            fontWeight: 600,
                          }}
                        />
                      </Badge>
                      
                      {/* Filter Toggle */}
                      <Tooltip title={uniqueOnly ? "Showing unique records only" : "Showing all records"}>
                        <Chip
                          icon={<Filter size={14} />}
                          label={uniqueOnly ? "Unique Only" : "All Records"}
                          onClick={() => setUniqueOnly(!uniqueOnly)}
                          variant={uniqueOnly ? "filled" : "outlined"}
                          color={uniqueOnly ? "primary" : "default"}
                          sx={{ 
                            cursor: "pointer",
                            fontWeight: 600,
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        />
                      </Tooltip>

                      <Tooltip 
                        title="Click any row to view complete article details"
                        arrow
                      >
                        <Chip 
                          icon={<Info size={14} />}
                          label="Click to view details"
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: "#94a3b8",
                            color: "#64748b",
                          }}
                        />
                      </Tooltip>
                    </Box>
                    
                    {/* Export Button with Menu */}
                    <Box>
                      <Button
                        onClick={handleExportClick}
                        startIcon={<FileDown size={18} />}
                        endIcon={<MoreVertical size={16} />}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          borderWidth: 2,
                          "&:hover": {
                            borderWidth: 2,
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        Export Results
                      </Button>
                      <Menu
                        anchorEl={exportAnchor}
                        open={exportMenuOpen}
                        onClose={handleExportClose}
                        PaperProps={{
                          sx: {
                            borderRadius: 2,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            minWidth: 200,
                          }
                        }}
                      >
                        <MenuItem onClick={() => handleExport("unique")}>
                          <CheckCircle size={16} style={{ marginRight: 8 }} />
                          Unique Records
                        </MenuItem>
                        <MenuItem onClick={() => handleExport("all")}>
                          <Database size={16} style={{ marginRight: 8 }} />
                          All Records
                        </MenuItem>
                        <MenuItem onClick={() => handleExport("duplicates")}>
                          <AlertCircle size={16} style={{ marginRight: 8 }} />
                          Duplicates Only
                        </MenuItem>
                      </Menu>
                    </Box>
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
                      onRowClick={handleRowClick}
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
                        "& .MuiDataGrid-row": {
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        },
                        "& .MuiDataGrid-row:hover": {
                          bgcolor: "#f1f5f9",
                          transform: "scale(1.001)",
                        }
                      }}
                    />
                  </Card>
                </motion.div>
              )}

              {/* Empty State */}
              {masterData.length === 0 && !running && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      p: 8,
                      textAlign: "center",
                      borderRadius: 3,
                      border: "2px dashed #cbd5e1",
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <FileSearch size={64} color="#94a3b8" style={{ marginBottom: 16 }} />
                    </motion.div>
                    <Typography variant="h6" sx={{ color: "#64748b", mb: 1, fontWeight: 600 }}>
                      No literature data yet
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3 }}>
                      Upload keywords and start your literature search to see results
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setOpen(true)}
                      startIcon={<Upload size={18} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderWidth: 2,
                        "&:hover": {
                          borderWidth: 2,
                        }
                      }}
                    >
                      Get Started
                    </Button>
                  </Card>
                </motion.div>
              )}
            </div>
          </Fade>
        </Container>

        <LiteraturePopup
  open={open}
  onClose={() => setOpen(false)}
  file={file}
  onFileUpload={handleUpload}
  onSearch={handleSearch}
  running={running}
  progress={progress}

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
/>


        <LiteratureRecordModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          record={selectedRecord}
          onDelete={handleDeleteRecord}
          onUpdate={loadExistingData}
          projectId={PROJECT_ID}
        />
      </Box>
    </Layout>
  );
}