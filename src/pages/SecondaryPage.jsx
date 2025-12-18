import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../Layout/Layout";
import SecondaryPopup from "../components/SecondaryPopup";
import * as XLSX from "xlsx";

export default function SecondaryPage() {
  const { id } = useParams();
  const location = useLocation();
  const project = location.state?.project;

  const [open, setOpen] = useState(false);

  // -------------------------------
  // Uploads
  // -------------------------------
  const [excelFile, setExcelFile] = useState(null);
  const [ifuFile, setIfuFile] = useState(null);

  // -------------------------------
  // Criteria
  // -------------------------------
  const [inclusionCriteria, setInclusionCriteria] = useState("");
  const [exclusionCriteria, setExclusionCriteria] = useState("");

  // -------------------------------
  // Results
  // -------------------------------
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleExcelUpload = (e) => setExcelFile(e.target.files[0]);
  const handleIfuUpload = (e) => setIfuFile(e.target.files[0]);

  // TEMP: local Excel preview (API later)
  const handleSearch = () => {
    if (!excelFile) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const binary = e.target.result;
      const workbook = XLSX.read(binary, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      if (!jsonData || jsonData.length === 0) return;

      const dynamicColumns = Object.keys(jsonData[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 200,
      }));

      const tableRows = jsonData.map((row, index) => ({
        id: index + 1,
        ...row,
      }));

      setColumns(dynamicColumns);
      setRows(tableRows);
      setOpen(false);
    };

    reader.readAsBinaryString(excelFile);
  };

  const downloadResults = () => {
    if (rows.length === 0) return;

    const exportRows = rows.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Secondary Screening");
    XLSX.writeFile(workbook, "Secondary-Screening-Results.xlsx");
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Secondary Screening
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Project: {project?.title} (ID: {id})
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Import Excel & Start Screening
        </Button>

        {/* Popup */}
        <SecondaryPopup
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
        {rows.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mt: 4 }}>
              Secondary Screening Results
            </Typography>

            <Button
              variant="outlined"
              sx={{ mt: 2, mb: 2 }}
              onClick={downloadResults}
            >
              Download Results
            </Button>

            <Box sx={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={rows}
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
