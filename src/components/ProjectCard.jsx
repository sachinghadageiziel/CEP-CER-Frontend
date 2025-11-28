import React from "react";
import { Card, CardContent, Typography, Box, Chip, Button } from "@mui/material";

export default function ProjectCard({ project, onLaunch }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: 3,
        borderRadius: 2,
        p: 1,
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Owner: {project.owner}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Duration: {project.duration}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {project.description}
        </Typography>

        {/* Row with 3 elements */}
        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip label="Literature" color="primary" size="small" />
          <Chip label="Primary" color="success" size="small" />
          <Chip label="Secondary" color="warning" size="small" />
        </Box>
      </CardContent>

      {/* Launch button */}
      <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
        <Button variant="contained" color="secondary" fullWidth onClick={() => onLaunch(project)}>
          Launch
        </Button>
      </Box>
    </Card>
  );
}
