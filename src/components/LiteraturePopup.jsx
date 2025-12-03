import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import LiteraturePopup from "../components/LiteraturePopup";

export default function LiteraturePage() {
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
  const [excelBlob, setExcelBlob] = useState(null);

  const handleUpload = (e) => setFile(e.target.files[0]);

  const handleSearch = async () => {
  const form = new FormData();
  form.append("keywordsFile", file);
  form.append("applyDateFilter", applyDateFilter.toString());
  form.append("fromDate", fromDate);
  form.append("toDate", toDate);
  form.append("abstract", filters.abstract.toString());
  form.append("freeFullText", filters.freeFullText.toString());
  form.append("fullText", filters.fullText.toString());
  form.append("pubmed", databases.pubmed.toString());
  form.append("cochrane", databases.cochrane.toString());
  form.append("googleScholar", databases.googleScholar.toString());

  const res = await fetch("http://localhost:5000/api/literature/run", {
    method: "POST",
    body: form,
  });

  const data = await res.json();

  // IMPORTANT FIX — Datagrid requires "id"
  setMasterData(
    data.masterSheet.map((row, index) => ({
      id: index + 1,
      ...row,
    }))
  );

  setExcelBlob(data.excelFile);
  setOpen(false);
};


  const downloadExcel = () => {
    const byteCharacters = atob(excelBlob);
    const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "All-Merged.xlsx";
    link.click();
  };

  const columns = [
  { field: "Sr.No", headerName: "Sr.No", width: 80 },
  { field: "PMID", headerName: "PMID", width: 150 },
  { field: "Title", headerName: "Title", width: 300 },
  { field: "Journal", headerName: "Journal", width: 200 },
  { field: "PubDate", headerName: "Pub Date", width: 150 },
  { field: "Authors", headerName: "Authors", width: 200 },
];


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Literature Search
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Upload Keywords & Start Search
      </Button>

      {/* Popup Component */}
      <LiteraturePopup
        open={open}
        onClose={() => setOpen(false)}
        file={file}
        onFileUpload={handleUpload}
        applyDateFilter={applyDateFilter}
        setApplyDateFilter={setApplyDateFilter}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        filters={filters}
        setFilters={setFilters}
        databases={databases}
        setDatabases={setDatabases}
        onSearch={handleSearch}
      />

      {/* Results Table */}
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
            <DataGrid rows={masterData} columns={columns} />
          </Box>
        </>
      )}
    </Box>
  );
}
