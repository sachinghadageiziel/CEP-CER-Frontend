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
      if (useCustomCriteria && projectData.customCriteria.trim()) {
        formData.append("custom_criteria", projectData.customCriteria.trim());
      } else {
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
                <FileText size={18} color="#667eea" />
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
                error={error && !projectData.title}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: "#667eea" },
                    "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 }
                  }
                }}
              />
            </Box>

            {/* Owner Field */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <User size={18} color="#667eea" />
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
                error={error && !projectData.owner}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: "#667eea" },
                    "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 }
                  }
                }}
              />
            </Box>

            {/* Start Date and Status */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Calendar size={18} color="#667eea" />
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
                      "&:hover fieldset": { borderColor: "#667eea" },
                      "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 }
                    }
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Target size={18} color="#667eea" />
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
                      "&:hover fieldset": { borderColor: "#667eea" },
                      "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 }
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
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Target size={18} color="#667eea" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    Selection Criteria
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => setUseCustomCriteria(!useCustomCriteria)}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: useCustomCriteria ? "#dc3545" : "#0d6efd",
                  }}
                >
                  {useCustomCriteria ? "Use IZIEL Template" : "Add Custom Criteria"}
                </Button>
              </Box>

              {!useCustomCriteria ? (
                <>
                  {/* IZIEL Template Criteria */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1.5, color: "#64748b", fontWeight: 600 }}>
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
                          "&:hover fieldset": { borderColor: "#667eea" },
                          "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 }
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1.5, color: "#64748b", fontWeight: 600 }}>
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
                          "&:hover fieldset": { borderColor: "#667eea" },
                          "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 }
                        }
                      }}
                    />
                  </Box>

                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Using IZIEL Template Criteria
                    </Typography>
                    <Typography variant="caption">
                      Following standardized inclusion/exclusion criteria for systematic reviews
                    </Typography>
                  </Alert>
                </>
              ) : (
                <>
                  {/* Custom Criteria */}
                  <TextField
                    name="customCriteria"
                    value={projectData.customCriteria}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Enter your custom selection criteria..."
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#667eea" },
                        "&.Mui-focused fieldset": { borderColor: "#667eea", borderWidth: 2 }
                      }
                    }}
                  />

                  <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Note: Custom Criteria
                    </Typography>
                    <Typography variant="caption">
                      You are not following the standard IZIEL template criteria. Ensure your criteria meet your systematic review requirements.
                    </Typography>
                  </Alert>
                </>
              )}
            </Box>

            {/* IFU PDF Upload */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Upload size={18} color="#667eea" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                    IFU Document *
                  </Typography>
                </Box>
                {ifuFile ? (
                  <Chip icon={<Check size={14} />} label="Uploaded" size="small"
                    sx={{ bgcolor: "#d1e7dd", color: "#0f5132", fontWeight: 700, fontSize: "0.7rem" }}
                  />
                ) : (
                  <Chip icon={<AlertCircle size={14} />} label="Required" size="small"
                    sx={{ bgcolor: "#f8d7da", color: "#842029", fontWeight: 700, fontSize: "0.7rem" }}
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
                      borderColor: "#667eea",
                      bgcolor: "#f1f5f9",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                    }
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Upload size={32} color="#667eea" />
                    <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>
                      Click to upload IFU PDF (Required)
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
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
                    border: "2px solid #667eea",
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
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
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
            color: "#64748b",
            "&:hover": { bgcolor: "#f1f5f9" }
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
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
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
