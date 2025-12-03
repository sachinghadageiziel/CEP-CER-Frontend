import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function ExistingMergedView({ data, onDownload }) {
  const columns = [
    { field: "Sr.No", headerName: "Sr.No", width: 90 },
    { field: "PMID", headerName: "PMID", width: 120 },
    { field: "Title", headerName: "Title", width: 300 },
    { field: "Journal", headerName: "Journal", width: 200 },
    { field: "PubDate", headerName: "Date", width: 120 },
    { field: "Authors", headerName: "Authors", width: 250 },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">Existing Saved Results</Typography>

      <Button variant="contained" sx={{ mt: 2, mb: 2 }} onClick={onDownload}>
        Download All-Merged.xlsx
      </Button>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid rows={data} columns={columns} />
      </Box>
    </Box>
  );
}
