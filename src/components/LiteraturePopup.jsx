import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUpload, FiCheckCircle, FiCalendar, FiDatabase, FiFilter, FiSearch } from "react-icons/fi";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function LiteraturePopup({
  open,
  onClose,
  file,
  onFileUpload,
  applyDateFilter,
  setApplyDateFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  filters,
  setFilters,
  databases,
  setDatabases,
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
            className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* HEADER */}
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5">
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
                  <FiSearch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Literature Search</h2>
                  <p className="text-purple-100 text-sm mt-0.5">
                    Configure search parameters and filters
                  </p>
                </div>
              </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* FILE UPLOAD */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FiUpload className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-slate-800">Upload Keywords File</h3>
                </div>
                
                <label
                  className={`
                    relative block w-full border-2 border-dashed rounded-xl p-6
                    transition-all duration-300 cursor-pointer
                    ${
                      file
                        ? "border-green-400 bg-green-50"
                        : "border-slate-300 bg-slate-50 hover:border-purple-400 hover:bg-purple-50"
                    }
                    ${running ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <input
                    hidden
                    type="file"
                    onChange={onFileUpload}
                    disabled={running}
                    accept=".xlsx,.xls"
                  />
                  
                  <div className="flex items-center gap-4">
                    {file ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-2 bg-green-100 rounded-lg"
                        >
                          <FiCheckCircle className="w-6 h-6 text-green-600" />
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-semibold text-green-900">{file.name}</p>
                          <p className="text-sm text-green-600 mt-0.5">Ready to search</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FiUpload className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-700">Upload Excel File</p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            Click to select keywords file (.xlsx, .xls)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* DATE RANGE FILTER */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FiCalendar className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-slate-800">Date Range Filter</h3>
                </div>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyDateFilter}
                    disabled={running}
                    onChange={(e) => setApplyDateFilter(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Apply custom date range
                  </span>
                </label>

                <AnimatePresence>
                  {applyDateFilter && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 grid grid-cols-2 gap-3"
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="From Date"
                          value={fromDate ? dayjs(fromDate) : null}
                          onChange={(val) =>
                            setFromDate(val ? val.format("YYYY-MM-DD") : "")
                          }
                          disabled={running}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                            },
                          }}
                        />
                        <DatePicker
                          label="To Date"
                          value={toDate ? dayjs(toDate) : null}
                          onChange={(val) =>
                            setToDate(val ? val.format("YYYY-MM-DD") : "")
                          }
                          disabled={running}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TEXT AVAILABILITY */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FiFilter className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-slate-800">Text Availability</h3>
                </div>

                <div className="space-y-2">
                  {[
                    { key: "abstract", label: "Abstract" },
                    { key: "freeFullText", label: "Free Full Text" },
                    { key: "fullText", label: "Full Text" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters[key]}
                        disabled={running}
                        onChange={(e) =>
                          setFilters({ ...filters, [key]: e.target.checked })
                        }
                        className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* DATABASES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FiDatabase className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-slate-800">Databases</h3>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={databases.pubmed}
                      disabled={running}
                      onChange={(e) =>
                        setDatabases({ ...databases, pubmed: e.target.checked })
                      }
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      PubMed
                    </span>
                  </label>

                  <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg opacity-50 cursor-not-allowed">
                    <input
                      type="checkbox"
                      disabled
                      className="w-5 h-5 text-slate-400 rounded"
                    />
                    <span className="text-sm font-medium text-slate-500">
                      Cochrane <span className="text-xs">(Coming Soon)</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg opacity-50 cursor-not-allowed">
                    <input
                      type="checkbox"
                      disabled
                      className="w-5 h-5 text-slate-400 rounded"
                    />
                    <span className="text-sm font-medium text-slate-500">
                      Google Scholar <span className="text-xs">(Coming Soon)</span>
                    </span>
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
                    className="mb-4 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-900">
                        Searching literature...
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={!running && file ? { scale: 1.02 } : {}}
                whileTap={!running && file ? { scale: 0.98 } : {}}
                onClick={onSearch}
                disabled={!file || running}
                className={`
                  w-full h-12 rounded-xl font-semibold text-white
                  transition-all duration-300
                  ${
                    !file || running
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50"
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
                    <FiSearch className="w-5 h-5" />
                    Start Search
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