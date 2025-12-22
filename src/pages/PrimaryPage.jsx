import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
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

  // Criteria (future use)
  const [inclusionCriteria, setInclusionCriteria] = useState("");
  const [exclusionCriteria, setExclusionCriteria] = useState("");

  // Results
  const [masterData, setMasterData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [excelBlob, setExcelBlob] = useState(null);

  // Progress UI
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // ----------------------------------------
  // LOAD EXISTING DATA (same as Literature)
  // ----------------------------------------
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/primary/existing?project_id=${PROJECT_ID}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data.masterSheet) return;

        setColumns(
          Object.keys(data.masterSheet[0]).map((key) => ({
            field: key,
            headerName: key,
            width: 200,
          }))
        );

        setMasterData(
          data.masterSheet.map((row, i) => ({ id: i + 1, ...row }))
        );

        setExcelBlob(data.excelFile);
      })
      .catch(() => {});
  }, [PROJECT_ID]);

  // ----------------------------------------
  const handleExcelUpload = (e) => setExcelFile(e.target.files[0]);
  const handleIfuUpload = (e) => setIfuFile(e.target.files[0]);

  // ----------------------------------------
  // PRIMARY SEARCH
  // ----------------------------------------
  const handleSearch = async () => {
    if (!excelFile || !ifuFile) return;

    const form = new FormData();
    form.append("project_id", PROJECT_ID);
    form.append("all_merged", excelFile);
    form.append("ifu_pdf", ifuFile);

    setRunning(true);
    setProgress(5);
    setOpen(false);

    // Fake smooth progress
    let fake = 5;
    const timer = setInterval(() => {
      fake += Math.random() * 10;
      if (fake < 90) setProgress(Math.floor(fake));
    }, 900);

    try {
      await fetch("http://localhost:5000/api/primary/run", {
        method: "POST",
        body: form,
      });

      // Reload from existing endpoint
      const res = await fetch(
        `http://localhost:5000/api/primary/existing?project_id=${PROJECT_ID}`
      );
      const data = await res.json();

      clearInterval(timer);
      setProgress(100);

      setColumns(
        Object.keys(data.masterSheet[0]).map((key) => ({
          field: key,
          headerName: key,
          width: 200,
        }))
      );

      setMasterData(
        data.masterSheet.map((row, i) => ({ id: i + 1, ...row }))
      );

      setExcelBlob(data.excelFile);
      setTimeout(() => setRunning(false), 600);

    } catch (err) {
      clearInterval(timer);
      setRunning(false);
      alert("Primary screening failed");
    }
  };

  // ----------------------------------------
  const downloadExcel = () => {
    if (!excelBlob) return;

    const binary = atob(excelBlob);
    const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));

    const blob = new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Primary-Search-Results.xlsx";
    link.click();
  };

  // ----------------------------------------
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">
          Primary Search – {PROJECT_ID}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          disabled={running}
          onClick={() => setOpen(true)}
        >
          Import Excel
        </Button>

        {running && (
          <Box sx={{ mt: 3 }}>
            <Typography>{progress}% Processing…</Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

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
          running={running}
          progress={progress}
        />

        {masterData.length > 0 && (
          <>
            <Button sx={{ mt: 2 }} onClick={downloadExcel}>
              Download Results
            </Button>

            <Box sx={{ height: 500, mt: 2 }}>
              <DataGrid rows={masterData} columns={columns} />
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
}
