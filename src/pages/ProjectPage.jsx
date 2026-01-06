import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Container,
  Fade,
  Zoom,
  Chip,
} from "@mui/material";
import { ArrowRight, FileSearch, Filter, ClipboardCheck } from "lucide-react";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

export default function ProjectPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const project = location.state?.project;

  const steps = [
    {
      title: "Literature Search",
      subtitle: "Upload keywords and search across multiple databases",
      description: "Comprehensive search across PubMed, Cochrane, and Google Scholar",
      path: "literature",
      icon: FileSearch,
      gradient: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
      bgGradient: "linear-gradient(135deg, #e7f1ff 0%, #c4d0ff 100%)",
      iconBg: "#c4d0ff",
      processed: 0,
    },
    {
      title: "Primary Screening",
      subtitle: "Review and screen literature based on inclusion criteria",
      description: "Efficient title and abstract screening workflow",
      path: "primary",
      icon: Filter,
      gradient: "linear-gradient(135deg, #fd7e14 0%, #dc6c13 100%)",
      bgGradient: "linear-gradient(135deg, #ffe5d0 0%, #ffd8b8 100%)",
      iconBg: "#ffe5d0",
      processed: 0,
    },
    {
      title: "Secondary Screening",
      subtitle: "Detailed evaluation and quality assessment of selected papers",
      description: "Full-text review and quality appraisal",
      path: "secondary",
      icon: ClipboardCheck,
      gradient: "linear-gradient(135deg, #198754 0%, #157347 100%)",
      bgGradient: "linear-gradient(135deg, #d1e7dd 0%, #badbcc 100%)",
      iconBg: "#d1e7dd",
      processed: 0,
    },
  ];

  return (
    <Layout>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
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
                    label="Active"
                    sx={{
                      background: "linear-gradient(135deg, #198754 0%, #157347 100%)",
                      color: "#fff",
                      fontWeight: 600,
                      height: 32,
                      boxShadow: "0 2px 8px rgba(25, 135, 84, 0.3)",
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                      Duration:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1e293b", fontWeight: 500 }}>
                      {project?.duration || "Not specified"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Workflow Steps */}
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 2,
                mb: 4,
                pb: 2,
                borderBottom: "3px solid #e9ecef"
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: "#212529",
                  }}
                >
                  Research Workflow
                </Typography>
                <Box 
                  sx={{ 
                    background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    boxShadow: "0 2px 8px rgba(13, 110, 253, 0.25)"
                  }}
                >
                  3 Steps
                </Box>
              </Box>

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
                {steps.map((step, index) => (
                  <Zoom in timeout={700 + index * 150} key={step.path}>
                    <Card
                      onClick={() =>
                        navigate(`/project/${id}/${step.path}`, {
                          state: { project },
                        })
                      }
                      sx={{
                        borderRadius: 4,
                        p: 3,
                        minHeight: 420,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                        border: "2px solid #e9ecef",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        bgcolor: "#fff",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                          borderColor: step.gradient.includes('#0d6efd') ? '#0d6efd' : 
                                      step.gradient.includes('#fd7e14') ? '#fd7e14' : '#198754',
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
                          opacity: 0.35,
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
                            background: step.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 3,
                            boxShadow: `0 8px 20px ${step.iconBg}`,
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
                            color: "#212529",
                            mb: 1.5,
                            fontSize: "1.35rem"
                          }}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: "#495057",
                            mb: 2,
                            lineHeight: 1.6,
                            fontWeight: 500,
                          }}
                        >
                          {step.subtitle}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ 
                            color: "#6c757d",
                            fontSize: "0.875rem",
                            fontStyle: "italic",
                            mb: 3,
                            lineHeight: 1.5,
                          }}
                        >
                          {step.description}
                        </Typography>

                        {/* Progress Box - pushed to bottom of flex container */}
                        <Box
                          sx={{
                            mt: "auto",
                            p: 2.5,
                            borderRadius: 3,
                            background: "#fff",
                            border: `2px solid ${step.iconBg}`,
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
                            Items Processed
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 0.5 }}>
                            <Typography 
                              variant="h4" 
                              sx={{ 
                                fontWeight: 800,
                                background: step.gradient,
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

                      {/* Start Button - Fixed at bottom */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2.5,
                          mt: 3,
                          borderRadius: 3,
                          background: step.gradient,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "1rem",
                          position: "relative",
                          zIndex: 1,
                          boxShadow: `0 4px 12px ${step.iconBg}`,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <span>Start Workflow</span>
                        <ArrowRight 
                          className="arrow-icon"
                          size={22} 
                          strokeWidth={2.5}
                          style={{ 
                            transition: "transform 0.3s ease"
                          }}
                        />
                      </Box>
                    </Card>
                  </Zoom>
                ))}
              </Box>
            </div>
          </Fade>
        </Container>
      </Box>
    </Layout>
  );
}