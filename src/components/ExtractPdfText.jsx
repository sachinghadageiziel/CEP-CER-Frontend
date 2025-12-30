import { motion, AnimatePresence } from "framer-motion";

export default function ExtractPdfText({
  onExtract,
  loading,
  progress,
}) {
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={onExtract}
        disabled={loading}
        className={`border px-4 py-2 rounded-md text-sm
          ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {loading ? "Extracting Text..." : "Extract Text from PDFs"}
      </button>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full"
          >
            <div className="w-full bg-slate-200 rounded h-2 overflow-hidden">
              <motion.div
                className="bg-blue-600 h-2"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1 text-right">
              {progress}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
