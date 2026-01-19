import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle, XCircle, Trash2, Save, AlertTriangle, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Card, TextField, Stack, CircularProgress,
  Container, Fade, MenuItem, Chip, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Snackbar, Tooltip, Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

const API_BASE = "http://localhost:5000/api/primary";

export default function PrimaryArticlePage() {
  const { id: PROJECT_ID, pmid } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overrideMode, setOverrideMode] = useState(false);
  const [overrideDecision, setOverrideDecision] = useState("");
  const [overrideRationale, setOverrideRationale] = useState("");
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
          // Store current decision for override
          setOverrideDecision(found.decision?.toUpperCase() || "");
          setOverrideRationale(found.rationale || "");
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

  const handleOverride = async () => {
    if (!overrideDecision) {
      showSnackbar("Please select a decision", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("decision", overrideDecision);
      formData.append("rationale", overrideRationale);

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
        setOverrideMode(false);
        showSnackbar("Decision overridden successfully!", "success");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to override decision");
      }
    } catch (error) {
      console.error("Error overriding decision:", error);
      showSnackbar("Failed to override decision", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
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
        <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", 
          background: "linear-gradient(135deg, #E8F4F8 0%, #B8E0F0 100%)" }}>
          <Box sx={{ textAlign: "center" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <CircularProgress size={48} sx={{ color: "#0284c7" }} />
            </motion.div>
            <Typography variant="body1" sx={{ mt: 2, color: "#475569", fontWeight: 600 }}>Loading article...</Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #E8F4F8 0%, #B8E0F0 100%)" }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <BreadcrumbsBar items={[
              { label: "Home", to: "/" },
              { label: "Project", to: `/project/${PROJECT_ID}` },
              { label: "Primary Search", to: `/project/${PROJECT_ID}/primary` },
              { label: "Article" },
            ]} />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card sx={{ p: 6, textAlign: "center", borderRadius: 4, mt: 4, 
                background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)" }}>
                <FileText size={64} color="#94a3b8" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: "#64748b", mb: 2 }}>Article not found</Typography>
                <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowLeft size={18} />}
                  sx={{ borderRadius: 3, borderWidth: 2 }}>
                  Back to Results
                </Button>
              </Card>
            </motion.div>
          </Container>
        </Box>
      </Layout>
    );
  }

  const isIncluded = article.decision?.toUpperCase() === "INCLUDE";
  const currentDecision = article.decision?.toUpperCase() || "NO DECISION";

  return (
    <Layout>
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #E8F4F8 0%, #B8E0F0 100%)" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
          <Fade in timeout={600}>
            <div>
              <BreadcrumbsBar items={[
                { label: "Home", to: "/" },
                { label: "Project", to: `/project/${PROJECT_ID}` },
                { label: "Primary Search", to: `/project/${PROJECT_ID}/primary` },
                { label: `Article ${pmid}` },
              ]} />

              {/* Top Action Bar */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, 
                  flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                  <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)}
                    sx={{ textTransform: "none", fontWeight: 700, color: "#0284c7",
                      background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", px: 3, py: 1.5, borderRadius: 3,
                      border: "2px solid rgba(2, 132, 199, 0.3)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      "&:hover": { background: "rgba(255,255,255,0.95)", transform: "translateY(-2px)", 
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)" } }}>
                    Back to Results
                  </Button>

                  <Tooltip title="Delete record">
                    <IconButton onClick={() => setDeleteDialog(true)}
                      sx={{ background: "rgba(239, 68, 68, 0.1)", backdropFilter: "blur(10px)", color: "#ef4444",
                        border: "2px solid rgba(239, 68, 68, 0.3)", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                        "&:hover": { background: "rgba(239, 68, 68, 0.2)", transform: "scale(1.05)" } }}>
                      <Trash2 size={20} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </motion.div>

              {/* HEADER CARD */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <Card sx={{ p: { xs: 3, md: 4 }, mb: 3, borderRadius: 4, 
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)", border: "2px solid rgba(255,255,255,0.5)",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                  backdropFilter: "blur(20px)", position: "relative", overflow: "hidden" }}>
                  
                  {/* Animated Background */}
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200,
                      background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)", borderRadius: "50%" }} />
                  
                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: { xs: 2, md: 3 }, mb: 3,
                      flexDirection: { xs: "column", sm: "row" } }}>
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Box sx={{ width: { xs: 50, md: 64 }, height: { xs: 50, md: 64 }, borderRadius: 3,
                          background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)", display: "flex",
                          alignItems: "center", justifyContent: "center", flexShrink: 0,
                          boxShadow: "0 8px 24px rgba(2, 132, 199, 0.4)" }}>
                          <FileText color="#fff" size={32} />
                        </Box>
                      </motion.div>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mb: 2, 
                          fontSize: { xs: "1.5rem", md: "2rem" }, lineHeight: 1.3, wordBreak: "break-word" }}>
                          {article.title || "Article Review"}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip label={`PMID: ${article.article_id || article.literature_id}`}
                            sx={{ background: "rgba(2, 132, 199, 0.1)", color: "#0284c7", fontWeight: 700,
                              border: "2px solid rgba(2, 132, 199, 0.3)", height: 32 }} />
                          
                          <AnimatePresence>
                            {article.decision && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} 
                                transition={{ type: "spring", stiffness: 500 }}>
                                <Chip icon={isIncluded ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                  label={currentDecision}
                                  sx={{ background: isIncluded 
                                      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                    color: "#fff", fontWeight: 700, height: 32,
                                    boxShadow: isIncluded ? "0 4px 12px rgba(16, 185, 129, 0.4)" 
                                      : "0 4px 12px rgba(239, 68, 68, 0.4)",
                                    "& .MuiChip-icon": { color: "#fff" } }} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {article.exclusion_criteria && (
                            <Chip label={article.exclusion_criteria} variant="outlined"
                              sx={{ borderWidth: 2, borderColor: "#0891b2", color: "#0891b2", fontWeight: 700, height: 32 }} />
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </motion.div>

              {/* ABSTRACT SECTION */}
              {article.abstract && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card sx={{ p: { xs: 3, md: 4 }, mb: 3, borderRadius: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    border: "2px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
                    transition: "all 0.3s ease", "&:hover": { transform: "translateY(-4px)", 
                      boxShadow: "0 12px 40px rgba(0,0,0,0.12)" } }}>
                    
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, pb: 2,
                      borderBottom: "3px solid", borderImage: "linear-gradient(90deg, #0284c7, transparent) 1" }}>
                      <Box sx={{ width: 6, height: 40, borderRadius: 1,
                        background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)" }} />
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
                        Abstract
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.9, textAlign: "justify",
                      fontSize: { xs: "0.95rem", md: "1rem" } }}>
                      {article.abstract}
                    </Typography>
                  </Card>
                </motion.div>
              )}

              {/* DECISION SECTION */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card sx={{ p: { xs: 3, md: 4 }, mb: 3, borderRadius: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  border: "2px solid rgba(255,255,255,0.5)", 
                  background: isIncluded 
                    ? "linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(220, 252, 231, 0.95) 100%)"
                    : "linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 226, 226, 0.95) 100%)",
                  backdropFilter: "blur(20px)", transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" } }}>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, pb: 2,
                    borderBottom: `3px solid ${isIncluded ? "#86efac" : "#fecaca"}` }}>
                    <Box sx={{ width: 6, height: 40, borderRadius: 1,
                      background: isIncluded 
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
                      Current Decision
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: 1, fontSize: "0.75rem" }}>
                      DECISION
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#0f172a", mt: 1, fontWeight: 800 }}>
                      {currentDecision}
                    </Typography>
                  </Box>

                  {article.rationale && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: 1, fontSize: "0.75rem" }}>
                        RATIONALE
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8, mt: 1 }}>
                        {article.rationale}
                      </Typography>
                    </Box>
                  )}

                  {article.exclusion_criteria && (
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: 1, fontSize: "0.75rem" }}>
                        APPLIED EXCLUSION CRITERIA
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8, mt: 1 }}>
                        {article.exclusion_criteria}
                      </Typography>
                    </Box>
                  )}
                </Card>
              </motion.div>

              {/* OVERRIDE DECISION SECTION */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                  border: "3px solid", borderColor: overrideMode ? "#f59e0b" : "rgba(2, 132, 199, 0.3)",
                  background: overrideMode 
                    ? "linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(253, 230, 138, 0.95) 100%)"
                    : "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(20px)", transition: "all 0.4s ease" }}>
                  
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, pb: 3,
                    borderBottom: "3px solid", borderImage: overrideMode 
                      ? "linear-gradient(90deg, #f59e0b, transparent) 1"
                      : "linear-gradient(90deg, #0284c7, transparent) 1",
                    flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <motion.div animate={{ rotate: overrideMode ? [0, 10, -10, 0] : 0 }}
                        transition={{ duration: 0.5 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 2, display: "flex", alignItems: "center",
                          justifyContent: "center", background: overrideMode 
                            ? "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)"
                            : "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                          <Shield color="#fff" size={24} />
                        </Box>
                      </motion.div>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", 
                          fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
                          Override Decision
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                          Manually change the screening decision
                        </Typography>
                      </Box>
                    </Box>

                    {!overrideMode ? (
                      <Button variant="contained" startIcon={<Shield size={18} />}
                        onClick={() => setOverrideMode(true)}
                        sx={{ background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)", color: "#fff",
                          px: 4, py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: "none",
                          boxShadow: "0 4px 16px rgba(2, 132, 199, 0.4)", fontSize: "1rem",
                          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(2, 132, 199, 0.5)" } }}>
                        Enable Override
                      </Button>
                    ) : (
                      <Chip label="Override Mode Active" icon={<AlertTriangle size={16} />}
                        sx={{ background: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)", color: "#fff",
                          fontWeight: 700, height: 36, boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)",
                          "& .MuiChip-icon": { color: "#fff" } }} />
                    )}
                  </Box>

                  <AnimatePresence>
                    {overrideMode && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
                        <Box sx={{ mb: 3 }}>
                          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}>
                            You are about to override the AI decision. This action will replace the current decision.
                          </Alert>

                          <TextField select fullWidth label="Override Decision" value={overrideDecision}
                            onChange={(e) => setOverrideDecision(e.target.value)}
                            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2, fontWeight: 600 } }}>
                            <MenuItem value="">Select decision</MenuItem>
                            <MenuItem value="INCLUDE">INCLUDE</MenuItem>
                            <MenuItem value="EXCLUDE">EXCLUDE</MenuItem>
                          </TextField>

                          <TextField multiline rows={4} fullWidth label="Override Rationale"
                            placeholder="Provide detailed reasoning for overriding the decision..."
                            value={overrideRationale} onChange={(e) => setOverrideRationale(e.target.value)}
                            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />

                          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button variant="outlined" startIcon={<XCircle size={18} />}
                              onClick={() => {
                                setOverrideMode(false);
                                setOverrideDecision(article.decision?.toUpperCase() || "");
                                setOverrideRationale(article.rationale || "");
                              }}
                              sx={{ px: 4, py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 700,
                                borderWidth: 2, "&:hover": { borderWidth: 2 } }}>
                              Cancel
                            </Button>
                            <Button variant="contained" startIcon={<Save size={18} />}
                              onClick={handleOverride} disabled={submitting}
                              sx={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", px: 4, py: 1.5,
                                borderRadius: 2, textTransform: "none", fontWeight: 700,
                                boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
                                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(16, 185, 129, 0.5)" } }}>
                              {submitting ? "Saving..." : "Save Override"}
                            </Button>
                          </Box>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>
          </Fade>
        </Container>

        {/* Delete Dialog */}
        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}
          PaperProps={{ sx: { borderRadius: 4, minWidth: { xs: "90%", sm: 450 } } }}>
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2,
            background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", color: "#991b1b", fontWeight: 800 }}>
            <Trash2 size={24} />
            Delete Screening Record?
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              This action cannot be undone!
            </Alert>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Are you sure you want to delete this screening record for PMID: <strong>{pmid}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={() => setDeleteDialog(false)}
              sx={{ textTransform: "none", fontWeight: 700, px: 3 }}>
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="contained" startIcon={<Trash2 size={18} />}
              sx={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", textTransform: "none",
                fontWeight: 700, px: 4 }}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}
            sx={{ borderRadius: 3, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}