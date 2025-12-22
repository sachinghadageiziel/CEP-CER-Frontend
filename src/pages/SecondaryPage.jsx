import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../Layout/Layout";

import SecondaryPopup from "../components/SecondaryPopup";
import PdfDownloadPopup from "../components/PdfDownloadPopup";
import ActionCard from "../components/ActionCard";

import * as XLSX from "xlsx";

export default function SecondaryPage() {
  const { id } = useParams();
  const location = useLocation();
  const project = location.state?.project;

    
  // Popup states
    
  const [openSecondary, setOpenSecondary] = useState(false);
  const [openPdfDownload, setOpenPdfDownload] = useState(false);

    
  // Uploads
    
  const [excelFile, setExcelFile] = useState(null);
  const [ifuFile, setIfuFile] = useState(null);

    
  // Criteria
    
  const [inclusionCriteria, setInclusionCriteria] = useState("");
  const [exclusionCriteria, setExclusionCriteria] = useState("");

    
  // Results
    
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

    
  // Card running state
    
  const [runningCard, setRunningCard] = useState(null);

    
  // Handlers
    
  const handleExcelUpload = (e) => setExcelFile(e.target.files[0]);
  const handleIfuUpload = (e) => setIfuFile(e.target.files[0]);

    
  // Secondary Search (existing logic)
    
  const handleSecondarySearch = () => {
    if (!excelFile) return;

    setRunningCard("secondary");

    const reader = new FileReader();
    reader.onload = (e) => {
      const binary = e.target.result;
      const workbook = XLSX.read(binary, { type: "binary" });
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

      setRows(
        jsonData.map((row, i) => ({
          id: i + 1,
          ...row,
        }))
      );

      setRunningCard(null);
      setOpenSecondary(false);
    };

    reader.readAsBinaryString(excelFile);
  };

    
  // Action Cards (dynamic-ready)
    
  const actionCards = [
    {
      id: "pdf-download",
      title: "PDF Download",
      description: "Download project related PDFs",
      onStart: () => {
        setRunningCard("pdf-download");
        setOpenPdfDownload(true);
      },
    },
    {
      id: "pdf-text",
      title: "PDF → Text",
      description: "Convert PDF documents into text",
      onStart: () => {
        setRunningCard("pdf-text");
        // api hook
        setTimeout(() => setRunningCard(null), 2000);
      },
    },
    {
      id: "secondary",
      title: "Secondary Screening",
      description: "Run secondary screening on Excel",
      onStart: () => {
        setRunningCard("secondary");
        setOpenSecondary(true);
      },
    },
  ];

  // UI

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Secondary Screening
        </Typography>

        <Typography sx={{ mb: 4 }}>
          Project: {project?.title} (ID: {id})
        </Typography>

        {/* ACTION CARDS */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
        >
          {actionCards.map((card) => (
            <Grid item key={card.id}>
              <ActionCard
                title={card.title}
                description={card.description}
                running={runningCard === card.id}
                onStart={card.onStart}
              />
            </Grid>
          ))}
        </Grid>

        <PdfDownloadPopup
          open={openPdfDownload}
          onClose={() => {
            setOpenPdfDownload(false);
            setRunningCard(null);
          }}
          excelFile={excelFile}
          onExcelUpload={handleExcelUpload}
          onSearch={() => {
            // connect API later
            setTimeout(() => {
              setRunningCard(null);
              setOpenPdfDownload(false);
            }, 1500);
          }}
        />

        <SecondaryPopup
          open={openSecondary}
          onClose={() => {
            setOpenSecondary(false);
            setRunningCard(null);
          }}
          excelFile={excelFile}
          onExcelUpload={handleExcelUpload}
          ifuFile={ifuFile}
          onIfuUpload={handleIfuUpload}
          inclusionCriteria={inclusionCriteria}
          setInclusionCriteria={setInclusionCriteria}
          exclusionCriteria={exclusionCriteria}
          setExclusionCriteria={setExclusionCriteria}
          onSearch={handleSecondarySearch}
        />

        {/* RESULTS */}
        {rows.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mt: 5 }}>
              Secondary Screening Results
            </Typography>

            <Box sx={{ height: 500, mt: 2 }}>
              <DataGrid rows={rows} columns={columns} />
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
}
