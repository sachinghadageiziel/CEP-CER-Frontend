import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Card,
  Fade,
  Zoom,
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
} from "@mui/material";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Filter,
  ArrowRight,
  Download,
  RefreshCw,
  Clock,
  Play,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";
import ResultTable from "../components/ResultTable";

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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

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
            article_id: r.article_id,  // PMID
            PMID: r.article_id,  // For backward compatibility
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
    } catch (err) {
      console.error("Error loading data:", err);
      showSnackbar("Failed to load screening results", "error");
    } finally {
      if (showRefresh) setIsRefreshing(false);
    }
  };

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

    // Progress simulation
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
  // UPDATE DECISION
  // -------------------------------
  const handleDecisionChange = async (displayId, newDecision, rationale = "") => {
    try {
      // Find the row to get the literature_id
      const targetRow = rows.find(r => 
        r.PMID === displayId || 
        r.article_id === displayId || 
        r.literature_id === displayId
      );
      
      if (!targetRow) {
        showSnackbar("Record not found", "error");
        return;
      }

      const formData = new FormData();
      formData.append("decision", newDecision);
      formData.append("rationale", rationale);

      const response = await fetch(
        `${API_BASE}/${PROJECT_ID}/${targetRow.literature_id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        setRows((prev) =>
          prev.map((r) =>
            r.literature_id === targetRow.literature_id
              ? { ...r, Decision: newDecision, decision: newDecision, Rationale: rationale, rationale: rationale } 
              : r
          )
        );
        showSnackbar("Decision updated successfully", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update decision");
      }
    } catch (error) {
      console.error("Error updating decision:", error);
      showSnackbar("Failed to update decision", "error");
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
      // Find the row to get the literature_id
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
  // STATS
  // -------------------------------
  const stats = useMemo(() => {
    const included = rows.filter((r) => r.Decision === "Include").length;
    const excluded = rows.filter((r) => r.Decision === "Exclude").length;
    const pending = rows.filter((r) => !r.Decision || r.Decision === "Pending").length;
    
    return { 
      total: rows.length, 
      included, 
      excluded, 
      pending,
      inclusionRate: rows.length > 0 ? ((included / rows.length) * 100).toFixed(1) : 0
    };
  }, [rows]);

  // -------------------------------
  // PAGINATION
  // -------------------------------
  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

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
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    border: "1px solid #e2e8f0",
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
                    {/* Background decoration */}
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
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          <Box
                            sx={{
                              width: 72,
                              height: 72,
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
                        </motion.div>
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
                              color: "rgba(255,255,255,0.9)",
                              fontWeight: 500,
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
                            Start Primary Screening
                          </Button>
                        ) : (
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
                            Export Results
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Progress Bar */}
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
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 360]
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
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
                                <Typography variant="body1" sx={{ fontWeight: 700, color: "#075985" }}>
                                  Processing Primary Screening
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#0c4a6e" }}>
                                  Analyzing articles against IFU criteria...
                                </Typography>
                              </Box>
                            </Box>
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
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
                        sm: "repeat(2, 1fr)", 
                        md: "repeat(5, 1fr)" 
                      },
                      gap: 3,
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
                        delay: 0
                      },
                      { 
                        label: "Included", 
                        value: stats.included, 
                        icon: CheckCircle, 
                        gradient: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
                        bgGradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                        delay: 0.15
                      },
                      { 
                        label: "Excluded", 
                        value: stats.excluded, 
                        icon: XCircle, 
                        gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                        bgGradient: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
                        delay: 0.3
                      },
                      { 
                        label: "Pending", 
                        value: stats.pending, 
                        icon: Clock, 
                        gradient: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
                        bgGradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                        delay: 0.45
                      },
                      { 
                        label: "Inclusion Rate", 
                        value: `${stats.inclusionRate}%`, 
                        icon: TrendingUp, 
                        gradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                        bgGradient: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
                        delay: 0.6
                      },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stat.delay, duration: 0.5 }}
                      >
                        <Card
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                            border: "1px solid #e2e8f0",
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
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Box
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    background: stat.gradient,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                                  }}
                                >
                                  <stat.icon size={24} color="#fff" />
                                </Box>
                              </motion.div>
                            </Box>
                            <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5, fontWeight: 600 }}>
                              {stat.label}
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: "#1e293b" }}>
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
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        border: "1px solid #e2e8f0",
                        overflow: "hidden",
                      }}
                    >
                      <Box 
                        sx={{ 
                          p: 3, 
                          background: "linear-gradient(135deg, #cffafe 0%, #e0f2fe 100%)",
                          borderBottom: "1px solid #a5f3fc",
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "#075985", mb: 0.5 }}>
                            Screening Results
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#0c4a6e" }}>
                            Click on any row to view details and make decisions
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ overflowX: "auto" }}>
                        <ResultTable
                          rows={pagedRows}
                          onDecisionChange={handleDecisionChange}
                          onDelete={handleDelete}
                          onRowClick={(row) =>
                            navigate(
                              `/project/${PROJECT_ID}/primary/article/${row.article_id || row.PMID}`,
                              { state: row }
                            )
                          }
                        />
                      </Box>

                      {/* Pagination */}
                      {rows.length > PAGE_SIZE && (
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
                          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                            Page {page} of {totalPages} • Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, rows.length)} of {rows.length} results
                          </Typography>
                          <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", sm: "flex-start" } }}>
                            <Button
                              disabled={page === 1}
                              onClick={() => setPage((p) => p - 1)}
                              variant="outlined"
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "#e2e8f0",
                                color: "#64748b",
                                "&:hover": {
                                  borderColor: "#cbd5e1",
                                  bgcolor: "#f8fafc",
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
                              disabled={page * PAGE_SIZE >= rows.length}
                              onClick={() => setPage((p) => p + 1)}
                              variant="contained"
                              endIcon={<ArrowRight size={18} />}
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
                        p: 8,
                        textAlign: "center",
                        borderRadius: 4,
                        border: "2px dashed #a5f3fc",
                        background: "linear-gradient(135deg, #f0fdfa 0%, #cffafe 100%)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          position: "absolute",
                          top: -60,
                          right: -60,
                          width: 200,
                          height: 200,
                          background: "rgba(14, 165, 233, 0.1)",
                          borderRadius: "50%",
                        }}
                      />
                      <Box
                        sx={{
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        <motion.div
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Box
                            sx={{
                              width: 96,
                              height: 96,
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
                        </motion.div>
                        <Typography variant="h5" sx={{ color: "#075985", mb: 1, fontWeight: 700 }}>
                          No screening data yet
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#0c4a6e", mb: 4, maxWidth: 500, mx: "auto" }}>
                          Start the primary screening process to analyze articles against your IFU criteria.
                          The system will automatically screen all literature based on your project's inclusion and exclusion criteria.
                        </Typography>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => setConfirmDialog(true)}
                            variant="contained"
                            startIcon={<Play size={20} />}
                            endIcon={<ArrowRight size={20} />}
                            sx={{
                              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                              px: 4,
                              py: 1.5,
                              borderRadius: 2,
                              fontWeight: 700,
                              textTransform: "none",
                              fontSize: "1rem",
                              boxShadow: "0 4px 16px rgba(14, 165, 233, 0.3)",
                              "&:hover": {
                                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 24px rgba(14, 165, 233, 0.4)",
                              }
                            }}
                          >
                            Start Primary Screening
                          </Button>
                        </motion.div>
                      </Box>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Fade>
        </Container>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog}
          onClose={() => setConfirmDialog(false)}
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
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRunScreening}
              variant="contained"
              startIcon={<Play size={18} />}
              sx={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
              }}
            >
              Start Screening
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
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