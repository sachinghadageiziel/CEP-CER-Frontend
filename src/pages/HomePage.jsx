// HomePage.jsx - Updated with correct API endpoints
import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Fade,
  Zoom,
  Container,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { Add, Science, CheckCircle, Pending } from "@mui/icons-material";
import AddProjectDialog from "../components/AddProjectDialog";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, completed: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Call the correct endpoint: /api/projects/existing
      const response = await fetch("http://localhost:5000/api/projects/existing");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const projectsData = await response.json();
      
      console.log("📥 Projects fetched:", projectsData);
      
      setProjects(projectsData);

      // Calculate counts
      const activeCount = projectsData.filter(p => p.status === "Active").length;
      const completedCount = projectsData.filter(p => p.status === "Completed").length;

      setCounts({
        total: projectsData.length,
        active: activeCount,
        completed: completedCount,
      });
    } catch (err) {
      console.error("❌ Error fetching projects:", err);
      setSnackbar({
        open: true,
        message: "Failed to load projects. Please ensure backend is running.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveProject = async (newProject) => {
    try {
      console.log("✅ New project saved:", newProject);
      
      // Show success message
      setSnackbar({
        open: true,
        message: "Project created successfully!",
        severity: "success"
      });
      
      // Refresh projects list
      await fetchProjects();
      
      handleCloseDialog();
    } catch (err) {
      console.error("❌ Error in handleSaveProject:", err);
      setSnackbar({
        open: true,
        message: "Failed to create project",
        severity: "error"
      });
    }
  };

  const handleLaunchProject = (project) => {
    navigate(`/project/${project.id}`, { state: { project } });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const statCards = [
    { 
      title: "Total Projects", 
      count: counts.total, 
      icon: Science,
      gradient: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
      solidColor: "#0d6efd",
      lightBg: "rgba(13, 110, 253, 0.08)"
    },
    { 
      title: "Active Projects", 
      count: counts.active, 
      icon: Pending,
      gradient: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
      solidColor: "#17a2b8",
      lightBg: "rgba(23, 162, 184, 0.08)"
    },
    { 
      title: "Completed Projects", 
      count: counts.completed, 
      icon: CheckCircle,
      gradient: "linear-gradient(135deg, #28a745 0%, #218838 100%)",
      solidColor: "#28a745",
      lightBg: "rgba(40, 167, 69, 0.08)"
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <Box sx={{ 
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          bgcolor: "#f8f9fa"
        }}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: "#0d6efd", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#6c757d" }}>
              Loading your projects...
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
        {/* Hero Section */}
        <Fade in timeout={800}>
          <Box
            sx={{
              background: "linear-gradient(180deg, #1976fd 0%, #0d6efd 50%, rgba(13, 110, 253, 0.05) 100%)",
              pt: { xs: 4, md: 6 },
              pb: { xs: 8, md: 12 },
              px: { xs: 2, md: 4 },
              position: "relative",
              overflow: "hidden",
              marginTop: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                pointerEvents: "none",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "150px",
                background: "linear-gradient(to bottom, transparent, #f8f9fa)",
                pointerEvents: "none",
              }
            }}
          >
            <Container maxWidth="xl">
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: "#fff", 
                    fontWeight: 800,
                    mb: 1.5,
                    fontSize: { xs: "2rem", md: "3.5rem" },
                    textShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    letterSpacing: "-0.5px"
                  }}
                >
                  Research Projects
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: "rgba(255,255,255,0.95)", 
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: "1rem", md: "1.35rem" },
                    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  Manage your systematic reviews and literature analysis
                </Typography>
                <Button 
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleOpenDialog}
                  sx={{
                    bgcolor: "#fff",
                    color: "#0d6efd",
                    px: 5,
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    textTransform: "none",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "3px solid rgba(255,255,255,0.3)",
                    "&:hover": {
                      bgcolor: "#fff",
                      transform: "translateY(-4px)",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
                      border: "3px solid #fff",
                    },
                    "&:active": {
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  Create New Project
                </Button>
              </Box>
            </Container>
          </Box>
        </Fade>

        <Container maxWidth="xl" sx={{ mt: -8, position: "relative", zIndex: 2 }}>
          {/* Dashboard Stats */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={stat.title}>
                <Zoom in timeout={600 + index * 200}>
                  <Card 
                    sx={{ 
                      borderRadius: 4,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      border: "2px solid",
                      borderColor: "rgba(0,0,0,0.06)",
                      overflow: "hidden",
                      position: "relative",
                      bgcolor: "#fff",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-12px) scale(1.02)",
                        boxShadow: `0 20px 60px ${stat.solidColor}30`,
                        borderColor: stat.solidColor,
                        "& .stat-icon": {
                          transform: "rotate(360deg) scale(1.1)",
                        },
                        "& .stat-bg": {
                          transform: "scale(1.3) rotate(15deg)",
                          opacity: 0.15,
                        }
                      }
                    }}
                  >
                    <Box
                      className="stat-bg"
                      sx={{
                        position: "absolute",
                        top: -20,
                        right: -20,
                        width: 160,
                        height: 160,
                        background: stat.lightBg,
                        borderRadius: "50%",
                        opacity: 0.6,
                        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                    <CardContent sx={{ p: 3.5, position: "relative" }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
                        <Box
                          className="stat-icon"
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 3,
                            background: stat.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                            boxShadow: `0 8px 24px ${stat.solidColor}40`,
                            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <stat.icon sx={{ color: "#fff", fontSize: 34 }} />
                        </Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: "#495057",
                            fontWeight: 700,
                            fontSize: "1rem",
                            lineHeight: 1.3
                          }}
                        >
                          {stat.title}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 900,
                          color: stat.solidColor,
                          fontSize: "3rem",
                          textShadow: `0 2px 8px ${stat.solidColor}20`
                        }}
                      >
                        {stat.count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          {/* Projects Section */}
          <Fade in timeout={1000}>
            <Box>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                mb: 4,
                pb: 3,
                borderBottom: "3px solid",
                borderImage: "linear-gradient(90deg, #0d6efd, transparent) 1",
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 800,
                      color: "#212529",
                      fontSize: "1.75rem"
                    }}
                  >
                    Your Projects
                  </Typography>
                  <Box 
                    sx={{ 
                      background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                      color: "#fff",
                      px: 3,
                      py: 1,
                      borderRadius: 3,
                      fontSize: "1rem",
                      fontWeight: 800,
                      boxShadow: "0 4px 16px rgba(13, 110, 253, 0.3)",
                      minWidth: "50px",
                      textAlign: "center"
                    }}
                  >
                    {projects.length}
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {projects.map((project, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={project.id}>
                    <Zoom in timeout={800 + index * 100}>
                      <div>
                        <ProjectCard 
                          project={project} 
                          onLaunch={handleLaunchProject} 
                        />
                      </div>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>

              {projects.length === 0 && (
                <Zoom in timeout={1200}>
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 12,
                      px: 3,
                      bgcolor: "#fff",
                      borderRadius: 5,
                      border: "3px dashed #dee2e6",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#0d6efd",
                        borderStyle: "solid",
                        boxShadow: "0 8px 32px rgba(13, 110, 253, 0.1)"
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #e7f1ff 0%, #c4d0ff 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 24px",
                        boxShadow: "0 8px 24px rgba(13, 110, 253, 0.2)",
                      }}
                    >
                      <Science sx={{ fontSize: 70, color: "#0d6efd" }} />
                    </Box>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: "#212529" }}>
                      No projects yet
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: "#6c757d", fontSize: "1.1rem" }}>
                      Create your first project to get started with research management
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleOpenDialog}
                      sx={{
                        background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                        color: "#fff",
                        px: 5,
                        py: 1.8,
                        borderRadius: 3,
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        textTransform: "none",
                        boxShadow: "0 8px 24px rgba(13, 110, 253, 0.3)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 12px 36px rgba(13, 110, 253, 0.4)",
                        },
                        "&:active": {
                          transform: "translateY(-1px)",
                        }
                      }}
                    >
                      Create Project
                    </Button>
                  </Box>
                </Zoom>
              )}
            </Box>
          </Fade>
        </Container>

        {/* Add Project Dialog */}
        <AddProjectDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          handleSave={handleSaveProject}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Layout>
  );
}