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
} from "@mui/material";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Filter,
  ArrowRight,
  Download,
  RefreshCw,
  Clock,
} from "lucide-react";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";
import ResultTable from "../components/ResultTable";
import PrimarySearchPopup from "../components/PrimaryPopup";

export default function PrimarySearchPage() {
  const { id: PROJECT_ID } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  // Popup state
  const [excelFile, setExcelFile] = useState(null);
  const [ifuFile, setIfuFile] = useState(null);
  const [inclusionCriteria, setInclusionCriteria] = useState("");
  const [exclusionCriteria, setExclusionCriteria] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  // -------------------------------
  // LOAD DATA
  // -------------------------------
  const loadData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    
    try {
      const response = await fetch(
        `http://localhost:5000/api/primary/existing?project_id=${PROJECT_ID}`
      );
      const data = await response.json();
      
      if (data?.masterSheet) {
        setRows(
          data.masterSheet.map((r, i) => ({
            id: i + 1,
            ...r,
          }))
        );
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      if (showRefresh) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [PROJECT_ID]);

  // -------------------------------
  // FILE HANDLERS
  // -------------------------------
  const handleExcelUpload = (file) => {
    console.log("Excel file selected:", file.name);
    setExcelFile(file);
  };

  const handleIfuUpload = (file) => {
    console.log("PDF file selected:", file.name);
    setIfuFile(file);
  };

  // -------------------------------
  // EXPORT HANDLER
  // -------------------------------
  const handleExport = () => {
    const url = `http://localhost:5000/api/primary/export?project_id=${PROJECT_ID}`;
    window.open(url, '_blank');
  };

  // -------------------------------
  // SEARCH HANDLER
  // -------------------------------
  const handleSearch = async () => {
    if (!excelFile || !ifuFile) {
      alert("Please upload both Excel and PDF files");
      return;
    }

    console.log("Starting primary screening...");
    setRunning(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("all_merged", excelFile);
    formData.append("ifu_pdf", ifuFile);
    formData.append("project_id", PROJECT_ID);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 1000);

    // Timeout handler
    const timeoutId = setTimeout(() => {
      clearInterval(progressInterval);
      setRunning(false);
      setProgress(0);
      alert("Request timeout. Please check backend logs.");
    }, 300000);

    try {
      const response = await fetch("http://localhost:5000/api/primary/run", {
        method: "POST",
        body: formData,
      });

      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      
      if (response.ok) {
        const data = await response.json();
        setProgress(100);
        
        setTimeout(async () => {
          await loadData();
          setExcelFile(null);
          setIfuFile(null);
          setInclusionCriteria("");
          setExclusionCriteria("");
          setOpen(false);
          setRunning(false);
          setProgress(0);
          alert("Primary screening completed successfully!");
        }, 500);
      } else {
        const errorText = await response.text();
        let errorMessage = "Search failed";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      console.error("Error during primary search:", error);
      alert(`An error occurred:\n\n${error.message}`);
    } finally {
      setRunning(false);
      setProgress(0);
    }
  };

  // -------------------------------
  // STATS
  // -------------------------------
  const included = useMemo(
    () => rows.filter((r) => r.Decision === "Include").length,
    [rows]
  );

  const excluded = useMemo(
    () => rows.filter((r) => r.Decision === "Exclude").length,
    [rows]
  );

  const pending = useMemo(
    () => rows.filter((r) => !r.Decision || r.Decision === "Pending").length,
    [rows]
  );

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

              {/* Header with gradient background */}
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
                              transform: "rotate(180deg)",
                            },
                            transition: "all 0.5s ease",
                          }}
                        >
                          <RefreshCw size={20} />
                        </IconButton>
                      </Tooltip>

                      <Button
                        onClick={() => setOpen(true)}
                        startIcon={<Upload size={20} />}
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
                        Import Documents
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Progress Bar */}
                {running && (
                  <Box 
                    sx={{ 
                      p: 3,
                      background: "linear-gradient(135deg, #cffafe 0%, #e0f2fe 100%)",
                      borderTop: "1px solid #a5f3fc",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: "pulse 2s ease-in-out infinite",
                            "@keyframes pulse": {
                              "0%, 100%": { transform: "scale(1)" },
                              "50%": { transform: "scale(1.05)" },
                            }
                          }}
                        >
                          <Filter size={20} color="#fff" />
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: "#075985" }}>
                            Processing Primary Screening
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#0c4a6e" }}>
                            This may take several minutes. Please don't close this window.
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={`${progress}%`}
                        sx={{
                          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: "1rem",
                          height: 36,
                          px: 1,
                        }}
                      />
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
                )}
              </Card>

              {/* Stats Cards */}
              <Box 
                sx={{ 
                  display: "grid",
                  gridTemplateColumns: { 
                    xs: "1fr", 
                    sm: "repeat(2, 1fr)", 
                    md: "repeat(4, 1fr)" 
                  },
                  gap: 3,
                  mb: 4,
                }}
              >
                <Zoom in timeout={600}>
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
                        background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                        borderRadius: "50%",
                        opacity: 0.5,
                      }}
                    />
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(14, 165, 233, 0.3)",
                          }}
                        >
                          <FileText size={24} color="#fff" />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5, fontWeight: 600 }}>
                        Total Reviewed
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#1e293b" }}>
                        {rows.length}
                      </Typography>
                    </Box>
                  </Card>
                </Zoom>

                <Zoom in timeout={750}>
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
                        background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                        borderRadius: "50%",
                        opacity: 0.5,
                      }}
                    />
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          <CheckCircle size={24} color="#fff" />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5, fontWeight: 600 }}>
                        Included
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#1e293b" }}>
                        {included}
                      </Typography>
                    </Box>
                  </Card>
                </Zoom>

                <Zoom in timeout={900}>
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
                        background: "linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)",
                        borderRadius: "50%",
                        opacity: 0.5,
                      }}
                    />
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)",
                          }}
                        >
                          <XCircle size={24} color="#fff" />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5, fontWeight: 600 }}>
                        Excluded
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#1e293b" }}>
                        {excluded}
                      </Typography>
                    </Box>
                  </Card>
                </Zoom>

                <Zoom in timeout={1050}>
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
                        background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                        borderRadius: "50%",
                        opacity: 0.5,
                      }}
                    />
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)",
                          }}
                        >
                          <Clock size={24} color="#fff" />
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5, fontWeight: 600 }}>
                        Pending
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#1e293b" }}>
                        {pending}
                      </Typography>
                    </Box>
                  </Card>
                </Zoom>
              </Box>

              {/* Results Table or Empty State */}
              {rows.length > 0 ? (
                <Fade in timeout={800}>
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
                          Click on any row to view details
                        </Typography>
                      </Box>
                      <Button
                        onClick={handleExport}
                        startIcon={<Download size={18} />}
                        variant="contained"
                        sx={{
                          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                          color: "#fff",
                          fontWeight: 600,
                          textTransform: "none",
                          px: 3,
                          py: 1,
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px rgba(14, 165, 233, 0.4)",
                          }
                        }}
                      >
                        Export Results
                      </Button>
                    </Box>

                    <Box sx={{ overflowX: "auto" }}>
                      <ResultTable
                        rows={pagedRows}
                        onDecisionChange={(pmid, next) => {
                          setRows((prev) =>
                            prev.map((r) =>
                              r.PMID === pmid ? { ...r, Decision: next } : r
                            )
                          );
                        }}
                        onRowClick={(row) =>
                          navigate(
                            `/project/${PROJECT_ID}/primary/article/${row.PMID}`,
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
                </Fade>
              ) : (
                <Fade in timeout={800}>
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
                    <Box
                      sx={{
                        position: "relative",
                        zIndex: 1,
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
                      <Typography variant="h5" sx={{ color: "#075985", mb: 1, fontWeight: 700 }}>
                        No screening data yet
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#0c4a6e", mb: 4, maxWidth: 500, mx: "auto" }}>
                        Upload your Excel file and IFU PDF to start the primary screening process. 
                        The system will analyze each article against your criteria.
                      </Typography>
                      <Button
                        onClick={() => setOpen(true)}
                        variant="contained"
                        startIcon={<Upload size={20} />}
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
                    </Box>
                  </Card>
                </Fade>
              )}
            </div>
          </Fade>
        </Container>

        <PrimarySearchPopup
          open={open}
          onClose={() => {
            if (!running) {
              setOpen(false);
              setExcelFile(null);
              setIfuFile(null);
            }
          }}
          excelFile={excelFile}
          onExcelUpload={handleExcelUpload}
          ifuFile={ifuFile}
          onIfuUpload={handleIfuUpload}
          inclusionCriteria={inclusionCriteria}
          setInclusionCriteria={setInclusionCriteria}
          exclusionCriteria={exclusionCriteria}
          setExclusionCriteria={setExclusionCriteria}
          onSearch={handleSearch}
          running={running}
          progress={progress}
        />
      </Box>
    </Layout>
  );
}