import { motion } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle, XCircle } from "lucide-react";
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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

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
  const [decision, setDecision] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(
      `http://localhost:5000/api/primary/existing?project_id=${PROJECT_ID}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data?.masterSheet) {
          setArticle(null);
          return;
        }

        const found = data.masterSheet.find(
          (row) => String(row.PMID) === String(pmid)
        );

        setArticle(found || null);
      })
      .finally(() => setLoading(false));
  }, [PROJECT_ID, pmid]);

  const submitOverride = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    alert("Override submitted successfully");
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
            <CircularProgress size={48} />
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
          </Container>
        </Box>
      </Layout>
    );
  }

  const isIncluded = article.Decision === "Include";

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

              <Button
                startIcon={<ArrowLeft size={18} />}
                onClick={() => navigate(-1)}
                sx={{
                  mb: 3,
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
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
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
                          Article Review
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip
                            label={`PMID: ${article.PMID}`}
                            sx={{
                              bgcolor: "#f1f5f9",
                              color: "#64748b",
                              fontWeight: 600,
                            }}
                          />
                          {article.Decision && (
                            <Chip
                              icon={isIncluded ? 
                                <CheckCircle size={16} /> : 
                                <XCircle size={16} />
                              }
                              label={article.Decision}
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
                          )}
                          {article.Category && (
                            <Chip
                              label={article.Category}
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
                  </Card>
                </motion.div>

                {/* ARTICLE INFO */}
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
                          background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        Article Information
                      </Typography>
                    </Box>

                    <Box 
                      sx={{ 
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                        gap: 3,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                          JOURNAL
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#1e293b", mt: 0.5 }}>
                          {article.Journal || "—"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
                          YEAR
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#1e293b", mt: 0.5 }}>
                          {article.Year || "—"}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>

                {/* ABSTRACT */}
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
                      sx={{ 
                        color: "#475569",
                        lineHeight: 1.8,
                        textAlign: "justify",
                      }}
                    >
                      {article.Abstract || "No abstract available."}
                    </Typography>
                  </Card>
                </motion.div>

                {/* OVERRIDE */}
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
                          background: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        Override Decision
                      </Typography>
                    </Box>

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
                      label="Reason for override"
                      placeholder="Provide detailed reasoning for your decision..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      disabled={submitting || !decision}
                      onClick={submitOverride}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: "none",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                      {submitting ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CircularProgress size={20} color="inherit" />
                          <span>Submitting...</span>
                        </Box>
                      ) : (
                        "Submit Override"
                      )}
                    </Button>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </Fade>
        </Container>
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