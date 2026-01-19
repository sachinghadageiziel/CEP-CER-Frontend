import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiFileText, FiCheckCircle, FiAlertCircle, FiTrash2 } from "react-icons/fi";

export default function ManualPdfUploadPopup({ open, pmid, onClose, onUpload }) {
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
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file);
      setFile(null);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFile(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", duration: 0.6 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 px-8 py-6 overflow-hidden">
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
                className="absolute top-5 right-5 p-2 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50 z-10"
              >
                <FiX className="w-6 h-6 text-white" />
              </motion.button>

              <div className="relative flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                  <FiUpload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Manual PDF Upload</h2>
                  <p className="text-blue-100 text-sm mt-1 font-medium">
                    PMID: <span className="font-bold font-mono">{pmid}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-8 space-y-6">
              {/* INFO BANNER */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <FiAlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-sm text-blue-900">
                  <p className="font-bold mb-1">PDF Upload Required</p>
                  <p className="text-blue-700">
                    Upload the PDF file manually for this article. The file will be processed automatically after upload.
                  </p>
                </div>
              </div>

              {/* DRAG AND DROP AREA */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-2xl p-10
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
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                  id="pdf-upload"
                />
                
                <label
                  htmlFor="pdf-upload"
                  className={`flex flex-col items-center gap-4 ${
                    uploading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {file ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-4 bg-blue-100 rounded-2xl"
                      >
                        <FiCheckCircle className="w-12 h-12 text-blue-600" />
                      </motion.div>
                      <div className="text-center w-full">
                        <p className="font-bold text-blue-900 text-lg truncate px-4">
                          {file.name}
                        </p>
                        <p className="text-sm text-blue-600 mt-2 font-medium">
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
                              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold transition-all"
                            >
                              <FiTrash2 className="w-4 h-4" /> Remove
                            </motion.button>
                            <label
                              htmlFor="pdf-upload"
                              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold transition-all cursor-pointer"
                            >
                              <FiFileText className="w-4 h-4" /> Replace
                            </label>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`p-4 rounded-2xl transition-all ${
                        dragActive ? "bg-blue-100 scale-110" : "bg-blue-100"
                      }`}>
                        <FiFileText className="w-12 h-12 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-slate-700 text-lg">
                          {dragActive ? "Drop PDF here" : "Click to upload or drag & drop"}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          PDF files only • Maximum 50MB
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {/* FILE REQUIREMENTS */}
              <div className="px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                <p className="text-sm font-bold text-slate-700 mb-3">File Requirements:</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span><span className="font-semibold">Format:</span> PDF only</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span><span className="font-semibold">Size:</span> Maximum 50MB</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span><span className="font-semibold">Content:</span> Must be readable and not corrupted</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span><span className="font-semibold">Processing:</span> Text extraction will run automatically</span>
                  </li>
                </ul>
              </div>

              {/* PROGRESS */}
              <AnimatePresence>
                {uploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-blue-900">
                          Uploading and Processing PDF...
                        </span>
                      </div>
                      
                      <div className="w-full bg-blue-200 h-2.5 rounded-full overflow-hidden">
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

                      <p className="text-xs text-blue-600 mt-3 font-medium">
                        Please wait while we upload, extract text, and process your PDF
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  disabled={uploading}
                  className="flex-1 h-14 rounded-2xl font-bold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={!uploading && file ? { scale: 1.02 } : {}}
                  whileTap={!uploading && file ? { scale: 0.98 } : {}}
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className={`
                    flex-1 h-14 rounded-2xl font-bold text-white text-base
                    transition-all duration-300 flex items-center justify-center gap-3
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
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FiUpload className="w-5 h-5" />
                      Upload PDF
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}