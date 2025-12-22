import React from "react";
import {
  Card,
  Modal,
  Typography,
  Button,
  TextField,
  Divider,
  Box,
  LinearProgress,
} from "@mui/material";

export default function PrimarySearchPopup({
  open,
  onClose,
  excelFile,
  onExcelUpload,
  ifuFile,
  onIfuUpload,
  inclusionCriteria,
  setInclusionCriteria,
  exclusionCriteria,
  setExclusionCriteria,
  onSearch,
  running = false,
  progress = 0,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Card sx={{
        width: { xs: "90%", sm: 500 },
        maxHeight: "90vh",
        overflowY: "auto",
        mx: "auto",
        mt: { xs: "5vh", sm: "8vh" },
        p: 3,
        borderRadius: 4,
        boxShadow: 8,
      }}>
        <Typography variant="h6">Upload Inputs</Typography>

        <Button variant="outlined" component="label" disabled={running}>
          Upload Excel
          <input hidden type="file" onChange={onExcelUpload} />
        </Button>
        {excelFile && <Typography sx={{ mt: 1 }}>{excelFile.name}</Typography>}

        <Divider sx={{ my: 2 }} />

        <Button variant="outlined" component="label" disabled={running}>
          Upload IFU (PDF)
          <input hidden type="file" accept="application/pdf" onChange={onIfuUpload} />
        </Button>
        {ifuFile && <Typography sx={{ mt: 1 }}>{ifuFile.name}</Typography>}

        <Divider sx={{ my: 2 }} />

        <TextField
          label="Inclusion Criteria"
          multiline rows={4} fullWidth
          value={inclusionCriteria}
          disabled={running}
          onChange={(e) => setInclusionCriteria(e.target.value)}
        />

        <TextField
          label="Exclusion Criteria"
          multiline rows={4} fullWidth
          sx={{ mt: 2 }}
          value={exclusionCriteria}
          disabled={running}
          onChange={(e) => setExclusionCriteria(e.target.value)}
        />

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          disabled={!excelFile || !ifuFile || running}
          onClick={onSearch}
        >
          {running ? "Processing…" : "Search"}
        </Button>

        {running && (
          <Box sx={{ mt: 2 }}>
            <Typography align="center">{progress}% completed</Typography>
            <LinearProgress value={progress} variant="determinate" />
          </Box>
        )}
      </Card>
    </Modal>
  );
}
