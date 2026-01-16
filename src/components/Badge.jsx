import React from "react";
import { Box } from "@mui/material";

const colorMap = {
  green: {
    background: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
    color: "#fff",
  },
  red: {
    background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    color: "#fff",
  },
  orange: {
    background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    color: "#fff",
  },
  violet: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
  },
  blue: {
    background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    color: "#fff",
  },
};

export default function Badge({ color = "blue", children }) {
  const style = colorMap[color] || colorMap.blue;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 2,
        py: 0.75,
        borderRadius: 1.5,
        fontSize: "0.813rem",
        fontWeight: 600,
        background: style.background,
        color: style.color,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }
      }}
    >
      {children}
    </Box>
  );
}