import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function DownloadedPdfPopup({
  open,
  pdfs,
  onClose,
  onView,
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white w-[420px] rounded-md shadow"
        >
          {/* HEADER */}
          <div className="flex justify-between px-4 py-2 border-b">
            <span className="font-medium">
              Downloaded PDFs ({pdfs.length})
            </span>
            <button onClick={onClose}>
              <FiX />
            </button>
          </div>

          {/* LIST */}
          <div className="max-h-[320px] overflow-auto">
            {pdfs.map((p) => (
              <div
                key={p.filename}
                className="px-4 py-2 flex justify-between border-b last:border-b-0"
              >
                <span className="text-sm">{p.pmid}</span>
                <button
                  className="text-blue-600 text-sm"
                  onClick={() => onView(p.filename)}
                >
                  View
                </button>
              </div>
            ))}

            {pdfs.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                No PDFs downloaded
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
