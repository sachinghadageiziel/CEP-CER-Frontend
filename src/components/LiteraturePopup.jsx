import React from "react";
import dayjs from "dayjs";

import {
  Card,
  Modal,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Box,
  LinearProgress,
  Fade,
} from "@mui/material";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
  running = false,
  progress = 0,
}) {
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open} timeout={180}>
        <Card
          sx={{
            width: { xs: "94%", sm: 540 },
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            mx: "auto",
            mt: { xs: "4vh", sm: "7vh" },
            borderRadius: 3,
            boxShadow: 12,
          }}
        >
          {/* ===== SCROLLABLE CONTENT ===== */}
          <Box
            sx={{
              p: 3,
              overflowY: "auto",
              flex: 1,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Upload Inputs
            </Typography>

            <Typography
              variant="body2"
              sx={{ mb: 1.5, color: "text.secondary" }}
            >
              Upload the <strong>Excel file containing keywords</strong> for
              literature search.
            </Typography>

            {/* Upload */}
            <Button
              variant="outlined"
              component="label"
              disabled={running}
              sx={{ mb: 1 }}
            >
              Upload Excel
              <input hidden type="file" onChange={onFileUpload} />
            </Button>

            {file && (
              <Typography fontSize={13} sx={{ mt: 0.5 }}>
                📄 {file.name}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Date Filter Toggle */}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <DatePicker
                    label="From Date"
                    value={fromDate ? dayjs(fromDate) : null}
                    onChange={(val) =>
                      setFromDate(val ? val.format("YYYY-MM-DD") : "")
                    }
                    disabled={running}
                    slotProps={{ textField: { fullWidth: true } }}
                  />

                  <DatePicker
                    label="To Date"
                    value={toDate ? dayjs(toDate) : null}
                    onChange={(val) =>
                      setToDate(val ? val.format("YYYY-MM-DD") : "")
                    }
                    disabled={running}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Box>
              </LocalizationProvider>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Text Filters */}
            <Typography variant="subtitle1" fontWeight={600}>
              Text Availability
            </Typography>

            <FormGroup>
              {[
                { key: "abstract", label: "Abstract" },
                { key: "freeFullText", label: "Free Full Text" },
                { key: "fullText", label: "Full Text" },
              ].map(({ key, label }) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={filters[key]}
                      disabled={running}
                      onChange={(e) =>
                        setFilters({ ...filters, [key]: e.target.checked })
                      }
                    />
                  }
                  label={label}
                />
              ))}
            </FormGroup>

            <Divider sx={{ my: 2 }} />

            {/* Databases */}
            <Typography variant="subtitle1" fontWeight={600}>
              Databases
            </Typography>

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
                disabled
                sx={{ opacity: 0.5 }}
                control={<Checkbox />}
                label="Cochrane (Coming Soon)"
              />

              <FormControlLabel
                disabled
                sx={{ opacity: 0.5 }}
                control={<Checkbox />}
                label="Google Scholar (Coming Soon)"
              />
            </FormGroup>
          </Box>

          {/* ===== STICKY FOOTER ===== */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              disabled={!file || running}
              onClick={onSearch}
              sx={{
                py: 1.2,
                fontWeight: 600,
              }}
            >
              {running ? "Processing…" : "Search"}
            </Button>

            {running && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" align="center">
                  {progress}% completed
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ mt: 0.8, height: 6, borderRadius: 3 }}
                />
              </Box>
            )}
          </Box>
        </Card>
      </Fade>
    </Modal>
  );
}
