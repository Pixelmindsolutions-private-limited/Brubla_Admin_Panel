import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ChevronDown, Plus, RefreshCw, Edit3, FolderPlus,
  Eye, Power, Trash2, ChevronRight, Shirt, Users, X, AlertTriangle,
} from "lucide-react";

const API_HOST = "http://31.97.228.17:4077";
const API_BASE = `${API_HOST}/api/admin`;

// Reusable dropdown class (matches AllUsers page)
const SELECT_CLASS =
  "appearance-none px-4 py-2.5 pr-10 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 transition-all cursor-pointer";

// Force black background for native dropdown options (browser override)
const OPTION_STYLE = { backgroundColor: "#000", color: "#fff" };

// Convert relative image path → absolute URL
const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_HOST}${path}`;
};

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // ---------------- Fetch ----------------
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to load categories");
      }
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ---------------- Delete ----------------
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE}/categories/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to delete");
      }
      setCategories((c) => c.filter((x) => x._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ---------------- Toggle active/disabled ----------------
  const toggleStatus = async (cat) => {
    try {
      setTogglingId(cat._id);

      const fd = new FormData();
      fd.append("isActive", cat.isActive ? "false" : "true");

      const res = await fetch(`${API_BASE}/categories/${cat._id}`, {
        method: "PUT",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to update");
      }
      setCategories((list) =>
        list.map((c) => (c._id === cat._id ? data.category : c))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  // ---------------- Summary ----------------
  const summary = useMemo(() => {
    const totalSubs = categories.reduce(
      (s, c) => s + (c.subcategories?.length || 0),
      0
    );
    const disabled = categories.filter((c) => !c.isActive).length;
    return {
      categories: categories.length,
      subcategories: totalSubs,
      disabled,
      active: categories.length - disabled,
    };
  }, [categories]);

  // ---------------- Filter + Sort ----------------
  const filtered = useMemo(() => {
    let list = [...categories];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }

    if (statusFilter === "active") list = list.filter((c) => c.isActive);
    if (statusFilter === "disabled") list = list.filter((c) => !c.isActive);

    switch (sortBy) {
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "oldest":
        list.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "newest":
      default:
        list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    return list;
  }, [categories, search, statusFilter, sortBy]);

  // ---------------- Format date ----------------
  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------- UI ----------------
  return (
    <div className="space-y-6 pb-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage product categories and their subcategories
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/categories/create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Categories",
            value: summary.categories,
            color: "text-white",
            icon: Shirt,
          },
          {
            label: "Subcategories",
            value: summary.subcategories,
            color: "text-blue-400",
            icon: Users,
          },
          {
            label: "Active",
            value: summary.active,
            color: "text-emerald-400",
            icon: Eye,
          },
          {
            label: "Disabled",
            value: summary.disabled,
            color: "text-red-400",
            icon: Power,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#94A3B8] text-xs font-medium">{label}</p>
              <Icon size={16} className={color} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search / Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={SELECT_CLASS}
            >
              <option style={OPTION_STYLE} value="all">All Status</option>
              <option style={OPTION_STYLE} value="active">Active</option>
              <option style={OPTION_STYLE} value="disabled">Disabled</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={14}
            />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={SELECT_CLASS}
            >
              <option style={OPTION_STYLE} value="newest">Newest First</option>
              <option style={OPTION_STYLE} value="oldest">Oldest First</option>
              <option style={OPTION_STYLE} value="name-asc">Name (A–Z)</option>
              <option style={OPTION_STYLE} value="name-desc">Name (Z–A)</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={14}
            />
          </div>

          <button
            onClick={loadCategories}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {[
                  "Category",
                  "Subcategories",
                  "Status",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-[#94A3B8] text-sm"
                  >
                    Loading categories...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-[#94A3B8] text-sm"
                  >
                    {search || statusFilter !== "all"
                      ? "No categories match your filters."
                      : "No categories yet. Click Add Category to start."}
                  </td>
                </tr>
              ) : (
                filtered.map((row, index) => {
                  const isLastRow = index >= filtered.length - 2;
                  const isExpanded = expandedRow === row._id;
                  const subCount = row.subcategories?.length || 0;

                  return (
                    <Row
                      key={row._id}
                      row={row}
                      isLastRow={isLastRow}
                      isExpanded={isExpanded}
                      subCount={subCount}
                      activeDropdown={activeDropdown}
                      setActiveDropdown={setActiveDropdown}
                      setExpandedRow={setExpandedRow}
                      navigate={navigate}
                      onDelete={() => setDeleteTarget(row)}
                      onToggle={() => toggleStatus(row)}
                      togglingId={togglingId}
                      buildImageUrl={buildImageUrl}
                      formatDate={formatDate}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1A4A] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Category?</h3>
            </div>
            <p className="text-sm text-[#94A3B8]">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                "{deleteTarget.name}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= Row Component =================
const Row = ({
  row,
  isLastRow,
  isExpanded,
  subCount,
  activeDropdown,
  setActiveDropdown,
  setExpandedRow,
  navigate,
  onDelete,
  onToggle,
  togglingId,
  buildImageUrl,
  formatDate,
}) => {
  const isToggling = togglingId === row._id;
  const statusLabel = row.isActive ? "Active" : "Disabled";
  const statusClass = row.isActive
    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    : "bg-red-500/20 text-red-400 border-red-500/30";
  const dotClass = row.isActive ? "bg-emerald-400" : "bg-red-400";

  return (
    <>
      <tr className="hover:bg-white/5 transition-colors">
        {/* Category */}
        <td className="px-4 py-3">
          <button
            onClick={() => setExpandedRow(isExpanded ? null : row._id)}
            className="flex items-center gap-3 text-sm text-white font-medium"
          >
            <ChevronRight
              size={14}
              className={`text-[#94A3B8] transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
            {row.image ? (
              <img
                src={buildImageUrl(row.image)}
                alt={row.name}
                className="w-10 h-10 rounded-lg object-cover border border-white/10"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/40?text=?";
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] text-xs">
                ?
              </div>
            )}
            <span className="truncate max-w-[220px]">{row.name}</span>
          </button>
        </td>

        {/* Subcategories */}
        <td className="px-4 py-3 text-sm text-[#94A3B8]">
          {subCount} {subCount === 1 ? "sub" : "subs"}
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 w-fit ${statusClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            {statusLabel}
          </span>
        </td>

        {/* Created */}
        <td className="px-4 py-3 text-sm text-[#94A3B8] whitespace-nowrap">
          {formatDate(row.createdAt)}
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="relative">
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === row._id ? null : row._id
                )
              }
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
            >
              <ChevronDown size={16} />
            </button>

            {activeDropdown === row._id && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setActiveDropdown(null)}
                />
                <div
                  className={`absolute right-0 z-30 w-56 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden ${
                    isLastRow ? "bottom-full mb-2" : "top-12"
                  }`}
                >
                  <button
                    onClick={() => {
                      navigate(`/dashboard/categories/edit/${row._id}`);
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10"
                  >
                    <Edit3 size={14} /> Edit Category
                  </button>
                  <button
                    onClick={() => {
                      navigate(
                        `/dashboard/categories/${row._id}/subcategories/create`
                      );
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10"
                  >
                    <FolderPlus size={14} /> Add Subcategory
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/dashboard/products?category=${row._id}`);
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10"
                  >
                    <Eye size={14} /> View Products
                  </button>
                  <button
                    disabled={isToggling}
                    onClick={() => {
                      onToggle();
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10 disabled:opacity-50"
                  >
                    <Power size={14} />
                    {isToggling
                      ? "Updating..."
                      : row.isActive
                      ? "Disable"
                      : "Enable"}
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setActiveDropdown(null);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 border-t border-white/5"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded subcategories row */}
      {isExpanded && (
        <tr className="bg-white/5">
          <td colSpan={5} className="px-4 py-3 pl-20">
            {subCount === 0 ? (
              <p className="text-xs text-[#94A3B8] italic">
                No subcategories yet.
              </p>
            ) : (
              <div className="space-y-2">
                {row.subcategories.map((sub) => (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg bg-[#071236]/40 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#C026D3]">└─</span>
                      {sub.image && (
                        <img
                          src={buildImageUrl(sub.image)}
                          alt={sub.name}
                          className="w-7 h-7 rounded-md object-cover border border-white/10"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <span className="text-sm text-white">{sub.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          sub.isActive
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-red-500/15 text-red-300"
                        }`}
                      >
                        {sub.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/categories/${row._id}/subcategories/edit/${sub._id}`
                        )
                      }
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      view
                    </button>
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

export default Categories;