import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function ActionCard({
  title,
  description,
  icon,
  onStart,
  running = false,
}) {
  return (
    <Card
      sx={{
        width: {
          xs: "100%",
          sm: 320,
          md: 360,
        },
        height: {
          xs: 200,
          md: 230,
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        //  Sharp edges
        borderRadius: 1.5,

        background: running
          ? "linear-gradient(135deg, #eeeeee, #f5f5f5)"
          : "#ffffff",

        boxShadow: running
          ? "0 6px 18px rgba(0,0,0,0.12)"
          : "0 10px 35px rgba(0,0,0,0.14)",

        transition: "all 0.3s ease",
        cursor: running ? "not-allowed" : "pointer",
        position: "relative",
        overflow: "hidden",

        "&:hover": !running && {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 45px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* CONTENT */}
      <CardContent sx={{ pb: 1 }}>
        {/* ICON */}
        <Box sx={{ mb: 1.5 }}>{icon}</Box>

        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.8 }}
        >
          {description}
        </Typography>
      </CardContent>

      {/*  ACTION */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          disableElevation
          disabled={running}
          onClick={onStart}
          startIcon={!running && <PlayArrowIcon />}
          sx={{
            height: 44,
            borderRadius: 1,
            fontWeight: 600,
            textTransform: "none",
            bgcolor: running ? "grey.400" : "primary.main",

            "&:hover": {
              bgcolor: running ? "grey.400" : "primary.dark",
            },
          }}
        >
          {running ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Start"
          )}
        </Button>
      </Box>
    </Card>
  );
}
