import { motion } from "framer-motion";

const COLORS = {
  green: {
    bg: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
    text: "#fff",
    shadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
  },
  red: {
    bg: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
    text: "#fff",
    shadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
  },
  violet: {
    bg: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
    text: "#fff",
    shadow: "0 2px 8px rgba(139, 92, 246, 0.3)",
  },
  orange: {
    bg: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)",
    text: "#fff",
    shadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
  },
  blue: {
    bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    text: "#fff",
    shadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
  },
};

export default function Badge({ color = "blue", children }) {
  const style = COLORS[color] || COLORS.blue;

  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        fontSize: "0.813rem",
        fontWeight: 700,
        borderRadius: "8px",
        background: style.bg,
        color: style.text,
        boxShadow: style.shadow,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {children}
    </motion.span>
  );
}