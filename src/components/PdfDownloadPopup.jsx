import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiFileText, FiCheckCircle } from "react-icons/fi";

export default function PdfDownloadPopup({
  open,
  onClose,
  excelFile,
  onExcelUpload,
  onSearch,
  running = false,
  progress = 0,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-white" />
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FiFileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Download PDFs</h2>
                  <p className="text-blue-100 text-sm mt-0.5">
                    Upload PMID list to fetch available PDFs
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-6">
              {/* STEP INDICATOR */}
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span className="text-sm font-medium text-blue-900">
                    Upload Excel
                  </span>
                </div>
                <div className="w-8 h-0.5 bg-slate-200"></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                  <div className="w-6 h-6 bg-slate-300 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Download
                  </span>
                </div>
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label
                  className={`
                    relative block w-full border-2 border-dashed rounded-xl p-8
                    transition-all duration-300 cursor-pointer
                    ${
                      excelFile
                        ? "border-green-400 bg-green-50"
                        : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                    }
                    ${running ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    hidden
                    type="file"
                    onChange={onExcelUpload}
                    disabled={running}
                    accept=".xlsx,.xls"
                  />
                  
                  <div className="flex flex-col items-center gap-3">
                    {excelFile ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-3 bg-green-100 rounded-full"
                        >
                          <FiCheckCircle className="w-8 h-8 text-green-600" />
                        </motion.div>
                        <div className="text-center">
                          <p className="font-semibold text-green-900">
                            {excelFile.name}
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            File selected successfully
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-blue-100 rounded-full">
                          <FiUpload className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-slate-700">
                            Click to upload PMID Excel
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            .xlsx or .xls files only
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>

                <div className="mt-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-900">
                    <span className="font-semibold">Note:</span> Excel file must contain a column named <span className="font-bold">PMID</span> with PubMed IDs
                  </p>
                </div>
              </div>

              {/* PROGRESS */}
              <AnimatePresence>
                {running && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">
                          Downloading PDFs...
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {progress}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      <p className="text-xs text-blue-600 mt-2">
                        This may take several minutes depending on the number of PMIDs
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION BUTTON */}
              <motion.button
                whileHover={!running && excelFile ? { scale: 1.02 } : {}}
                whileTap={!running && excelFile ? { scale: 0.98 } : {}}
                onClick={onSearch}
                disabled={!excelFile || running}
                className={`
                  w-full h-12 rounded-xl font-semibold text-white
                  transition-all duration-300
                  ${
                    !excelFile || running
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-500/50"
                  }
                `}
              >
                {running ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Downloading PDFs...
                  </span>
                ) : (
                  "Start Download"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}