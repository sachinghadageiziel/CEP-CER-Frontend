import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUpload, FiEye, FiX, FiCheckCircle, FiLoader, FiSearch, 
  FiCheck, FiSquare, FiCheckSquare, FiFilter, FiAlertCircle,
  FiDownload, FiFileText
} from "react-icons/fi";

const normalizePMID = (pmid) => String(pmid).replace(".0", "");

// Mock useParams and useNavigate for demonstration
const useParams = () => ({ id: "5" });
const useNavigate = () => (path) => console.log("Navigate to:", path);

export default function SecondaryPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [pdfRows, setPdfRows] = useState([]);
  const [downloadedPdfs, setDownloadedPdfs] = useState([]);

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [loadingSecondary, setLoadingSecondary] = useState(false);

  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [activePdfUrl, setActivePdfUrl] = useState(null);

  const [selectedPMIDs, setSelectedPMIDs] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [uploadingLiteratureId, setUploadingLiteratureId] = useState(null);
  const [hasAutoExtracted, setHasAutoExtracted] = useState(false);

  // Progress tracking
  const [downloadProgress, setDownloadProgress] = useState({
    show: false,
    current: 0,
    total: 0,
    status: ""
  });

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    if (projectId) {
      loadPdfStatus();
      loadPdfList();
    }
  }, [projectId]);

  const loadPdfStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/secondary/pdf-status/${projectId}`
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.exists) {
        setPdfRows(data.screening || []);
        if (!hasAutoExtracted && data.screening && data.screening.length > 0) {
          autoExtractText();
        }
      }
    } catch (error) {
      console.error("Error loading PDF status:", error);
      showToastMessage("Error loading PDF status", "error");
    }
  };

  const autoExtractText = async () => {
    setLoadingText(true);
    setHasAutoExtracted(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/secondary/pdf-to-text/${projectId}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setLoadingText(false);
      showToastMessage("PDF text extracted successfully!");
    } catch (error) {
      console.error("Error extracting text:", error);
      setLoadingText(false);
      showToastMessage("Error extracting text from PDFs", "error");
    }
  };

  const loadPdfList = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/secondary/pdf-list/${projectId}`
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setDownloadedPdfs(data.pdfs || []);
    } catch (error) {
      console.error("Error loading PDF list:", error);
    }
  };

  const pdfFilenameMap = useMemo(() => {
    const map = {};
    downloadedPdfs.forEach((p) => {
      map[normalizePMID(p.pmid)] = p.filename;
    });
    return map;
  }, [downloadedPdfs]);

  const togglePMID = (pmid) => {
    const newSet = new Set(selectedPMIDs);
    if (newSet.has(pmid)) {
      newSet.delete(pmid);
    } else {
      newSet.add(pmid);
    }
    setSelectedPMIDs(newSet);
    setSelectAll(newSet.size === filteredRows.length && filteredRows.length > 0);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedPMIDs(new Set());
      setSelectAll(false);
    } else {
      const allPMIDs = filteredRows.map(r => normalizePMID(r.PMID));
      setSelectedPMIDs(new Set(allPMIDs));
      setSelectAll(true);
    }
  };

  const runPdfDownload = async () => {
    setLoadingPdf(true);
    setDownloadProgress({
      show: true,
      current: 0,
      total: pdfRows.length || 10,
      status: "Initializing download..."
    });

    try {
      const response = await fetch(
        `http://localhost:5000/api/secondary/pdf-download/${projectId}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      // Simulate progress updates
      const total = pdfRows.length || 10;
      for (let i = 0; i <= total; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setDownloadProgress({
          show: true,
          current: i,
          total: total,
          status: i === total ? "Download complete!" : `Downloading PDFs... (${i}/${total})`
        });
      }

      await loadPdfStatus();
      await loadPdfList();
      
      showToastMessage("PDF download completed successfully!");
      
      setTimeout(() => {
        setDownloadProgress({ show: false, current: 0, total: 0, status: "" });
      }, 2000);
    } catch (error) {
      console.error("Error downloading PDFs:", error);
      showToastMessage("Error starting PDF download", "error");
      setDownloadProgress({ show: false, current: 0, total: 0, status: "" });
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleUploadPdf = async (literatureId, file) => {
    setUploadingLiteratureId(literatureId);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:5000/api/secondary/upload-pdf/${projectId}/${literatureId}`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      await loadPdfStatus();
      await loadPdfList();
      
      showToastMessage("PDF uploaded and text extracted successfully!");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      showToastMessage("Error uploading PDF", "error");
    } finally {
      setUploadingLiteratureId(null);
    }
  };

  const runSecondary = async () => {
    if (selectedPMIDs.size === 0) {
      showToastMessage("Please select at least one article to process", "error");
      return;
    }

    setLoadingSecondary(true);

    const formData = new FormData();
    formData.append("selected_pmids", JSON.stringify([...selectedPMIDs]));

    try {
      const response = await fetch(
        `http://localhost:5000/api/secondary/secondary-runner/${projectId}`,
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to run secondary screening");
      }

      const result = await response.json();
      
      showToastMessage(`Successfully processed ${result.processed_articles} articles!`);
      
      setTimeout(() => {
        navigate(`/projects/${projectId}/secondary/results`);
      }, 1500);
    } catch (error) {
      console.error("Error running secondary screening:", error);
      showToastMessage(error.message || "Error running secondary screening", "error");
    } finally {
      setLoadingSecondary(false);
    }
  };

  const openPdf = async (filename) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/secondary/open-pdf/${projectId}?filename=${encodeURIComponent(filename)}`
      );

      if (!response.ok) throw new Error("PDF not found on server");

      const blob = await response.blob();
      setActivePdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error opening PDF:", error);
      showToastMessage("Error opening PDF", "error");
    }
  };

  const filteredRows = useMemo(
    () =>
      pdfRows.filter(
        (r) =>
          normalizePMID(r.PMID).includes(search) ||
          r.Status.toLowerCase().includes(search.toLowerCase())
      ),
    [pdfRows, search]
  );

  const paginatedRows = filteredRows.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const totalPages = Math.ceil(filteredRows.length / pageSize);

  const stats = useMemo(() => {
    const selected = selectedPMIDs.size;
    const available = [...selectedPMIDs].filter(pmid => {
      const row = pdfRows.find(r => normalizePMID(r.PMID) === pmid);
      return row && (row.Status.toLowerCase().includes("available") || row.Status.toLowerCase().includes("uploaded"));
    }).length;
    const unavailable = selected - available;

    return { selected, available, unavailable };
  }, [selectedPMIDs, pdfRows]);

  const getStatusBadge = (status) => {
    const isAvailable = status.toLowerCase().includes("available") || status.toLowerCase().includes("uploaded");
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          isAvailable
            ? "bg-green-100 text-green-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {isAvailable ? <FiCheckCircle className="w-3 h-3" /> : <FiAlertCircle className="w-3 h-3" />}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Secondary Screening
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Project ID: <span className="font-semibold text-slate-700">{projectId}</span>
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runPdfDownload}
            disabled={loadingPdf}
            className="h-12 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50"
          >
            {loadingPdf ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <FiDownload className="w-5 h-5" />
            )}
            {loadingPdf ? "Downloading..." : "Download PDFs"}
          </motion.button>
        </div>

        {/* DOWNLOAD PROGRESS BAR */}
        <AnimatePresence>
          {downloadProgress.show && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">{downloadProgress.status}</span>
                <span className="text-sm font-mono text-slate-600">
                  {downloadProgress.current}/{downloadProgress.total}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(downloadProgress.current / downloadProgress.total) * 100}%` 
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TEXT EXTRACTION STATUS */}
        <AnimatePresence>
          {loadingText && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center gap-3"
            >
              <FiFileText className="w-6 h-6 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium text-blue-900">
                Extracting text from PDFs...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SELECTION STATS */}
        {selectedPMIDs.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-4"
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Selected</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {stats.selected}
                  </p>
                </div>
                <div className="p-3 bg-blue-200 rounded-xl">
                  <FiCheckSquare className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Available PDFs</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {stats.available}
                  </p>
                </div>
                <div className="p-3 bg-green-200 rounded-xl">
                  <FiCheckCircle className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Unavailable</p>
                  <p className="text-3xl font-bold text-amber-900 mt-1">
                    {stats.unavailable}
                  </p>
                </div>
                <div className="p-3 bg-amber-200 rounded-xl">
                  <FiFilter className="w-6 h-6 text-amber-700" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ACTION TOOLBAR */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                className="w-full h-12 border-2 border-slate-300 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search by Article ID or Status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runSecondary}
              disabled={selectedPMIDs.size === 0 || loadingSecondary}
              className="h-12 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 rounded-xl text-sm font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {loadingSecondary ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FiCheck className="w-5 h-5" />
                  Run Screening ({selectedPMIDs.size})
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">PDF Status</h2>
              <p className="text-xs text-slate-500 mt-1">
                {paginatedRows.length} of {filteredRows.length} entries
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md"
            >
              {selectAll ? <FiCheckSquare className="w-4 h-4" /> : <FiSquare className="w-4 h-4" />}
              {selectAll ? "Deselect All" : "Select All"}
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider w-16">
                    Select
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Article ID
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRows.map((row, i) => {
                  const pmid = normalizePMID(row.PMID);
                  const filename = pdfFilenameMap[pmid];
                  const isSelected = selectedPMIDs.has(pmid);
                  const isUploading = uploadingLiteratureId === row.literature_id;

                  return (
                    <tr
                      key={`${pmid}-${i}`}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => togglePMID(pmid)}
                          className="inline-flex items-center justify-center"
                        >
                          {isSelected ? (
                            <FiCheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FiSquare className="w-5 h-5 text-slate-400" />
                          )}
                        </motion.button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-800 font-semibold">{row.article_id || "-"}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(row.Status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {filename ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openPdf(filename)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
                            >
                              <FiEye className="w-4 h-4" /> View
                            </motion.button>
                          ) : (
                            <>
                              <input
                                type="file"
                                accept=".pdf"
                                id={`upload-${row.literature_id}`}
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleUploadPdf(row.literature_id, e.target.files[0]);
                                  }
                                }}
                              />
                              <label
                                htmlFor={`upload-${row.literature_id}`}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm ${
                                  isUploading
                                    ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                              >
                                {isUploading ? (
                                  <>
                                    <FiLoader className="w-4 h-4 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <FiUpload className="w-4 h-4" />
                                    Upload
                                  </>
                                )}
                              </label>
                            </>
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
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </motion.button>
              <span className="text-sm font-semibold text-slate-600">
                Page {page + 1} of {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </motion.button>
            </div>
          )}
        </div>

        {/* PDF VIEWER */}
        <AnimatePresence>
          {activePdfUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setActivePdfUrl(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <span className="font-bold text-slate-800 text-lg">PDF Viewer</span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActivePdfUrl(null)}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </motion.button>
                </div>
                <iframe
                  src={activePdfUrl}
                  className="w-full h-[calc(100%-64px)]"
                  title="PDF Viewer"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOAST NOTIFICATION */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className={`fixed bottom-6 right-6 ${
                toastType === "success"
                  ? "bg-gradient-to-r from-green-600 to-green-700"
                  : "bg-gradient-to-r from-red-600 to-red-700"
              } text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50`}
            >
              {toastType === "success" ? (
                <FiCheckCircle className="w-6 h-6" />
              ) : (
                <FiAlertCircle className="w-6 h-6" />
              )}
              <span className="font-semibold">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}