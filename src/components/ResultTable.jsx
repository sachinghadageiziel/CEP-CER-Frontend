import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Search, Filter, Eye, Trash2, Clock } from "lucide-react";
import { Box, TextField, InputAdornment, Chip, IconButton, Tooltip } from "@mui/material";
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
  onDelete,
}) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    return rows.filter(
      (r) =>
        r.PMID?.toString().includes(query) ||
        r.literature_id?.toString().includes(query) ||
        r.article_id?.toString().includes(query) ||
        r.Decision?.toLowerCase().includes(query.toLowerCase()) ||
        r.decision?.toLowerCase().includes(query.toLowerCase()) ||
        r.ExclusionCriteria?.toLowerCase().includes(query.toLowerCase()) ||
        r.exclusion_criteria?.toLowerCase().includes(query.toLowerCase()) ||
        r.Rationale?.toLowerCase().includes(query.toLowerCase()) ||
        r.rationale?.toLowerCase().includes(query.toLowerCase())
    );
  }, [rows, query]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* SEARCH BAR */}
      <Box 
        sx={{ 
          p: 3,
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by PMID, decision, exclusion criteria, or rationale..."
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
              gridTemplateColumns: onDelete 
                ? "1fr 1.2fr 1.5fr 1.5fr 2fr 120px" 
                : "1fr 1.2fr 1.5fr 1.5fr 2fr",
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
              Exclusion Criteria
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
              Rationale
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
              Abstract
            </Box>
            {onDelete && (
              <Box
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  textAlign: "center",
                }}
              >
                Actions
              </Box>
            )}
          </Box>

          {/* ROWS */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {filteredRows.map((row) => (
              <Row
                key={row.id ?? row.PMID ?? row.literature_id ?? row.article_id}
                row={row}
                onRowClick={onRowClick}
                onDecisionChange={onDecisionChange}
                onDelete={onDelete}
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

function Row({ row, onRowClick, onDecisionChange, onDelete }) {
  // Normalize decision value to match MenuItem values (Include/Exclude)
  const normalizedDecision = row.Decision || row.decision 
    ? String(row.Decision || row.decision).charAt(0).toUpperCase() + 
      String(row.Decision || row.decision).slice(1).toLowerCase()
    : "Pending";
    
  const [decision, setDecision] = useState(normalizedDecision);
  const [isHovered, setIsHovered] = useState(false);

  const pmid = row.PMID || row.literature_id || row.article_id;
  const exclusionCriteria = row.ExclusionCriteria || row.exclusion_criteria;
  const rationale = row.Rationale || row.rationale;
  const abstract = row.abstract || row.Abstract;

  const toggleDecision = () => {
    const next = decision === "Include" ? "Exclude" : "Include";
    setDecision(next);
    onDecisionChange?.(pmid, next);
  };

  return (
    <motion.div
      variants={rowVariant}
      whileHover={{ scale: 1.005 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: onDelete 
            ? "1fr 1.2fr 1.5fr 1.5fr 2fr 120px" 
            : "1fr 1.2fr 1.5fr 1.5fr 2fr",
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
        <Box 
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => onRowClick?.(row)}
        >
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
            {pmid}
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
            ) : decision === "Exclude" ? (
              <Badge color="red">
                <XCircle size={14} /> Exclude
              </Badge>
            ) : (
              <Badge color="orange">
                <Clock size={14} /> Pending
              </Badge>
            )}
          </motion.div>
        </Box>

        {/* EXCLUSION CRITERIA */}
        <Box 
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => onRowClick?.(row)}
        >
          <Box
            sx={{
              fontSize: "0.813rem",
              color: "#475569",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {exclusionCriteria || "—"}
          </Box>
        </Box>

        {/* RATIONALE */}
        <Box 
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => onRowClick?.(row)}
        >
          <Box
            sx={{
              fontSize: "0.813rem",
              color: "#475569",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {rationale || "—"}
          </Box>
        </Box>

        {/* ABSTRACT */}
        <Box 
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => onRowClick?.(row)}
        >
          <Box
            sx={{
              fontSize: "0.813rem",
              color: "#475569",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {abstract || "—"}
          </Box>
        </Box>

        {/* ACTIONS */}
        {onDelete && (
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              gap: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip title="View details">
              <IconButton
                size="small"
                onClick={() => onRowClick?.(row)}
                sx={{
                  bgcolor: "#f1f5f9",
                  "&:hover": { 
                    bgcolor: "#e2e8f0",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Eye size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete record">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(pmid);
                }}
                sx={{
                  bgcolor: "#fef2f2",
                  color: "#ef4444",
                  "&:hover": { 
                    bgcolor: "#fee2e2",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}