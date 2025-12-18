import React from "react";
import {
  Card,
  Modal,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Box,
  LinearProgress,
} from "@mui/material";

export default function LiteraturePopup({
  open,
  onClose,
  file,
  onFileUpload,
  applyDateFilter,
  setApplyDateFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  filters,
  setFilters,
  databases,
  setDatabases,
  onSearch,

  // 🔥 ADDED (do not remove)
  running = false,
  progress = 0,
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

        {/* Excel Upload */}
        <Button variant="outlined" component="label" disabled={running}>
          Upload Excel
          <input hidden type="file" onChange={onFileUpload} />
        </Button>
        {file && <Typography sx={{ mt: 1 }}>{file.name}</Typography>}

        <Divider sx={{ my: 2 }} />

        {/* Date Filter */}
        <FormControlLabel
          control={
            <Checkbox
              checked={applyDateFilter}
              disabled={running}
              onChange={(e) => setApplyDateFilter(e.target.checked)}
            />
          }
          label="Apply Date Range"
        />

        {applyDateFilter && (
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <TextField
              label="From Date (YYYY-MM-DD)"
              value={fromDate}
              disabled={running}
              onChange={(e) => setFromDate(e.target.value)}
              fullWidth
            />
            <TextField
              label="To Date (YYYY-MM-DD)"
              value={toDate}
              disabled={running}
              onChange={(e) => setToDate(e.target.value)}
              fullWidth
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Filters */}
        <Typography variant="subtitle1">Text Availability</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.abstract}
                disabled={running}
                onChange={(e) =>
                  setFilters({ ...filters, abstract: e.target.checked })
                }
              />
            }
            label="Abstract"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.freeFullText}
                disabled={running}
                onChange={(e) =>
                  setFilters({ ...filters, freeFullText: e.target.checked })
                }
              />
            }
            label="Free Full Text"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.fullText}
                disabled={running}
                onChange={(e) =>
                  setFilters({ ...filters, fullText: e.target.checked })
                }
              />
            }
            label="Full Text"
          />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        {/* Databases */}
        <Typography variant="subtitle1">Databases</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={databases.pubmed}
                disabled={running}
                onChange={(e) =>
                  setDatabases({ ...databases, pubmed: e.target.checked })
                }
              />
            }
            label="PubMed"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={databases.cochrane}
                disabled={running}
                onChange={(e) =>
                  setDatabases({ ...databases, cochrane: e.target.checked })
                }
              />
            }
            label="Cochrane"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={databases.googleScholar}
                disabled={running}
                onChange={(e) =>
                  setDatabases({
                    ...databases,
                    googleScholar: e.target.checked,
                  })
                }
              />
            }
            label="Google Scholar"
          />
        </FormGroup>

        {/* 🔥 SEARCH BUTTON */}
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          disabled={!file || running}
          onClick={onSearch}
        >
          {running ? "Processing…" : "Search"}
        </Button>

        {/* 🔥 PROGRESS UI (REAL BACKEND) */}
        {running && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" align="center">
              {progress}% completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 1 }}
            />
          </Box>
        )}
      </Card>
    </Modal>
  );
}
