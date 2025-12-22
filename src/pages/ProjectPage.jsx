import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import Layout from "../Layout/Layout";

// 🔹 Images
import literatureImg from "../assets/literature.png";
import primaryImg from "../assets/Primary.png";
import secondaryImg from "../assets/secondary.png";

export default function ProjectPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const project = location.state?.project;
  const itemsProcessed = 0;

  const steps = [
    {
      title: "Literature Search",
      subtitle: "Upload keywords and search across multiple databases",
      path: "literature",
      image: literatureImg,
    },
    {
      title: "Primary Screening",
      subtitle: "Review and screen literature based on inclusion criteria",
      path: "primary",
      image: primaryImg,
    },
    {
      title: "Secondary Screening",
      subtitle: "Detailed evaluation and quality assessment of selected papers",
      path: "secondary",
      image: secondaryImg,
    },
  ];

  return (
    <Layout>
      <Box sx={{ p: { xs: 2, md: 4 }, width: "100%" }}>
        {/* Header */}
        <Typography variant="h4" gutterBottom>
          {project?.title} (Project ID: {id})
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          Owner: {project?.owner} • Duration: {project?.duration}
        </Typography>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
            maxWidth: 1400,
            mx: "auto",
          }}
        >
          {steps.map((step, index) => (
            <Card
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 45%",
                  md: "1 1 30%",
                },
                minHeight: 380,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0px 6px 18px rgba(0,0,0,0.15)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0px 14px 40px rgba(0,0,0,0.2)",
                },
              }}
            >
              {/* 🖼 Image */}
              <Box
                sx={{
                  height: 160,
                  background: `url(${step.image}) center / cover no-repeat`,
                }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {step.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {step.subtitle}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" fontWeight="bold">
                  Items Processed: {itemsProcessed}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() =>
                    navigate(`/project/${id}/${step.path}`, {
                      state: { project },
                    })
                  }
                >
                  Start
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Layout>
  );
}
