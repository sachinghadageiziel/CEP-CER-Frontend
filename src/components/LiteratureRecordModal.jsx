import { Dialog, IconButton, Typography, Box, Divider, Slide } from "@mui/material";
import { X, FileText } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LiteratureRecordModal({ open, onClose, record }) {
  if (!record) return null;

  const importantFields = ["PMID", "Title", "Authors", "Journal", "PubDate", "Abstract"];
  const otherFields = Object.keys(record).filter(
    (key) => key !== "id" && !importantFields.includes(key)
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
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
                <FileText size={24} color="#fff" />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  Literature Details
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "rgba(255, 255, 255, 0.9)",
                    mt: 0.5,
                  }}
                >
                  Complete article information
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

        {/* Content */}
        <Box sx={{ p: 3, maxHeight: "60vh", overflowY: "auto" }}>
          {/* Important Fields */}
          <Box sx={{ mb: 3 }}>
            {importantFields.map((key) => {
              if (!record[key]) return null;
              
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ mb: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <Box
                        sx={{
                          width: 4,
                          height: 16,
                          borderRadius: 1,
                          background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {key}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "#1e293b",
                        pl: 2,
                        lineHeight: key === "Abstract" ? 1.7 : 1.5,
                        textAlign: key === "Abstract" ? "justify" : "left",
                      }}
                    >
                      {record[key]}
                    </Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Box>

          {/* Other Fields */}
          {otherFields.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  mb: 2,
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Additional Information
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                {otherFields.map((key) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {key}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: "#1e293b",
                          mt: 0.5,
                          fontWeight: 500,
                        }}
                      >
                        {record[key] || "—"}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </>
          )}
        </Box>
      </motion.div>
    </Dialog>
  );
}