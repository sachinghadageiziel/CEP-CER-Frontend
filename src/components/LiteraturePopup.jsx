import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUpload, FiCheckCircle, FiCalendar, FiDatabase, FiFilter, FiSearch } from "react-icons/fi";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a blue theme for the DatePicker
const blueTheme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue-600
    },
  },
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#2563eb',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
          },
        },
      },
    },
  },
});

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
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border-2 border-blue-100"
          >
            {/* HEADER */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 px-6 sm:px-8 py-5 sm:py-6 overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 hover:bg-white/20 rounded-xl transition-all z-10"
              >
                <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.button>

              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <FiSearch className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Literature Search</h2>
                  <p className="text-blue-100 text-xs sm:text-sm mt-0.5 font-medium">
                    Configure search parameters and filters
                  </p>
                </div>
              </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 sm:space-y-6">
              {/* FILE UPLOAD */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <FiUpload className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Upload Keywords File</h3>
                </div>
                
                <label
                  className={`
                    relative block w-full border-2 border-dashed rounded-2xl p-5 sm:p-6
                    transition-all duration-300 cursor-pointer
                    ${
                      file
                        ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50"
                        : "border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 hover:border-blue-400 hover:shadow-lg"
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
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    {file ? (
                      <>
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="p-2.5 sm:p-3 bg-green-100 rounded-xl border-2 border-green-300 shadow-md"
                        >
                          <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </motion.div>
                        <div className="flex-1">
                          <p className="font-bold text-green-900 text-sm sm:text-base">{file.name}</p>
                          <p className="text-xs sm:text-sm text-green-600 mt-1 font-medium">✓ Ready to search</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-2.5 sm:p-3 bg-blue-100 rounded-xl border-2 border-blue-200 shadow-sm">
                          <FiUpload className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-700 text-sm sm:text-base">Upload Excel File</p>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
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
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <FiCalendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Date Range Filter</h3>
                </div>

                <label className="flex items-center gap-3 p-3.5 sm:p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-all cursor-pointer shadow-sm">
                  <input
                    type="checkbox"
                    checked={applyDateFilter}
                    disabled={running}
                    onChange={(e) => setApplyDateFilter(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-slate-700">
                    Apply custom date range
                  </span>
                </label>

                <AnimatePresence>
                  {applyDateFilter && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                    >
                      <ThemeProvider theme={blueTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">From Date</label>
                            <DatePicker
                              value={fromDate ? dayjs(fromDate) : null}
                              onChange={(val) =>
                                setFromDate(val ? val.format("YYYY-MM-DD") : "")
                              }
                              disabled={running}
                              disableFuture={false}
                              maxDate={toDate ? dayjs(toDate) : undefined}
                              views={['year', 'month', 'day']}
                              openTo="year"
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  placeholder: "Select start date",
                                  sx: {
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '12px',
                                      backgroundColor: 'white',
                                      '& fieldset': {
                                        borderColor: '#cbd5e1',
                                        borderWidth: '2px',
                                      },
                                      '&:hover fieldset': {
                                        borderColor: '#3b82f6',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#2563eb',
                                      },
                                    },
                                  },
                                },
                                popper: {
                                  sx: {
                                    '& .MuiPaper-root': {
                                      borderRadius: '16px',
                                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                      border: '2px solid #dbeafe',
                                    },
                                  },
                                },
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">To Date</label>
                            <DatePicker
                              value={toDate ? dayjs(toDate) : null}
                              onChange={(val) =>
                                setToDate(val ? val.format("YYYY-MM-DD") : "")
                              }
                              disabled={running}
                              disableFuture={false}
                              minDate={fromDate ? dayjs(fromDate) : undefined}
                              views={['year', 'month', 'day']}
                              openTo="year"
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  placeholder: "Select end date",
                                  sx: {
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '12px',
                                      backgroundColor: 'white',
                                      '& fieldset': {
                                        borderColor: '#cbd5e1',
                                        borderWidth: '2px',
                                      },
                                      '&:hover fieldset': {
                                        borderColor: '#3b82f6',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#2563eb',
                                      },
                                    },
                                  },
                                },
                                popper: {
                                  sx: {
                                    '& .MuiPaper-root': {
                                      borderRadius: '16px',
                                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                      border: '2px solid #dbeafe',
                                    },
                                  },
                                },
                              }}
                            />
                          </div>
                        </LocalizationProvider>
                      </ThemeProvider>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TEXT AVAILABILITY */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <FiFilter className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Text Availability</h3>
                </div>

                <div className="space-y-2.5">
                  {[
                    { key: "abstract", label: "Abstract" },
                    { key: "freeFullText", label: "Free Full Text" },
                    { key: "fullText", label: "Full Text" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-3 sm:p-3.5 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shadow-sm"
                    >
                      <input
                        type="checkbox"
                        checked={filters[key]}
                        disabled={running}
                        onChange={(e) =>
                          setFilters({ ...filters, [key]: e.target.checked })
                        }
                        className="w-5 h-5 text-blue-600 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-700">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* DATABASES */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <FiDatabase className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Databases</h3>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 p-3 sm:p-3.5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      checked={databases.pubmed}
                      disabled={running}
                      onChange={(e) =>
                        setDatabases({ ...databases, pubmed: e.target.checked })
                      }
                      className="w-5 h-5 text-blue-600 rounded-md focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-700">
                      PubMed
                    </span>
                  </label>

                  <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-slate-100 border-2 border-slate-200 rounded-xl opacity-60 cursor-not-allowed">
                    <input
                      type="checkbox"
                      disabled
                      className="w-5 h-5 text-slate-400 rounded-md cursor-not-allowed"
                    />
                    <span className="text-sm font-bold text-slate-500">
                      Cochrane <span className="text-xs font-normal">(Coming Soon)</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-slate-100 border-2 border-slate-200 rounded-xl opacity-60 cursor-not-allowed">
                    <input
                      type="checkbox"
                      disabled
                      className="w-5 h-5 text-slate-400 rounded-md cursor-not-allowed"
                    />
                    <span className="text-sm font-bold text-slate-500">
                      Google Scholar <span className="text-xs font-normal">(Coming Soon)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-t-2 border-slate-200">
              <AnimatePresence>
                {running && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-xs sm:text-sm font-bold text-blue-900">
                        Searching literature...
                      </span>
                      <span className="text-sm sm:text-base font-black text-blue-600">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 h-2 sm:h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-blue-600 mt-2 sm:mt-3 font-medium">
                      Please wait while we search the databases...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={!running && file ? { scale: 1.02, y: -2 } : {}}
                whileTap={!running && file ? { scale: 0.98 } : {}}
                onClick={onSearch}
                disabled={!file || running}
                className={`
                  w-full h-12 sm:h-14 rounded-2xl font-bold text-white text-sm sm:text-base
                  transition-all duration-300 shadow-lg
                  ${
                    !file || running
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:shadow-2xl hover:shadow-blue-500/50"
                  }
                `}
              >
                {running ? (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 sm:gap-3">
                    <FiSearch className="w-4 h-4 sm:w-5 sm:h-5" />
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