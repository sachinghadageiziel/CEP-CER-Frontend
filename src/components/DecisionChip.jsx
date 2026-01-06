import { Chip } from "@mui/material";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const STYLES = {
  Include: {
    background: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
    color: "#fff",
    icon: CheckCircle,
  },
  Exclude: {
    background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
    color: "#fff",
    icon: XCircle,
  },
  SOTA: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    color: "#fff",
    icon: AlertCircle,
  },
  DUE: {
    background: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
    color: "#fff",
    icon: Clock,
  },
};

export default function DecisionChip({ label }) {
  const style = STYLES[label] || {
    background: "#e2e8f0",
    color: "#64748b",
    icon: AlertCircle,
  };

  const Icon = style.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ display: "inline-block" }}
    >
      <Chip
        icon={<Icon size={14} color={style.color} />}
        label={label || "N/A"}
        sx={{
          background: style.background,
          color: style.color,
          fontWeight: 700,
          fontSize: "0.813rem",
          height: 32,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          "& .MuiChip-icon": {
            color: style.color,
            marginLeft: "8px",
          },
          transition: "all 0.2s ease",
        }}
      />
    </motion.div>
  );
}