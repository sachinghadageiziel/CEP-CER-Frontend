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
  Chip,
  MenuItem,
} from "@mui/material";
import { X, Plus, FileText, Calendar, Upload, File, Check, AlertCircle, User, Target } from "lucide-react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddProjectDialog({ open, handleClose, handleSave, currentUser }) {
  const [projectData, setProjectData] = useState({
    title: "",
    owner: "",
    startDate: "",
    status: "Active",
    primaryCriteria: "",
    secondaryCriteria: "",
    customCriteria: "",
  });
  const [ifuFile, setIfuFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useCustomCriteria, setUseCustomCriteria] = useState(false);

  // Set owner to logged-in user when dialog opens
  useEffect(() => {
    if (open && currentUser) {
      setProjectData(prev => ({
        ...prev,
        owner: currentUser
      }));
    }
  }, [open, currentUser]);

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
    const fileInput = document.getElementById('ifu-upload');
    if (fileInput) fileInput.value = null;
  };

  const handleSubmit = async () => {
    // Validation
    if (!projectData.title.trim()) {
      setError("Project Title is required");
      return;
    }

    if (!projectData.owner.trim()) {
      setError("Owner is required");
      return;
    }

    if (!ifuFile) {
      setError("IFU document is mandatory");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", projectData.title.trim());
      formData.append("owner", projectData.owner.trim());
      
      if (projectData.startDate) {
        formData.append("start_date", projectData.startDate);
      }

      formData.append("status", projectData.status);

      // Handle criteria - either custom or IZIEL template
      if (useCustomCriteria) {
        if (projectData.primaryCriteria.trim()) {
          formData.append("primary_criteria", projectData.primaryCriteria.trim());
        }
        if (projectData.secondaryCriteria.trim()) {
          formData.append("secondary_criteria", projectData.secondaryCriteria.trim());
        }
      }

      formData.append("ifu_pdf", ifuFile);

      console.log("📤 Sending FormData to backend");

      const response = await fetch("http://localhost:5000/api/projects/project", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error (${response.status})`);
      }

      const newProject = await response.json();
      console.log("✅ Project created:", newProject);

      if (handleSave) {
        await handleSave(newProject);
      }

      // Reset form and close
      setProjectData({
        title: "",
        owner: currentUser || "",
        startDate: "",
        status: "Active",
        primaryCriteria: "",
        secondaryCriteria: "",
        customCriteria: "",
      });
      setIfuFile(null);
      setUseCustomCriteria(false);
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
    setIfuFile(null);
    setUseCustomCriteria(false);
    setTimeout(() => {
      setProjectData({
        title: "",
        owner: currentUser || "",
        startDate: "",
        status: "Active",
        primaryCriteria: "",
        secondaryCriteria: "",
        customCriteria: "",
      });
    }, 300);
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
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
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
                sx={{ borderRadius: 2, whiteSpace: "pre-line" }}
              >
                {error}
              </Alert>
            )}

            {/* Project Title */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <FileText size={18} color="#1976D2" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "#FAFAFA",
                    "&:hover fieldset": { borderColor: "#2196F3" },
                    "&.Mui-focused fieldset": { borderColor: "#1976D2", borderWidth: 2 }
                  }
                }}
              />
            </Box>

            {/* Owner Field */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <User size={18} color="#1976D2" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  Project Owner *
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
                    bgcolor: "#FAFAFA",
                    "&:hover fieldset": { borderColor: "#2196F3" },
                    "&.Mui-focused fieldset": { borderColor: "#1976D2", borderWidth: 2 }
                  }
                }}
              />
            </Box>

            {/* Start Date and Status */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Calendar size={18} color="#1976D2" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Start Date
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.75rem", fontStyle: "italic" }}>
                    Optional
                  </Typography>
                </Box>
                <TextField
                  name="startDate"
                  type="date"
                  value={projectData.startDate}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: today }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#FAFAFA",
                      "&:hover fieldset": { borderColor: "#2196F3" },
                      "&.Mui-focused fieldset": { borderColor: "#1976D2", borderWidth: 2 }
                    }
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Target size={18} color="#1976D2" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    Status
                  </Typography>
                </Box>
                <TextField
                  name="status"
                  select
                  value={projectData.status}
                  onChange={handleChange}
                  fullWidth
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#FAFAFA",
                      "&:hover fieldset": { borderColor: "#2196F3" },
                      "&.Mui-focused fieldset": { borderColor: "#1976D2", borderWidth: 2 }
                    }
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* Criteria Selection Toggle */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Target size={18} color="#2196F3" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  Selection Criteria Template
                </Typography>
              </Box>

              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                p: 2,
                bgcolor: "#E3F2FD",
                borderRadius: 2,
                mb: 2,
                border: "1px solid #BBDEFB"
              }}>
                <Typography variant="body2" sx={{ color: "#1565C0", fontWeight: 500 }}>
                  {useCustomCriteria 
                    ? "If not following IZIEL template, add primary and secondary criteria"
                    : "Following IZIEL template - no additional criteria needed"}
                </Typography>
                <Button
                  size="small"
                  onClick={() => setUseCustomCriteria(!useCustomCriteria)}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    bgcolor: useCustomCriteria ? "#fff" : "#2196F3",
                    color: useCustomCriteria ? "#2196F3" : "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: 1.5,
                    border: useCustomCriteria ? "1px solid #2196F3" : "none",
                    "&:hover": {
                      bgcolor: useCustomCriteria ? "#f5f5f5" : "#1976D2",
                    }
                  }}
                >
                  {useCustomCriteria ? "Use IZIEL Template" : "For External Criteria"}
                </Button>
              </Box>

              {useCustomCriteria ? (
                <>
                  {/* External Template Criteria */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1.5, color: "#546E7A", fontWeight: 600 }}>
                      Primary Criteria (Optional)
                    </Typography>
                    <TextField
                      name="primaryCriteria"
                      value={projectData.primaryCriteria}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Enter primary inclusion/exclusion criteria"
                      disabled={loading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#FAFAFA",
                          "&:hover fieldset": { borderColor: "#2196F3" },
                          "&.Mui-focused fieldset": { borderColor: "#2196F3", borderWidth: 2 }
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1.5, color: "#546E7A", fontWeight: 600 }}>
                      Secondary Criteria (Optional)
                    </Typography>
                    <TextField
                      name="secondaryCriteria"
                      value={projectData.secondaryCriteria}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Enter secondary inclusion/exclusion criteria"
                      disabled={loading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#FAFAFA",
                          "&:hover fieldset": { borderColor: "#2196F3" },
                          "&.Mui-focused fieldset": { borderColor: "#2196F3", borderWidth: 2 }
                        }
                      }}
                    />
                  </Box>

                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2, bgcolor: "#E1F5FE", border: "1px solid #B3E5FC" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#01579B" }}>
                      External Template Criteria
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#0277BD" }}>
                      You are using custom criteria instead of the standard IZIEL template
                    </Typography>
                  </Alert>
                </>
              ) : (
                <Alert severity="success" sx={{ borderRadius: 2, bgcolor: "#E8F5E9", border: "1px solid #C8E6C9" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#2E7D32" }}>
                    Using IZIEL Template
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#388E3C" }}>
                    Following standardized inclusion/exclusion criteria
                  </Typography>
                </Alert>
              )}
            </Box>

            {/* IFU PDF Upload */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Upload size={18} color="#1976D2" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    IFU Document *
                  </Typography>
                </Box>
           
              </Box>
              
              {!ifuFile ? (
                <Button
                  component="label"
                  fullWidth
                  disabled={loading}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: "2px dashed #90CAF9",
                    bgcolor: "#E3F2FD",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#1976D2",
                      bgcolor: "#BBDEFB",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                    }
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Upload size={32} color="#1976D2" />
                    <Typography variant="body2" sx={{ color: "#0D47A1", fontWeight: 600 }}>
                      Click to upload IFU PDF (Required)
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#1565C0" }}>
                      PDF only • Maximum 10MB
                    </Typography>
                  </Box>
                  <input
                    id="ifu-upload"
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
                    border: "2px solid #2196F3",
                    bgcolor: "#E3F2FD",
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
                        background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                      }}
                    >
                      <File size={20} color="#fff" />
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                        {ifuFile.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {(ifuFile.size / 1024).toFixed(2)} KB • PDF Document
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    onClick={handleRemoveFile}
                    disabled={loading}
                    sx={{ color: "#dc3545", "&:hover": { bgcolor: "#ffebee" } }}
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
            color: "#546E7A",
            "&:hover": { bgcolor: "#ECEFF1" }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!projectData.title || !projectData.owner || !ifuFile || loading}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(25, 118, 210, 0.4)",
            },
            "&:disabled": {
              background: "#B0BEC5",
              color: "#ECEFF1",
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