import { motion } from "framer-motion";
import { CheckCircle, XCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "./Badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const rowVariant = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function ResultTable({
  rows = [],
  onRowClick,
  onDecisionChange,
}) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    return rows.filter(
      (r) =>
        r.PMID?.toString().includes(query) ||
        r.Abstract?.toLowerCase().includes(query.toLowerCase())
    );
  }, [rows, query]);

  return (
    <div>
      {/* SEARCH */}
      <div className="mb-3 flex items-center gap-2">
        <Search size={16} className="text-gray-400" />
        <input
          className="w-full border rounded-md px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by PMID or abstract..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="bg-white rounded-xl shadow-sm divide-y"
      >
        {/* HEADER */}
        <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold
                        text-gray-500 uppercase">
          <div className="col-span-2">PMID</div>
          <div className="col-span-6">Abstract</div>
          <div className="col-span-2">Decision</div>
          <div className="col-span-2">Category</div>
        </div>

        {filteredRows.map((row) => (
          <Row
            key={row.id ?? row.PMID}
            row={row}
            onRowClick={onRowClick}
            onDecisionChange={onDecisionChange}
          />
        ))}

        {filteredRows.length === 0 && (
          <div className="p-4 text-sm text-gray-500 text-center">
            No results found
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Row({ row, onRowClick, onDecisionChange }) {
  const [decision, setDecision] = useState(row.Decision);

  const toggleDecision = () => {
    const next = decision === "Include" ? "Exclude" : "Include";
    setDecision(next);
    onDecisionChange?.(row.PMID, next); 
  };

  return (
    <motion.div
      variants={rowVariant}
      whileHover={{ backgroundColor: "#f9fafb" }}
      className="grid grid-cols-12 px-4 py-3 items-center rounded-lg
                 cursor-pointer transition hover:shadow-md"
      onClick={() => onRowClick(row)}
    >
      <div className="col-span-2 text-sm font-medium">
        {row.PMID}
      </div>

      <div className="col-span-6 text-sm text-gray-600 truncate">
        {row.Abstract}
      </div>

      {/* DECISION */}
      <div
        className="col-span-2 focus:outline-none focus:ring-2
                   focus:ring-blue-500 rounded"
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          toggleDecision();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleDecision();
        }}
      >
        <motion.div layout transition={{ type: "spring", stiffness: 260 }}>
          {decision === "Include" ? (
            <Badge color="green">
              <CheckCircle size={14} /> Include
            </Badge>
          ) : (
            <Badge color="red">
              <XCircle size={14} /> Exclude
            </Badge>
          )}
        </motion.div>
      </div>

      {/* CATEGORY */}
      <div className="col-span-2">
        <Badge color={row.Category === "SOTA" ? "violet" : "orange"}>
          {row.Category}
        </Badge>
      </div>
    </motion.div>
  );
}
