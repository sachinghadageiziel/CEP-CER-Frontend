import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../Layout/Layout";
import PrimarySearchPopup from "../components/PrimaryPopup";
import * as XLSX from "xlsx";

export default function PrimarySearchPage() {
  const { id: PROJECT_ID } = useParams();

  const [open, setOpen] = useState(false);

  // Uploads
  const [excelFile, setExcelFile] = useState(null);
  const [ifuFile, setIfuFile] = useState(null);

  // Criteria (kept for future use)
  const [inclusionCriteria, setInclusionCriteria] = useState("");
  const [exclusionCriteria, setExclusionCriteria] = useState("");

  // Results
  const [masterData, setMasterData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [excelBlob, setExcelBlob] = useState(null);

  // Upload handlers
  const handleExcelUpload = (e) => setExcelFile(e.target.files[0]);
  const handleIfuUpload = (e) => setIfuFile(e.target.files[0]);

  //   REAL API CALL
  const handleSearch = async () => {
    if (!excelFile || !ifuFile) return;

    const form = new FormData();
    form.append("project_id", PROJECT_ID);
    form.append("all_merged", excelFile); 
    form.append("ifu_pdf", ifuFile);      

    try {
      const res = await fetch("http://localhost:5000/api/primary/run", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!data.excelFile) return;

      setExcelBlob(data.excelFile);

      // Decode returned Excel → DataGrid
      const binary = atob(data.excelFile);
      const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)));
      const workbook = XLSX.read(bytes, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (!jsonData.length) return;

      setColumns(
        Object.keys(jsonData[0]).map((key) => ({
          field: key,
          headerName: key,
          width: 200,
        }))
      );

      setMasterData(
        jsonData.map((row, i) => ({
          id: i + 1,
          ...row,
        }))
      );

      setOpen(false);
    } catch (err) {
      alert("Primary screening failed");
      console.error(err);
    }
  };

  const downloadExcel = () => {
    if (!excelBlob) return;

    const binary = atob(excelBlob);
    const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)));

    const blob = new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Primary-Search-Results.xlsx";
    link.click();
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Primary Search – {PROJECT_ID}
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Import Excel
        </Button>

        {/* Popup (UNCHANGED UI) */}
        <PrimarySearchPopup
          open={open}
          onClose={() => setOpen(false)}
          excelFile={excelFile}
          onExcelUpload={handleExcelUpload}
          ifuFile={ifuFile}
          onIfuUpload={handleIfuUpload}
          inclusionCriteria={inclusionCriteria}
          setInclusionCriteria={setInclusionCriteria}
          exclusionCriteria={exclusionCriteria}
          setExclusionCriteria={setExclusionCriteria}
          onSearch={handleSearch}
        />

        {/* Results */}
        {masterData.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mt: 4 }}>
              Primary Search Results
            </Typography>

            <Button sx={{ mt: 2, mb: 2 }} onClick={downloadExcel}>
              Download Results
            </Button>

            <Box sx={{ height: 500 }}>
              <DataGrid rows={masterData} columns={columns} />
            </Box>
          </>
        )}
      </Box>Sure
    </Layout>
  );
}
