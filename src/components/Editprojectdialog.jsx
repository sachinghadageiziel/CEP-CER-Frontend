// EditProjectDialog.jsx - Complete with All Database Fields
import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { X, Edit, FileText, Calendar, Upload, File, Check, AlertCircle, Filter, ClipboardCheck } from "lucide-react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditProjectDialog({ open, handleClose, handleSave, project }) {
  const [projectData, setProjectData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    status: "Active",
    primaryCriteria: "",
    secondaryCriteria: "",
  });
  const [ifuFile, setIfuFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setProjectData({
        title: project.title || "",
        startDate: project.start_date || "",
        endDate: project.end_date || "",
        status: project.status || "Active",
        primaryCriteria: project.primary_criteria || "",
        secondaryCriteria: project.secondary_criteria || "",
      });
    }
  }, [project]);

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError("IFU must be a PDF file");
        setIfuFile(null);
        e.target.value = null;
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        setIfuFile(null);
        e.target.value = null;
        return;
      }
      
      setIfuFile(file);
      if (error) setError("");
    }
  };

  const handleRemoveFile = () => {
    setIfuFile(null);
    const fileInput = document.getElementById('edit-ifu-upload');
    if (fileInput) fileInput.value = null;
  };

  const handleSubmit = async () => {
    if (!project) return;

    // Validation
    if (!projectData.title.trim()) {
      setError("Project Title is required");
      return;
    }

    // Validate date range if both dates are provided
    if (projectData.startDate && projectData.endDate) {
      if (new Date(projectData.startDate) > new Date(projectData.endDate)) {
        setError("Start Date cannot be after End Date");
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", projectData.title.trim());
      formData.append("status", projectData.status);
      
      if (projectData.startDate) {
        formData.append("start_date", projectData.startDate);
      }
      if (projectData.endDate) {
        formData.append("end_date", projectData.endDate);
      }
      
      if (projectData.primaryCriteria.trim()) {
        formData.append("primary_criteria", projectData.primaryCriteria.trim());
      }
      if (projectData.secondaryCriteria.trim()) {
        formData.append("secondary_criteria", projectData.secondaryCriteria.trim());
      }

      if (ifuFile) {
        formData.append("ifu_pdf", ifuFile);
      }

      console.log("📤 Updating project", project.id);

      const response = await fetch(`http://localhost:5000/api/projects/${project.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error (${response.status})`);
      }

      const updatedProject = await response.json();
      console.log("✅ Project updated:", updatedProject);

      if (handleSave) {
        await handleSave(updatedProject);
      }

      setIfuFile(null);
      setLoading(false);
      handleClose();

    } catch (err) {
      console.error("❌ Error updating project:", err);
      
      let errorMessage = "Failed to update project. ";
      
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
    setIfuFile(null);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog 
      open={open} 
      onClose={handleDialogClose}
      TransitionComponent={Transition}
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
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
              <Edit size={28} color="#fff" />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Edit Project
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.9)",
                  mt: 0.5,
                }}
              >
                Update project details
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
                <FileText size={18} color="#0d6efd" />
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
                      borderColor: "#0d6efd",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0d6efd",
                      borderWidth: 2,
                    }
                  }
                }}
              />
            </Box>

            {/* Status */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Check size={18} color="#0d6efd" />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Status
                </Typography>
              </Box>
              <FormControl fullWidth>
                <Select
                  name="status"
                  value={projectData.status}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0d6efd",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#0d6efd",
                      borderWidth: 2,
                    }
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Date Range */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Calendar size={18} color="#0d6efd" />
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    Project Duration
                  </Typography>
                </Box>
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
                        borderColor: "#0d6efd",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0d6efd",
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
                    min: projectData.startDate
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: "#0d6efd",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0d6efd",
                        borderWidth: 2,
                      }
                    }
                  }}
                />
              </Box>
              {projectData.startDate && projectData.endDate && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    icon={<Check size={14} />}
                    label={`Duration: ${Math.ceil((new Date(projectData.endDate) - new Date(projectData.startDate)) / (1000 * 60 * 60 * 24))} days`}
                    size="small"
                    sx={{
                      bgcolor: "#e7f1ff",
                      color: "#0654c4",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Primary Criteria */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Filter size={18} color="#0d6efd" />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Primary Criteria
                </Typography>
              </Box>
              <TextField
                name="primaryCriteria"
                value={projectData.primaryCriteria}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Define primary screening criteria..."
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#0d6efd",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0d6efd",
                      borderWidth: 2,
                    }
                  }
                }}
              />
            </Box>

            {/* Secondary Criteria */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <ClipboardCheck size={18} color="#0d6efd" />
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  Secondary Criteria
                </Typography>
              </Box>
              <TextField
                name="secondaryCriteria"
                value={projectData.secondaryCriteria}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Define secondary screening criteria..."
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": {
                      borderColor: "#0d6efd",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0d6efd",
                      borderWidth: 2,
                    }
                  }
                }}
              />
            </Box>

            {/* IFU PDF Upload */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Upload size={18} color="#0d6efd" />
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    Update IFU Document
                  </Typography>
                </Box>
                {ifuFile && (
                  <Chip
                    icon={<Check size={14} />}
                    label="New File Selected"
                    size="small"
                    sx={{
                      bgcolor: "#d1e7dd",
                      color: "#0f5132",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                    }}
                  />
                )}
              </Box>
              
              {!ifuFile ? (
                <Button
                  component="label"
                  fullWidth
                  disabled={loading}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "2px dashed #cbd5e1",
                    bgcolor: "#f8fafc",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#0d6efd",
                      bgcolor: "#f1f5f9",
                      transform: "translateY(-2px)",
                    }
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Upload size={32} color="#0d6efd" />
                    <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>
                      Upload new IFU PDF (optional)
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                      Leave empty to keep existing file
                    </Typography>
                  </Box>
                  <input
                    id="edit-ifu-upload"
                    type="file"
                    accept=".pdf,application/pdf"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "2px solid #0d6efd",
                    bgcolor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <File size={20} color="#fff" />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {ifuFile.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {(ifuFile.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={handleRemoveFile}
                    disabled={loading}
                    sx={{
                      color: "#dc3545",
                      "&:hover": {
                        bgcolor: "#fee",
                      }
                    }}
                  >
                    <X size={20} />
                  </IconButton>
                </Box>
              )}
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
          disabled={!projectData.title || loading}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
            boxShadow: "0 4px 12px rgba(13, 110, 253, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(13, 110, 253, 0.4)",
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
              Updating...
            </Box>
          ) : (
            "Update Project"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}