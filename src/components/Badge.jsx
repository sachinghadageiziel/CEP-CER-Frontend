import { motion } from "framer-motion";

const COLORS = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  violet: "bg-violet-100 text-violet-700",
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100 text-blue-700",
};

export default function Badge({ color = "blue", children }) {
  return (
    <motion.span
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${COLORS[color]}`}
    >
      {children}
    </motion.span>
  );
}
