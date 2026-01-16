import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiDownload,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

export default function SecondaryResultsPage() {
  const { id: projectId } = useParams();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterDecision, setFilterDecision] = useState("all"); // all, include, exclude
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    included: 0,
    excluded: 0,
  });

  // ---------------- LOAD RESULTS ----------------
  useEffect(() => {
    setLoading(true);
    fetch(
      `http://localhost:5000/api/secondary/existing?project_id=${projectId}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (!d.exists) {
          setLoading(false);
          return;
        }

        const cols = Object.keys(d.masterSheet[0]);
        setColumns(cols);

        const processedRows = d.masterSheet.map((r, i) => ({ 
          id: i + 1, 
          ...r 
        }));
        setRows(processedRows);

        // Calculate stats
        const included = processedRows.filter(
          (r) => r.Decision?.toLowerCase() === "include"
        ).length;
        const excluded = processedRows.filter(
          (r) => r.Decision?.toLowerCase() === "exclude"
        ).length;

        setStats({
          total: processedRows.length,
          included,
          excluded,
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  // ---------------- FILTER & SEARCH ----------------
  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Apply decision filter
    if (filterDecision !== "all") {
      filtered = filtered.filter(
        (r) => r.Decision?.toLowerCase() === filterDecision
      );
    }

    // Apply search
    if (search) {
      filtered = filtered.filter((r) =>
        Object.values(r)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [rows, search, filterDecision]);

  // ---------------- PAGINATION ----------------
  const paginatedRows = useMemo(() => {
    const start = page * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);

  // ---------------- DOWNLOAD ----------------
  const handleDownload = () => {
    window.open(
      `http://localhost:5000/api/secondary/existing?project_id=${projectId}&download=true`
    );
  };

  // ---------------- RENDER HELPERS ----------------
  const getDecisionBadge = (decision) => {
    const isInclude = decision?.toLowerCase() === "include";
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          isInclude
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isInclude ? (
          <FiCheckCircle className="w-3 h-3" />
        ) : (
          <FiXCircle className="w-3 h-3" />
        )}
        {decision}
      </span>
    );
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 space-y-6"
      >
        <BreadcrumbsBar
          items={[
            { label: "Dashboard", to: "/" },
            { label: "Secondary Screening", to: `/projects/${projectId}/secondary` },
            { label: "Results" },
          ]}
        />

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-between items-start"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Secondary Screening Results
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Project ID: <span className="font-medium text-slate-700">{projectId}</span>
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="h-11 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
          >
            <FiDownload className="w-4 h-4" />
            Export Excel
          </motion.button>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Articles</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <FiFilter className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Included</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {stats.included}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              {stats.total > 0 ? ((stats.included / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Excluded</p>
                <p className="text-3xl font-bold text-red-900 mt-1">
                  {stats.excluded}
                </p>
              </div>
              <div className="p-3 bg-red-200 rounded-lg">
                <FiXCircle className="w-6 h-6 text-red-700" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2">
              {stats.total > 0 ? ((stats.excluded / stats.total) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
        </motion.div>

        {/* FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                className="w-full h-11 border border-slate-300 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Search decision, rationale, PMID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* DECISION FILTER */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterDecision("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterDecision === "all"
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterDecision("include")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterDecision === "include"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Included
              </button>
              <button
                onClick={() => setFilterDecision("exclude")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterDecision === "exclude"
                    ? "bg-red-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Excluded
              </button>
            </div>
          </div>

          {(search || filterDecision !== "all") && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-slate-600 mt-3"
            >
              Showing {filteredRows.length} of {rows.length} results
            </motion.p>
          )}
        </motion.div>

        {/* RESULTS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
        >
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Screening Results</h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {paginatedRows.length} of {filteredRows.length} entries
            </p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full"
                />
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <FiXCircle className="w-12 h-12 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No results found</p>
                <p className="text-sm text-slate-500 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRows.map((row, i) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {columns.map((col) => (
                        <td key={col} className="px-6 py-4">
                          {col.toLowerCase() === "decision" ? (
                            getDecisionBadge(row[col])
                          ) : (
                            <span className="text-slate-700">
                              {row[col] || "-"}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-slate-600">entries</span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </motion.button>

                <span className="text-sm text-slate-600 px-3">
                  Page {page + 1} of {totalPages}
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FiChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </Layout>
  );
}