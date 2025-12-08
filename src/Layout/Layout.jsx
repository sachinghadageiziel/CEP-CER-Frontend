import React from "react";
import { Box } from "@mui/material";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Global Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <Box sx={{ flex: 1 }}>{children}</Box>

      {/* Global Footer */}
      <Footer />
    </Box>
  );
}
