import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Users,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  UserCheck,
  Clock,
  Building,
  Shield,
  Wallet,
  Package,
  Filter,
} from "lucide-react";
import { apiFetch, buildImageUrl } from "../../config";

// =================================================================
const PendingDesigners = () => {
  const navigate = useNavigate();

  const [pendingDesigners, setPendingDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPending, setTotalPending] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState({});

  const designersPerPage = 10;

  // ---------- Fetch ----------
  const fetchPendingDesigners = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch(`/pendingdesginers`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to fetch pending designers");
      }

      setPendingDesigners(data.pendingDesigners || []);
      setTotalPending(data.total || data.count || 0);
      setTotalPages(data.pages || 1);
      setCurrentPage(data.page || 1);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
        confirmButtonColor: "#C026D3",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingDesigners();
  }, [fetchPendingDesigners]);

  // ---------- Approve ----------
  const handleApprove = async (designerId, designerName) => {
    const result = await Swal.fire({
      title: "Approve Designer?",
      text: `Are you sure you want to approve ${
        designerName || "this designer"
      }?`,
      icon: "question",
      showCancelButton: true,
      background: "#071236",
      color: "#FFFFFF",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading((prev) => ({ ...prev, [designerId]: "approve" }));
      const res = await apiFetch(`/designers/${designerId}/approve`, {
        method: "PATCH",
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to approve");
      }

      Swal.fire({
        title: "Approved!",
        text: "Designer has been approved successfully",
        icon: "success",
        background: "#071236",
        color: "#FFFFFF",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchPendingDesigners();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
        confirmButtonColor: "#C026D3",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [designerId]: null }));
    }
  };

  // ---------- Reject ----------
  const handleReject = async (designerId, designerName) => {
    const { value: rejectionReason } = await Swal.fire({
      title: "Reject Designer?",
      text: `Please provide a reason for rejecting ${
        designerName || "this designer"
      }`,
      icon: "warning",
      input: "textarea",
      inputPlaceholder: "Enter rejection reason...",
      inputAttributes: { "aria-label": "Rejection reason" },
      showCancelButton: true,
      background: "#071236",
      color: "#FFFFFF",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "Please provide a rejection reason";
        }
        return null;
      },
    });

    if (!rejectionReason) return;

    try {
      setActionLoading((prev) => ({ ...prev, [designerId]: "reject" }));
      const res = await apiFetch(`/designers/${designerId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ rejectionReason }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to reject");
      }

      Swal.fire({
        title: "Rejected!",
        text: "Designer has been rejected successfully",
        icon: "info",
        background: "#071236",
        color: "#FFFFFF",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchPendingDesigners();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
        confirmButtonColor: "#C026D3",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [designerId]: null }));
    }
  };

  // ---------- Filter + paginate ----------
  const filteredDesigners = useMemo(() => {
    if (!searchTerm.trim()) return pendingDesigners;
    const q = searchTerm.toLowerCase();
    return pendingDesigners.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q) ||
        d.mobile?.includes(q) ||
        d.brandName?.toLowerCase().includes(q)
    );
  }, [pendingDesigners, searchTerm]);

  const indexOfLastDesigner = currentPage * designersPerPage;
  const indexOfFirstDesigner = indexOfLastDesigner - designersPerPage;
  const currentDesigners = filteredDesigners.slice(
    indexOfFirstDesigner,
    indexOfLastDesigner
  );
  const pageTotal =
    filteredDesigners.length > 0
      ? Math.ceil(filteredDesigners.length / designersPerPage)
      : 1;

  const getWaitingDaysText = (days) => {
    if (!days && days !== 0) return "—";
    if (days === 0) return "Today";
    if (days === 1) return "1 day";
    return `${days} days`;
  };

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  // =================================================================
  return (
    <div className="space-y-6 pb-10 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Clock size={28} className="text-amber-400" />
            Pending Designers
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Review and approve designer registration requests
          </p>
        </div>
        <button
          onClick={fetchPendingDesigners}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm transition-all disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Pending Approvals"
          value={totalPending}
          icon={Clock}
          color="text-amber-400"
          bg="bg-amber-500/20"
        />
        <StatCard
          label="With Brand Name"
          value={
            pendingDesigners.filter(
              (d) => d.brandName && d.brandName.trim() !== ""
            ).length
          }
          icon={Building}
          color="text-purple-400"
          bg="bg-purple-500/20"
        />
        <StatCard
          label="Verified Accounts"
          value={pendingDesigners.filter((d) => d.isVerified).length}
          icon={UserCheck}
          color="text-emerald-400"
          bg="bg-emerald-500/20"
        />
      </div>

      {/* Search */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            placeholder="Search by name, email, mobile or brand name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-amber-500/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pendingDesigners.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Pending Approvals
            </h3>
            <p className="text-[#94A3B8]">
              All designers have been reviewed and processed.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    {[
                      "Designer",
                      "Contact",
                      "Brand",
                      "Products",
                      "Wallet",
                      "Status",
                      "Waiting",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider ${
                          h === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentDesigners.map((designer) => {
                    const isLoadingA =
                      actionLoading[designer._id] === "approve";
                    const isLoadingR =
                      actionLoading[designer._id] === "reject";
                    const busy = isLoadingA || isLoadingR;

                    return (
                      <tr
                        key={designer._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        {/* Designer */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {designer.profileImage ? (
                              <img
                                src={buildImageUrl(designer.profileImage)}
                                alt={designer.name}
                                className="w-10 h-10 rounded-full object-cover border border-white/10"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                {designer.name
                                  ? designer.name.charAt(0).toUpperCase()
                                  : "D"}
                              </div>
                            )}
                            <div>
                              <p className="text-white font-semibold">
                                {designer.name || "Unnamed"}
                              </p>
                              <p className="text-[#94A3B8] text-xs flex items-center gap-1">
                                <Shield size={10} />
                                Designer
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                              <Mail size={14} />
                              {designer.email || "No email"}
                            </div>
                            <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                              <Phone size={14} />
                              {designer.mobile || "No mobile"}
                            </div>
                          </div>
                        </td>

                        {/* Brand */}
                        <td className="px-4 py-4">
                          {designer.brandName ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              <Building size={12} />
                              {designer.brandName}
                            </span>
                          ) : (
                            <span className="text-[#94A3B8] text-xs">
                              Not specified
                            </span>
                          )}
                        </td>

                        {/* Products */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-white text-sm">
                            <Package size={14} className="text-blue-400" />
                            <span className="font-semibold">
                              {designer.productStats?.total ?? 0}
                            </span>
                          </div>
                          {designer.productStats?.pending > 0 && (
                            <p className="text-[10px] text-yellow-400 mt-0.5">
                              {designer.productStats.pending} pending
                            </p>
                          )}
                        </td>

                        {/* Wallet */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-emerald-400 text-sm">
                            <Wallet size={14} />
                            <span className="font-semibold">
                              ₹
                              {(designer.walletBalance ?? 0).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <div className="space-y-1.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              <Clock size={12} />
                              Pending
                            </span>
                            {designer.isVerified && (
                              <div className="flex items-center gap-1 text-emerald-400 text-xs">
                                <UserCheck size={12} />
                                Verified
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Waiting */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-[#94A3B8] text-xs">
                            <Calendar size={12} />
                            {getWaitingDaysText(designer.waitingDays)}
                          </div>
                          <div className="text-[#94A3B8] text-xs mt-1">
                            {formatDate(designer.createdAt)}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/dashboard/designers/${designer._id}`
                                )
                              }
                              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleApprove(designer._id, designer.name)
                              }
                              disabled={busy}
                              className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve Designer"
                            >
                              {isLoadingA ? (
                                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleReject(designer._id, designer.name)
                              }
                              disabled={busy}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject Designer"
                            >
                              {isLoadingR ? (
                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <XCircle size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pageTotal > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <p className="text-sm text-[#94A3B8]">
                  Showing {indexOfFirstDesigner + 1} to{" "}
                  {Math.min(
                    indexOfLastDesigner,
                    filteredDesigners.length
                  )}{" "}
                  of {filteredDesigners.length} pending designers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(p - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-white text-sm">
                    {currentPage} / {pageTotal}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, pageTotal))
                    }
                    disabled={currentPage === pageTotal}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ---------- Stat Card helper ----------
const StatCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[#94A3B8] text-xs font-medium">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
      >
        <Icon size={20} className={color} />
      </div>
    </div>
  </div>
);

export default PendingDesigners;