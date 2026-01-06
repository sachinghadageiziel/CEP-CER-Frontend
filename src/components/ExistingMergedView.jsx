import React from "react";
import { Box, Typography, Button, Card, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Download, FileSpreadsheet } from "lucide-react";

export default function ExistingMergedView({ data, onDownload }) {
  const columns = [
    { 
      field: "Sr.No", 
      headerName: "Sr.No", 
      width: 90,
      headerAlign: "center",
      align: "center",
    },
    { 
      field: "PMID", 
      headerName: "PMID", 
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    { 
      field: "Title", 
      headerName: "Title", 
      flex: 1,
      minWidth: 300,
    },
    { 
      field: "Journal", 
      headerName: "Journal", 
      width: 200,
    },
    { 
      field: "PubDate", 
      headerName: "Date", 
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    { 
      field: "Authors", 
      headerName: "Authors", 
      width: 250,
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header Section */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              }}
            >
              <FileSpreadsheet size={28} color="#fff" />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                Saved Results
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ color: "#64748b" }}
                >
                  Total articles:
                </Typography>
                <Chip 
                  label={data.length}
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Download size={18} />}
            onClick={onDownload}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
              }
            }}
          >
            Download All-Merged.xlsx
          </Button>
        </Box>
      </Card>

      {/* Data Grid */}
      <Card
        sx={{
          height: 600,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderColor: "#f1f5f9",
              py: 1.5,
            },
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#f8fafc",
              borderColor: "#e2e8f0",
              fontWeight: 700,
              color: "#475569",
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-row": {
              transition: "background-color 0.2s ease",
              "&:hover": {
                bgcolor: "#f8fafc",
              }
            },
            "& .MuiDataGrid-footerContainer": {
              borderColor: "#e2e8f0",
              bgcolor: "#f8fafc",
            }
          }}
        />
      </Card>
    </Box>
  );
}