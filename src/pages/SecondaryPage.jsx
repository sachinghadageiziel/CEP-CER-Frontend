import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUpload, FiEye, FiX, FiCheckCircle, FiLoader, FiSearch, 
  FiCheck, FiSquare, FiCheckSquare, FiFilter, FiDownload,
  FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2, FiXCircle
} from "react-icons/fi";

/* ==================== SECONDARY PAGE ==================== */
function SecondaryPage() {
  const projectId = 1; // Mock project ID

  /* ---------- STATE ---------- */
  const [openPdfUpload, setOpenPdfUpload] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [pdfStatusData, setPdfStatusData] = useState([]);
  const [downloadedPdfs, setDownloadedPdfs] = useState([]);

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [loadingSecondary, setLoadingSecondary] = useState(false);

  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [showPdfList, setShowPdfList] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [selectedLiteratureIds, setSelectedLiteratureIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadLiteratureId, setUploadLiteratureId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    loadPdfStatus();
    loadPdfList();
  }, []);

  const loadPdfStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/secondary/pdf-status/${projectId}`);
      const data = await res.json();
      if (data.exists) {
        setPdfStatusData(data.data || []);
      }
    } catch (error) {
      console.error("Error loading PDF status:", error);
    }
  };

  const loadPdfList = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/secondary/pdf-list?project_id=${projectId}`);
      const data = await res.json();
      setDownloadedPdfs(data.pdfs || []);
    } catch (error) {
      console.error("Error loading PDF list:", error);
    }
  };

  /* ---------- ACTIONS ---------- */
  const handleDownloadPdfs = async () => {
    setLoadingPdf(true);
    try {
      await fetch(`http://localhost:5000/api/secondary/download-pdfs/${projectId}`, {
        method: "POST"
      });
      await loadPdfStatus();
      await loadPdfList();
      setToastMessage("PDFs downloaded successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error downloading PDFs:", error);
    }
    setLoadingPdf(false);
  };

  const handleUploadPdf = async () => {
    if (!uploadFile || !uploadLiteratureId) return;

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      await fetch(
        `http://localhost:5000/api/secondary/upload-pdf/${projectId}/${uploadLiteratureId}`,
        { method: "POST", body: formData }
      );
      
      await loadPdfStatus();
      await loadPdfList();
      
      setUploadModalOpen(false);
      setUploadFile(null);
      setUploadLiteratureId(null);
      
      setToastMessage("PDF uploaded successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const handleRunSecondaryScreening = async () => {
    if (selectedLiteratureIds.size === 0) {
      alert("Please select at least one article");
      return;
    }

    setLoadingSecondary(true);
    try {
      await fetch(`http://localhost:5000/api/secondary/secondary-screen/${projectId}`, {
        method: "POST"
      });
      
      setToastMessage("Secondary screening completed!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      // Show results instead of navigating
      setShowResults(true);
    } catch (error) {
      console.error("Error running secondary screening:", error);
    }
    setLoadingSecondary(false);
    setOpenSecondary(false);
  };

  const openPdf = async (filename) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/secondary/open-pdf?project_id=${projectId}&filename=${encodeURIComponent(filename)}`
      );
      const blob = await res.blob();
      setActivePdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      alert("PDF not found");
    }
  };

  /* ---------- SELECTION ---------- */
  const toggleSelection = (literatureId) => {
    const newSet = new Set(selectedLiteratureIds);
    if (newSet.has(literatureId)) {
      newSet.delete(literatureId);
    } else {
      newSet.add(literatureId);
    }
    setSelectedLiteratureIds(newSet);
    setSelectAll(newSet.size === filteredRows.length && filteredRows.length > 0);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedLiteratureIds(new Set());
      setSelectAll(false);
    } else {
      const allIds = filteredRows.map(r => r.literature_id);
      setSelectedLiteratureIds(new Set(allIds));
      setSelectAll(true);
    }
  };

  /* ---------- FILTERING ---------- */
  const filteredRows = useMemo(() => {
    return pdfStatusData.filter(row =>
      row.article_id?.toLowerCase().includes(search.toLowerCase()) ||
      row.status?.toLowerCase().includes(search.toLowerCase())
    );
  }, [pdfStatusData, search]);

  const paginatedRows = filteredRows.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filteredRows.length / pageSize);

  /* ---------- STATS ---------- */
  const stats = useMemo(() => {
    const selected = selectedLiteratureIds.size;
    const downloaded = [...selectedLiteratureIds].filter(id => {
      const row = pdfStatusData.find(r => r.literature_id === id);
      return row && (row.status === "Downloaded" || row.status === "Manually downloaded");
    }).length;
    const pending = selected - downloaded;

    return { selected, downloaded, pending };
  }, [selectedLiteratureIds, pdfStatusData]);

  const getStatusBadge = (status) => {
    const isDownloaded = status === "Downloaded" || status === "Manually downloaded";
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        isDownloaded ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
      }`}>
        {isDownloaded && <FiCheckCircle className="w-3 h-3" />}
        {status}
      </span>
    );
  };

  // Show results view if showResults is true
  if (showResults) {
    return <SecondaryResultsView projectId={projectId} onBack={() => setShowResults(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6 max-w-7xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Secondary Screening</h1>
            <p className="text-sm text-slate-500 mt-1">Project ID: {projectId}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadPdfs}
            disabled={loadingPdf}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loadingPdf ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiUpload className="w-4 h-4" />}
            {loadingPdf ? "Downloading..." : "Download PDFs"}
          </motion.button>
        </div>

        {/* SELECTION STATS */}
        {selectedLiteratureIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
              <p className="text-xs font-medium text-blue-700 mb-1">Selected</p>
              <p className="text-3xl font-bold text-blue-900">{stats.selected}</p>
            </div>
            <div className="bg-white border-2 border-green-200 rounded-xl p-4">
              <p className="text-xs font-medium text-green-700 mb-1">Downloaded</p>
              <p className="text-3xl font-bold text-green-900">{stats.downloaded}</p>
            </div>
            <div className="bg-white border-2 border-amber-200 rounded-xl p-4">
              <p className="text-xs font-medium text-amber-700 mb-1">Pending</p>
              <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
            </div>
          </motion.div>
        )}

        {/* TOOLBAR */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full h-11 border border-slate-300 pl-10 pr-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by article ID or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowPdfList(true)}
              className="h-11 px-5 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
            >
              View PDFs
            </button>
            <button
              onClick={() => setOpenSecondary(true)}
              disabled={selectedLiteratureIds.size === 0 || loadingSecondary}
              className="h-11 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingSecondary ? "Processing..." : `Run Screening (${selectedLiteratureIds.size})`}
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">PDF Status</h2>
              <p className="text-xs text-slate-500">Showing {paginatedRows.length} of {filteredRows.length}</p>
            </div>
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {selectAll ? <FiCheckSquare /> : <FiSquare />}
              {selectAll ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase">Select</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Article ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">PMCID</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRows.map((row) => {
                  const isSelected = selectedLiteratureIds.has(row.literature_id);
                  const pdfFile = downloadedPdfs.find(p => p.literature_id === row.literature_id);
                  
                  return (
                    <tr key={row.literature_id} className={`hover:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => toggleSelection(row.literature_id)}>
                          {isSelected ? 
                            <FiCheckSquare className="w-5 h-5 text-blue-600" /> : 
                            <FiSquare className="w-5 h-5 text-slate-400" />
                          }
                        </button>
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-600">{row.article_id}</td>
                      <td className="px-6 py-4 text-slate-600">{row.pmcid || "-"}</td>
                      <td className="px-6 py-4 text-center">{getStatusBadge(row.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {pdfFile ? (
                            <button
                              onClick={() => openPdf(pdfFile.filename)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <FiEye /> View
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setUploadLiteratureId(row.literature_id);
                                setUploadModalOpen(true);
                              }}
                              className="flex items-center gap-1 text-green-600 hover:text-green-700"
                            >
                              <FiUpload /> Upload
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 border rounded-lg hover:bg-white disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">Page {page + 1} of {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 border rounded-lg hover:bg-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* MODALS */}
        <PdfListModal 
          open={showPdfList} 
          onClose={() => setShowPdfList(false)}
          pdfs={downloadedPdfs}
          onView={openPdf}
        />

        <UploadPdfModal
          open={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setUploadFile(null);
            setUploadLiteratureId(null);
          }}
          onUpload={handleUploadPdf}
          file={uploadFile}
          onFileChange={(e) => setUploadFile(e.target.files[0])}
        />

        <SecondaryScreeningModal
          open={openSecondary}
          onClose={() => setOpenSecondary(false)}
          onRun={handleRunSecondaryScreening}
          loading={loadingSecondary}
          selectedCount={selectedLiteratureIds.size}
        />

        {/* PDF VIEWER */}
        <AnimatePresence>
          {activePdfUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={() => setActivePdfUrl(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-6xl h-[90vh] rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
                  <span className="font-semibold">PDF Viewer</span>
                  <button onClick={() => setActivePdfUrl(null)} className="p-2 hover:bg-slate-200 rounded-lg">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <iframe src={activePdfUrl} className="w-full h-[calc(100%-64px)]" title="PDF" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOAST */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3"
            >
              <FiCheckCircle className="w-5 h-5" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ==================== SECONDARY RESULTS VIEW ==================== */
function SecondaryResultsView({ projectId, onBack }) {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [filterResult, setFilterResult] = useState("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editResult, setEditResult] = useState("");
  const [editRationale, setEditRationale] = useState("");

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/secondary/secondary-screen/${projectId}`);
      const data = await res.json();
      if (data.exists) {
        setResults(data.data || []);
      }
    } catch (error) {
      console.error("Error loading results:", error);
    }
    setLoading(false);
  };

  const handleExport = () => {
    window.open(`http://localhost:5000/api/secondary/export-secondary-screen/${projectId}`);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setEditResult(record.result || "");
    setEditRationale(record.rationale || "");
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("result", editResult);
      formData.append("rationale", editRationale);

      await fetch(
        `http://localhost:5000/api/secondary/secondary-screen/${projectId}/${editingRecord.literature_id}`,
        { method: "PUT", body: formData }
      );

      await loadResults();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleDelete = async (literatureId) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await fetch(
        `http://localhost:5000/api/secondary/secondary-screen/${projectId}/${literatureId}`,
        { method: "DELETE" }
      );
      await loadResults();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const filteredResults = useMemo(() => {
    let filtered = results;

    if (filterResult !== "all") {
      filtered = filtered.filter(r => r.result?.toLowerCase() === filterResult);
    }

    if (search) {
      filtered = filtered.filter(r =>
        r.article_id?.toLowerCase().includes(search.toLowerCase()) ||
        r.summary?.toLowerCase().includes(search.toLowerCase()) ||
        r.rationale?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [results, search, filterResult]);

  const paginatedResults = filteredResults.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filteredResults.length / pageSize);

  const stats = useMemo(() => {
    const included = results.filter(r => r.result?.toLowerCase() === "include").length;
    const excluded = results.filter(r => r.result?.toLowerCase() === "exclude").length;
    return { total: results.length, included, excluded };
  }, [results]);

  const getResultBadge = (result) => {
    const isInclude = result?.toLowerCase() === "include";
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
        isInclude ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}>
        {isInclude ? <FiCheckCircle className="w-3 h-3" /> : <FiXCircle className="w-3 h-3" />}
        {result}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6 max-w-7xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-2">
              <FiChevronLeft /> Back to Screening
            </button>
            <h1 className="text-3xl font-bold text-slate-800">Secondary Screening Results</h1>
            <p className="text-sm text-slate-500 mt-1">Project ID: {projectId}</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl"
          >
            <FiDownload /> Export Excel
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border-2 border-blue-200 rounded-xl p-5">
            <p className="text-sm font-medium text-blue-700">Total Articles</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white border-2 border-green-200 rounded-xl p-5">
            <p className="text-sm font-medium text-green-700">Included</p>
            <p className="text-3xl font-bold text-green-900 mt-1">{stats.included}</p>
            <p className="text-xs text-green-600 mt-1">
              {stats.total > 0 ? ((stats.included / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-white border-2 border-red-200 rounded-xl p-5">
            <p className="text-sm font-medium text-red-700">Excluded</p>
            <p className="text-3xl font-bold text-red-900 mt-1">{stats.excluded}</p>
            <p className="text-xs text-red-600 mt-1">
              {stats.total > 0 ? ((stats.excluded / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full h-11 border border-slate-300 pl-10 pr-4 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterResult("all")}
                className={`px-4 py-2 rounded-lg font-medium ${filterResult === "all" ? "bg-slate-800 text-white" : "bg-slate-100"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterResult("include")}
                className={`px-4 py-2 rounded-lg font-medium ${filterResult === "include" ? "bg-green-600 text-white" : "bg-slate-100"}`}
              >
                Included
              </button>
              <button
                onClick={() => setFilterResult("exclude")}
                className={`px-4 py-2 rounded-lg font-medium ${filterResult === "exclude" ? "bg-red-600 text-white" : "bg-slate-100"}`}
              >
                Excluded
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b">
            <h2 className="text-lg font-semibold">Screening Results</h2>
            <p className="text-xs text-slate-500">Showing {paginatedResults.length} of {filteredResults.length}</p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <FiLoader className="w-10 h-10 text-emerald-600 animate-spin" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Article ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Summary</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Study Type</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase">Result</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedResults.map((row) => (
                    <tr key={row.literature_id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-blue-600">{row.article_id}</td>
                      <td className="px-6 py-4 max-w-md truncate text-slate-700">{row.summary || "-"}</td>
                      <td className="px-6 py-4 text-slate-700">{row.study_type || "-"}</td>
                      <td className="px-6 py-4 text-center">{getResultBadge(row.result)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(row)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.literature_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 border rounded-lg hover:bg-white disabled:opacity-50"
                >
                  <FiChevronLeft />
                </button>
                <span className="text-sm text-slate-600 px-3">Page {page + 1} of {totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="p-2 border rounded-lg hover:bg-white disabled:opacity-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        <EditResultModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          result={editResult}
          setResult={setEditResult}
          rationale={editRationale}
          setRationale={setEditRationale}
          articleId={editingRecord?.article_id}
        />
      </motion.div>
    </div>
  );
}

/* ==================== MODALS ==================== */

function PdfListModal({ open, onClose, pdfs, onView }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
            <h2 className="text-lg font-semibold">Downloaded PDFs</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            {pdfs.length === 0 ? (
              <p className="text-center text-slate-500 py-10">No PDFs downloaded yet</p>
            ) : (
              <div className="space-y-2">
                {pdfs.map((pdf) => (
                  <div
                    key={pdf.literature_id}
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{pdf.filename}</p>
                      <p className="text-sm text-slate-500">PMID: {pdf.pmid}</p>
                    </div>
                    <button
                      onClick={() => onView(pdf.filename)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FiEye /> View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function UploadPdfModal({ open, onClose, onUpload, file, onFileChange }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
            <h2 className="text-lg font-semibold">Upload PDF</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={onFileChange}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
            </div>
            {file && (
              <p className="text-sm text-slate-600">Selected: {file.name}</p>
            )}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={onUpload}
                disabled={!file}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SecondaryScreeningModal({ open, onClose, onRun, loading, selectedCount }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
            <h2 className="text-lg font-semibold">Run Secondary Screening</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                You are about to run secondary screening on <strong>{selectedCount}</strong> selected articles.
              </p>
            </div>
            <p className="text-sm text-slate-600">
              This process will analyze the PDFs and generate screening results based on the project criteria.
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onRun}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Run Screening
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EditResultModal({ open, onClose, onSave, result, setResult, rationale, setRationale, articleId }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
            <h2 className="text-lg font-semibold">Edit Result</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Article ID: <span className="text-blue-600">{articleId}</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Result
              </label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select result</option>
                <option value="Include">Include</option>
                <option value="Exclude">Exclude</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rationale
              </label>
              <textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter rationale for this decision..."
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ==================== MAIN APP ==================== */
export default function App() {
  return <SecondaryPage />;
}