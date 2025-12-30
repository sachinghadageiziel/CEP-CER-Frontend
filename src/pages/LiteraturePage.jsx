import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Card,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import Layout from "../Layout/Layout";
import LiteraturePopup from "../components/LiteraturePopup";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

export default function LiteraturePage() {
  const { id: PROJECT_ID } = useParams();

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
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // -------------------------
  // LOAD EXISTING DATA
  // -------------------------
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/literature/existing?project_id=${PROJECT_ID}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data?.masterSheet?.length) return;

        setColumns(
          Object.keys(data.masterSheet[0]).map((key) => ({
            field: key,
            headerName: key,
            flex: 1,
            minWidth: 160,
          }))
        );

        setMasterData(
          data.masterSheet.map((row, i) => ({ id: i + 1, ...row }))
        );

        setExcelBlob(data.excelFile);
      })
      .catch(() => {});
  }, [PROJECT_ID]);

  const handleUpload = (e) => setFile(e.target.files[0]);

  // -------------------------
  // SEARCH
  // -------------------------
  const handleSearch = async () => {
    if (!file) return;

    const form = new FormData();
    form.append("project_id", PROJECT_ID);
    form.append("keywordsFile", file);
    form.append("applyDateFilter", applyDateFilter.toString());
    form.append("fromDate", fromDate);
    form.append("toDate", toDate);
    form.append("abstract", filters.abstract.toString());
    form.append("freeFullText", filters.freeFullText.toString());
    form.append("fullText", filters.fullText.toString());

    setRunning(true);
    setProgress(5);
    setOpen(false);

    let fake = 5;
    const timer = setInterval(() => {
      fake += Math.random() * 8;
      if (fake < 90) setProgress(Math.floor(fake));
    }, 800);

    try {
      await fetch("http://localhost:5000/api/literature/run", {
        method: "POST",
        body: form,
      });

      const res = await fetch(
        `http://localhost:5000/api/literature/existing?project_id=${PROJECT_ID}`
      );
      const data = await res.json();

      clearInterval(timer);
      setProgress(100);

      setColumns(
        Object.keys(data.masterSheet[0]).map((key) => ({
          field: key,
          headerName: key,
          flex: 1,
          minWidth: 160,
        }))
      );

      setMasterData(
        data.masterSheet.map((row, i) => ({ id: i + 1, ...row }))
      );

      setExcelBlob(data.excelFile);
      setTimeout(() => setRunning(false), 600);
    } catch {
      clearInterval(timer);
      setRunning(false);
      alert("Literature search failed");
    }
  };

  const downloadExcel = () => {
    if (!excelBlob) return;

    const bytes = atob(excelBlob);
    const buffer = new Uint8Array([...bytes].map((c) => c.charCodeAt(0)));

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "All-Merged.xlsx";
    link.click();
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <Layout>
      <Box sx={{ p: 3, background: "#f8fafc", minHeight: "100vh" }}>
        <BreadcrumbsBar
          items={[
            { label: "Home", to: "/" },
            { label: "Project", to: `/project/${PROJECT_ID}` },
            { label: "Literature Search" },
          ]}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" fontWeight={700}>
            Literature Search — {PROJECT_ID}
          </Typography>

          <Button
            variant="contained"
            disabled={running}
            onClick={() => setOpen(true)}
          >
            Upload Keywords & Start Search
          </Button>
        </Stack>

        {running && (
          <Card sx={{ p: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Processing literature…
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Card>
        )}

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
          running={running}
          progress={progress}
        />

        {masterData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Button sx={{ mb: 2 }} onClick={downloadExcel}>
              Download Excel
            </Button>

            <Card sx={{ height: 520 }}>
              <DataGrid
                rows={masterData}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
              />
            </Card>
          </motion.div>
        )}
      </Box>
    </Layout>
  );
}
