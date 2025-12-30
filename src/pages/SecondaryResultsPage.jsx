import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Stack,
  Button,
  TextField,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

export default function SecondaryResultsPage() {
  const { id: projectId } = useParams();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState("");

  // ---------------- LOAD RESULTS ONLY ----------------
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/secondary/existing?project_id=${projectId}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (!d.exists) return;

        const cols = Object.keys(d.masterSheet[0]).map((k) => {
          if (k.toLowerCase() === "decision") {
            return {
              field: k,
              headerName: k,
              flex: 1,
              renderCell: (p) => (
                <Chip
                  label={p.value}
                  color={p.value === "Include" ? "success" : "error"}
                  size="small"
                  variant="outlined"
                />
              ),
            };
          }
          return {
            field: k,
            headerName: k,
            flex: 1,
            minWidth: 160,
          };
        });

        setColumns(cols);
        setRows(d.masterSheet.map((r, i) => ({ id: i + 1, ...r })));
      });
  }, [projectId]);

  // ---------------- FILTER ----------------
  const filteredRows = rows.filter(
    (r) =>
      Object.values(r)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Box p={3}>
        <BreadcrumbsBar
          items={[
            { label: "Dashboard", to: "/" },
            { label: "Secondary Screening", to: `/projects/${projectId}/secondary` },
            { label: "Results" },
          ]}
        />

        <Stack direction="row" justifyContent="space-between" mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Secondary Screening Results
          </Typography>

          <Button
            startIcon={<DownloadIcon />}
            onClick={() =>
              window.open(
                `http://localhost:5000/api/secondary/existing?project_id=${projectId}`
              )
            }
          >
            Export Excel
          </Button>
        </Stack>

        {/* SEARCH */}
        <TextField
          size="small"
          placeholder="Search decision / rationale / PMID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, width: 320 }}
        />

        {/* RESULTS TABLE */}
        <Card sx={{ p: 2 }}>
          <DataGrid
            autoHeight
            density="compact"
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f4f6fb",
                fontWeight: 600,
              },
            }}
          />
        </Card>
      </Box>
    </Layout>
  );
}
