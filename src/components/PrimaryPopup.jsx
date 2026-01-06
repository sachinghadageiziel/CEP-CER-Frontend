import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUpload, FiCheckCircle, FiFileText, FiFile, FiList, FiPlay } from "react-icons/fi";

export default function PrimarySearchPopup({
  open,
  onClose,
  excelFile,
  onExcelUpload,
  ifuFile,
  onIfuUpload,
  inclusionCriteria,
  setInclusionCriteria,
  exclusionCriteria,
  setExclusionCriteria,
  onSearch,
  running = false,
  progress = 0,
}) {
  // Handle Excel file selection
  const handleExcelChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onExcelUpload) {
      onExcelUpload(file);
    }
  };

  // Handle IFU file selection
  const handleIfuChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onIfuUpload) {
      onIfuUpload(file);
    }
  };

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
            className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* HEADER */}
            <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-5">
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
                  <FiPlay className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Primary Screening</h2>
                  <p className="text-cyan-100 text-sm mt-0.5">
                    Upload files and configure screening criteria
                  </p>
                </div>
              </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* STEP 1: EXCEL FILE */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-slate-800">Keywords Excel File</h3>
                </div>
                
                <p className="text-sm text-slate-600 mb-3">
                  Upload the <strong>All_Merged Excel file</strong> containing PMIDs
                </p>

                <label
                  className={`
                    relative block w-full border-2 border-dashed rounded-xl p-6
                    transition-all duration-300 cursor-pointer
                    ${
                      excelFile
                        ? "border-green-400 bg-green-50"
                        : "border-slate-300 bg-slate-50 hover:border-cyan-400 hover:bg-cyan-50"
                    }
                    ${running ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    hidden
                    type="file"
                    onChange={handleExcelChange}
                    disabled={running}
                    accept=".xlsx,.xls"
                  />
                  
                  <div className="flex items-center gap-4">
                    {excelFile ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-2 bg-green-100 rounded-lg"
                        >
                          <FiCheckCircle className="w-6 h-6 text-green-600" />
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-semibold text-green-900">{excelFile.name}</p>
                          <p className="text-sm text-green-600 mt-0.5">File uploaded</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <FiFileText className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-700">Upload Excel File</p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            Click to select .xlsx or .xls file
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* STEP 2: IFU FILE */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-slate-800">IFU / Reference Document</h3>
                </div>
                
                <p className="text-sm text-slate-600 mb-3">
                  Upload the <strong>IFU or reference PDF</strong>
                </p>

                <label
                  className={`
                    relative block w-full border-2 border-dashed rounded-xl p-6
                    transition-all duration-300 cursor-pointer
                    ${
                      ifuFile
                        ? "border-green-400 bg-green-50"
                        : "border-slate-300 bg-slate-50 hover:border-cyan-400 hover:bg-cyan-50"
                    }
                    ${running ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    hidden
                    type="file"
                    onChange={handleIfuChange}
                    disabled={running}
                    accept=".pdf"
                  />
                  
                  <div className="flex items-center gap-4">
                    {ifuFile ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-2 bg-green-100 rounded-lg"
                        >
                          <FiCheckCircle className="w-6 h-6 text-green-600" />
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-semibold text-green-900">{ifuFile.name}</p>
                          <p className="text-sm text-green-600 mt-0.5">File uploaded</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <FiFile className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-700">Upload PDF File</p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            Click to select PDF document
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* STEP 3: CRITERIA */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-slate-800">Screening Criteria</h3>
                  <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded-full">
                    Optional
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 mb-3">
                  Provide additional context for inclusion or exclusion if required
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <FiList className="w-4 h-4 text-cyan-600" />
                      Inclusion Criteria
                    </label>
                    <textarea
                      value={inclusionCriteria}
                      onChange={(e) => setInclusionCriteria(e.target.value)}
                      disabled={running}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
                      placeholder="Enter inclusion criteria..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <FiList className="w-4 h-4 text-cyan-600" />
                      Exclusion Criteria
                    </label>
                    <textarea
                      value={exclusionCriteria}
                      onChange={(e) => setExclusionCriteria(e.target.value)}
                      disabled={running}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
                      placeholder="Enter exclusion criteria..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <AnimatePresence>
                {running && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-cyan-900">
                        Processing primary screening...
                      </span>
                      <span className="text-sm font-bold text-cyan-600">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-cyan-200 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={!running && excelFile && ifuFile ? { scale: 1.02 } : {}}
                whileTap={!running && excelFile && ifuFile ? { scale: 0.98 } : {}}
                onClick={onSearch}
                disabled={!excelFile || !ifuFile || running}
                className={`
                  w-full h-12 rounded-xl font-semibold text-white
                  transition-all duration-300
                  ${
                    !excelFile || !ifuFile || running
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50"
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
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FiPlay className="w-5 h-5" />
                    Start Primary Screening
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}