import { motion } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle, XCircle, Edit, Trash2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  TextField,
  Stack,
  CircularProgress,
  Container,
  Fade,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

const API_BASE = "http://localhost:5000/api/primary";

const pageVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function PrimaryArticlePage() {
  const { id: PROJECT_ID, pmid } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [decision, setDecision] = useState("");
  const [rationale, setRationale] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    loadArticle();
  }, [PROJECT_ID, pmid]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/primary-screen?project_id=${PROJECT_ID}`);
      const data = await response.json();

      if (data?.exists && data?.data) {
        const found = data.data.find(
          (item) => String(item.article_id) === String(pmid) || String(item.literature_id) === String(pmid)
        );
        if (found) {
          setArticle(found);
          // Normalize decision value to match MenuItem values
          const normalizedDecision = found.decision 
            ? found.decision.charAt(0).toUpperCase() + found.decision.slice(1).toLowerCase()
            : "";
          setDecision(normalizedDecision);
          setRationale(found.rationale || "");
        } else {
          setArticle(null);
        }
      }
    } catch (error) {
      console.error("Error loading article:", error);
      showSnackbar("Failed to load article", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!decision) {
      showSnackbar("Please select a decision", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("decision", decision);
      formData.append("rationale", rationale);

      // Use literature_id for the API endpoint
      const literatureId = article.literature_id;
      
      const response = await fetch(
        `${API_BASE}/${PROJECT_ID}/${literatureId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        await loadArticle();
        setEditing(false);
        showSnackbar("Decision updated successfully!", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update decision");
      }
    } catch (error) {
      console.error("Error updating decision:", error);
      showSnackbar("Failed to update decision", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      // Use literature_id for the API endpoint
      const literatureId = article.literature_id;
      
      const response = await fetch(
        `${API_BASE}/${PROJECT_ID}/${literatureId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        showSnackbar("Record deleted successfully", "success");
        setTimeout(() => {
          navigate(`/project/${PROJECT_ID}/primary`);
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      showSnackbar("Failed to delete record", "error");
    }
    setDeleteDialog(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f8fafc",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <CircularProgress size={48} />
            </motion.div>
            <Typography variant="body1" sx={{ mt: 2, color: "#64748b" }}>
              Loading article...
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <BreadcrumbsBar
              items={[
                { label: "Home", to: "/" },
                { label: "Project", to: `/project/${PROJECT_ID}` },
                { label: "Primary Search", to: `/project/${PROJECT_ID}/primary` },
                { label: "Article" },
              ]}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card sx={{ p: 6, textAlign: "center", borderRadius: 3, mt: 4 }}>
                <FileText size={64} color="#94a3b8" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: "#64748b", mb: 2 }}>
                  Article not found
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowLeft size={18} />}
                >
                  Back to Results
                </Button>
              </Card>
            </motion.div>
          </Container>
        </Box>
      </Layout>
    );
  }

  const isIncluded = article.decision === "Include";

  return (
    <Layout>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Fade in timeout={600}>
            <div>
              <BreadcrumbsBar
                items={[
                  { label: "Home", to: "/" },
                  { label: "Project", to: `/project/${PROJECT_ID}` },
                  { label: "Primary Search", to: `/project/${PROJECT_ID}/primary` },
                  { label: `Article ${pmid}` },
                ]}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Button
                  startIcon={<ArrowLeft size={18} />}
                  onClick={() => navigate(-1)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#64748b",
                    "&:hover": {
                      bgcolor: "#f1f5f9",
                      color: "#1e293b",
                    }
                  }}
                >
                  Back to Results
                </Button>

                <Box sx={{ display: "flex", gap: 2 }}>
                  {!editing ? (
                    <>
                      <Tooltip title="Edit decision">
                        <IconButton
                          onClick={() => setEditing(true)}
                          sx={{
                            bgcolor: "#f1f5f9",
                            "&:hover": { bgcolor: "#e2e8f0" }
                          }}
                        >
                          <Edit size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete record">
                        <IconButton
                          onClick={() => setDeleteDialog(true)}
                          sx={{
                            bgcolor: "#fef2f2",
                            color: "#ef4444",
                            "&:hover": { bgcolor: "#fee2e2" }
                          }}
                        >
                          <Trash2 size={20} />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Button
                        startIcon={<X size={18} />}
                        onClick={() => {
                          setEditing(false);
                          setDecision(article.decision || "");
                          setRationale(article.rationale || "");
                        }}
                        variant="outlined"
                        sx={{ textTransform: "none" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        startIcon={<Save size={18} />}
                        onClick={handleUpdate}
                        disabled={submitting}
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                        }}
                      >
                        {submitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              <motion.div variants={pageVariant} initial="hidden" animate="show">
                {/* HEADER */}
                <motion.div variants={sectionVariant}>
                  <Card
                    sx={{
                      p: 4,
                      mb: 3,
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                      border: "1px solid #e2e8f0",
                      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        position: "absolute",
                        top: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "50%",
                      }}
                    />
                    
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 2,
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                            }}
                          >
                            <FileText color="#fff" size={28} />
                          </Box>
                        </motion.div>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 700,
                              color: "#1e293b",
                              mb: 2,
                              fontSize: { xs: "1.5rem", md: "2rem" }
                            }}
                          >
                            {article.title || "Article Review"}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip
                              label={`PMID: ${article.article_id || article.literature_id}`}
                              sx={{
                                bgcolor: "#f1f5f9",
                                color: "#64748b",
                                fontWeight: 600,
                              }}
                            />
                            {article.decision && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              >
                                <Chip
                                  icon={isIncluded ? 
                                    <CheckCircle size={16} /> : 
                                    <XCircle size={16} />
                                  }
                                  label={article.decision}
                                  sx={{
                                    background: isIncluded 
                                      ? "linear-gradient(135deg, #10b981 0%, #22c55e 100%)"
                                      : "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    "& .MuiChip-icon": {
                                      color: "#fff",
                                    }
                                  }}
                                />
                              </motion.div>
                            )}
                            {article.exclusion_criteria && (
                              <Chip
                                label={article.exclusion_criteria}
                                variant="outlined"
                                sx={{
                                  borderWidth: 2,
                                  borderColor: "#667eea",
                                  color: "#667eea",
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>

                {/* ABSTRACT SECTION */}
                {article.abstract && (
                  <motion.div variants={sectionVariant}>
                    <Card sx={cardStyle}>
                      <Box 
                        sx={{ 
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                          pb: 2,
                          borderBottom: "2px solid #f1f5f9",
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 32,
                            borderRadius: 1,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                          Abstract
                        </Typography>
                      </Box>

                      <Typography 
                        variant="body1"
                        sx={{ 
                          color: "#475569",
                          lineHeight: 1.8,
                          textAlign: "justify",
                        }}
                      >
                        {article.abstract}
                      </Typography>
                    </Card>
                  </motion.div>
                )}

                {/* DECISION SECTION */}
                <motion.div variants={sectionVariant}>
                  <Card sx={{
                    ...cardStyle,
                    background: editing 
                      ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                      : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  }}>
                    <Box 
                      sx={{ 
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                        pb: 2,
                        borderBottom: "2px solid #f1f5f9",
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 32,
                          borderRadius: 1,
                          background: editing
                            ? "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)"
                            : "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        {editing ? "Edit Decision" : "Current Decision"}
                      </Typography>
                      {editing && (
                        <Chip 
                          label="Editing Mode" 
                          size="small"
                          sx={{
                            background: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>

                    {editing ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TextField
                          select
                          fullWidth
                          label="Decision"
                          value={decision}
                          onChange={(e) => setDecision(e.target.value)}
                          sx={{ mb: 2 }}
                        >
                          <MenuItem value="">Select decision</MenuItem>
                          <MenuItem value="Include">Include</MenuItem>
                          <MenuItem value="Exclude">Exclude</MenuItem>
                        </TextField>

                        <TextField
                          multiline
                          rows={4}
                          fullWidth
                          label="Rationale"
                          placeholder="Provide detailed reasoning for your decision..."
                          value={rationale}
                          onChange={(e) => setRationale(e.target.value)}
                        />
                      </motion.div>
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                          DECISION
                        </Typography>
                        <Typography variant="h6" sx={{ color: "#1e293b", mt: 0.5, mb: 2 }}>
                          {article.decision || "No decision made"}
                        </Typography>

                        {article.rationale && (
                          <>
                            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                              RATIONALE
                            </Typography>
                            <Typography 
                              variant="body1"
                              sx={{ 
                                color: "#475569",
                                lineHeight: 1.8,
                                mt: 0.5,
                              }}
                            >
                              {article.rationale}
                            </Typography>
                          </>
                        )}

                        {article.exclusion_criteria && (
                          <>
                            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, mt: 2, display: "block" }}>
                              EXCLUSION CRITERIA
                            </Typography>
                            <Typography 
                              variant="body1"
                              sx={{ 
                                color: "#475569",
                                lineHeight: 1.8,
                                mt: 0.5,
                              }}
                            >
                              {article.exclusion_criteria}
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </Fade>
        </Container>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          disableRestoreFocus
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: { xs: "90%", sm: 400 },
            }
          }}
        >
          <DialogTitle sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
            color: "#991b1b",
            fontWeight: 700,
          }}>
            <Trash2 size={24} />
            Delete Screening Record?
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone!
            </Alert>
            <Typography variant="body2" color="text.secondary">
              Are you sure you want to delete this screening record for PMID: {pmid}?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setDeleteDialog(false)}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              variant="contained"
              startIcon={<Trash2 size={18} />}
              sx={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}

const cardStyle = {
  p: 3,
  mt: 3,
  borderRadius: 3,
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
  },
};