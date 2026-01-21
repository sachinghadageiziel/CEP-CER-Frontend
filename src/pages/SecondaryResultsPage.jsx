import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiEye, FiX, FiCheckCircle, FiXCircle, FiChevronLeft, 
  FiChevronRight, FiTrash2, FiDownload, FiFilter, FiAlertCircle
} from "react-icons/fi";

// Detail View Modal
function DetailViewModal({ open, onClose, result }) {
  if (!open || !result) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 px-6 sm:px-8 py-5 sm:py-6">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 hover:bg-white/20 rounded-xl transition-all z-10"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white pr-12">Article Details</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 font-medium">
                Article ID: <span className="font-bold font-mono">{result.article_id}</span>
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Summary */}
              {result.summary && (
                <div className="md:col-span-2 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl">
                  <h3 className="text-sm font-black text-blue-900 mb-2 uppercase tracking-wide">Summary</h3>
                  <p className="text-sm text-blue-800 leading-relaxed">{result.summary}</p>
                </div>
              )}

              {/* Study Type */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Study Type</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.study_type || "N/A"}</p>
              </div>

              {/* Device */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Device</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.device || "N/A"}</p>
              </div>

              {/* Sample Size */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Sample Size</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.sample_size || "N/A"}</p>
              </div>

              {/* Appropriate Device */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Appropriate Device</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.appropriate_device || "N/A"}</p>
              </div>

              {/* Appropriate Device Application */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Device Application</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.appropriate_device_application || "N/A"}</p>
              </div>

              {/* Appropriate Patient Group */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Patient Group</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.appropriate_patient_group || "N/A"}</p>
              </div>

              {/* Acceptable Report */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Acceptable Report</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.acceptable_report || "N/A"}</p>
              </div>

              {/* Data Contribution Score */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Data Score</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.data_contribution_score || "N/A"}</p>
              </div>

              {/* Suitability Score */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Suitability Score</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.suitability_score || "N/A"}</p>
              </div>

              {/* Data Source Type */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Data Source Type</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.data_source_type || "N/A"}</p>
              </div>

              {/* Outcome Measures */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Outcome Measures</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.outcome_measures || "N/A"}</p>
              </div>

              {/* Follow Up */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Follow Up</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.follow_up || "N/A"}</p>
              </div>

              {/* Statistical Significance */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Statistical Significance</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.statistical_significance || "N/A"}</p>
              </div>

              {/* Clinical Significance */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Clinical Significance</h3>
                <p className="text-sm text-slate-900 font-semibold">{result.clinical_significance || "N/A"}</p>
              </div>

              {/* Demographics */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-3 uppercase tracking-wide">Demographics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Males:</span>
                    <span className="text-sm text-slate-900 font-semibold">{result.number_of_males || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Females:</span>
                    <span className="text-sm text-slate-900 font-semibold">{result.number_of_females || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Mean Age:</span>
                    <span className="text-sm text-slate-900 font-semibold">{result.mean_age || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl">
                <h3 className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">Decision</h3>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${
                  result.result?.toUpperCase() === "INCLUDE"
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-red-100 text-red-700 border-2 border-red-300"
                }`}>
                  {result.result?.toUpperCase() === "INCLUDE" ? <FiCheckCircle className="w-4 h-4" /> : <FiXCircle className="w-4 h-4" />}
                  {result.result?.toUpperCase() || "N/A"}
                </span>
              </div>

              {/* Rationale */}
              {result.rationale && (
                <div className="md:col-span-2 p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl">
                  <h3 className="text-sm font-black text-amber-900 mb-2 uppercase tracking-wide">Rationale</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">{result.rationale}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ==================== SECONDARY RESULT TABLE ==================== */
export default function SecondaryResultTable({ projectId, search, refreshTrigger, screenedArticleIds = [] }) {
  const [screeningResults, setScreeningResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterDecision, setFilterDecision] = useState("all");
  const [showAllResults, setShowAllResults] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [detailModal, setDetailModal] = useState({ open: false, result: null });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Load screening results on mount and when refreshTrigger changes
  useEffect(() => {
    loadScreeningResults();
  }, [projectId, refreshTrigger]);

  const loadScreeningResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/secondary/secondary-screen/${projectId}`);
      const data = await res.json();
      
      if (data.exists && data.data) {
        setScreeningResults(data.data);
      } else {
        setScreeningResults([]);
      }
    } catch (error) {
      console.error("Error loading screening results:", error);
      showNotification("Error loading screening results", "error");
      setScreeningResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (literatureId) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/secondary/secondary-screen/${projectId}/${literatureId}`,
        { method: "DELETE" }
      );
      
      if (res.ok) {
        showNotification("Result deleted successfully!", "success");
        await loadScreeningResults();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error("Error deleting result:", error);
      showNotification("Error deleting result", "error");
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/secondary/export-secondary-screen/${projectId}`
      );
      
      if (!res.ok) {
        throw new Error("Export failed");
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `secondary_screening_results_${projectId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showNotification("Export successful!", "success");
    } catch (error) {
      console.error("Error exporting:", error);
      showNotification("Error exporting results", "error");
    }
  };

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Filtering
  const filteredResults = useMemo(() => {
    let filtered = screeningResults;
    
    // Filter by screened articles (if any were specified and toggle is off)
    if (screenedArticleIds.length > 0 && !showAllResults) {
      filtered = filtered.filter(r => 
        screenedArticleIds.includes(r.article_id)
      );
    }
    
    // Filter by decision
    if (filterDecision !== "all") {
      filtered = filtered.filter(r => 
        r.result?.toUpperCase() === filterDecision.toUpperCase()
      );
    }
    
    // Filter by search
    if (search) {
      filtered = filtered.filter(r =>
        r.article_id?.toLowerCase().includes(search.toLowerCase()) ||
        r.summary?.toLowerCase().includes(search.toLowerCase()) ||
        r.study_type?.toLowerCase().includes(search.toLowerCase()) ||
        r.device?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  }, [screeningResults, filterDecision, search, screenedArticleIds, showAllResults]);

  const paginatedResults = filteredResults.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filteredResults.length / pageSize);

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [filterDecision, search]);

  // Stats
  const stats = useMemo(() => {
    const included = screeningResults.filter(r => r.result?.toUpperCase() === "INCLUDE").length;
    const excluded = screeningResults.filter(r => r.result?.toUpperCase() === "EXCLUDE").length;
    return {
      total: screeningResults.length,
      included,
      excluded,
      includedPercent: screeningResults.length > 0 ? ((included / screeningResults.length) * 100).toFixed(1) : 0,
      excludedPercent: screeningResults.length > 0 ? ((excluded / screeningResults.length) * 100).toFixed(1) : 0,
    };
  }, [screeningResults]);

  const getResultBadge = (result) => {
    const isInclude = result?.toUpperCase() === "INCLUDE";
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${
        isInclude
          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
          : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
      }`}>
        {isInclude ? <FiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <FiXCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        <span>{isInclude ? "Include" : "Exclude"}</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* STATS CARDS */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-bold text-blue-700">Total Articles</p>
            <div className="p-1.5 sm:p-2 bg-blue-200 rounded-lg">
              <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-blue-900">{stats.total}</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-bold text-green-700">Included</p>
            <div className="p-1.5 sm:p-2 bg-green-200 rounded-lg">
              <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl sm:text-4xl font-black text-green-900">{stats.included}</p>
            <p className="text-sm sm:text-base font-bold text-green-600">({stats.includedPercent}%)</p>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-300 rounded-2xl p-4 sm:p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm font-bold text-red-700">Excluded</p>
            <div className="p-1.5 sm:p-2 bg-red-200 rounded-lg">
              <FiXCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl sm:text-4xl font-black text-red-900">{stats.excluded}</p>
            <p className="text-sm sm:text-base font-bold text-red-600">({stats.excludedPercent}%)</p>
          </div>
        </motion.div>
      </motion.div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3">
        {/* Show toggle button only if there are screened articles */}
        {screenedArticleIds.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAllResults(!showAllResults)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center gap-2 ${
              !showAllResults
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <FiFilter className="w-3 h-3 sm:w-4 sm:h-4" /> 
            {showAllResults ? `Show Selected (${screenedArticleIds.length})` : "Show All Results"}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilterDecision("all")}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center gap-2 ${
            filterDecision === "all"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <FiFilter className="w-3 h-3 sm:w-4 sm:h-4" /> All
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilterDecision("include")}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center gap-2 ${
            filterDecision === "include"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <FiCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Included
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilterDecision("exclude")}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center gap-2 ${
            filterDecision === "exclude"
              ? "bg-red-600 text-white shadow-lg"
              : "bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <FiXCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Excluded
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          disabled={screeningResults.length === 0}
          className="ml-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiDownload className="w-3 h-3 sm:w-4 sm:h-4" /> Export
        </motion.button>
      </div>

      {/* RESULTS TABLE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden"
      >
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Screening Results</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Showing <span className="font-semibold text-slate-700">{paginatedResults.length}</span> of <span className="font-semibold text-slate-700">{filteredResults.length}</span> results
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
             <tr>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-slate-100 z-10">Article ID</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Study Type</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Device</th>
  <th className="px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Sample Size</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Appropriate Device</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Device Application</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Patient Group</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Acceptable Report</th>
  <th className="px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Suitability Score</th>
  <th className="px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Data Score</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Data Source Type</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Outcome Measures</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Follow Up</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Statistical Sig.</th>
  <th className="px-4 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Clinical Sig.</th>
  <th className="px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Males</th>
  <th className="px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Females</th>
  <th className="px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Mean Age</th>
  <th className="px-4 py-3 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Decision</th>
  <th className="px-4 py-3 text-right text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap sticky right-0 bg-slate-100 z-10">Actions</th>
</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="20" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"
                      />
                      <span className="font-semibold">Loading results...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedResults.length === 0 ? (
                <tr>
                  <td colSpan="20" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-100 rounded-full">
                        <FiAlertCircle className="w-8 h-8 text-slate-400" />
                      </div>
                      <span className="font-semibold text-slate-500">No results found</span>
                      {(filterDecision !== "all" || search) && (
                        <span className="text-xs text-slate-400">Try adjusting your filters</span>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedResults.map((result) => (
                  <motion.tr 
                    key={result.literature_id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-blue-600 text-sm whitespace-nowrap sticky left-0 bg-white z-10">{result.article_id}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.study_type || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.device || "N/A"}</td>
                    <td className="px-4 py-3 text-center text-slate-700 text-sm font-semibold whitespace-nowrap">{result.sample_size || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.appropriate_device || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.appropriate_device_application || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.appropriate_patient_group || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.acceptable_report || "N/A"}</td>
                    <td className="px-4 py-3 text-center text-slate-700 text-sm font-semibold whitespace-nowrap">{result.suitability_score || "N/A"}</td>
                    <td className="px-4 py-3 text-center text-slate-700 text-sm font-semibold whitespace-nowrap">{result.data_contribution_score || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.data_source_type || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.outcome_measures || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.follow_up || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.statistical_significance || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">{result.clinical_significance || "N/A"}</td>
                    <td className="px-4 py-3 text-center text-slate-700 text-sm font-semibold whitespace-nowrap">{result.number_of_males || "N/A"}</td>
                    <td className="px-4 py-3 text-center text-slate-700 text-sm font-semibold whitespace-nowrap">{result.number_of_females || "N/A"}</td>
                    <td className="px-4 py-3 text-center text-slate-700 text-sm font-semibold whitespace-nowrap">{result.mean_age || "N/A"}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{getResultBadge(result.result)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap sticky right-0 bg-white z-10">
                      <div className="flex justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDetailModal({ open: true, result })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all text-xs"
                        >
                          <FiEye className="w-3.5 h-3.5" /> 
                          <span>View</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(result.literature_id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow-md hover:shadow-lg transition-all text-xs"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" /> 
                          <span>Delete</span>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-slate-300 rounded-xl hover:bg-white disabled:opacity-50 font-bold flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
            >
              <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              Previous
            </motion.button>
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              Page <span className="text-blue-600">{page + 1}</span> of <span className="text-blue-600">{totalPages}</span>
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-slate-300 rounded-xl hover:bg-white disabled:opacity-50 font-bold flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
            >
              Next
              <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* DETAIL MODAL */}
      <DetailViewModal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, result: null })}
        result={detailModal.result}
      />

      {/* TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 border-2 z-50 max-w-sm ${
              toastType === "success" 
                ? "bg-gradient-to-r from-green-600 to-emerald-600 border-green-400" 
                : toastType === "error"
                ? "bg-gradient-to-r from-red-600 to-rose-600 border-red-400"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-400"
            } text-white`}
          >
            {toastType === "success" && <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
            {toastType === "error" && <FiAlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
            {toastType === "info" && <FiAlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
            <span className="font-bold text-xs sm:text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}