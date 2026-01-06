import { motion } from "framer-motion";

const COLORS = {
  blue: {
    bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
    text: "#1e40af",
    icon: "#3b82f6",
    shadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
  },
  green: {
    bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    text: "#065f46",
    icon: "#10b981",
    shadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
  },
  red: {
    bg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    text: "#991b1b",
    icon: "#ef4444",
    shadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
  },
  purple: {
    bg: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)",
    text: "#581c87",
    icon: "#8b5cf6",
    shadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
  },
  yellow: {
    bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    text: "#92400e",
    icon: "#f59e0b",
    shadow: "0 4px 12px rgba(245, 158, 11, 0.2)",
  },
};

export default function StatCard({ title, value, icon: Icon, color = "blue" }) {
  const style = COLORS[color] || COLORS.blue;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "20px",
        borderRadius: "16px",
        background: style.bg,
        boxShadow: style.shadow,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.3 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: style.icon,
          opacity: 0.1,
        }}
      />

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Icon size={28} color={style.icon} strokeWidth={2.5} />
      </motion.div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: style.text,
            opacity: 0.8,
            marginBottom: "4px",
          }}
        >
          {title}
        </p>
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: style.text,
            lineHeight: 1,
          }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}