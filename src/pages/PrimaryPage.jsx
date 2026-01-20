import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Card,
  Fade,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Filter,
  ArrowRight,
  Download,
  RefreshCw,
  Play,
  AlertCircle,
  Search,
  Eye,
  Trash2,
  X,
  Upload,
  ArrowRightCircle,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

const API_BASE = "http://localhost:5000/api/primary";

export default function PrimarySearchPage() {
  const { id: PROJECT_ID } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDecision, setFilterDecision] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);

  // Real-time stats from API
  const [stats, setStats] = useState({
    total: 0,
    included: 0,
    excluded: 0,
  });

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  // -------------------------------
  // LOAD STATS FROM API
  // -------------------------------
  const loadStats = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/project-decision-count?project_id=${PROJECT_ID}`
      );
      const data = await response.json();

      if (data) {
        const decisionCounts = data.decision_counts || {};

        setStats({
          total: data.total || 0,
          included: decisionCounts.INCLUDE || decisionCounts.Include || 0,
          excluded: decisionCounts.EXCLUDE || decisionCounts.Exclude || 0,
        });
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  // -------------------------------
  // LOAD EXISTING DATA
  // -------------------------------
  const loadData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    
    try {
      const response = await fetch(`${API_BASE}/primary-screen?project_id=${PROJECT_ID}`);
      const data = await response.json();
      
      if (data?.exists && data?.data?.length > 0) {
        setHasExistingData(true);
        setRows(
          data.data.map((r, i) => ({
            id: i + 1,
            literature_id: r.literature_id,
            article_id: r.article_id,
            PMID: r.article_id,
            title: r.title,
            abstract: r.abstract,
            Decision: r.decision,
            decision: r.decision,
            ExclusionCriteria: r.exclusion_criteria,
            exclusion_criteria: r.exclusion_criteria,
            Rationale: r.rationale,
            rationale: r.rationale,
          }))
        );
      } else {
        setHasExistingData(false);
        setRows([]);
      }

      await loadStats();
    } catch (err) {
      console.error("Error loading data:", err);
      showSnackbar("Failed to load screening results", "error");
    } finally {
      if (showRefresh) setIsRefreshing(false);
    }
  };
const [downloadingPDFs, setDownloadingPDFs] = useState(false);

  useEffect(() => {
    loadData();
  }, [PROJECT_ID]);

  // -------------------------------
  // RUN PRIMARY SCREENING
  // -------------------------------
  const handleRunScreening = async () => {
    setConfirmDialog(false);
    setRunning(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 1500);

    const formData = new FormData();
    formData.append("project_id", PROJECT_ID);

    try {
      const response = await fetch(`${API_BASE}/primary-screen`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      
      if (response.ok) {
        const data = await response.json();
        setProgress(100);
        
        setTimeout(async () => {
          await loadData();
          setRunning(false);
          setProgress(0);
          showSnackbar(`Successfully screened ${data.screened_articles} articles!`, "success");
        }, 500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Screening failed");
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error during screening:", error);
      showSnackbar(error.message, "error");
      setRunning(false);
      setProgress(0);
    }
  };

  // -------------------------------
  // EXPORT HANDLER
  // -------------------------------
  const handleExport = () => {
    const url = `${API_BASE}/export-primary-screen?project_id=${PROJECT_ID}`;
    window.open(url, '_blank');
    showSnackbar("Exporting screening results...", "info");
  };

  // -------------------------------
  // UPLOAD FILE HANDLER
  // -------------------------------
  const handleFileUpload = async () => {
    if (!selectedFile) {
      showSnackbar("Please select a file first", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("project_id", PROJECT_ID);

    try {
      const response = await fetch(`${API_BASE}/upload-screening-file`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        showSnackbar("File uploaded successfully!", "success");
        setUploadDialog(false);
        setSelectedFile(null);
        await loadData();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showSnackbar("File upload failed. Please try again.", "error");
    }
  };

  // -------------------------------
  // DELETE RECORD
  // -------------------------------
  const handleDelete = async (displayId) => {
    if (!window.confirm("Are you sure you want to delete this screening record?")) {
      return;
    }

    try {
      const targetRow = rows.find(r => 
        r.PMID === displayId || 
        r.article_id === displayId || 
        r.literature_id === displayId
      );
      
      if (!targetRow) {
        showSnackbar("Record not found", "error");
        return;
      }

      const response = await fetch(
        `${API_BASE}/${PROJECT_ID}/${targetRow.literature_id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setRows((prev) => prev.filter((r) => r.literature_id !== targetRow.literature_id));
        await loadStats();
        showSnackbar("Record deleted successfully", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      showSnackbar("Failed to delete record", "error");
    }
  };

  // -------------------------------
  // SNACKBAR
  // -------------------------------
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // -------------------------------
  // FILTERING
  // -------------------------------
  const filteredRows = useMemo(() => {
    let filtered = rows;
    
    if (searchTerm) {
      filtered = filtered.filter(row => 
        row.PMID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.abstract?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterDecision !== "all") {
      filtered = filtered.filter(row => row.decision === filterDecision);
    }
    
    return filtered;
  }, [rows, searchTerm, filterDecision]);

  // -------------------------------
  // PAGINATION
  // -------------------------------
  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);

  // -------------------------------
  // NAVIGATE TO SECONDARY SCREENING
  // -------------------------------
 const handleStartSecondaryScreening = async () => {
  try {
    setDownloadingPDFs(true);
    showSnackbar("Preparing PDFs for secondary screening...", "info");

    const res = await fetch(
      `http://localhost:5000/api/secondary/download-pdfs/${PROJECT_ID}`,
      { method: "POST" }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "PDF download failed");
    }

    showSnackbar("PDF preparation started successfully", "success");

    // Small delay for UX smoothness
    setTimeout(() => {
      navigate(`/project/${PROJECT_ID}/secondary`);
    }, 800);

  } catch (error) {
    console.error(error);
    showSnackbar(error.message, "error");
  } finally {
    setDownloadingPDFs(false);
  }
};


  return (
    <Layout>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 4 }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in timeout={600}>
            <div>
              <BreadcrumbsBar
                items={[
                  { label: "Home", to: "/" },
                  { label: "Project", to: `/project/${PROJECT_ID}` },
                  { label: "Primary Screening" },
                ]}
              />

              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  sx={{
                    mb: 4,
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 10px 40px rgba(14, 165, 233, 0.15)",
                    border: "1px solid #e0f2fe",
                  }}
                >
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                      p: 4,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: -60,
                        right: -60,
                        width: 300,
                        height: 300,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "50%",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -40,
                        left: -40,
                        width: 200,
                        height: 200,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "50%",
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
                        gap: 3,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Box
                          sx={{
                            width: { xs: 56, md: 72 },
                            height: { xs: 56, md: 72 },
                            borderRadius: 3,
                            bgcolor: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Filter color="#fff" size={36} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 800,
                              color: "#fff",
                              fontSize: { xs: "1.5rem", md: "2rem" },
                              mb: 0.5,
                            }}
                          >
                            Primary Screening
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: "rgba(255,255,255,0.95)",
                              fontWeight: 500,
                              fontSize: { xs: "0.875rem", md: "1rem" },
                            }}
                          >
                            Review and screen literature based on inclusion criteria
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <Tooltip title="Refresh data">
                          <IconButton
                            onClick={() => loadData(true)}
                            disabled={running || isRefreshing}
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              backdropFilter: "blur(10px)",
                              color: "#fff",
                              "&:hover": {
                                bgcolor: "rgba(255,255,255,0.3)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <motion.div
                              animate={isRefreshing ? { rotate: 360 } : {}}
                              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                            >
                              <RefreshCw size={20} />
                            </motion.div>
                          </IconButton>
                        </Tooltip>

                        {!hasExistingData ? (
                          <Button
                            onClick={() => setConfirmDialog(true)}
                            startIcon={<Play size={20} />}
                            disabled={running}
                            sx={{
                              bgcolor: "#fff",
                              color: "#0ea5e9",
                              px: 3,
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: 700,
                              textTransform: "none",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                              "&:hover": {
                                bgcolor: "#fff",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                              },
                              "&:disabled": {
                                bgcolor: "rgba(255,255,255,0.5)",
                                color: "rgba(14,165,233,0.5)",
                              }
                            }}
                          >
                            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                              Start Primary Screening
                            </Box>
                            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                              Start
                            </Box>
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => setUploadDialog(true)}
                              startIcon={<Upload size={20} />}
                              sx={{
                                bgcolor: "#fff",
                                color: "#0ea5e9",
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 700,
                                textTransform: "none",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                "&:hover": {
                                  bgcolor: "#fff",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                },
                              }}
                            >
                              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                                Upload File
                              </Box>
                              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                                Upload
                              </Box>
                            </Button>
                            <Button
                              onClick={handleExport}
                              startIcon={<Download size={20} />}
                              sx={{
                                bgcolor: "#fff",
                                color: "#0ea5e9",
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 700,
                                textTransform: "none",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                "&:hover": {
                                  bgcolor: "#fff",
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                },
                              }}
                            >
                              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                                Export Results
                              </Box>
                              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                                Export
                              </Box>
                            </Button>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Enhanced Progress Bar */}
                  <AnimatePresence>
                    {running && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Box 
                          sx={{ 
                            p: 3,
                            background: "linear-gradient(135deg, #cffafe 0%, #e0f2fe 100%)",
                            borderTop: "1px solid #a5f3fc",
                          }}
                        >
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Filter size={20} color="#fff" />
                                </Box>
                              </motion.div>
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 700, color: "#075985", fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                                  Processing Primary Screening
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#0c4a6e", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                  Analyzing articles against IFU criteria...
                                </Typography>
                              </Box>
                            </Box>
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Chip 
                                label={`${Math.round(progress)}%`}
                                sx={{
                                  background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                  color: "#fff",
                                  fontWeight: 800,
                                  fontSize: "1rem",
                                  height: 36,
                                  px: 1,
                                }}
                              />
                            </motion.div>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={progress}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              bgcolor: "rgba(14, 165, 233, 0.2)",
                              "& .MuiLinearProgress-bar": {
                                background: "linear-gradient(90deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
                                borderRadius: 5,
                              }
                            }}
                          />
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>

              {/* Stats Cards */}
              <AnimatePresence>
                {hasExistingData && (
                  <Box 
                    sx={{ 
                      display: "grid",
                      gridTemplateColumns: { 
                        xs: "1fr", 
                        sm: "repeat(3, 1fr)", 
                      },
                      gap: { xs: 2, md: 3 },
                      mb: 4,
                    }}
                  >
                    {[
                      { 
                        label: "Total Reviewed", 
                        value: stats.total, 
                        icon: FileText, 
                        gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                        bgGradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                      },
                      { 
                        label: "Included", 
                        value: stats.included, 
                        icon: CheckCircle, 
                        gradient: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
                        bgGradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                      },
                      { 
                        label: "Excluded", 
                        value: stats.excluded, 
                        icon: XCircle, 
                        gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                        bgGradient: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
                      },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                      >
                        <Card
                          sx={{
                            p: { xs: 2, md: 3 },
                            borderRadius: 3,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                            border: "1px solid #e0f2fe",
                            transition: "all 0.3s ease",
                            position: "relative",
                            overflow: "hidden",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 12px 48px rgba(0,0,0,0.12)",
                            }
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: -20,
                              right: -20,
                              width: 100,
                              height: 100,
                              background: stat.bgGradient,
                              borderRadius: "50%",
                              opacity: 0.5,
                            }}
                          />
                          <Box sx={{ position: "relative", zIndex: 1 }}>
                            <Box
                              sx={{
                                width: { xs: 40, md: 48 },
                                height: { xs: 40, md: 48 },
                                borderRadius: 2,
                                background: stat.gradient,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                                mb: 2,
                              }}
                            >
                              <stat.icon size={24} color="#fff" />
                            </Box>
                            <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5, fontWeight: 600, fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                              {stat.label}
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: "#1e293b", fontSize: { xs: "1.5rem", md: "2rem" } }}>
                              {stat.value}
                            </Typography>
                          </Box>
                        </Card>
                      </motion.div>
                    ))}
                  </Box>
                )}
              </AnimatePresence>

              {/* Results Table or Empty State */}
              <AnimatePresence mode="wait">
                {hasExistingData ? (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: "0 10px 40px rgba(14, 165, 233, 0.15)",
                        border: "1px solid #e0f2fe",
                        overflow: "hidden",
                      }}
                    >
                      {/* Filter Bar */}
                      <Box 
                        sx={{ 
                          p: { xs: 2, md: 3 },
                          background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)",
                          borderBottom: "1px solid #bae6fd",
                        }}
                      >
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                          <TextField
                            placeholder="Search by PMID, title, or abstract..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            sx={{
                              flex: 1,
                              bgcolor: "#fff",
                              borderRadius: 2,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              }
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search size={20} color="#64748b" />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 200 } }}>
                            <Select
                              value={filterDecision}
                              onChange={(e) => setFilterDecision(e.target.value)}
                              sx={{
                                bgcolor: "#fff",
                                borderRadius: 2,
                              }}
                            >
                              <MenuItem value="all">All Decisions</MenuItem>
                              <MenuItem value="Include">Include</MenuItem>
                              <MenuItem value="Exclude">Exclude</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>

                      {/* Table */}
                      <TableContainer>
                        <Table>
                          <TableHead sx={{ bgcolor: "#f8fafc" }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", fontSize: "0.75rem" }}>PMID</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", fontSize: "0.75rem", display: { xs: "none", lg: "table-cell" } }}>Abstract</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", fontSize: "0.75rem" }}>Decision</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", fontSize: "0.75rem", display: { xs: "none", md: "table-cell" } }}>Rationale</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", fontSize: "0.75rem", display: { xs: "none", xl: "table-cell" } }}>Exclusion Criteria</TableCell>
                              <TableCell sx={{ fontWeight: 700, color: "#475569", textTransform: "uppercase", fontSize: "0.75rem" }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pagedRows.map((row) => (
                              <TableRow 
                                key={row.id}
                                sx={{
                                  "&:hover": {
                                    bgcolor: "#eff6ff",
                                  },
                                  transition: "background-color 0.2s ease",
                                }}
                              >
                                <TableCell>
                                  <Typography sx={{ fontFamily: "monospace", fontSize: "0.875rem", fontWeight: 600, color: "#0284c7" }}>
                                    {row.PMID}
                                  </Typography>
                                  <Typography sx={{ fontSize: "0.75rem", color: "#64748b", display: { xs: "block", lg: "none" }, mt: 0.5 }}>
                                    {row.title?.substring(0, 50)}...
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ display: { xs: "none", lg: "table-cell" }, maxWidth: 400 }}>
                                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                                    {row.title}
                                  </Typography>
                                  <Typography sx={{ fontSize: "0.75rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                    {row.abstract}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={row.decision || "Pending"}
                                    size="small"
                                    sx={{
                                      fontWeight: 700,
                                      bgcolor: row.decision === "Include" ? "#dcfce7" : row.decision === "Exclude" ? "#fee2e2" : "#fef3c7",
                                      color: row.decision === "Include" ? "#15803d" : row.decision === "Exclude" ? "#b91c1c" : "#a16207",
                                      borderRadius: 2,
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ display: { xs: "none", md: "table-cell" }, maxWidth: 300 }}>
                                  <Typography sx={{ fontSize: "0.75rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                    {row.rationale || "—"}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ display: { xs: "none", xl: "table-cell" } }}>
                                  <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                                    {row.exclusion_criteria || "None"}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", gap: 1 }}>
                                    <Tooltip title="View Details">
                                      <IconButton
                                        size="small"
                                        onClick={() => navigate(`/project/${PROJECT_ID}/primary/article/${row.article_id || row.PMID}`, { state: row })}
                                        sx={{
                                          color: "#0284c7",
                                          "&:hover": { bgcolor: "#eff6ff" }
                                        }}
                                      >
                                        <Eye size={18} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(row.PMID);
                                        }}
                                        sx={{
                                          color: "#dc2626",
                                          "&:hover": { bgcolor: "#fef2f2" }
                                        }}
                                      >
                                        <Trash2 size={18} />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <Box 
                          sx={{ 
                            p: 3, 
                            display: "flex", 
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { xs: "stretch", sm: "center" },
                            gap: 2,
                            bgcolor: "#f8fafc",
                            borderTop: "1px solid #e2e8f0",
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                            Page {page} of {totalPages} • Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredRows.length)} of {filteredRows.length} results
                          </Typography>
                          <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", sm: "flex-start" } }}>
                            <Button
                              disabled={page === 1}
                              onClick={() => setPage((p) => p - 1)}
                              variant="outlined"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "#cbd5e1",
                                color: "#64748b",
                                "&:hover": {
                                  borderColor: "#0284c7",
                                  bgcolor: "#eff6ff",
                                },
                                "&:disabled": {
                                  borderColor: "#f1f5f9",
                                  color: "#cbd5e1",
                                }
                              }}
                            >
                              Previous
                            </Button>
                            <Button
                              disabled={page >= totalPages}
                              onClick={() => setPage((p) => p + 1)}
                              variant="contained"
                              size="small"
                              endIcon={<ArrowRight size={16} />}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                                boxShadow: "0 4px 16px rgba(14, 165, 233, 0.3)",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                                  boxShadow: "0 6px 24px rgba(14, 165, 233, 0.4)",
                                },
                                "&:disabled": {
                                  background: "#e2e8f0",
                                  color: "#94a3b8",
                                }
                              }}
                            >
                              Next
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Card>

                   {/* Secondary Screening CTA - Sticky Bottom Right */}
{stats.included > 0 && (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    style={{
      position: "fixed",
      bottom: 32,
      right: 32,
      zIndex: 1000,
    }}
  >
    <Tooltip
      title={
        downloadingPDFs
          ? "Preparing PDFs for secondary screening..."
          : `${stats.included} articles ready for full-text review`
      }
      placement="left"
    >
      {/* Tooltip requires span when button can be disabled */}
      <span>
        <Button
          onClick={handleStartSecondaryScreening}
          disabled={downloadingPDFs}
          variant="contained"
          endIcon={
            downloadingPDFs ? <RefreshCw size={20} /> : <ChevronRight size={24} />
          }
          sx={{
            background: downloadingPDFs
              ? "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)"
              : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            px: 4,
            py: 2,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: "0 8px 32px rgba(16, 185, 129, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": downloadingPDFs
              ? {}
              : {
                  background:
                    "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  transform: "translateY(-4px) scale(1.02)",
                  boxShadow:
                    "0 12px 48px rgba(16, 185, 129, 0.5)",
                },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              mr: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: "0.7rem", opacity: 0.9, lineHeight: 1 }}
            >
              Next Step
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1rem", fontWeight: 800, lineHeight: 1.2 }}
            >
              {downloadingPDFs ? "Preparing PDFs..." : "Secondary Screening"}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: 1,
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: "0.875rem" }}>
              {stats.included}
            </Typography>
          </Box>
        </Button>
      </span>
    </Tooltip>
  </motion.div>
)}

                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      sx={{
                        p: { xs: 6, md: 8 },
                        textAlign: "center",
                        borderRadius: 4,
                        border: "2px dashed #bae6fd",
                        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                        boxShadow: "0 10px 40px rgba(55, 66, 71, 0.15)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: -60,
                          right: -60,
                          width: 200,
                          height: 200,
                          background: "rgba(14, 165, 233, 0.1)",
                          borderRadius: "50%",
                        }}
                      />
                      <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Box
                          sx={{
                            width: { xs: 80, md: 96 },
                            height: { xs: 80, md: 96 },
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                            boxShadow: "0 8px 32px rgba(14, 165, 233, 0.3)",
                          }}
                        >
                          <Filter size={48} color="#fff" />
                        </Box>
                        <Typography variant="h5" sx={{ color: "#075985", mb: 1, fontWeight: 700, fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
                          No screening data yet
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#0c4a6e", mb: 4, maxWidth: 500, mx: "auto", fontSize: { xs: "0.875rem", md: "1rem" } }}>
                          Start the primary screening process to analyze articles against your IFU criteria.
                          The system will automatically screen all literature based on your project's inclusion and exclusion criteria.
                        </Typography>
                        <Button
                          onClick={() => setConfirmDialog(true)}
                          variant="contained"
                          startIcon={<Play size={20} />}
                          endIcon={<ArrowRight size={20} />}
                          disabled={running}
                          sx={{
                            background: running ? "#94a3b8" : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: "none",
                            fontSize: "1rem",
                            boxShadow: "0 4px 16px rgba(14, 165, 233, 0.3)",
                            "&:hover": running ? {} : {
                              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 24px rgba(14, 165, 233, 0.4)",
                            },
                            "&:disabled": {
                              background: "#94a3b8",
                              color: "#e2e8f0",
                            }
                          }}
                        >
                          {running ? "Processing..." : "Start Primary Screening"}
                        </Button>
                      </Box>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Fade>
        </Container>

        {/* Dialogs */}
        <Dialog
          open={confirmDialog}
          onClose={() => !running && setConfirmDialog(false)}
          disableRestoreFocus
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: { xs: "90%", sm: 400 },
            }
          }}
        >
          <DialogTitle sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            color: "#92400e",
            fontWeight: 700,
          }}>
            <AlertCircle size={24} />
            Start Primary Screening?
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              This will analyze all literature in your project against the IFU criteria stored in the database.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              The screening process may take several minutes depending on the number of articles. 
              You can continue working while the screening runs in the background.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setConfirmDialog(false)}
              disabled={running}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRunScreening}
              disabled={running}
              variant="contained"
              startIcon={<Play size={18} />}
              sx={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                "&:disabled": {
                  background: "#94a3b8",
                }
              }}
            >
              {running ? "Processing..." : "Start Screening"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={uploadDialog}
          onClose={() => setUploadDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
            }
          }}
        >
          <DialogTitle sx={{ 
            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
            color: "#fff",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
            <Upload size={24} />
            Upload Screening File
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Upload a file containing screening results to update or add new records.
            </Alert>
            <Box
              sx={{
                border: "2px dashed #bae6fd",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                bgcolor: "#f0f9ff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#0ea5e9",
                  bgcolor: "#e0f2fe",
                }
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <Upload size={48} color="#0ea5e9" style={{ marginBottom: 16 }} />
              <Typography variant="body1" sx={{ fontWeight: 600, color: "#075985", mb: 1 }}>
                {selectedFile ? selectedFile.name : "Click to select file"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Supported formats: CSV, Excel
              </Typography>
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
            <Button 
              onClick={() => {
                setUploadDialog(false);
                setSelectedFile(null);
              }}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleFileUpload}
              variant="contained"
              disabled={!selectedFile}
              sx={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                "&:disabled": {
                  background: "#e2e8f0",
                  color: "#94a3b8",
                }
              }}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}