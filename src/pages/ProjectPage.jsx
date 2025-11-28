import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, Divider } from "@mui/material";

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
    },
    {
      title: "Primary Screening",
      subtitle: "Review and screen literature based on inclusion criteria",
      path: "primary",
    },
    {
      title: "Secondary Screening",
      subtitle: "Detailed evaluation and quality assessment of selected papers",
      path: "secondary",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: "100%", boxSizing: "border-box" }}>
      {/* Page Header */}
      <Typography variant="h4" gutterBottom>
        {project?.title} (Project ID: {id})
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Owner: {project?.owner} • Duration: {project?.duration}
      </Typography>

      {/* Steps Row */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          width: "100%",
          maxWidth: 1400, // container max width
          margin: "0 auto", // center horizontally
        }}
      >
        {steps.map((step, index) => (
          <Card
            key={index}
            sx={{
              flex: {
                xs: "1 1 100%",  // mobile: full width
                sm: "1 1 45%",   // tablet: ~2 per row
                md: "1 1 30%",   // desktop: ~3 per row
              },
              minHeight: 350,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 3,
              boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
              transition: "0.2s",
              "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {step.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {step.subtitle}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Items Processed: {itemsProcessed}
              </Typography>
            </CardContent>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() =>
                navigate(`/project/${id}/${step.path}`, { state: { project } })
              }
            >
              Start
            </Button>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
