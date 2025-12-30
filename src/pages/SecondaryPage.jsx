import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiEye, FiX } from "react-icons/fi";

import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";
import PdfDownloadPopup from "../components/PdfDownloadPopup";
import SecondaryPopup from "../components/SecondaryPopup";
import DownloadedPdfPopup from "../components/DownloadedPdfPopup";
import ExtractPdfText from "../components/ExtractPdfText";

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
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [showPdfList, setShowPdfList] = useState(false);

  /* ---------- PAGINATION ---------- */
  const [page, setPage] = useState(0);
  const pageSize = 10;

  /* ---------- LOAD EXISTING ---------- */
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/secondary/pdf-download/existing?project_id=${projectId}`
    )
      .then((r) => r.json())
      .then((d) => d.exists && setPdfRows(d.screening || []));

    loadPdfList();
  }, [projectId]);

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
  };

  const runPdfToText = async () => {
    setLoadingText(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 10 : p));
    }, 300);

    const form = new FormData();
    form.append("project_id", projectId);

    await fetch("http://localhost:5000/api/secondary/pdf-to-text", {
      method: "POST",
      body: form,
    });

    clearInterval(interval);
    setProgress(100);
    setLoadingText(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const runSecondary = async () => {
    setLoadingSecondary(true);

    const form = new FormData();
    form.append("project_id", projectId);
    form.append("primary_excel", excelFile);
    form.append("ifu_pdf", ifuFile);

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

  /* -------------------- UI -------------------- */
  return (
    <Layout>
      <div className="p-6 space-y-6">

        <BreadcrumbsBar
          items={[{ label: "Home", to: "/" }, { label: "Secondary Screening" }]}
        />

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Secondary Screening</h1>
            <p className="text-sm text-slate-500">
              Project ID: {projectId}
            </p>
          </div>

          <button
            onClick={() => setOpenPdfUpload(true)}
            className="h-10 flex items-center gap-2 bg-blue-600 text-white px-4 rounded-md text-sm hover:bg-blue-700"
          >
            <FiUpload /> Upload PMID Excel
          </button>
        </div>

        {/* ACTION TOOLBAR */}
        <div className="bg-white border rounded-md p-4">
          <div className="grid grid-cols-[260px_auto_auto_auto] gap-3 items-center">

            <input
              className="h-10 border px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search PMID / Status"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <ExtractPdfText
              onExtract={runPdfToText}
              loading={loadingText}
              progress={progress}
            />

            <button
              onClick={() => setShowPdfList(true)}
              className="h-10 border px-4 rounded-md text-sm hover:bg-slate-50"
            >
              View Downloaded PDFs
            </button>

            <button
              onClick={() => setOpenSecondary(true)}
              className="h-10 bg-green-600 text-white px-4 rounded-md text-sm hover:bg-green-700"
            >
              Run Secondary Screening
            </button>
          </div>

          {loadingText && (
            <div className="mt-3">
              <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
                <motion.div
                  className="bg-blue-600 h-2"
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1 text-right">
                {progress}%
              </div>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-md overflow-hidden shadow-sm">
          <div className="px-4 py-3 font-medium border-b">
            PDF Availability Status
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left">PMID</th>
                <th className="text-center">Status</th>
                <th className="text-right px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, i) => {
                const pmid = normalizePMID(row.PMID);
                const filename = pdfFilenameMap[pmid];

                return (
                  <tr
                    key={`${pmid}-${i}`}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-2 text-blue-600 font-medium">
                      {pmid}
                    </td>
                    <td className="text-center">{row.Status}</td>
                    <td className="px-4 py-2 text-right">
                      {filename ? (
                        <button
                          onClick={() => openPdf(filename)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <FiEye /> View
                        </button>
                      ) : (
                        <span className="text-slate-400 text-sm">
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

        <DownloadedPdfPopup
          open={showPdfList}
          pdfs={downloadedPdfs}
          onClose={() => setShowPdfList(false)}
          onView={openPdf}
        />

        {/* PDF VIEWER */}
        <AnimatePresence>
          {activePdfUrl && (
            <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white w-[90%] h-[90%] rounded-md shadow-xl">
                <div className="flex justify-between px-4 py-2 border-b">
                  <span className="font-medium">PDF Viewer</span>
                  <button onClick={() => setActivePdfUrl(null)}>
                    <FiX />
                  </button>
                </div>
                <iframe
                  src={activePdfUrl}
                  className="w-full h-[calc(100%-48px)]"
                  title="PDF Viewer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showToast && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
            Text extraction completed
          </div>
        )}

        <PdfDownloadPopup
          open={openPdfUpload}
          onClose={() => setOpenPdfUpload(false)}
          excelFile={excelFile}
          onExcelUpload={(e) => setExcelFile(e.target.files[0])}
          onSearch={runPdfDownload}
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
      </div>
    </Layout>
  );
}
