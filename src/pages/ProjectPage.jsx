import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Button,
} from "@mui/material";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

// Images (keep same)
import literatureImg from "../assets/literature.png";
import primaryImg from "../assets/Primary.png";
import secondaryImg from "../assets/secondary.png";

export default function ProjectPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const project = location.state?.project;

  const steps = [
    {
      title: "Literature Search",
      subtitle: "Upload keywords and search across multiple databases",
      path: "literature",
      image: literatureImg,
      bg: "#e3f2fd",
      btn: "linear-gradient(90deg,#2563eb,#14b8a6)",
    },
    {
      title: "Primary Screening",
      subtitle: "Review and screen literature based on inclusion criteria",
      path: "primary",
      image: primaryImg,
      bg: "#fff8e1",
      btn: "#eab308",
    },
    {
      title: "Secondary Screening",
      subtitle: "Detailed evaluation and quality assessment of selected papers",
      path: "secondary",
      image: secondaryImg,
      bg: "#e8f5e9",
      btn: "#22c55e",
    },
  ];

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>

        {/* Breadcrumb */}
        <BreadcrumbsBar
          items={[
            { label: "Home", to: "/" },
            { label: "Project" },
          ]}
        />

        {/* Header */}
        <Typography variant="h4" fontWeight={700}>
          {project?.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Owner: {project?.owner} • Duration: {project?.duration}
        </Typography>

        {/* Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 3,
          }}
        >
          {steps.map((step) => (
            <Card
              key={step.path}
              sx={{
                borderRadius: 3,
                p: 3,
                height: 360,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                transition: "transform .18s ease, box-shadow .18s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 14px 36px rgba(0,0,0,0.15)",
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  background: step.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <img src={step.image} alt={step.title} width={28} />
              </Box>

              {/* Content */}
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {step.subtitle}
                </Typography>

                {/* Items processed box */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    background: step.bg,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Items Processed
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    0
                  </Typography>
                </Box>
              </Box>

              {/* Start Button */}
              <Button
                fullWidth
                sx={{
                  mt: 3,
                  color: "#fff",
                  background: step.btn,
                  borderRadius: 2,
                  fontWeight: 600,
                  py: 1.2,
                  "&:hover": { opacity: 0.95 },
                }}
                onClick={() =>
                  navigate(`/project/${id}/${step.path}`, {
                    state: { project },
                  })
                }
              >
                Start
              </Button>
            </Card>
          ))}
        </Box>
      </Box>
    </Layout>
  );
}
