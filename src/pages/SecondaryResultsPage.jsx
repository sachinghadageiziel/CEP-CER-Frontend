import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDownload, FiSearch, FiCheckCircle, FiXCircle, FiFilter,
  FiChevronLeft, FiChevronRight, FiTrash2, FiX, FiInfo
} from "react-icons/fi";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

// Detail View Modal for Full Data
function DetailViewModal({ open, onClose, record }) {
  if (!open || !record) return null;

  const fields = [
    { label: "Literature ID", value: record.literature_id },
    { label: "Article ID", value: record.article_id },
    { label: "Summary", value: record.summary, multiline: true },
    { label: "Study Type", value: record.study_type },
    { label: "Device", value: record.device },
    { label: "Sample Size", value: record.sample_size },
    { label: "Appropriate Device", value: record.appropriate_device },
    { label: "Appropriate Device Application", value: record.appropriate_device_application },
    { label: "Appropriate Patient Group", value: record.appropriate_patient_group },
    { label: "Acceptable Report", value: record.acceptable_report },
    { label: "Suitability Score", value: record.suitability_score },
    { label: "Data Contribution Score", value: record.data_contribution_score },
    { label: "Data Source Type", value: record.data_source_type },
    { label: "Outcome Measures", value: record.outcome_measures },
    { label: "Follow Up", value: record.follow_up },
    { label: "Statistical Significance", value: record.statistical_significance },
    { label: "Clinical Significance", value: record.clinical_significance },
    { label: "Number of Males", value: record.number_of_males },
    { label: "Number of Females", value: record.number_of_females },
    { label: "Mean Age", value: record.mean_age },
    { label: "Result", value: record.result },
    { label: "Rationale", value: record.rationale, multiline: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 border-b-2 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Article Details</h2>
            <p className="text-xs sm:text-sm text-blue-600 font-semibold mt-1">Article ID: {record.article_id}</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-xl transition-all"
          >
            <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {fields.map((field, idx) => (
              <div 
                key={idx} 
                className={`${field.multiline ? 'md:col-span-2' : ''} bg-slate-50 border-2 border-slate-200 rounded-xl p-3 sm:p-4`}
              >
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                  {field.label}
                </label>
                <p className={`text-slate-800 ${field.multiline ? 'whitespace-pre-wrap' : ''} font-medium text-sm`}>
                  {field.value !== null && field.value !== undefined && field.value !== "" ? field.value : <span className="text-slate-400">-</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SecondaryResultsPage() {
  const { id: projectId } = useParams();

  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterDecision, setFilterDecision] = useState("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [stats, setStats] = useState({ total: 0, included: 0, excluded: 0 });

  useEffect(() => {
    loadResults();
  }, [projectId]);

  const loadResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/secondary/secondary-screen/${projectId}`);
      const data = await res.json();
      if (data.exists) {
        setResults(data.data || []);
        
        const included = (data.data || []).filter(r => r.result?.toUpperCase() === "INCLUDE").length;
        const excluded = (data.data || []).filter(r => r.result?.toUpperCase() === "EXCLUDE").length;
        
        setStats({
          total: (data.data || []).length,
          included,
          excluded,
        });
      }
    } catch (error) {
      console.error("Error loading results:", error);
    }
    setLoading(false);
  };

  const handleExport = () => {
    window.open(`http://localhost:5000/api/secondary/export-secondary-screen/${projectId}`);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailModalOpen(true);
  };

  const handleDelete = async (literatureId) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await fetch(
        `http://localhost:5000/api/secondary/secondary-screen/${projectId}/${literatureId}`,
        { method: "DELETE" }
      );
      await loadResults();
      setToastMessage("Record deleted successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const filteredResults = useMemo(() => {
    let filtered = results;

    if (filterDecision !== "all") {
      filtered = filtered.filter(r => r.result?.toUpperCase() === filterDecision.toUpperCase());
    }

    if (search) {
      filtered = filtered.filter(r =>
        Object.values(r).some(val => 
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    return filtered;
  }, [results, search, filterDecision]);

  const paginatedResults = filteredResults.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filteredResults.length / pageSize);

  const getResultBadge = (result) => {
    const isInclude = result?.toUpperCase() === "INCLUDE";
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${
        isInclude ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200" : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
      }`}>
        {isInclude ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiXCircle className="w-3.5 h-3.5" />}
        {result}
      </span>
    );
  };

  return (
    <Layout>
   <BreadcrumbsBar items={[
  { label: "Home", to: "/" },
  { label: "Project", to: `/project/${projectId}` },
  { label: "Secondary Screening" }
]} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 sm:p-6 space-y-4 sm:space-y-6"
      >
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Secondary Screening Results</h1>
              <p className="text-blue-200 text-xs sm:text-sm font-medium">Project ID: <span className="font-bold">{projectId}</span></p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center gap-2 bg-white text-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
            >
              <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" /> Export Excel
            </motion.button>
          </div>
        </motion.div>

        {/* STATS */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
        >
          <motion.div whileHover={{ scale: 1.02, y: -2 }} className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-bold text-blue-700">Total Articles</p>
              <div className="p-2 sm:p-3 bg-blue-200 rounded-xl">
                <FiFilter className="w-4 h-4 sm:w-6 sm:h-6 text-blue-700" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-blue-900">{stats.total}</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -2 }} className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-bold text-green-700">Included</p>
              <div className="p-2 sm:p-3 bg-green-200 rounded-xl">
                <FiCheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-700" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-green-900">{stats.included}</p>
            <p className="text-xs sm:text-sm text-green-600 mt-2 font-semibold">
              {stats.total > 0 ? ((stats.included / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -2 }} className="bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-300 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-bold text-red-700">Excluded</p>
              <div className="p-2 sm:p-3 bg-red-200 rounded-xl">
                <FiXCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-700" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-red-900">{stats.excluded}</p>
            <p className="text-xs sm:text-sm text-red-600 mt-2 font-semibold">
              {stats.total > 0 ? ((stats.excluded / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </motion.div>
        </motion.div>

        {/* FILTERS */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-slate-200"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
              <input
                className="w-full h-10 sm:h-12 border-2 border-slate-300 pl-10 sm:pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm sm:text-base"
                placeholder="Search across all fields..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterDecision("all")}
                className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm ${filterDecision === "all" ? "bg-slate-800 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                All
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterDecision("include")}
                className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm ${filterDecision === "include" ? "bg-green-600 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Included
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterDecision("exclude")}
                className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold transition-all text-xs sm:text-sm ${filterDecision === "exclude" ? "bg-red-600 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Excluded
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* RESULTS TABLE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Screening Results</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing <span className="font-semibold text-slate-700">{paginatedResults.length}</span> of <span className="font-semibold text-slate-700">{filteredResults.length}</span> entries
            </p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full"
                />
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <FiXCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium text-sm sm:text-base">No results found</p>
              </div>
            ) : (
              <div className="min-w-full">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200 sticky top-0">
                    <tr>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap sticky left-0 bg-slate-100 z-10">Article ID</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Study Type</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Device</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase whitespace-nowrap">Sample Size</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Appropriate Device</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Device Application</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Patient Group</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Acceptable Report</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase whitespace-nowrap">Suitability Score</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase whitespace-nowrap">Data Score</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Data Source</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Outcome Measures</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Follow Up</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Statistical Sig.</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase whitespace-nowrap">Clinical Sig.</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase whitespace-nowrap">Males</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase whitespace-nowrap">Females</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase whitespace-nowrap">Mean Age</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase whitespace-nowrap">Result</th>
                      <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-xs font-black text-slate-700 uppercase whitespace-nowrap sticky right-0 bg-slate-100 z-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedResults.map((row) => (
                      <motion.tr 
                        key={row.literature_id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-3 sm:px-4 py-3 sm:py-4 font-bold text-blue-600 whitespace-nowrap sticky left-0 bg-white z-10">{row.article_id}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.study_type || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.device || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-slate-700 whitespace-nowrap">{row.sample_size || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.appropriate_device || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.appropriate_device_application || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.appropriate_patient_group || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.acceptable_report || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-slate-700 whitespace-nowrap">{row.suitability_score || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-slate-700 whitespace-nowrap">{row.data_contribution_score || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.data_source_type || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.outcome_measures || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.follow_up || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.statistical_significance || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-slate-700 whitespace-nowrap">{row.clinical_significance || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-slate-700 whitespace-nowrap">{row.number_of_males || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-slate-700 whitespace-nowrap">{row.number_of_females || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center text-slate-700 whitespace-nowrap">{row.mean_age || "-"}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-center whitespace-nowrap">{getResultBadge(row.result)}</td>
                        <td className="px-3 sm:px-4 py-3 sm:py-4 text-right whitespace-nowrap sticky right-0 bg-white z-10">
                          <div className="flex justify-end gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewDetails(row)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Details"
                            >
                              <FiInfo className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(row.literature_id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-slate-600 font-medium">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-slate-300 rounded-lg text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-1.5 sm:p-2 border-2 border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
                >
                  <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
                <span className="text-xs sm:text-sm font-bold text-slate-700 px-2 sm:px-3">
                  Page <span className="text-blue-600">{page + 1}</span> of <span className="text-blue-600">{totalPages}</span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="p-1.5 sm:p-2 border-2 border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
                >
                  <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>

        {/* DETAIL VIEW MODAL */}
        <DetailViewModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          record={selectedRecord}
        />

        {/* TOAST */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-3 border-2 border-green-400 z-50 max-w-sm"
            >
              <FiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span className="font-bold text-sm sm:text-base">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}