import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import AddProjectDialog from "../components/AddProjectDialog";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, completed: 0 });
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveProject = (data) => {
    const newProject = {
      id: projects.length + 1,
      title: data.title,
      duration: data.duration,
      description: data.description,
      owner: data.owner,
      status: "Active",
    };

    setProjects([...projects, newProject]);

    setCounts({
      total: counts.total + 1,
      active: counts.active + 1,
      completed: counts.completed,
    });

    handleCloseDialog();
  };

  const handleLaunchProject = (project) => {
    navigate(`/project/${project.id}`, { state: { project } });
  };

  return (
    <Box>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar
          sx={{
            flexDirection: "column",
            alignItems: "flex-start",
            py: 2,
            width: "100%",
            boxSizing: "border-box",
            px: { xs: 2, sm: 4 },
          }}
        >
          <Typography variant="h5">Research Projects</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Manage your systematic reviews and literature analysis
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
            + New Project
          </Button>
        </Toolbar>
      </AppBar>

      {/* Dashboard Cards */}
      <Box sx={{ display: "flex", gap: 2, p: 2, flexWrap: "wrap" }}>
        <Card sx={{ flex: "1 1 30%" }}>
          <CardContent>
            <Typography variant="h6">Total Projects</Typography>
            <Typography variant="h4">{counts.total}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 30%" }}>
          <CardContent>
            <Typography variant="h6">Active Projects</Typography>
            <Typography variant="h4">{counts.active}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 30%" }}>
          <CardContent>
            <Typography variant="h6">Completed Projects</Typography>
            <Typography variant="h4">{counts.completed}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Projects List */}
      <Grid container spacing={2} sx={{ p: 2 }}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <ProjectCard project={project} onLaunch={handleLaunchProject} />
          </Grid>
        ))}
      </Grid>

      {/* Add Project Dialog */}
      <AddProjectDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleSave={handleSaveProject}
      />
    </Box>
  );
}
