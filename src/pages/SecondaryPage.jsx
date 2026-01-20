import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUpload, FiEye, FiX, FiCheckCircle, FiLoader, FiSearch, 
  FiSquare, FiCheckSquare, FiChevronLeft, FiChevronRight, 
  FiFileText, FiAlertCircle, FiExternalLink, FiTrash2
} from "react-icons/fi";

import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";
import SecondaryResultTable from "./SecondaryResultsPage";

// Toggle Button Component  
function ToggleButton({ activeView, onToggle }) {
  return (
    <div className="relative inline-flex items-center bg-white rounded-full p-1 border-2 border-slate-200 shadow-md">
      <motion.div
        className="absolute h-[calc(100%-8px)] bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg"
        initial={false}
        animate={{
          left: activeView === "articles" ? "4px" : "calc(50% - 4px)",
          width: "calc(50% - 4px)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      
      <motion.button
        onClick={() => onToggle("articles")}
        className={`relative z-10 px-6 py-2.5 rounded-full font-bold text-sm transition-colors duration-200 whitespace-nowrap ${
          activeView === "articles" ? "text-white" : "text-slate-600"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Articles
      </motion.button>
      
      <motion.button
        onClick={() => onToggle("results")}
        className={`relative z-10 px-6 py-2.5 rounded-full font-bold text-sm transition-colors duration-200 whitespace-nowrap ${
          activeView === "results" ? "text-white" : "text-slate-600"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Results
      </motion.button>
    </div>
  );
}

// Manual PDF Upload Modal
function ManualPdfUploadPopup({ open, pmid, literatureId, onClose, onUpload, mode = "upload" }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        alert("Please select a valid PDF file");
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file, literatureId);
      setFile(null);
      setUploading(false);
      onClose();
    } catch (error) {
      setUploading(false);
      alert("Error uploading PDF");
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFile(null);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 px-6 sm:px-8 py-5 sm:py-6 overflow-hidden">
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
              onClick={handleClose}
              disabled={uploading}
              className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50 z-10"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.button>

            <div className="relative flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                <FiUpload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-bold text-white">
                  {mode === "reupload" ? "Re-upload PDF" : "Manual PDF Upload"}
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm mt-1 font-medium">
                  Article ID: <span className="font-bold font-mono">{pmid}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 sm:p-10
                transition-all duration-300 cursor-pointer
                ${
                  file
                    ? "border-blue-400 bg-blue-50"
                    : dragActive
                    ? "border-blue-400 bg-blue-50 scale-105"
                    : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                }
                ${uploading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input
                hidden
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                disabled={uploading}
                id="pdf-upload"
              />
              
              <label
                htmlFor="pdf-upload"
                className={`flex flex-col items-center gap-3 sm:gap-4 ${
                  uploading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {file ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="p-3 sm:p-4 bg-blue-100 rounded-2xl"
                    >
                      <FiCheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                    </motion.div>
                    <div className="text-center w-full">
                      <p className="font-bold text-blue-900 text-base sm:text-lg truncate px-4">
                        {file.name}
                      </p>
                      <p className="text-xs sm:text-sm text-blue-600 mt-2 font-medium">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {!uploading && (
                        <div className="flex gap-2 justify-center mt-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveFile();
                            }}
                            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold transition-all text-xs sm:text-sm"
                          >
                            <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Remove
                          </motion.button>
                          <label
                            htmlFor="pdf-upload"
                            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold transition-all cursor-pointer text-xs sm:text-sm"
                          >
                            <FiFileText className="w-3 h-3 sm:w-4 sm:h-4" /> Replace
                          </label>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`p-3 sm:p-4 rounded-2xl transition-all ${
                      dragActive ? "bg-blue-100 scale-110" : "bg-blue-100"
                    }`}>
                      <FiFileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-700 text-base sm:text-lg">
                        {dragActive ? "Drop PDF here" : "Click to upload or drag & drop"}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-2">
                        PDF files only • Maximum 50MB
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>

            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs sm:text-sm font-bold text-blue-900">
                        Uploading and Processing PDF...
                      </span>
                    </div>
                    
                    <div className="w-full bg-blue-200 h-2 sm:h-2.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>

                    <p className="text-xs text-blue-600 mt-2 sm:mt-3 font-medium">
                      Please wait while we upload, extract text, and process your PDF
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 sm:gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                disabled={uploading}
                className="flex-1 h-12 sm:h-14 rounded-2xl font-bold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={!uploading && file ? { scale: 1.02 } : {}}
                whileTap={!uploading && file ? { scale: 0.98 } : {}}
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`
                  flex-1 h-12 sm:h-14 rounded-2xl font-bold text-white text-sm sm:text-base
                  transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3
                  ${
                    !file || uploading
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:shadow-2xl hover:shadow-blue-500/50"
                  }
                `}
              >
                {uploading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="w-4 h-4 sm:w-5 sm:h-5" />
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

// PDF Viewer Modal
function PdfViewerModal({ open, onClose, pdfUrl }) {
  if (!open || !pdfUrl) return null;

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
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-xl transition-all"
            >
              <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </div>
          <iframe src={pdfUrl} className="w-full h-[calc(100%-64px)]" title="PDF" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ==================== MAIN SECONDARY SCREEN PAGE ==================== */
export default function SecondaryScreen() {
  const { id: projectId } = useParams();

  /* ---------- STATE ---------- */
  const [activeView, setActiveView] = useState("articles");
  const [pdfStatusData, setPdfStatusData] = useState([]);
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [selectedLiteratureIds, setSelectedLiteratureIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadLiteratureId, setUploadLiteratureId] = useState(null);
  const [uploadPmid, setUploadPmid] = useState(null);
  const [uploadMode, setUploadMode] = useState("upload");
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [loadingSecondary, setLoadingSecondary] = useState(false);
  const [refreshResults, setRefreshResults] = useState(0);

  /* ---------- LOAD DATA ON MOUNT ---------- */
  useEffect(() => {
    loadPdfStatus();
  }, [projectId]);

  const loadPdfStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/secondary/pdf-download/existing?project_id=${projectId}`);
      const data = await res.json();
      
      if (data.exists && data.screening) {
        const formattedData = data.screening.map(item => ({
          article_id: item.PMID,
          pmcid: item.PMCID,
          pdf_link: item.PDF_Link,
          status: item.Status,
          secondary_screened: item.Secondary_Screened
        }));
        setPdfStatusData(formattedData);
      }
    } catch (error) {
      console.error("Error loading PDF status:", error);
    }
  };

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  /* ---------- ACTIONS ---------- */
  const handleUploadPdf = async (file, pmid) => {
    if (!file || !pmid) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Find the literature_id from the article_id (PMID)
      const response = await fetch(
        `http://localhost:5000/api/secondary/upload-pdf/${projectId}/${pmid}`,
        { method: "POST", body: formData }
      );
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      
      await loadPdfStatus();
      showNotification("PDF uploaded and processed successfully!");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      showNotification("Error uploading PDF", "error");
    }
  };

  const handleRunSecondaryScreening = async () => {
  if (selectedLiteratureIds.size === 0) {
    showNotification("Please select at least one article", "error");
    return;
  }

  setLoadingSecondary(true);

  const isAllSelected = selectedLiteratureIds.size === filteredRows.length;

  try {
    if (isAllSelected) {
      const response = await fetch(
        `http://localhost:5000/api/secondary/secondary-screen/${projectId}`,
        { method: "POST" }
      );
      
      if (!response.ok) {
        throw new Error("Screening failed");
      }
    } else {
      const formData = new FormData();
      [...selectedLiteratureIds].forEach(id =>
        formData.append("article_ids", id)  // Changed to article_ids
      );

      const response = await fetch(
        `http://localhost:5000/api/secondary/secondary-screen/selected/${projectId}`,
        { method: "POST", body: formData }
      );
      
      if (!response.ok) {
        throw new Error("Screening failed");
      }
    }

    showNotification("Secondary screening completed successfully!");
    setSelectedLiteratureIds(new Set());
    setSelectAll(false);
    
    await loadPdfStatus();
    setRefreshResults(prev => prev + 1);
    setActiveView("results");
  } catch (error) {
    console.error(error);
    showNotification("Error running secondary screening", "error");
  } finally {
    setLoadingSecondary(false);
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
      setPdfViewerOpen(true);
    } catch (error) {
      console.error("Error opening PDF:", error);
      showNotification("PDF not found", "error");
    }
  };

  const closePdfViewer = () => {
    if (activePdfUrl) {
      URL.revokeObjectURL(activePdfUrl);
      setActivePdfUrl(null);
    }
    setPdfViewerOpen(false);
  };

  /* ---------- SELECTION ---------- */
  const toggleSelection = (articleId) => {
    const newSet = new Set(selectedLiteratureIds);
    if (newSet.has(articleId)) {
      newSet.delete(articleId);
    } else {
      newSet.add(articleId);
    }
    setSelectedLiteratureIds(newSet);
    setSelectAll(newSet.size === filteredRows.length && filteredRows.length > 0);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedLiteratureIds(new Set());
      setSelectAll(false);
    } else {
      const allIds = filteredRows.map(r => r.article_id);
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

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || "";
    const isDownloaded = normalizedStatus === "downloaded";
    const isManual = normalizedStatus === "manually downloaded";
    
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

  const getSecondaryStatusBadge = (secondaryScreened) => {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${
        secondaryScreened
          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
          : "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200"
      }`}>
        {secondaryScreened ? <FiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <FiLoader className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        <span>{secondaryScreened ? "Done" : "Not Done"}</span>
      </span>
    );
  };

  const shouldShowViewButton = (status) => {
    const normalized = status?.toLowerCase() || "";
    return normalized === "downloaded" || normalized === "manually downloaded";
  };

  const shouldShowUploadButton = (status) => {
    const normalized = status?.toLowerCase() || "";
    return normalized === "pending" || normalized === "not_found" || (!normalized);
  };

  return (
    <Layout>
      <BreadcrumbsBar items={[
        { label: "Home", to: "/" },
        { label: "Project", to: `/project/${projectId}` },
        { label: "Secondary Screening" }
      ]} />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6 p-4 sm:p-6"
      >
        {/* PROJECT HEADER */}
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
          <div className="relative">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Secondary Screening</h1>
            <p className="text-blue-100 text-xs sm:text-sm font-medium">
              Project ID: <span className="font-bold font-mono">{projectId}</span>
            </p>
          </div>
        </motion.div>

        {/* SEARCH BAR AND TOGGLE */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-slate-200"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
              <input
                className="w-full h-10 sm:h-12 border-2 border-slate-300 pl-10 sm:pl-12 pr-3 sm:pr-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm sm:text-base"
                placeholder="Search by article ID or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Toggle Button */}
            <div className="flex justify-center lg:justify-end">
              <ToggleButton activeView={activeView} onToggle={setActiveView} />
            </div>
          </div>
        </motion.div>

        {/* CONDITIONAL RENDERING BASED ON ACTIVE VIEW */}
        <AnimatePresence mode="wait">
          {activeView === "articles" ? (
            /* ARTICLES VIEW */
            <motion.div
              key="articles"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSelectAll}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center gap-2"
                >
                  {selectAll ? <FiCheckSquare className="w-4 h-4" /> : <FiSquare className="w-4 h-4" />}
                  {selectAll ? "Deselect All" : "Select All"}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: selectedLiteratureIds.size > 0 ? 1.05 : 1 }}
                  whileTap={{ scale: selectedLiteratureIds.size > 0 ? 0.95 : 1 }}
                  onClick={handleRunSecondaryScreening}
                  disabled={selectedLiteratureIds.size === 0 || loadingSecondary}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm flex items-center gap-2"
                >
                  {loadingSecondary ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Run Screening ({selectedLiteratureIds.size})
                    </>
                  )}
                </motion.button>
              </div>

              {/* ARTICLES TABLE */}
              <motion.div 
                className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden"
              >
                <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">Article Status</h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Showing <span className="font-semibold text-slate-700">{paginatedRows.length}</span> of <span className="font-semibold text-slate-700">{filteredRows.length}</span> articles
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">
                          <FiCheckSquare className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                        </th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Article ID</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">PMCID</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Link</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">PDF Status</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">SS Status</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-black text-slate-700 uppercase tracking-wider whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedRows.map((row) => {
                        const isSelected = selectedLiteratureIds.has(row.article_id);
                        
                        return (
                          <motion.tr 
                            key={row.article_id} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                          >
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleSelection(row.article_id)}
                              >
                                {isSelected ? 
                                  <FiCheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" /> : 
                                  <FiSquare className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 hover:text-slate-600" />
                                }
                              </motion.button>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-blue-600 text-sm sm:text-base">{row.article_id}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-700 text-xs sm:text-sm">
                              {row.pmcid || "N/A"}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                              {row.pdf_link ? (
                                <a
                                  href={row.pdf_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all text-xs"
                                >
                                  <FiExternalLink className="w-3 h-3" /> 
                                  <span className="hidden sm:inline">PMC</span>
                                </a>
                              ) : row.article_id ? (
                                <a
                                  href={`https://pubmed.ncbi.nlm.nih.gov/${row.article_id}/`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all text-xs"
                                >
                                  <FiExternalLink className="w-3 h-3" /> 
                                  <span className="hidden sm:inline">PubMed</span>
                                </a>
                              ) : null}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">{getStatusBadge(row.status)}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">{getSecondaryStatusBadge(row.secondary_screened)}</td>
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
                                
                                {shouldShowUploadButton(row.status) && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      setUploadLiteratureId(row.article_id);
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
            </motion.div>
          ) : (
            /* RESULTS VIEW */
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SecondaryResultTable projectId={projectId} search={search} refreshTrigger={refreshResults} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODALS */}
        <ManualPdfUploadPopup
          open={uploadModalOpen}
          pmid={uploadPmid}
          literatureId={uploadLiteratureId}
          mode={uploadMode}
          onClose={() => {
            setUploadModalOpen(false);
            setUploadLiteratureId(null);
            setUploadPmid(null);
            setUploadMode("upload");
          }}
          onUpload={handleUploadPdf}
        />

        <PdfViewerModal
          open={pdfViewerOpen}
          onClose={closePdfViewer}
          pdfUrl={activePdfUrl}
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
      </motion.div>
    </Layout>
  );
}