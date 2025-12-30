import React from "react";
import {
  Card,
  Modal,
  Typography,
  Button,
  Divider,
  LinearProgress,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function SecondaryPopup({
  open,
  onClose,
  excelFile,
  ifuFile,
  onExcelUpload,
  onIfuUpload,
  onRun,
  loading,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Card
        sx={{
          width: { xs: "92%", sm: 520 },
          mx: "auto",
          mt: "8vh",
          p: 3,
          borderRadius: 2,
          position: "relative",
        }}
      >
        {/* ---------- HEADER ---------- */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6" fontWeight={600}>
            Run Secondary Screening
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Please upload the required files below to start the secondary
          screening process.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* ---------- STEP 1 ---------- */}
        <Typography fontWeight={600} mb={0.5}>
          Step 1: Upload  Excel
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={1.5}>
          Upload the PMID File.
        </Typography>

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mb: 1 }}
        >
          Upload PMID.xlsx
          <input hidden type="file" onChange={onExcelUpload} />
        </Button>

        {excelFile && (
          <Typography variant="caption" color="success.main">
            Selected file: {excelFile.name}
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* ---------- STEP 2 ---------- */}
        <Typography fontWeight={600} mb={0.5}>
          Step 2: Upload IFU PDF
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={1.5}>
          Upload the <b>Instructions For Use (IFU)</b> 
        </Typography>

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mb: 1 }}
        >
          Upload IFU.pdf
          <input
            hidden
            type="file"
            accept="application/pdf"
            onChange={onIfuUpload}
          />
        </Button>

        {ifuFile && (
          <Typography variant="caption" color="success.main">
            Selected file: {ifuFile.name}
          </Typography>
        )}

        {/* ---------- PROGRESS ---------- */}
        {loading && (
          <Box mt={3}>
            <Typography variant="body2" mb={1}>
              Running secondary screening… Please wait.
            </Typography>
            <LinearProgress />
          </Box>
        )}

        {/* ---------- ACTION ---------- */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={!excelFile || !ifuFile || loading}
          onClick={onRun}
        >
          Start Secondary Screening
        </Button>
      </Card>
    </Modal>
  );
}
