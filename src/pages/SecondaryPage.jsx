import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUpload, FiEye, FiX, FiCheckCircle, FiLoader, FiSearch, 
  FiCheck, FiSquare, FiCheckSquare, FiFilter 
} from "react-icons/fi";

import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";
import PdfDownloadPopup from "../components/PdfDownloadPopup";
import SecondaryPopup from "../components/SecondaryPopup";
import DownloadedPdfPopup from "../components/DownloadedPdfPopup";

/* -------------------- HELPERS -------------------- */
const normalizePMID = (pmid) => String(pmid).replace(".0", "");

export default function SecondaryPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  /* ---------- STATE ---------- */
  const [openPdfUpload, setOpenPdfUpload] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [ifuFile, setIfuFile] = useState(null);

  const [pdfRows, setPdfRows] = useState([]);
  const [downloadedPdfs, setDownloadedPdfs] = useState([]);

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingText, setLoadingText] = useState(false);
  const [loadingSecondary, setLoadingSecondary] = useState(false);

  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [showPdfList, setShowPdfList] = useState(false);

  /* ---------- SELECTION STATE ---------- */
  const [selectedPMIDs, setSelectedPMIDs] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  /* ---------- PAGINATION ---------- */
  const [page, setPage] = useState(0);
  const pageSize = 10;

  /* ---------- AUTO EXTRACT TEXT ---------- */
  const [hasAutoExtracted, setHasAutoExtracted] = useState(false);

  /* ---------- LOAD EXISTING ---------- */
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/secondary/pdf-download/existing?project_id=${projectId}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.exists) {
          setPdfRows(d.screening || []);
          // Auto extract text after loading PDFs
          if (!hasAutoExtracted && d.screening && d.screening.length > 0) {
            autoExtractText();
          }
        }
      });

    loadPdfList();
  }, [projectId]);

  /* ---------- AUTO EXTRACT TEXT FUNCTION ---------- */
  const autoExtractText = async () => {
    setLoadingText(true);
    setHasAutoExtracted(true);

    const form = new FormData();
    form.append("project_id", projectId);

    try {
      await fetch("http://localhost:5000/api/secondary/pdf-to-text", {
        method: "POST",
        body: form,
      });

      setLoadingText(false);
      setToastMessage("PDF text extracted successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1000);
    } catch (error) {
      setLoadingText(false);
    }
  };

  /* ---------- LOAD PDF LIST ---------- */
  const loadPdfList = async () => {
    const res = await fetch(
      `http://localhost:5000/api/secondary/pdf-list?project_id=${projectId}`
    );
    const data = await res.json();
    setDownloadedPdfs(data.pdfs || []);
  };

  /* ---------- MAP PMID → FILENAME ---------- */
  const pdfFilenameMap = useMemo(() => {
    const map = {};
    downloadedPdfs.forEach((p) => {
      map[normalizePMID(p.pmid)] = p.filename;
    });
    return map;
  }, [downloadedPdfs]);

  /* ---------- SELECTION LOGIC ---------- */
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

  /* ---------- API ACTIONS ---------- */
  const runPdfDownload = async () => {
    setLoadingPdf(true);

    const form = new FormData();
    form.append("project_id", projectId);
    form.append("pmid_excel", excelFile);

    await fetch("http://localhost:5000/api/secondary/pdf-download", {
      method: "POST",
      body: form,
    });

    const res = await fetch(
      `http://localhost:5000/api/secondary/pdf-download/existing?project_id=${projectId}`
    );
    const data = await res.json();

    setPdfRows(data.screening || []);
    loadPdfList();
    setLoadingPdf(false);
    setOpenPdfUpload(false);
    
    // Auto extract after upload
    if (data.screening && data.screening.length > 0) {
      autoExtractText();
    }
  };

  const runSecondary = async () => {
    if (selectedPMIDs.size === 0) {
      alert("Please select at least one PMID to process");
      return;
    }

    setLoadingSecondary(true);

    const form = new FormData();
    form.append("project_id", projectId);
    form.append("primary_excel", excelFile);
    form.append("ifu_pdf", ifuFile);
    form.append("selected_pmids", JSON.stringify([...selectedPMIDs]));

    await fetch(
      "http://localhost:5000/api/secondary/secondary-runner",
      { method: "POST", body: form }
    );

    setLoadingSecondary(false);
    setOpenSecondary(false);
    navigate(`/projects/${projectId}/secondary/results`);
  };

  /* ---------- OPEN PDF ---------- */
  const openPdf = async (filename) => {
    const res = await fetch(
      `http://localhost:5000/api/secondary/open-pdf?project_id=${projectId}&filename=${encodeURIComponent(
        filename
      )}`
    );

    if (!res.ok) {
      alert("PDF not found on server");
      return;
    }

    const blob = await res.blob();
    setActivePdfUrl(URL.createObjectURL(blob));
  };

  /* ---------- DERIVED ---------- */
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

  /* ---------- STATS ---------- */
  const stats = useMemo(() => {
    const selected = selectedPMIDs.size;
    const available = [...selectedPMIDs].filter(pmid => {
      const row = pdfRows.find(r => normalizePMID(r.PMID) === pmid);
      return row && row.Status.toLowerCase().includes("available");
    }).length;
    const unavailable = selected - available;

    return { selected, available, unavailable };
  }, [selectedPMIDs, pdfRows]);

  /* ---------- STATUS BADGE ---------- */
  const getStatusBadge = (status) => {
    const isAvailable = status.toLowerCase().includes("available");
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          isAvailable
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isAvailable ? <FiCheckCircle className="w-3 h-3" /> : null}
        {status}
      </span>
    );
  };

  /* -------------------- UI -------------------- */
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 space-y-6"
      >
        <BreadcrumbsBar
          items={[{ label: "Home", to: "/" }, { label: "Secondary Screening" }]}
        />

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Secondary Screening</h1>
            <p className="text-sm text-slate-500 mt-1">
              Project ID: <span className="font-medium text-slate-700">{projectId}</span>
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpenPdfUpload(true)}
            className="h-11 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 rounded-lg text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
          >
            <FiUpload className="w-4 h-4" /> Upload PMID Excel
          </motion.button>
        </motion.div>

        {/* PROCESSING STATUS */}
        <AnimatePresence>
          {loadingText && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3"
            >
              <FiLoader className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-sm font-medium text-blue-900">
                Processing PDF text extraction...
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
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-700">Selected</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {stats.selected}
                  </p>
                </div>
                <div className="p-2 bg-blue-200 rounded-lg">
                  <FiCheckSquare className="w-5 h-5 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-700">Available PDFs</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {stats.available}
                  </p>
                </div>
                <div className="p-2 bg-green-200 rounded-lg">
                  <FiCheckCircle className="w-5 h-5 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-700">Unavailable</p>
                  <p className="text-2xl font-bold text-amber-900 mt-1">
                    {stats.unavailable}
                  </p>
                </div>
                <div className="p-2 bg-amber-200 rounded-lg">
                  <FiFilter className="w-5 h-5 text-amber-700" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ACTION TOOLBAR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                className="w-full h-11 border border-slate-300 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search PMID or Status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowPdfList(true)}
              className="h-11 border border-slate-300 px-5 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              View Downloaded PDFs
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenSecondary(true)}
              disabled={selectedPMIDs.size === 0}
              className="h-11 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 rounded-lg text-sm font-medium shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Run Secondary Screening ({selectedPMIDs.size})
            </motion.button>
          </div>
        </motion.div>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">PDF Availability Status</h2>
              <p className="text-xs text-slate-500 mt-1">
                Showing {paginatedRows.length} of {filteredRows.length} entries
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              {selectAll ? <FiCheckSquare className="w-4 h-4" /> : <FiSquare className="w-4 h-4" />}
              {selectAll ? "Deselect All" : "Select All"}
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider w-20">
                    Select
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    PMID
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedRows.map((row, i) => {
                  const pmid = normalizePMID(row.PMID);
                  const filename = pdfFilenameMap[pmid];
                  const isSelected = selectedPMIDs.has(pmid);

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
                          className="inline-flex items-center justify-center w-5 h-5"
                        >
                          {isSelected ? (
                            <FiCheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <FiSquare className="w-5 h-5 text-slate-400" />
                          )}
                        </motion.button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-600 font-semibold">{pmid}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(row.Status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {filename ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openPdf(filename)}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            <FiEye className="w-4 h-4" /> View PDF
                          </motion.button>
                        ) : (
                          <span className="text-slate-400 text-sm italic">
                            Not available
                          </span>
                        )}
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
              <span className="text-sm text-slate-600">
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
        </motion.div>

        <DownloadedPdfPopup
          open={showPdfList}
          pdfs={downloadedPdfs}
          onClose={() => setShowPdfList(false)}
          onView={openPdf}
        />

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
                className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <span className="font-semibold text-slate-800">PDF Viewer</span>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActivePdfUrl(null)}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5" />
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
              className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3"
            >
              <FiCheckCircle className="w-5 h-5" />
              <span className="font-medium">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <PdfDownloadPopup
          open={openPdfUpload}
          onClose={() => setOpenPdfUpload(false)}
          excelFile={excelFile}
          onExcelUpload={(e) => setExcelFile(e.target.files[0])}
          onSearch={runPdfDownload}
          running={loadingPdf}
        />

        <SecondaryPopup
          open={openSecondary}
          onClose={() => setOpenSecondary(false)}
          excelFile={excelFile}
          ifuFile={ifuFile}
          onExcelUpload={(e) => setExcelFile(e.target.files[0])}
          onIfuUpload={(e) => setIfuFile(e.target.files[0])}
          onRun={runSecondary}
          loading={loadingSecondary}
        />
      </motion.div>
    </Layout>
  );
}