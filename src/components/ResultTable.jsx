import { motion } from "framer-motion";
import { CheckCircle, XCircle, Search, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { Box, TextField, InputAdornment, Chip } from "@mui/material";
import Badge from "./Badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const rowVariant = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function ResultTable({
  rows = [],
  onRowClick,
  onDecisionChange,
}) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    return rows.filter(
      (r) =>
        r.PMID?.toString().includes(query) ||
        r.Title?.toLowerCase().includes(query.toLowerCase()) ||
        r.Abstract?.toLowerCase().includes(query.toLowerCase())
    );
  }, [rows, query]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* SEARCH BAR - Separated from table */}
      <Box 
        sx={{ 
          p: 3,
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by PMID, title, or abstract..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#64748b" />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <Chip 
                  label={`${filteredRows.length} results`}
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#fff",
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: "#667eea",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#667eea",
                borderWidth: 2,
              }
            }
          }}
        />
      </Box>

      {/* TABLE */}
      <Box sx={{ p: 3 }}>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* HEADER */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.5fr 4fr 1.5fr 1.5fr",
              gap: 2,
              px: 3,
              py: 2,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Filter size={14} color="#64748b" />
              <Box
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                PMID
              </Box>
            </Box>
            <Box
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Title / Abstract
            </Box>
            <Box
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Decision
            </Box>
            <Box
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Category
            </Box>
          </Box>

          {/* ROWS */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {filteredRows.map((row) => (
              <Row
                key={row.id ?? row.PMID}
                row={row}
                onRowClick={onRowClick}
                onDecisionChange={onDecisionChange}
              />
            ))}
          </Box>

          {filteredRows.length === 0 && (
            <Box
              sx={{
                p: 8,
                textAlign: "center",
                bgcolor: "#f8fafc",
                borderRadius: 3,
                border: "2px dashed #cbd5e1",
              }}
            >
              <Search size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
              <Box sx={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 600 }}>
                No results found
              </Box>
              <Box sx={{ fontSize: "0.75rem", color: "#94a3b8", mt: 0.5 }}>
                Try adjusting your search query
              </Box>
            </Box>
          )}
        </motion.div>
      </Box>
    </Box>
  );
}

function Row({ row, onRowClick, onDecisionChange }) {
  const [decision, setDecision] = useState(row.Decision);
  const [isHovered, setIsHovered] = useState(false);

  const toggleDecision = () => {
    const next = decision === "Include" ? "Exclude" : "Include";
    setDecision(next);
    onDecisionChange?.(row.PMID, next);
  };

  return (
    <motion.div
      variants={rowVariant}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onRowClick(row)}
      style={{
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1.5fr 4fr 1.5fr 1.5fr",
          gap: 2,
          p: 3,
          bgcolor: isHovered ? "#f8fafc" : "#fff",
          borderRadius: 2,
          border: "1px solid #e2e8f0",
          transition: "all 0.2s ease",
          boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.08)" : "0 2px 4px rgba(0,0,0,0.04)",
          "&:hover": {
            borderColor: "#667eea",
          }
        }}
      >
        {/* PMID */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1.5,
              bgcolor: "#f1f5f9",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#475569",
              fontFamily: "monospace",
            }}
          >
            {row.PMID}
          </Box>
        </Box>

        {/* Title/Abstract */}
        <Box>
          {row.Title && (
            <Box
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#1e293b",
                mb: 0.5,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {row.Title}
            </Box>
          )}
          <Box
            sx={{
              fontSize: "0.813rem",
              color: "#64748b",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {row.Abstract || "No abstract available"}
          </Box>
        </Box>

        {/* DECISION */}
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          onClick={(e) => {
            e.stopPropagation();
            toggleDecision();
          }}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{ width: "100%" }}
          >
            {decision === "Include" ? (
              <Badge color="green">
                <CheckCircle size={14} /> Include
              </Badge>
            ) : (
              <Badge color="red">
                <XCircle size={14} /> Exclude
              </Badge>
            )}
          </motion.div>
        </Box>

        {/* CATEGORY */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Badge color={row.Category === "SOTA" ? "violet" : "orange"}>
            {row.Category || "N/A"}
          </Badge>
        </Box>
      </Box>
    </motion.div>
  );
}