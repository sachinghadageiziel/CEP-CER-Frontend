import { Chip } from "@mui/material";

const COLORS = {
  Include: "success",
  Exclude: "error",
  SOTA: "secondary",
  DUE: "warning",
};

export default function DecisionChip({ label }) {
  return (
    <Chip
      label={label}
      size="small"
      color={COLORS[label] || "default"}
      sx={{
        fontWeight: 600,
        transition: "0.15s",
        "&:hover": { transform: "scale(1.05)" },
      }}
    />
  );
}
