import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import BreadcrumbsBar from "../components/BreadcrumbsBar";
import ResultTable from "../components/ResultTable";
import StatCard from "../components/StatCard";
import PrimarySearchPopup from "../components/PrimaryPopup";

import { FileText, CheckCircle, XCircle } from "lucide-react";

export default function PrimarySearchPage() {
  const { id: PROJECT_ID } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  // Pagination (server-safe)
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  // -------------------------------
  // LOAD DATA
  // -------------------------------
  useEffect(() => {
    fetch(
      `http://localhost:5000/api/primary/existing?project_id=${PROJECT_ID}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.masterSheet) {
          setRows(
            data.masterSheet.map((r, i) => ({
              id: i + 1,
              ...r,
            }))
          );
        }
      });
  }, [PROJECT_ID]);

  // -------------------------------
  // STATS
  // -------------------------------
  const included = useMemo(
    () => rows.filter((r) => r.Decision === "Include").length,
    [rows]
  );

  const excluded = useMemo(
    () => rows.filter((r) => r.Decision === "Exclude").length,
    [rows]
  );

  // -------------------------------
  // PAGINATION (client for now)
  // -------------------------------
  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, page]);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <BreadcrumbsBar
          items={[
            { label: "Home", to: "/" },
            { label: "Project", to: `/project/${PROJECT_ID}` },
            { label: "Primary Screening" },
          ]}
        />

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Primary Screening Results
          </h1>

          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition"
          >
            Import Excel
          </button>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap gap-4">
          <StatCard
            title="Reviewed"
            value={rows.length}
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Included"
            value={included}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Excluded"
            value={excluded}
            icon={XCircle}
            color="red"
          />
        </div>

        {/* TABLE */}
        <ResultTable
          rows={pagedRows}
          onDecisionChange={(pmid, next) => {
            // Optimistic update
            setRows((prev) =>
              prev.map((r) =>
                r.PMID === pmid ? { ...r, Decision: next } : r
              )
            );
          }}
          onRowClick={(row) =>
            navigate(
              `/project/${PROJECT_ID}/primary/article/${row.PMID}`
            )
          }
        />

        {/* PAGINATION */}
        {rows.length > PAGE_SIZE && (
          <div className="flex justify-end gap-2 pt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page * PAGE_SIZE >= rows.length}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        <PrimarySearchPopup open={open} onClose={() => setOpen(false)} />
      </div>
    </Layout>
  );
}
