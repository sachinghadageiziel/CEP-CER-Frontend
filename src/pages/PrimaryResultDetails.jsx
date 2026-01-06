import React from "react";
import { 
  Box, 
  Typography, 
  Card, 
  Chip, 
  Button,
  Container,
  Fade,
  Divider,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, XCircle } from "lucide-react";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

export default function PrimaryResultDetails() {
  const { state } = useLocation();
  const { id: PROJECT_ID } = useParams();
  const navigate = useNavigate();

  if (!state) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Card sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              No article data available
            </Typography>
            <Button 
              onClick={() => navigate(-1)}
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </Card>
        </Container>
      </Layout>
    );
  }

  const isIncluded = state.Decision === "Include";

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
                  { label: state.PMID },
                ]}
              />

              {/* Back Button */}
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

              {/* Header Card */}
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
                        lineHeight: 1.4,
                      }}
                    >
                      {state.Title || "Article Details"}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        icon={isIncluded ? 
                          <CheckCircle size={16} /> : 
                          <XCircle size={16} />
                        }
                        label={state.Decision}
                        sx={{
                          background: isIncluded 
                            ? "linear-gradient(135deg, #10b981 0%, #22c55e 100%)"
                            : "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
                          color: "#fff",
                          fontWeight: 700,
                          height: 32,
                          fontSize: "0.875rem",
                          "& .MuiChip-icon": {
                            color: "#fff",
                          }
                        }}
                      />
                      {state.Category && (
                        <Chip
                          label={state.Category}
                          variant="outlined"
                          sx={{
                            borderWidth: 2,
                            borderColor: "#667eea",
                            color: "#667eea",
                            fontWeight: 600,
                            height: 32,
                          }}
                        />
                      )}
                      <Chip
                        label={`PMID: ${state.PMID}`}
                        sx={{
                          bgcolor: "#f1f5f9",
                          color: "#64748b",
                          fontWeight: 600,
                          height: 32,
                        }}
                      />
                    </Stack>
                  </Box>
                </Box>

                {/* Metadata */}
                {(state.Authors || state.Journal || state.Year) && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box 
                      sx={{ 
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                        gap: 3,
                      }}
                    >
                      {state.Authors && (
                        <Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: "#64748b",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}
                          >
                            Authors
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ color: "#1e293b", mt: 0.5 }}
                          >
                            {state.Authors}
                          </Typography>
                        </Box>
                      )}
                      {state.Journal && (
                        <Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: "#64748b",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}
                          >
                            Journal
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ color: "#1e293b", mt: 0.5 }}
                          >
                            {state.Journal}
                          </Typography>
                        </Box>
                      )}
                      {state.Year && (
                        <Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: "#64748b",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}
                          >
                            Year
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ color: "#1e293b", mt: 0.5 }}
                          >
                            {state.Year}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </Card>

              {/* Abstract Section */}
              <Card
                sx={{
                  p: 4,
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  border: "1px solid #e2e8f0",
                }}
              >
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
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: "#1e293b",
                    }}
                  >
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
                  {state.Abstract || "No abstract available"}
                </Typography>
              </Card>

              {/* Rationale Section */}
              {state.Rationale && (
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    border: "1px solid #e2e8f0",
                    background: isIncluded 
                      ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                      : "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                  }}
                >
                  <Box 
                    sx={{ 
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                      pb: 2,
                      borderBottom: `2px solid ${isIncluded ? "#86efac" : "#fecaca"}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 32,
                        borderRadius: 1,
                        background: isIncluded 
                          ? "linear-gradient(135deg, #10b981 0%, #22c55e 100%)"
                          : "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
                      }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      Decision Rationale
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      color: "#475569",
                      lineHeight: 1.8,
                    }}
                  >
                    {state.Rationale}
                  </Typography>
                </Card>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    }
                  }}
                >
                  Back to List
                </Button>
              </Box>
            </div>
          </Fade>
        </Container>
      </Box>
    </Layout>
  );
}