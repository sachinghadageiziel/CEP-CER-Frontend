import React from "react";
import {
  Card,
  Modal,
  Typography,
  Button,
  Divider,
  Box,
  IconButton,
  LinearProgress,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function PdfDownloadPopup({
  open,
  onClose,
  excelFile,
  onExcelUpload,
  onSearch,
  running = false,
  progress = 0,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Card
        sx={{
          width: { xs: "92%", sm: 480 },
          mx: "auto",
          mt: { xs: "10vh", sm: "12vh" },
          p: 3,
          borderRadius: 2,
          boxShadow: "0 16px 50px rgba(0,0,0,0.25)",
          animation: "fadeInScale 0.35s ease",
          position: "relative",

          "@keyframes fadeInScale": {
            from: {
              opacity: 0,
              transform: "scale(0.95)",
            },
            to: {
              opacity: 1,
              transform: "scale(1)",
            },
          },
        }}
      >
        {/* 🔝 HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <IconButton onClick={onClose}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={600}>
            PDF Download
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* 📄 EXCEL UPLOAD */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          disabled={running}
          startIcon={<CloudUploadIcon />}
          sx={{
            height: 46,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Import Excel
          <input hidden type="file" onChange={onExcelUpload} />
        </Button>

        {excelFile && (
          <Typography
            variant="body2"
            sx={{
              mt: 1.2,
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            {excelFile.name}
          </Typography>
        )}

        {/* ⏳ PROGRESS */}
        {running && (
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 1 }}
            >
              Processing… {progress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
            />
          </Box>
        )}

        {/* 🔘 ACTION */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 4,
            height: 46,
            borderRadius: 1,
            fontWeight: 600,
            textTransform: "none",
          }}
          disabled={!excelFile || running}
          onClick={onSearch}
        >
          {running ? "Processing…" : "Start"}
        </Button>
      </Card>
    </Modal>
  );
}
