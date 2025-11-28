import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function LiteraturePage() {
  const { id } = useParams();
  const location = useLocation();
  const project = location.state?.project;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Literature Search</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Project: {project?.title} (ID: {id})
      </Typography>

      <Typography>
        Upload keywords and run search (UI coming here)...
      </Typography>
    </Box>
  );
}
