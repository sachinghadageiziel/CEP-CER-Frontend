import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  TextField,
  Stack,
  CircularProgress,
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
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  /* ---------------- not found ---------------- */

  if (!article) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <BreadcrumbsBar
            items={[
              { label: "Home", to: "/" },
              { label: "Project", to: `/project/${PROJECT_ID}` },
              { label: "Primary Search", to: `/project/${PROJECT_ID}/primary` },
              { label: "Article" },
            ]}
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            Article not found
          </Typography>

          <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>
            Back to Results
          </Button>
        </Box>
      </Layout>
    );
  }


  return (
    <Layout>
      <Box sx={{ p: 3, background: "#f8fafc", minHeight: "100vh" }}>
        <BreadcrumbsBar
          items={[
            { label: "Home", to: "/" },
            { label: "Project", to: `/project/${PROJECT_ID}` },
            { label: "Primary Search", to: `/project/${PROJECT_ID}/primary` },
            { label: `Article ${pmid}` },
          ]}
        />

        <Button
          startIcon={<ChevronLeft size={16} />}
          size="small"
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Results
        </Button>

        <motion.div variants={pageVariant} initial="hidden" animate="show">
          {/* TITLE */}
          <motion.div variants={sectionVariant}>
            <Typography variant="h4" fontWeight={700} sx={{ maxWidth: 900 }}>
              Article Review — PMID {article.PMID}
            </Typography>
          </motion.div>

          {/* ARTICLE INFO */}
          <motion.div variants={sectionVariant}>
            <Card sx={cardStyle}>
              <Typography variant="subtitle1" fontWeight={600}>
                Article Information
              </Typography>

              <Stack spacing={1} sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Journal: {article.Journal || "—"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Year: {article.Year || "—"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Decision: {article.Decision || "—"}
                </Typography>

                <Typography variant="body2" color="primary">
                  Category: {article.Category || "—"}
                </Typography>
              </Stack>
            </Card>
          </motion.div>

          {/* ABSTRACT */}
          <motion.div variants={sectionVariant}>
            <Card sx={cardStyle}>
              <Typography variant="subtitle1" fontWeight={600}>
                Abstract
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1, lineHeight: 1.7, maxWidth: 900 }}
              >
                {article.Abstract || "No abstract available."}
              </Typography>
            </Card>
          </motion.div>

          {/* OVERRIDE */}
          <motion.div variants={sectionVariant}>
            <Card sx={cardStyle}>
              <Typography variant="subtitle1" fontWeight={600}>
                Override Decision
              </Typography>

              <TextField
                select
                fullWidth
                SelectProps={{ native: true }}
                sx={{ mt: 2 }}
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
              >
                <option value="">Select decision</option>
                <option value="Include">Include</option>
                <option value="Exclude">Exclude</option>
                {/* <option value="Undecided">Undecided</option> */}
              </TextField>

              <TextField
                multiline
                rows={3}
                fullWidth
                sx={{ mt: 2 }}
                placeholder="Reason for override"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <motion.div whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                  disabled={submitting || !decision}
                  onClick={submitOverride}
                >
                  {submitting ? "Submitting…" : "Accept Override"}
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      </Box>
    </Layout>
  );
}

const cardStyle = {
  p: 3,
  mt: 3,
  borderRadius: 3,
  transition: "0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },
};
