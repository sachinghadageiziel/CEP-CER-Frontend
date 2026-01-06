import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, FileText, Download } from "lucide-react";
import { Box, Typography, IconButton, Divider, Button } from "@mui/material";

export default function DownloadedPdfPopup({ open, pdfs = [], onClose, onView }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: "#fff",
            width: "90%",
            maxWidth: 480,
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
              p: 3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 120,
                height: 120,
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Download size={24} color="#fff" />
                </Box>
                <Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    Downloaded PDFs
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "rgba(255, 255, 255, 0.9)",
                      mt: 0.5,
                    }}
                  >
                    {pdfs.length} {pdfs.length === 1 ? "file" : "files"}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={onClose}
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                  }
                }}
              >
                <X size={20} />
              </IconButton>
            </Box>
          </Box>

          {/* LIST */}
          <Box
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: 8,
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f5f9",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#cbd5e1",
                borderRadius: 4,
                "&:hover": {
                  background: "#94a3b8",
                },
              },
            }}
          >
            {pdfs.map((p, index) => (
              <motion.div
                key={p.filename || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: index < pdfs.length - 1 ? "1px solid #e2e8f0" : "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                    }
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "#dbeafe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FileText size={20} color="#2563eb" />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: "#1e293b",
                          fontFamily: "monospace",
                        }}
                      >
                        {p.pmid || "Unknown"}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: "#64748b",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.filename}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    size="small"
                    startIcon={<Eye size={16} />}
                    onClick={() => onView(p.filename)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#2563eb",
                      "&:hover": {
                        bgcolor: "#dbeafe",
                      }
                    }}
                  >
                    View
                  </Button>
                </Box>
              </motion.div>
            ))}

            {pdfs.length === 0 && (
              <Box
                sx={{
                  p: 6,
                  textAlign: "center",
                }}
              >
                <Download size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#64748b",
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  No PDFs downloaded
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ color: "#94a3b8" }}
                >
                  PDFs you download will appear here
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}