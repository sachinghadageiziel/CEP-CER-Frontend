import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUpload, FiEye, FiX, FiCheckCircle, FiLoader, FiSearch, 
  FiCheck, FiSquare, FiCheckSquare, FiChevronLeft, 
  FiChevronRight, FiXCircle, FiFileText, FiAlertCircle, FiDatabase
} from "react-icons/fi";

// ACTUAL IMPORTS - Use your existing components
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

// Fluent UI Style Progress Indicator Component
const FluentProgressIndicator = ({ label, description, percentComplete }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-blue-600">{Math.round(percentComplete * 100)}%</span>
      </div>
      {description && <p className="text-xs text-slate-500">{description}</p>}
      <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
          initial={{ width: "0%" }}
          animate={{ width: `${percentComplete * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Manual PDF Upload Popup
function ManualPdfUploadPopup({ open, pmid, onClose, onUpload, mode = "upload" }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    await onUpload(selectedFile);
    setUploading(false);
    setSelectedFile(null);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="flex justify-between items-center px-6 py-5 border-b-2 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h2 className="text-xl font-bold text-slate-800">
              {mode === "reupload" ? "Re-upload PDF" : "Upload PDF Manually"}
            </h2>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="p-2 hover:bg-slate-200 rounded-xl transition-all"
            >
              <FiX className="w-6 h-6" />
            </motion.button>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900 font-medium">
                Article ID: <strong className="text-lg">{pmid}</strong>
              </p>
            </div>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <FiUpload className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                <p className="text-sm font-semibold text-slate-700">
                  {selectedFile ? selectedFile.name : "Click to select PDF file"}
                </p>
                <p className="text-xs text-slate-500 mt-1">PDF files only</p>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={uploading}
                className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 font-bold transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: !uploading && selectedFile ? 1.02 : 1 }}
                whileTap={{ scale: !uploading && selectedFile ? 0.98 : 1 }}
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 font-bold transition-all"
              >
                {uploading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="w-5 h-5" />
                    {mode === "reupload" ? "Re-upload PDF" : "Upload PDF"}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// PDF List Modal
function PdfListModal({ open, onClose, pdfs, onView }) {
  if (!open) return null;

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden"
        >
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 border-b-2 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Downloaded PDFs</h2>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="p-2 hover:bg-white/50 rounded-xl transition-all"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </div>
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
            {pdfs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <FiFileText className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400" />
                </div>
                <p className="text-center text-slate-600 font-semibold text-base sm:text-lg">No PDFs downloaded yet</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-2">PDFs will appear here after download</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pdfs.map((pdf) => (
                  <motion.div
                    key={pdf.literature_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 sm:p-5 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                        <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm sm:text-base truncate">{pdf.filename}</p>
                        <p className="text-xs sm:text-sm text-slate-500">PMID: <span className="font-semibold">{pdf.pmid}</span></p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onView(pdf.filename)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                    >
                      <FiEye className="w-4 h-4" /> View
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Secondary Screening Modal
function SecondaryScreeningModal({ open, onClose, onRun, loading, selectedCount }) {
  if (!open) return null;

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 border-b-2 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Run Secondary Screening</h2>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="p-2 hover:bg-slate-200 rounded-xl transition-all"
            >
              <FiX className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-5">
              <p className="text-sm text-blue-900 font-medium">
                You are about to run secondary screening on <strong className="text-base sm:text-lg">{selectedCount}</strong> selected articles.
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              This process will analyze the PDFs and generate screening results based on the project criteria.
            </p>
            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 sm:py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 font-bold transition-all text-sm sm:text-base"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: !loading ? 1.02 : 1 }}
                whileTap={{ scale: !loading ? 0.98 : 1 }}
                onClick={onRun}
                disabled={loading}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 font-bold transition-all text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    Run Screening
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ==================== SECONDARY PAGE ==================== */
export default function SecondaryPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  /* ---------- STATE ---------- */
  const [pdfStatusData, setPdfStatusData] = useState([]);
  const [downloadedPdfs, setDownloadedPdfs] = useState([]);
  const [loadingSecondary, setLoadingSecondary] = useState(false);
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [showPdfList, setShowPdfList] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);
  const [selectedLiteratureIds, setSelectedLiteratureIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadLiteratureId, setUploadLiteratureId] = useState(null);
  const [uploadPmid, setUploadPmid] = useState(null);
  const [uploadMode, setUploadMode] = useState("upload");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  /* ---------- LOAD DATA ON MOUNT ---------- */
  useEffect(() => {
    loadPdfStatus();
    loadPdfList();
    checkAndAutoDownload();
  }, [projectId]);

  const checkAndAutoDownload = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/secondary/pdf-status/${projectId}`);
      const data = await res.json();
      if (data.exists && data.data) {
        const hasDownloaded = data.data.some(row => 
          row.status?.toLowerCase() === "downloaded" || row.status?.toLowerCase() === "uploaded_manually"
        );
        if (!hasDownloaded) {
          handleDownloadPdfs();
        }
      }
    } catch (error) {
      console.error("Error checking download status:", error);
    }
  };

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

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  /* ---------- ACTIONS ---------- */
  const handleDownloadPdfs = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    const targetProgress = 0.9;
    const duration = 3000;
    const steps = 30;
    const increment = targetProgress / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      currentStep++;
      setDownloadProgress(Math.min(currentStep * increment, targetProgress));
      if (currentStep >= steps) {
        clearInterval(progressInterval);
      }
    }, stepDuration);

    try {
      const response = await fetch(`http://localhost:5000/api/secondary/download-pdfs/${projectId}`, {
        method: "POST"
      });
      
      clearInterval(progressInterval);
      setDownloadProgress(1);
      
      await loadPdfStatus();
      await loadPdfList();
      
      showNotification("PDFs downloaded successfully!");
      
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error downloading PDFs:", error);
      setIsDownloading(false);
      setDownloadProgress(0);
      showNotification("Error downloading PDFs", "error");
    }
  };

  const handleUploadPdf = async (file) => {
    if (!file || !uploadLiteratureId || !uploadPmid) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsProcessing(true);
    setProcessingProgress(0);

    const targetProgress = 0.9;
    const duration = 2000;
    const steps = 20;
    const increment = targetProgress / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      currentStep++;
      setProcessingProgress(Math.min(currentStep * increment, targetProgress));
      if (currentStep >= steps) {
        clearInterval(progressInterval);
      }
    }, stepDuration);

    try {
      const response = await fetch(
        `http://localhost:5000/api/secondary/upload-pdf/${projectId}/${uploadLiteratureId}`,
        { method: "POST", body: formData }
      );
      
      clearInterval(progressInterval);
      setProcessingProgress(1);
      
      await loadPdfStatus();
      await loadPdfList();
      
      setUploadModalOpen(false);
      setUploadLiteratureId(null);
      setUploadPmid(null);
      setUploadMode("upload");
      
      showNotification("PDF uploaded and text extraction completed successfully!");
      
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingProgress(0);
      }, 1500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error uploading PDF:", error);
      setIsProcessing(false);
      setProcessingProgress(0);
      showNotification("Error uploading PDF", "error");
    }
  };

  const handleRunSecondaryScreening = async () => {
    if (selectedLiteratureIds.size === 0) {
      showNotification("Please select at least one article", "error");
      return;
    }

    setLoadingSecondary(true);
    setOpenSecondary(false);
    
    try {
      await fetch(`http://localhost:5000/api/secondary/secondary-screen/${projectId}`, {
        method: "POST"
      });
      
      showNotification("Secondary screening completed!");
      setLoadingSecondary(false);
      
      navigate(`/projects/${projectId}/secondary/results`);
    } catch (error) {
      console.error("Error running secondary screening:", error);
      setLoadingSecondary(false);
      showNotification("Error running secondary screening", "error");
    }
  };

  const openPdf = async (filename) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/secondary/open-pdf?project_id=${projectId}&filename=${encodeURIComponent(filename)}`
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setActivePdfUrl(url);
    } catch (error) {
      console.error("Error opening PDF:", error);
      showNotification("PDF not found", "error");
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
      return row && (row.status?.toLowerCase() === "downloaded" || row.status?.toLowerCase() === "uploaded_manually");
    }).length;
    const pending = selected - downloaded;

    return { selected, downloaded, pending };
  }, [selectedLiteratureIds, pdfStatusData]);

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || "";
    const isDownloaded = normalizedStatus === "downloaded";
    const isManual = normalizedStatus === "uploaded_manually";
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${
        isDownloaded 
          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
          : isManual
          ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200"
          : "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300"
      }`}>
        {(isDownloaded || isManual) && <FiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        {!isDownloaded && !isManual && <FiLoader className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        <span className="hidden sm:inline">{isManual ? "Manual Upload" : status}</span>
        <span className="sm:hidden">{isManual ? "Manual" : status}</span>
      </span>
    );
  };

  // Check button visibility based on Action Button Matrix
  const shouldShowViewButton = (status) => {
    const normalized = status?.toLowerCase() || "";
    return normalized === "downloaded" || normalized === "uploaded_manually";
  };

  const shouldShowReuploadButton = (status) => {
    const normalized = status?.toLowerCase() || "";
    return normalized === "uploaded_manually";
  };

  const shouldShowUploadButton = (status) => {
    const normalized = status?.toLowerCase() || "";
    return normalized === "pending" || (!normalized);
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
          <div className="relative flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Secondary Screening</h1>
              <p className="text-blue-200 text-xs sm:text-sm font-medium flex items-center gap-2">
                <FiDatabase className="w-3 h-3 sm:w-4 sm:h-4" />
                Project ID: <span className="font-bold">{projectId}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* SELECTION STATS */}
        <AnimatePresence>
          {selectedLiteratureIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-bold text-blue-700">Selected</p>
                  <div className="p-1.5 sm:p-2 bg-blue-200 rounded-lg">
                    <FiCheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-blue-900">{stats.selected}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-bold text-green-700">Downloaded</p>
                  <div className="p-1.5 sm:p-2 bg-green-200 rounded-lg">
                    <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-green-900">{stats.downloaded}</p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-2xl p-4 sm:p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-700">Pending</p>
                  <div className="p-1.5 sm:p-2 bg-slate-200 rounded-lg">
                    <FiLoader className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-slate-900">{stats.pending}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOOLBAR */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-slate-200"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
              <input
                className="w-full h-10 sm:h-12 border-2 border-slate-300 pl-10 sm:pl-12 pr-3 sm:pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm sm:text-base"
                placeholder="Search by article ID or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPdfList(true)}
                className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 border-2 border-blue-600 text-blue-700 rounded-xl hover:bg-blue-50 font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <FiFileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">View PDFs</span>
                <span className="sm:hidden">PDFs</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: selectedLiteratureIds.size > 0 ? 1.05 : 1, y: selectedLiteratureIds.size > 0 ? -2 : 0 }}
                whileTap={{ scale: selectedLiteratureIds.size > 0 ? 0.95 : 1 }}
                onClick={() => setOpenSecondary(true)}
                disabled={selectedLiteratureIds.size === 0 || loadingSecondary}
                className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                {loadingSecondary ? (
                  <>
                    <FiLoader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Run Screening ({selectedLiteratureIds.size})</span>
                    <span className="sm:hidden">Run ({selectedLiteratureIds.size})</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* TABLE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">PDF Status</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Showing <span className="font-semibold text-slate-700">{paginatedRows.length}</span> of <span className="font-semibold text-slate-700">{filteredRows.length}</span> articles
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSelectAll}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg font-bold transition-all text-xs sm:text-sm"
            >
              {selectAll ? <FiCheckSquare className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiSquare className="w-4 h-4 sm:w-5 sm:h-5" />}
              {selectAll ? "Deselect All" : "Select All"}
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase tracking-wider">Select</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Article ID</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Source</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRows.map((row) => {
                  const isSelected = selectedLiteratureIds.has(row.literature_id);
                  
                  return (
                    <motion.tr 
                      key={row.literature_id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleSelection(row.literature_id)}
                        >
                          {isSelected ? 
                            <FiCheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" /> : 
                            <FiSquare className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 hover:text-slate-600" />
                          }
                        </motion.button>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-blue-600 text-sm sm:text-base">{row.article_id}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-700 font-medium text-xs sm:text-sm">PubMed</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">{getStatusBadge(row.status)}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {shouldShowViewButton(row.status) && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openPdf(`${row.article_id}.pdf`)}
                              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
                            >
                              <FiEye className="w-3 h-3 sm:w-4 sm:h-4" /> 
                              <span className="hidden sm:inline">View</span>
                            </motion.button>
                          )}
                          
                          {shouldShowReuploadButton(row.status) && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setUploadLiteratureId(row.literature_id);
                                setUploadPmid(row.article_id);
                                setUploadMode("reupload");
                                setUploadModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all text-xs sm:text-sm"
                            >
                              <FiUpload className="w-3 h-3 sm:w-4 sm:h-4" /> 
                              <span className="hidden sm:inline">Re-upload</span>
                            </motion.button>
                          )}
                          
                          {shouldShowUploadButton(row.status) && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setUploadLiteratureId(row.literature_id);
                                setUploadPmid(row.article_id);
                                setUploadMode("upload");
                                setUploadModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all text-xs sm:text-sm"
                            >
                              <FiUpload className="w-3 h-3 sm:w-4 sm:h-4" /> 
                              <span className="hidden sm:inline">Upload</span>
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
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

        {/* MODALS */}
        <PdfListModal 
          open={showPdfList} 
          onClose={() => setShowPdfList(false)}
          pdfs={downloadedPdfs}
          onView={openPdf}
        />

        <ManualPdfUploadPopup
          open={uploadModalOpen}
          pmid={uploadPmid}
          mode={uploadMode}
          onClose={() => {
            setUploadModalOpen(false);
            setUploadLiteratureId(null);
            setUploadPmid(null);
            setUploadMode("upload");
          }}
          onUpload={handleUploadPdf}
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
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
              onClick={() => {
                URL.revokeObjectURL(activePdfUrl);
                setActivePdfUrl(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b-2 bg-gradient-to-r from-slate-50 to-slate-100">
                  <span className="font-bold text-base sm:text-lg">PDF Viewer</span>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      URL.revokeObjectURL(activePdfUrl);
                      setActivePdfUrl(null);
                    }}
                    className="p-2 hover:bg-slate-200 rounded-xl transition-all"
                  >
                    <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
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
              {toastType === "error" && <FiXCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
              {toastType === "info" && <FiAlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
              <span className="font-bold text-xs sm:text-sm">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* BOTTOM PROGRESS BARS */}
      <AnimatePresence>
        {(isDownloading || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-2xl p-3 sm:p-4 z-40"
          >
            <div className="max-w-3xl mx-auto">
              {isDownloading && (
                <FluentProgressIndicator 
                  label="Downloading PDFs" 
                  description="Fetching PDF files from PubMed..."
                  percentComplete={downloadProgress}
                />
              )}
              {isProcessing && !isDownloading && (
                <FluentProgressIndicator 
                  label="Processing PDF" 
                  description="PDF uploaded and text extraction completed successfully!"
                  percentComplete={processingProgress}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}