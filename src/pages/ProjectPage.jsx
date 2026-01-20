import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Container,
  Fade,
  Zoom,
  Chip,
  CircularProgress,
  Alert,
  Backdrop,
  LinearProgress,
} from "@mui/material";
import { ArrowRight, FileSearch, Filter, ClipboardCheck, Lock, CheckCircle2, Clock, Download } from "lucide-react";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

export default function ProjectPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const project = location.state?.project;

  const [loading, setLoading] = useState(true);
  const [downloadingPDFs, setDownloadingPDFs] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState("");
  const [counts, setCounts] = useState({
    literature: 0,
    primary: 0,
    secondary: 0,
  });
  const [stepStatus, setStepStatus] = useState({
    literature: "not_started",
    primary: "locked",
    secondary: "locked",
  });

  // Fetch counts for all stages
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const [litRes, primaryRes, secondaryRes] = await Promise.all([
          fetch(`http://localhost:5000/api/literature/project-counts?project_id=${id}`),
          fetch(`http://localhost:5000/api/primary/project-count?project_id=${id}`),
          fetch(`http://localhost:5000/api/secondary/project-count?project_id=${id}`),
        ]);

        const litData = await litRes.json();
        const primaryData = await primaryRes.json();
        const secondaryData = await secondaryRes.json();

        const literatureCount = litData[0]?.total_literature_count || 0;
        const primaryCount = primaryData?.total_primary_screening_count || 0;
        const secondaryCount = secondaryData?.total_secondary_screening_count || 0;

        setCounts({
          literature: literatureCount,
          primary: primaryCount,
          secondary: secondaryCount,
        });

        // Determine step status based on counts
        let newStatus = {
          literature: literatureCount > 0 ? "completed" : "ready_to_start",
          primary: literatureCount > 0 ? (primaryCount > 0 ? "completed" : "ready_to_start") : "pending",
          secondary: primaryCount > 0 ? (secondaryCount > 0 ? "completed" : "ready_to_start") : "pending",
        };

        setStepStatus(newStatus);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching counts:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchCounts();
    }
  }, [id]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          color: "#198754",
          bgColor: "#d1e7dd",
          icon: CheckCircle2,
        };
      case "ready_to_start":
        return {
          label: "Ready to Start",
          color: "#0d6efd",
          bgColor: "#cfe2ff",
          icon: Clock,
        };
      case "pending":
        return {
          label: "Pending",
          color: "#ffc107",
          bgColor: "#fff3cd",
          icon: Clock,
        };
      default:
        return {
          label: "Not Started",
          color: "#6c757d",
          bgColor: "#e9ecef",
          icon: Clock,
        };
    }
  };

  const steps = [
    {
      title: "Literature Search",
      subtitle: "Find and collect research papers",
      description: "Search databases like PubMed, Cochrane, and Google Scholar to gather relevant research articles",
      userFriendly: "Upload your search keywords and let us find all relevant research papers for you",
      path: "literature",
      icon: FileSearch,
      gradient: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
      bgGradient: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
      iconBg: "#BBDEFB",
      processed: counts.literature,
      status: stepStatus.literature,
      countLabel: "Articles Found",
    },
    {
      title: "Primary Screening",
      subtitle: "Quick review of paper summaries",
      description: "Review abstracts to decide which papers are relevant for your research",
      userFriendly: "Read short summaries and select papers that match your research topic",
      path: "primary",
      icon: Filter,
      gradient: "linear-gradient(135deg, #FB8C00 0%, #EF6C00 100%)",
      bgGradient: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)",
      iconBg: "#FFE0B2",
      processed: counts.primary,
      status: stepStatus.primary,
      countLabel: "Articles Screened",
    },
    {
      title: "Secondary Screening",
      subtitle: "Detailed review of full papers",
      description: "Read complete papers and assess their quality for final inclusion",
      userFriendly: "Review full papers in detail and make final decisions on which to include",
      path: "secondary",
      icon: ClipboardCheck,
      gradient: "linear-gradient(135deg, #43A047 0%, #2E7D32 100%)",
      bgGradient: "linear-gradient(135deg, #C8E6C9 0%, #A5D6A7 100%)",
      iconBg: "#C8E6C9",
      processed: counts.secondary,
      status: stepStatus.secondary,
      countLabel: "Articles Reviewed",
    },
  ];

  const handleStepClick = async (step) => {
    if (step.status === "pending") {
      return; // Don't navigate if pending
    }

    // Special handling for Secondary Screening - check PDF status first
    if (step.path === "secondary") {
      try {
        setDownloadingPDFs(true);
        setDownloadProgress("Checking PDF availability...");

        // Check if PDFs are already downloaded
        const statusResponse = await fetch(`http://localhost:5000/api/secondary/pdf-status/${id}`);
        
        if (!statusResponse.ok) {
          throw new Error('Failed to check PDF status');
        }

        const statusData = await statusResponse.json();
        const totalPDFs = statusData.total || 0;
        const pdfExists = statusData.exists || false;

        // If PDFs already exist (total > 0 and exists is true), navigate directly
        if (pdfExists && totalPDFs > 0) {
          setDownloadProgress(`Found ${totalPDFs} PDF${totalPDFs !== 1 ? 's' : ''} already available. Opening interface...`);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setDownloadingPDFs(false);
          setDownloadProgress("");
          
          navigate(`/project/${id}/secondary`, {
            state: { project },
          });
          return;
        }

        // If no PDFs exist (total <= 0 or exists is false), download them
        setDownloadProgress("No PDFs found. Starting download process...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setDownloadProgress("Fetching research papers from database...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setDownloadProgress("Downloading PDF files for full-text review...");

        const response = await fetch(`http://localhost:5000/api/secondary/download-pdfs/${id}`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to download PDFs');
        }

        const data = await response.json();
        const downloadedCount = data.downloaded || 0;
        
        setDownloadProgress(`✅ Successfully downloaded ${downloadedCount} research paper${downloadedCount !== 1 ? 's' : ''}!`);

        await new Promise(resolve => setTimeout(resolve, 1200));
        
        setDownloadProgress("Opening Secondary Screening interface...");
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setDownloadingPDFs(false);
        setDownloadProgress("");
        
        navigate(`/project/${id}/secondary`, {
          state: { project },
        });

      } catch (error) {
        console.error("Error in Secondary Screening:", error);
        setDownloadProgress("❌ Failed to process. Please check your connection and try again.");
        setTimeout(() => {
          setDownloadingPDFs(false);
          setDownloadProgress("");
        }, 3000);
      }
    } else {
      // For other steps, navigate directly
      navigate(`/project/${id}/${step.path}`, {
        state: { project },
      });
    }
  };

  // Function to determine which alert to show
  const getProgressAlert = () => {
    const { literature, primary, secondary } = counts;

    // All completed
    if (literature > 0 && primary > 0 && secondary > 0) {
      return (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            border: "2px solid #C8E6C9",
            bgcolor: "#E8F5E9",
            "& .MuiAlert-icon": {
              color: "#2E7D32"
            }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#1B5E20", mb: 0.5 }}>
           systematic literature review is complete.
          </Typography>
          <Typography variant="body2" sx={{ color: "#2E7D32", fontWeight: 500 }}>
            Review Journey: Started with {literature} articles → Screened {primary} abstracts → Final selection of {secondary} quality-reviewed papers ready for analysis.
          </Typography>
        </Alert>
      );
    }

    // Literature and Primary completed, Secondary pending
    if (literature > 0 && primary > 0 && secondary === 0) {
      return (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            border: "2px solid #FFE0B2",
            bgcolor: "#FFF3E0",
            "& .MuiAlert-icon": {
              color: "#EF6C00"
            }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#E65100", mb: 0.5 }}>
             Primary Screening complete - {primary} Articles selected for Secondary Screening.
          </Typography>
          <Typography variant="body2" sx={{ color: "#EF6C00", fontWeight: 500 }}>
            Final Step: Click "Start Workflow" on Secondary Screening to download full PDFs and begin detailed quality review.
          </Typography>
        </Alert>
      );
    }

    // Only Literature completed
    if (literature > 0 && primary === 0 && secondary === 0) {
      return (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            border: "2px solid #BBDEFB",
            bgcolor: "#E3F2FD",
            "& .MuiAlert-icon": {
              color: "#1565C0"
            }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#0D47A1", mb: 0.5 }}>
            Literature Search completed successfully with {literature} research articles.
          </Typography>
          <Typography variant="body2" sx={{ color: "#1565C0", fontWeight: 500 }}>
            What's Next: Click "Start Workflow" on Primary Screening below to review article abstracts and select relevant papers.
          </Typography>
        </Alert>
      );
    }

    return null;
  };

  return (
    <Layout>
      {/* PDF Download Loading Backdrop */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
        }}
        open={downloadingPDFs}
      >
        <Box
          sx={{
            textAlign: 'center',
            bgcolor: '#fff',
            borderRadius: 4,
            p: 5,
            minWidth: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.1)', opacity: 0.8 },
              },
            }}
          >
            <Download size={40} color="#fff" strokeWidth={2.5} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: '#1e293b',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Preparing Research Papers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              mb: 3,
              fontWeight: 500,
            }}
          >
            {downloadProgress}
          </Typography>
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#E8F5E9',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: '#94a3b8',
              mt: 2,
              display: 'block',
              fontWeight: 500,
            }}
          >
            Please wait while we prepare your documents...
          </Typography>
        </Box>
      </Backdrop>

      <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7FA" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in timeout={600}>
            <div>
              <BreadcrumbsBar
                items={[
                  { label: "Home", to: "/" },
                  { label: "Project" },
                ]}
              />

              {/* Project Header */}
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      color: "#1e293b",
                      fontSize: { xs: "1.75rem", md: "2.5rem" }
                    }}
                  >
                    {project?.title || "Research Project"}
                  </Typography>
                  <Chip 
                    label={project?.status || "Active"}
                    sx={{
                      background: "linear-gradient(135deg, #43A047 0%, #2E7D32 100%)",
                      color: "#fff",
                      fontWeight: 600,
                      height: 32,
                      boxShadow: "0 2px 8px rgba(67, 160, 71, 0.3)",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                      Owner:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                      {project?.owner || "Not specified"}
                    </Typography>
                  </Box>
                  {project?.start_date && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                        Start Date:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                        {new Date(project.start_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Progress Summary Alert - Dynamic based on workflow stage */}
              {getProgressAlert()}

              {/* Workflow Steps */}
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                mb: 4,
                pb: 2,
                borderBottom: "3px solid #E0E7FF"
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  Research Workflow
                </Typography>
                <Box 
                  sx={{ 
                    background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    boxShadow: "0 2px 8px rgba(30, 136, 229, 0.25)"
                  }}
                >
                  3 Steps
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    },
                    gap: 3,
                  }}
                >
                  {steps.map((step, index) => {
                    const statusConfig = getStatusConfig(step.status);
                    const isPending = step.status === "pending";
                    const StatusIcon = statusConfig.icon;

                    return (
                      <Zoom in timeout={700 + index * 150} key={step.path}>
                        <Card
                          onClick={() => handleStepClick(step)}
                          sx={{
                            borderRadius: 4,
                            p: 3,
                            minHeight: 480,
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: isPending 
                              ? "0 2px 8px rgba(0,0,0,0.04)" 
                              : "0 4px 20px rgba(0,0,0,0.08)",
                            border: `2px solid ${isPending ? "#e9ecef" : step.iconBg}`,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            cursor: isPending ? "not-allowed" : "pointer",
                            position: "relative",
                            overflow: "hidden",
                            bgcolor: isPending ? "#f8f9fa" : "#fff",
                            opacity: isPending ? 0.7 : 1,
                            "&:hover": isPending ? {} : {
                              transform: "translateY(-8px)",
                              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                              borderColor: step.gradient.includes('#1E88E5') ? '#1E88E5' : 
                                          step.gradient.includes('#FB8C00') ? '#FB8C00' : '#43A047',
                              "& .arrow-icon": {
                                transform: "translateX(4px)",
                              },
                              "& .step-bg": {
                                transform: "scale(1.15) rotate(10deg)",
                                opacity: 0.5,
                              }
                            },
                          }}
                        >
                          {/* Status Badge */}
                          <Chip
                            icon={<StatusIcon size={14} />}
                            label={statusConfig.label}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 16,
                              right: 16,
                              zIndex: 2,
                              bgcolor: statusConfig.bgColor,
                              color: statusConfig.color,
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              border: `1.5px solid ${statusConfig.color}`,
                              "& .MuiChip-icon": {
                                color: statusConfig.color,
                              }
                            }}
                          />

                          {/* Background decoration */}
                          <Box
                            className="step-bg"
                            sx={{
                              position: "absolute",
                              top: -50,
                              right: -50,
                              width: 220,
                              height: 220,
                              background: step.bgGradient,
                              borderRadius: "50%",
                              opacity: isPending ? 0.15 : 0.35,
                              transition: "all 0.4s ease",
                            }}
                          />

                          {/* Content Area */}
                          <Box sx={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
                            {/* Icon */}
                            <Box
                              sx={{
                                width: 68,
                                height: 68,
                                borderRadius: 3,
                                background: isPending ? "#adb5bd" : step.gradient,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 3,
                                boxShadow: isPending ? "0 4px 12px rgba(0,0,0,0.1)" : `0 8px 20px ${step.iconBg}`,
                                transition: "all 0.3s ease",
                              }}
                            >
                              <step.icon size={34} color="#fff" strokeWidth={2.5} />
                            </Box>

                            {/* Text Content */}
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontWeight: 700,
                                color: isPending ? "#6c757d" : "#1e293b",
                                mb: 1.5,
                                fontSize: "1.35rem"
                              }}
                            >
                              {step.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ 
                                color: isPending ? "#6c757d" : "#495057",
                                mb: 2,
                                lineHeight: 1.6,
                                fontWeight: 600,
                              }}
                            >
                              {step.subtitle}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ 
                                color: "#6c757d",
                                fontSize: "0.875rem",
                                mb: 2,
                                lineHeight: 1.6,
                              }}
                            >
                              {step.userFriendly}
                            </Typography>

                            {/* Progress Box */}
                            <Box
                              sx={{
                                mt: "auto",
                                p: 2.5,
                                borderRadius: 3,
                                background: "#fff",
                                border: `2px solid ${isPending ? "#dee2e6" : step.iconBg}`,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: "#6c757d",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: 0.8,
                                  fontSize: "0.7rem",
                                }}
                              >
                                {step.countLabel}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 0.5 }}>
                                <Typography 
                                  variant="h4" 
                                  sx={{ 
                                    fontWeight: 800,
                                    background: isPending ? "#6c757d" : step.gradient,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                  }}
                                >
                                  {step.processed}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#6c757d", fontWeight: 500 }}>
                                  articles
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          {/* Action Button */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: 2.5,
                              mt: 3,
                              borderRadius: 3,
                              background: isPending ? "#adb5bd" : step.gradient,
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "1rem",
                              position: "relative",
                              zIndex: 1,
                              boxShadow: isPending ? "none" : `0 4px 12px ${step.iconBg}`,
                              transition: "all 0.3s ease",
                              pointerEvents: isPending ? "none" : "auto",
                            }}
                          >
                            <span>{isPending ? "Complete Previous Step" : "Start Workflow"}</span>
                            {isPending ? (
                              <Lock size={22} strokeWidth={2.5} />
                            ) : (
                              <ArrowRight 
                                className="arrow-icon"
                                size={22} 
                                strokeWidth={2.5}
                                style={{ 
                                  transition: "transform 0.3s ease"
                                }}
                              />
                            )}
                          </Box>
                        </Card>
                      </Zoom>
                    );
                  })}
                </Box>
              )}
            </div>
          </Fade>
        </Container>
      </Box>
    </Layout>
  );
}