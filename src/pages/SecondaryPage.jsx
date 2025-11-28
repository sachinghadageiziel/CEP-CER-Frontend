import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function SecondaryPage() {
  const { id } = useParams();
  const location = useLocation();
  const project = location.state?.project;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Secondary Screening</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Project: {project?.title} (ID: {id})
      </Typography>

      <Typography>
        Quality assessment UI will appear here...
      </Typography>
    </Box>
  );
}
