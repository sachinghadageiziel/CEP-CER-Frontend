import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 p-4 rounded-xl shadow-sm bg-${color}-50 text-${color}-700 focus:outline-none focus:ring-2 focus:ring-${color}-500`}
    >
      <Icon aria-hidden size={22} />
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}
