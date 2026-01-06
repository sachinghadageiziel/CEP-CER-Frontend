import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiPlayCircle, FiCheckCircle, FiFileText, FiFile } from "react-icons/fi";

export default function SecondaryPopup({
  open,
  onClose,
  excelFile,
  ifuFile,
  onExcelUpload,
  onIfuUpload,
  onRun,
  loading = false,
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
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
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
                  <FiPlayCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Run Secondary Screening</h2>
                  <p className="text-green-100 text-sm mt-0.5">
                    Upload required files to start analysis
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-6">
              {/* STEP INDICATOR */}
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span className="text-sm font-medium text-green-900">
                    Upload Files
                  </span>
                </div>
                <div className="w-8 h-0.5 bg-slate-200"></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                  <div className="w-6 h-6 bg-slate-300 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Process
                  </span>
                </div>
              </div>

              {/* FILE UPLOADS GRID */}
              <div className="grid grid-cols-2 gap-4">
                {/* PRIMARY EXCEL UPLOAD */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Primary Excel File
                  </label>
                  <label
                    className={`
                      relative block w-full border-2 border-dashed rounded-xl p-6
                      transition-all duration-300 cursor-pointer
                      ${
                        excelFile
                          ? "border-green-400 bg-green-50"
                          : "border-slate-300 bg-slate-50 hover:border-green-400 hover:bg-green-50"
                      }
                      ${loading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <input
                      hidden
                      type="file"
                      onChange={onExcelUpload}
                      disabled={loading}
                      accept=".xlsx,.xls"
                    />
                    
                    <div className="flex flex-col items-center gap-2">
                      {excelFile ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="p-2 bg-green-100 rounded-lg"
                          >
                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                          </motion.div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-green-900 truncate max-w-full">
                              {excelFile.name}
                            </p>
                            <p className="text-xs text-green-600 mt-0.5">
                              Ready
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-slate-200 rounded-lg">
                            <FiFileText className="w-6 h-6 text-slate-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-slate-700">
                              Upload Excel
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              .xlsx or .xls
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {/* IFU PDF UPLOAD */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    IFU PDF File
                  </label>
                  <label
                    className={`
                      relative block w-full border-2 border-dashed rounded-xl p-6
                      transition-all duration-300 cursor-pointer
                      ${
                        ifuFile
                          ? "border-green-400 bg-green-50"
                          : "border-slate-300 bg-slate-50 hover:border-green-400 hover:bg-green-50"
                      }
                      ${loading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <input
                      hidden
                      type="file"
                      onChange={onIfuUpload}
                      disabled={loading}
                      accept=".pdf"
                    />
                    
                    <div className="flex flex-col items-center gap-2">
                      {ifuFile ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="p-2 bg-green-100 rounded-lg"
                          >
                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                          </motion.div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-green-900 truncate max-w-full">
                              {ifuFile.name}
                            </p>
                            <p className="text-xs text-green-600 mt-0.5">
                              Ready
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-slate-200 rounded-lg">
                            <FiFile className="w-6 h-6 text-slate-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-slate-700">
                              Upload PDF
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              .pdf only
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* INFO BOX */}
              <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-900">
                  <span className="font-semibold">Note:</span> Both files are required to run the secondary screening process. Ensure your Excel file contains the necessary columns from primary screening.
                </p>
              </div>

              {/* LOADING STATE */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full"
                    />
                    <span className="text-sm font-medium text-green-900">
                      Running secondary screening analysis...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 h-12 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={!loading && excelFile && ifuFile ? { scale: 1.02 } : {}}
                  whileTap={!loading && excelFile && ifuFile ? { scale: 0.98 } : {}}
                  onClick={onRun}
                  disabled={!excelFile || !ifuFile || loading}
                  className={`
                    flex-1 h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2
                    transition-all duration-300
                    ${
                      !excelFile || !ifuFile || loading
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg hover:shadow-green-500/50"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiPlayCircle className="w-5 h-5" />
                      Run Screening
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}