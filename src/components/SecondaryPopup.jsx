import React from "react";
import {
  Card,
  Modal,
  Typography,
  Button,
  TextField,
  Divider,
} from "@mui/material";

export default function SecondaryPopup({
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
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Card
        sx={{
          width: { xs: "90%", sm: 500 },
          maxHeight: "90vh",
          overflowY: "auto",
          mx: "auto",
          mt: { xs: "5vh", sm: "8vh" },
          p: 3,
          borderRadius: 4,
          boxShadow: 8,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Upload Inputs
        </Typography>

        {/* Excel */}
        <Button variant="outlined" component="label">
          Upload Excel
          <input hidden type="file" onChange={onExcelUpload} />
        </Button>
        {excelFile && (
          <Typography sx={{ mt: 1 }}>{excelFile.name}</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* IFU */}
        <Button variant="outlined" component="label">
          Upload IFU (PDF)
          <input
            hidden
            type="file"
            accept="application/pdf"
            onChange={onIfuUpload}
          />
        </Button>
        {ifuFile && <Typography sx={{ mt: 1 }}>{ifuFile.name}</Typography>}

        <Divider sx={{ my: 2 }} />

        {/* Criteria */}
        <TextField
          label="Inclusion Criteria"
          multiline
          rows={4}
          fullWidth
          value={inclusionCriteria}
          onChange={(e) => setInclusionCriteria(e.target.value)}
        />

        <TextField
          label="Exclusion Criteria"
          multiline
          rows={4}
          fullWidth
          sx={{ mt: 2 }}
          value={exclusionCriteria}
          onChange={(e) => setExclusionCriteria(e.target.value)}
        />

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          disabled={!excelFile}
          onClick={onSearch}
        >
          Search
        </Button>
      </Card>
    </Modal>
  );
}
