import { Dialog, IconButton, Typography, Box, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

export default function LiteratureRecordModal({ open, onClose, record }) {
  if (!record) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Box sx={{ p: 3, position: "relative" }}>
          {/* Close */}
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 12, right: 12 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={700}>
            Literature Details
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* GRID-LIKE INFO */}
          {Object.entries(record).map(([key, value]) => {
            if (key === "id") return null;

            return (
              <Box key={key} sx={{ mb: 1.5 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase" }}
                >
                  {key}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.3 }}>
                  {value || "—"}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </motion.div>
    </Dialog>
  );
}
