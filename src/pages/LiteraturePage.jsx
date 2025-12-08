import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // <-- import useParams
import {
  Box,
  Typography,
  Button,
  Card,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../Layout/Layout";

export default function LiteraturePage() {
  const { id } = useParams();           // <-- get project ID from URL
  const PROJECT_ID = id;                // <-- replace PROJECT123 with dynamic ID

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  const [applyDateFilter, setApplyDateFilter] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [filters, setFilters] = useState({
    abstract: false,
    freeFullText: false,
    fullText: false,
  });

  const [databases, setDatabases] = useState({
    pubmed: true,
    cochrane: false,
    googleScholar: false,
  });

  const [masterData, setMasterData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [excelBlob, setExcelBlob] = useState(null);

  // -------------------------------
  // Fetch existing All-Merged.xlsx on page load
  // -------------------------------
  useEffect(() => {
    async function loadExisting() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/literature/existing?project_id=${PROJECT_ID}`
        );

        if (!res.ok) return;

        const data = await res.json();
        if (!data.masterSheet || data.masterSheet.length === 0) return;

        const rowsWithId = data.masterSheet.map((row, index) => ({
          id: index + 1,
          ...row,
        }));

        const dynamicCols = Object.keys(data.masterSheet[0]).map((key) => ({
          field: key,
          headerName: key,
          width: 200,
        }));

        setColumns(dynamicCols);
        setMasterData(rowsWithId);
        setExcelBlob(data.excelFile || null);

        console.log("Loaded existing merged sheet ✔");
      } catch (err) {
        console.log("No existing merged file found.");
      }
    }

    loadExisting();
  }, [PROJECT_ID]); // <-- add PROJECT_ID to dependency

  // -------------------------------
  const handleUpload = (e) => setFile(e.target.files[0]);

  const handleSearch = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("project_id", PROJECT_ID);
    form.append("keywordsFile", file);
    form.append("applyDateFilter", applyDateFilter ? "true" : "false");
    form.append("fromDate", fromDate);
    form.append("toDate", toDate);
    form.append("abstract", filters.abstract ? "true" : "false");
    form.append("freeFullText", filters.freeFullText ? "true" : "false");
    form.append("fullText", filters.fullText ? "true" : "false");
    form.append("pubmed", databases.pubmed ? "true" : "false");
    form.append("cochrane", databases.cochrane ? "true" : "false");
    form.append("googleScholar", databases.googleScholar ? "true" : "false");

    try {
      const res = await fetch("http://localhost:5000/api/literature/run", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.masterSheet && data.masterSheet.length > 0) {
        const rowsWithId = data.masterSheet.map((row, index) => ({
          id: index + 1,
          ...row,
        }));

        const dynamicCols = Object.keys(data.masterSheet[0]).map((key) => ({
          field: key,
          headerName: key,
          width: 200,
        }));

        setColumns(dynamicCols);
        setMasterData(rowsWithId);
        setExcelBlob(data.excelFile || null);
      }

      setOpen(false);
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Failed to run search. Check backend.");
    }
  };

  // -------------------------------
  const downloadExcel = () => {
    if (!excelBlob) return;

    const byteCharacters = atob(excelBlob);
    const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "All-Merged.xlsx";
    link.click();
  };

  // -------------------------------

  return (
    <Layout>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Literature Search – {PROJECT_ID}
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Upload Keywords & Start Search
      </Button>

      {/* ---------------------------- */}
      {/* Popup Modal */}
      {/* ---------------------------- */}
      <Modal open={open} onClose={() => setOpen(false)}>
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
            position: "relative",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Upload Inputs
          </Typography>

          <Button variant="outlined" component="label">
            Upload Excel
            <input hidden type="file" onChange={handleUpload} />
          </Button>
          {file && <Typography sx={{ mt: 1 }}>{file.name}</Typography>}

          <Divider sx={{ my: 2 }} />

          {/* Date Filter */}
          <FormControlLabel
            control={
              <Checkbox
                checked={applyDateFilter}
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
                onChange={(e) => setFromDate(e.target.value)}
                fullWidth
              />
              <TextField
                label="To Date (YYYY-MM-DD)"
                value={toDate}
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

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled={!file}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Card>
      </Modal>

      {/* ---------------------------- */}
      {/* Results */}
      {/* ---------------------------- */}
      {masterData.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Master Sheet Results
          </Typography>

          <Button
            variant="outlined"
            sx={{ mt: 2, mb: 2 }}
            onClick={downloadExcel}
          >
            Download Merged Excel
          </Button>

          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={masterData}
              columns={columns}
              pageSize={25}
              rowsPerPageOptions={[25, 50, 100]}
            />
          </Box>
        </>
      )}
    </Box>
    </Layout>
  );
}
