import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { PlayCircle } from "lucide-react";

export default function ActionCard({
  title,
  description,
  icon,
  onStart,
  running = false,
  gradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  bgGradient = "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
}) {
  return (
    <Card
      sx={{
        width: {
          xs: "100%",
          sm: 320,
          md: 360,
        },
        minHeight: 240,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        background: "#fff",
        boxShadow: running
          ? "0 8px 24px rgba(0,0,0,0.12)"
          : "0 8px 32px rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: running ? "not-allowed" : "pointer",
        position: "relative",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        opacity: running ? 0.7 : 1,
        "&:hover": !running && {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 48px rgba(0,0,0,0.15)",
          "& .action-bg": {
            transform: "scale(1.1) rotate(-5deg)",
          },
          "& .play-icon": {
            transform: "scale(1.1)",
          }
        },
      }}
    >
      {/* Background Decoration */}
      <Box
        className="action-bg"
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          background: bgGradient,
          borderRadius: "50%",
          opacity: 0.3,
          transition: "all 0.4s ease",
        }}
      />

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 3, position: "relative", zIndex: 1 }}>
        {/* Icon */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
            boxShadow: `0 4px 12px ${gradient.match(/#[a-fA-F0-9]{6}/)?.[0] || "#667eea"}40`,
            transition: "all 0.3s ease",
          }}
        >
          {icon}
        </Box>

        {/* Title */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            color: "#1e293b",
            mb: 1,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{ 
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </CardContent>

      {/* Action Button */}
      <Box sx={{ p: 3, pt: 0, position: "relative", zIndex: 1 }}>
        <Button
          fullWidth
          disabled={running}
          onClick={onStart}
          endIcon={
            !running && (
              <PlayCircle 
                className="play-icon"
                size={20}
                style={{ transition: "transform 0.3s ease" }}
              />
            )
          }
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 700,
            textTransform: "none",
            background: running ? "#e2e8f0" : gradient,
            color: running ? "#94a3b8" : "#fff",
            boxShadow: running ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": !running && {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
            },
            "&:disabled": {
              background: "#e2e8f0",
              color: "#94a3b8",
            }
          }}
        >
          {running ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CircularProgress size={20} sx={{ color: "#94a3b8" }} />
              <span>Processing...</span>
            </Box>
          ) : (
            "Start Process"
          )}
        </Button>
      </Box>
    </Card>
  );
}