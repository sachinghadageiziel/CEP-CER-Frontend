import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Fade,
  Slide,
} from "@mui/material";
import { X, Plus, FileText, User, Calendar, AlignLeft } from "lucide-react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  const handleDialogClose = () => {
    handleClose();
    // Reset form after animation completes
    setTimeout(() => {
      setProjectData({ title: "", duration: "", description: "", owner: "" });
    }, 300);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose}
      TransitionComponent={Transition}
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
          }}
        />
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <Plus size={28} color="#fff" />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Create New Project
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.9)",
                  mt: 0.5,
                }}
              >
                Set up your systematic review project
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleDialogClose}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
              }
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Fade in={open} timeout={400}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Project Title */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <FileText size={18} color="#667eea" />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Project Title *
                </Typography>
              </Box>
              <TextField
                name="title"
                value={projectData.title}
                onChange={handleChange}
                fullWidth
                placeholder="Enter project title"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                      borderWidth: 2,
                    }
                  }
                }}
              />
            </Box>

            {/* Owner */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <User size={18} color="#667eea" />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Project Owner
                </Typography>
              </Box>
              <TextField
                name="owner"
                value={projectData.owner}
                onChange={handleChange}
                fullWidth
                placeholder="Enter owner name"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                      borderWidth: 2,
                    }
                  }
                }}
              />
            </Box>

            {/* Duration */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Calendar size={18} color="#667eea" />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Literature Search Duration
                </Typography>
              </Box>
              <TextField
                name="duration"
                value={projectData.duration}
                onChange={handleChange}
                fullWidth
                placeholder="e.g., 2020-2024"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                      borderWidth: 2,
                    }
                  }
                }}
              />
            </Box>

            {/* Description */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <AlignLeft size={18} color="#667eea" />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Description
                </Typography>
              </Box>
              <TextField
                name="description"
                value={projectData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Provide a brief description of your research project"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#667eea",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#667eea",
                      borderWidth: 2,
                    }
                  }
                }}
              />
            </Box>
          </Box>
        </Fade>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleDialogClose}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            color: "#64748b",
            "&:hover": {
              bgcolor: "#f1f5f9",
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!projectData.title}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
            },
            "&:disabled": {
              background: "#cbd5e1",
              color: "#94a3b8",
            }
          }}
        >
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}