// AddProjectDialog.jsx - Updated with Date Range & SharePoint IFU
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Fade,
  Slide,
  CircularProgress,
  Alert,
} from "@mui/material";
import { X, Plus, FileText, User, Calendar, AlignLeft, Link2 } from "lucide-react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddProjectDialog({ open, handleClose, handleSave }) {
  const [projectData, setProjectData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    owner: "",
    sharepointUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async () => {
    // Validation
    if (!projectData.title.trim()) {
      setError("Project Title is required");
      return;
    }

    if (!projectData.startDate || !projectData.endDate) {
      setError("Both Start Date and End Date are required");
      return;
    }

    // Validate date range
    if (new Date(projectData.startDate) > new Date(projectData.endDate)) {
      setError("Start Date cannot be after End Date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare payload matching backend ProjectCreate schema
      const payload = {
        title: projectData.title.trim(),
        start_date: projectData.startDate, // Format: YYYY-MM-DD
        end_date: projectData.endDate,     // Format: YYYY-MM-DD
      };

      console.log("📤 Sending to backend:", payload);

      // Call the correct endpoint: /api/projects/addProject
      const response = await fetch("http://localhost:5000/api/projects/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error (${response.status})`);
      }

      const newProject = await response.json();
      console.log("✅ Project created:", newProject);

      // Call parent's handleSave with complete data
      if (handleSave) {
        await handleSave({
          ...newProject,
          // Include UI-only fields for display
          description: projectData.description,
          owner: projectData.owner,
          sharepointUrl: projectData.sharepointUrl,
        });
      }

      // Reset form and close
      setProjectData({
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        owner: "",
        sharepointUrl: "",
      });
      setLoading(false);
      handleClose();

    } catch (err) {
      console.error("❌ Error creating project:", err);
      
      let errorMessage = "Failed to create project. ";
      
      if (err.message === "Failed to fetch") {
        errorMessage += "Cannot connect to server. Please ensure backend is running on port 5000.";
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    if (loading) return;
    handleClose();
    setError("");
    setTimeout(() => {
      setProjectData({
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        owner: "",
        sharepointUrl: "",
      });
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
            disabled={loading}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
              },
              "&:disabled": {
                color: "rgba(255, 255, 255, 0.5)",
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
            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                onClose={() => setError("")}
                sx={{ 
                  borderRadius: 2,
                  whiteSpace: "pre-line"
                }}
              >
                {error}
              </Alert>
            )}

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
                disabled={loading}
                error={error && !projectData.title}
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
                disabled={loading}
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

            {/* Date Range */}
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
                  Project Duration *
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  name="startDate"
                  type="date"
                  label="Start Date"
                  value={projectData.startDate}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                <TextField
                  name="endDate"
                  type="date"
                  label="End Date"
                  value={projectData.endDate}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: projectData.startDate // Prevent selecting end date before start date
                  }}
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

            {/* SharePoint IFU URL */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Link2 size={18} color="#667eea" />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  SharePoint IFU Link
                  <Typography 
                    component="span" 
                    sx={{ 
                      color: "#64748b", 
                      fontWeight: 400, 
                      ml: 1,
                      fontSize: "0.875rem"
                    }}
                  >
                    (Optional)
                  </Typography>
                </Typography>
              </Box>
              <TextField
                name="sharepointUrl"
                value={projectData.sharepointUrl}
                onChange={handleChange}
                fullWidth
                placeholder="https://sharepoint.com/..."
                disabled={loading}
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
                disabled={loading}
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
          disabled={loading}
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
          disabled={!projectData.title || !projectData.startDate || !projectData.endDate || loading}
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
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} sx={{ color: "#fff" }} />
              Creating...
            </Box>
          ) : (
            "Create Project"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}