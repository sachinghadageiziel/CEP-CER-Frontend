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
          width: { xs: "94%", sm: 520 },
          mx: "auto",
          mt: { xs: "8vh", sm: "10vh" },
          p: 3,
          borderRadius: 2,
          boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
          position: "relative",
          animation: "fadeInScale 0.3s ease-out",

          "@keyframes fadeInScale": {
            from: { opacity: 0, transform: "scale(0.96)" },
            to: { opacity: 1, transform: "scale(1)" },
          },
        }}
      >
        {/* ───────── HEADER ───────── */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <IconButton onClick={onClose} size="small">
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={600}>
            Download PDFs
          </Typography>

          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mb={2}
        >
          Upload a list of PMIDs to automatically download available PDFs.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* ───────── STEP LABEL ───────── */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mb: 1,
            color: "primary.main",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Step 1 of 2
        </Typography>

        {/* ───────── FILE UPLOAD ───────── */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          disabled={running}
          startIcon={<CloudUploadIcon />}
          sx={{
            height: 48,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Upload PMID Excel (.xlsx)
          <input hidden type="file" onChange={onExcelUpload} />
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1}
          textAlign="center"
        >
          Excel should contain a column named <b>PMID</b>
        </Typography>

        {excelFile && (
          <Typography
            variant="body2"
            sx={{
              mt: 1.5,
              color: "success.main",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Selected file: {excelFile.name}
          </Typography>
        )}

        {/* ───────── PROGRESS ───────── */}
        {running && (
          <Box mt={3}>
            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 1 }}
            >
              Downloading PDFs… {progress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
              mt={1}
            >
              This may take a few minutes depending on the number of PMIDs
            </Typography>
          </Box>
        )}

        {/* ───────── ACTION ───────── */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 4,
            height: 48,
            borderRadius: 1,
            fontWeight: 600,
            textTransform: "none",
          }}
          disabled={!excelFile || running}
          onClick={onSearch}
        >
          {running ? "Downloading PDFs…" : "Start Download"}
        </Button>
      </Card>
    </Modal>
  );
}
