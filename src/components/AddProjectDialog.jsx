import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

export default function AddProjectDialog({ open, handleClose, handleSave }) {
  const [projectData, setProjectData] = useState({
    title: "",
    duration: "",
    description: "",
    owner: "",
  });

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!projectData.title) return alert("Project Title is required");
    handleSave(projectData);
    setProjectData({ title: "", duration: "", description: "", owner: "" });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Project Title" name="title" value={projectData.title} onChange={handleChange} fullWidth />
          <TextField label="Literature Search Duration" name="duration" value={projectData.duration} onChange={handleChange} fullWidth />
          <TextField label="Description" name="description" value={projectData.description} onChange={handleChange} fullWidth multiline rows={3} />
          <TextField label="Owner" name="owner" value={projectData.owner} onChange={handleChange} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
