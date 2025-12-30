import {
  Card,
  Modal,
  Typography,
  Button,
  TextField,
  Divider,
  Box,
  LinearProgress,
  Fade,
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
      <Fade in={open} timeout={180}>
        <Card
          sx={{
            width: { xs: "92%", sm: 520 },
            maxHeight: "88vh",
            display: "flex",
            flexDirection: "column",
            mx: "auto",
            mt: { xs: "5vh", sm: "8vh" },
            p: 3,
            borderRadius: 3,
            boxShadow: 12,
          }}
        >
          {/* ================= HEADER ================= */}
          <Typography variant="h6" fontWeight={600}>
            Primary Screening Inputs
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* ================= CONTENT ================= */}
          <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
            {/* -------- EXCEL SECTION -------- */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                1. Keywords Excel File
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 1.5 }}
              >
                Upload the <strong>All_Merged Excel file</strong> containing
                PMIDs.
              </Typography>

              <Button
                variant="outlined"
                component="label"
                disabled={running}
              >
                Upload Excel (.xlsx)
                <input hidden type="file" onChange={onExcelUpload} />
              </Button>

              {excelFile && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                  color="text.secondary"
                >
                   {excelFile.name}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* -------- IFU SECTION -------- */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                2. IFU / Reference Document
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 1.5 }}
              >
                Upload the <strong>IFU or reference PDF</strong>
              </Typography>

              <Button
                variant="outlined"
                component="label"
                disabled={running}
              >
                Upload IFU (PDF)
                <input
                  hidden
                  type="file"
                  accept="application/pdf"
                  onChange={onIfuUpload}
                />
              </Button>

              {ifuFile && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                  color="text.secondary"
                >
                  📄 {ifuFile.name}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* -------- OPTIONAL CRITERIA -------- */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                3. Screening Criteria (Optional)
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 1.5 }}
              >
                Provide additional context for inclusion or exclusion if
                required.
              </Typography>

              <TextField
                label="Inclusion Criteria"
                multiline
                rows={3}
                fullWidth
                disabled={running}
                value={inclusionCriteria}
                onChange={(e) =>
                  setInclusionCriteria(e.target.value)
                }
              />

              <TextField
                label="Exclusion Criteria"
                multiline
                rows={3}
                fullWidth
                disabled={running}
                sx={{ mt: 2 }}
                value={exclusionCriteria}
                onChange={(e) =>
                  setExclusionCriteria(e.target.value)
                }
              />
            </Box>
          </Box>

          <Box sx={{ pt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={!excelFile || !ifuFile || running}
              onClick={onSearch}
            >
              {running ? "Processing…" : "Start Primary Screening"}
            </Button>

            {running && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  {progress}% completed
                </Typography>
                <LinearProgress
                  value={progress}
                  variant="determinate"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            )}
          </Box>
        </Card>
      </Fade>
    </Modal>
  );
}
