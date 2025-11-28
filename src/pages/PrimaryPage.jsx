import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function PrimaryPage() {
  const { id } = useParams();
  const location = useLocation();
  const project = location.state?.project;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Primary Screening</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Project: {project?.title} (ID: {id})
      </Typography>

      <Typography>
        Screening interface will be added here...
      </Typography>
    </Box>
  );
}
