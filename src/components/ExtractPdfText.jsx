import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader } from "lucide-react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";

export default function ExtractPdfText({ onExtract, loading, progress }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Button
        onClick={onExtract}
        disabled={loading}
        fullWidth
        startIcon={loading ? <Loader size={18} /> : <FileText size={18} />}
        variant="outlined"
        sx={{
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          borderWidth: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            borderWidth: 2,
            transform: loading ? "none" : "translateY(-2px)",
            boxShadow: loading ? "none" : "0 4px 12px rgba(37, 99, 235, 0.2)",
          },
          "&:disabled": {
            borderWidth: 2,
            borderColor: "#cbd5e1",
            color: "#94a3b8",
          }
        }}
      >
        {loading ? "Extracting Text..." : "Extract Text from PDFs"}
      </Button>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                  Processing PDFs...
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#1e293b",
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  {progress}%
                </Typography>
              </Box>
              
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "#e2e8f0",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg, #2563eb 0%, #14b8a6 100%)",
                    borderRadius: 4,
                  }
                }}
              />

              <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}