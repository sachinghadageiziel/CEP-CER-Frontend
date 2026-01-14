import { 
  Dialog, 
  IconButton, 
  Typography, 
  Box, 
  Divider, 
  Slide,
  Button,
  TextField,
  Chip,
  Stack,
  Alert,
  Tooltip,
  Paper,
  Fade,
  Collapse,
} from "@mui/material";
import { X, FileText, Edit, Trash2, Save, XCircle, AlertTriangle, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LiteratureRecordModal({ 
  open, 
  onClose, 
  record, 
  onDelete,
  onUpdate,
  projectId 
}) {
  const [editMode, setEditMode] = useState(false);
  const [editedAbstract, setEditedAbstract] = useState("");
  const [originalAbstract, setOriginalAbstract] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    abstract: true,
    details: true,
    additional: false
  });

  useEffect(() => {
    if (record) {
      const abstractText = record.Abstract || "";
      setEditedAbstract(abstractText);
      setOriginalAbstract(abstractText);
      setEditMode(false);
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [record]);

  if (!record) return null;

  const handleEdit = () => {
    setEditMode(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedAbstract(originalAbstract);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const formData = new FormData();
      formData.append("abstract", editedAbstract);

      const response = await fetch(
        `http://localhost:5000/api/literature/${projectId}/${record.PMID}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update abstract");
      }

      // Update local state
      setOriginalAbstract(editedAbstract);
      setEditMode(false);
      setSaveSuccess(true);
      
      // Update parent component data to refresh the grid
      if (onUpdate) {
        await onUpdate();
      }
      
      // Close modal after brief success message
      setTimeout(() => {
        onClose();
        setSaveSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update abstract");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(record.PMID);
    }
    onClose();
  };

  const handleCopyAbstract = async () => {
    try {
      await navigator.clipboard.writeText(editedAbstract);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const importantFields = [
    { key: "PMID", label: "PubMed ID", color: "#8b5cf6" },
    { key: "Title", label: "Title", color: "#3b82f6" },
    { key: "Authors", label: "Authors", color: "#10b981" },
    { key: "Journal", label: "Journal", color: "#f59e0b" },
    { key: "Publication Year", label: "Year", color: "#ef4444" },
  ];

  const otherFields = Object.keys(record).filter(
    (key) => key !== "id" && key !== "Abstract" && !importantFields.map(f => f.key).includes(key)
  );

  const hasChanges = editedAbstract !== originalAbstract;

  return (
    <Dialog 
      open={open} 
      onClose={editMode ? null : onClose}
      maxWidth="md" 
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          maxHeight: "92vh",
          overflow: "hidden",
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* HEADER */}
        <Box
          sx={{
            background: editMode 
              ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
            p: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated Background Elements */}
          <Box
            sx={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              animation: "pulse 3s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)", opacity: 0.1 },
                "50%": { transform: "scale(1.1)", opacity: 0.15 },
              }
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2.5,
                    background: "rgba(255, 255, 255, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  {editMode ? <Edit size={26} color="#fff" /> : <FileText size={26} color="#fff" />}
                </Box>
              </motion.div>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: "#fff",
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {editMode ? "Edit Abstract" : "Article Details"}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "rgba(255, 255, 255, 0.95)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Chip 
                      label={`PMID: ${record.PMID}`}
                      size="small"
                      sx={{ 
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        height: 24,
                      }}
                    />
                  </Typography>
                </motion.div>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <AnimatePresence mode="wait">
                {!editMode && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Tooltip title="Edit Abstract" arrow>
                      <IconButton
                        onClick={handleEdit}
                        sx={{
                          color: "#fff",
                          bgcolor: "rgba(255, 255, 255, 0.15)",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.25)",
                            transform: "scale(1.05)",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        <Edit size={20} />
                      </IconButton>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>

              <Tooltip title={editMode ? "Cancel" : "Close"} arrow>
                <IconButton
                  onClick={editMode ? handleCancelEdit : onClose}
                  disabled={saving}
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.25)",
                      transform: "scale(1.05)",
                    },
                    "&:disabled": {
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  <X size={20} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Box>

        {/* CONTENT */}
        <Box sx={{ maxHeight: "calc(92vh - 180px)", overflowY: "auto" }}>
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Box sx={{ p: 3, pb: 0 }}>
                  <Alert 
                    severity="error" 
                    onClose={() => setError(null)}
                    sx={{ borderRadius: 2 }}
                    icon={<AlertTriangle size={20} />}
                  >
                    {error}
                  </Alert>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Alert */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Box sx={{ p: 3, pb: 0 }}>
                  <Alert 
                    severity="success" 
                    sx={{ borderRadius: 2 }}
                    icon={<Check size={20} />}
                  >
                    Abstract updated successfully!
                  </Alert>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Indicator */}
          <AnimatePresence>
            {editMode && hasChanges && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Box sx={{ px: 3, pt: 2 }}>
                  <Alert 
                    severity="info" 
                    sx={{ borderRadius: 2 }}
                    icon={<Edit size={20} />}
                  >
                    You have unsaved changes to the abstract
                  </Alert>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <Box sx={{ p: 3 }}>
            {/* Important Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  border: "2px solid #f1f5f9",
                  background: "linear-gradient(135deg, #f8fafc 0%, #fff 100%)",
                }}
              >
                <Box 
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    mb: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSection('details')}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    Article Information
                  </Typography>
                  <motion.div
                    animate={{ rotate: expandedSections.details ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ transform: "rotate(90deg)" }}>›</Box>
                  </motion.div>
                </Box>

                <Collapse in={expandedSections.details}>
                  <Stack spacing={2}>
                    {importantFields.map(({ key, label, color }) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Box
                              sx={{
                                width: 3,
                                height: 14,
                                borderRadius: 1,
                                bgcolor: color,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#64748b",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                fontSize: "0.7rem",
                              }}
                            >
                              {label}
                            </Typography>
                          </Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: "#1e293b",
                              pl: 1.5,
                              fontWeight: key === "Title" ? 600 : 400,
                              fontSize: key === "Title" ? "0.95rem" : "0.875rem",
                            }}
                          >
                            {record[key] || "—"}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Stack>
                </Collapse>
              </Paper>
            </motion.div>

            {/* Abstract Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Paper
                elevation={editMode ? 3 : 0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  border: editMode ? "2px solid #f59e0b" : "2px solid #f1f5f9",
                  background: editMode 
                    ? "linear-gradient(135deg, #fffbeb 0%, #fff 100%)"
                    : "linear-gradient(135deg, #f8fafc 0%, #fff 100%)",
                  transition: "all 0.3s ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 16,
                        borderRadius: 1,
                        background: editMode 
                          ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                          : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#1e293b",
                        fontWeight: 700,
                      }}
                    >
                      Abstract
                    </Typography>
                    {editMode && (
                      <Chip 
                        label="Editing" 
                        size="small" 
                        sx={{ 
                          height: 22,
                          fontSize: "0.7rem",
                          bgcolor: "#fef3c7",
                          color: "#92400e",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>

                  {!editMode && (
                    <Tooltip title={copied ? "Copied!" : "Copy abstract"} arrow>
                      <IconButton
                        size="small"
                        onClick={handleCopyAbstract}
                        sx={{
                          color: copied ? "#10b981" : "#64748b",
                          "&:hover": {
                            bgcolor: "#f1f5f9",
                          }
                        }}
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                
                <AnimatePresence mode="wait">
                  {editMode ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TextField
                        fullWidth
                        multiline
                        rows={12}
                        value={editedAbstract}
                        onChange={(e) => setEditedAbstract(e.target.value)}
                        disabled={saving}
                        placeholder="Enter abstract text..."
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: "#fff",
                            fontSize: "0.875rem",
                            lineHeight: 1.7,
                            "&:hover fieldset": {
                              borderColor: "#f59e0b",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#f59e0b",
                              borderWidth: 2,
                            },
                            "&.Mui-disabled": {
                              bgcolor: "#f8fafc",
                            }
                          }
                        }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography variant="caption" sx={{ color: "#64748b" }}>
                          {editedAbstract.length} characters
                        </Typography>
                        {hasChanges && (
                          <Typography variant="caption" sx={{ color: "#f59e0b", fontWeight: 600 }}>
                            Modified
                          </Typography>
                        )}
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: "#475569",
                          lineHeight: 1.8,
                          textAlign: "justify",
                          fontSize: "0.875rem",
                        }}
                      >
                        {record.Abstract || "No abstract available"}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Paper>
            </motion.div>

            {/* Additional Fields */}
            {otherFields.length > 0 && !editMode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "2px solid #f1f5f9",
                    background: "linear-gradient(135deg, #f8fafc 0%, #fff 100%)",
                  }}
                >
                  <Box 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between",
                      mb: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => toggleSection('additional')}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      Additional Information
                    </Typography>
                    <motion.div
                      animate={{ rotate: expandedSections.additional ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ transform: "rotate(90deg)" }}>›</Box>
                    </motion.div>
                  </Box>

                  <Collapse in={expandedSections.additional}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                        gap: 2,
                      }}
                    >
                      {otherFields.map((key, idx) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: "#fff",
                              border: "1px solid #e2e8f0",
                              transition: "all 0.2s",
                              "&:hover": {
                                borderColor: "#cbd5e1",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              }
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#64748b",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                fontSize: "0.7rem",
                              }}
                            >
                              {key}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: "#1e293b",
                                mt: 0.5,
                                fontWeight: 500,
                                fontSize: "0.875rem",
                              }}
                            >
                              {record[key] || "—"}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Collapse>
                </Paper>
              </motion.div>
            )}
          </Box>
        </Box>

        {/* FOOTER */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            bgcolor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Delete Button (Left Side) */}
          <AnimatePresence>
            {!editMode && !showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Tooltip title="Delete this article" arrow>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    startIcon={<Trash2 size={18} />}
                    sx={{
                      color: "#ef4444",
                      borderColor: "#fecaca",
                      "&:hover": {
                        bgcolor: "#fef2f2",
                        borderColor: "#ef4444",
                      },
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                    }}
                    variant="outlined"
                  >
                    Delete
                  </Button>
                </Tooltip>
              </motion.div>
            )}

            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                  Are you sure?
                </Typography>
                <Button
                  onClick={handleDelete}
                  startIcon={<Trash2 size={16} />}
                  sx={{
                    bgcolor: "#ef4444",
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "#dc2626",
                    },
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 2,
                    py: 0.75,
                  }}
                >
                  Confirm
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  sx={{
                    color: "#64748b",
                    "&:hover": {
                      bgcolor: "#f1f5f9",
                    },
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Mode Actions (Right Side) */}
          <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
            <AnimatePresence mode="wait">
              {editMode ? (
                <motion.div
                  key="edit-actions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  style={{ display: "flex", gap: 12 }}
                >
                  <Button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    startIcon={<XCircle size={18} />}
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
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    startIcon={saving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Save size={18} />
                      </motion.div>
                    ) : <Save size={18} />}
                    sx={{
                      px: 4,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                      background: hasChanges && !saving
                        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                        : "#cbd5e1",
                      color: hasChanges && !saving ? "#fff" : "#94a3b8",
                      boxShadow: hasChanges && !saving ? "0 4px 12px rgba(245, 158, 11, 0.3)" : "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: hasChanges && !saving ? "translateY(-2px)" : "none",
                        boxShadow: hasChanges && !saving ? "0 8px 24px rgba(245, 158, 11, 0.4)" : "none",
                      },
                      "&:disabled": {
                        background: "#cbd5e1",
                        color: "#94a3b8",
                      }
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Box>
        </Box>
      </motion.div>
    </Dialog>
  );
}