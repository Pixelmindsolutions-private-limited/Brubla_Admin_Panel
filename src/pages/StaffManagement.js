import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  UserCog,
  Plus,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  Loader2,
  Phone,
  Mail,
  UserCheck,
  UserX,
  Power,
  Shield,
  Check,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const StaffManagement = () => {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const getToken = () =>
    localStorage.getItem("staffToken") ||
    sessionStorage.getItem("adminToken");

  // ============ Fetch Staff ============
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setStaffList(res.data.data || res.data.staff || []);
      }
    } catch (err) {
      console.error("Fetch staff error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to load staff",
        icon: "error",
        background: "#071236",
        color: "#FFF",
        confirmButtonColor: "#C026D3",
      });
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // ============ Delete Staff ============
  const handleDelete = async (staff) => {
    const result = await Swal.fire({
      title: "Delete Staff?",
      text: `Are you sure you want to delete "${staff.name}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      background: "#071236",
      color: "#FFFFFF",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const token = getToken();
      const res = await axios.delete(`${API}/staff/${staff._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Deleted!",
          text: "Staff deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchStaff();
      }
    } catch (err) {
      console.error("Delete staff error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to delete staff",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    }
  };

  // ============ Toggle Active/Inactive ============
  const handleToggleStatus = async (staff) => {
    try {
      setTogglingId(staff._id);
      const token = getToken();

      const res = await axios.patch(
        `${API}/staff/${staff._id}/status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        // Update local state instantly
        setStaffList((prev) =>
          prev.map((s) =>
            s._id === staff._id ? { ...s, isActive: res.data.data.isActive } : s
          )
        );

        Swal.fire({
          title: res.data.data.isActive ? "Activated!" : "Deactivated!",
          text: `${staff.name} is now ${
            res.data.data.isActive ? "active" : "inactive"
          }`,
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to toggle status",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setTogglingId(null);
    }
  };

  // ============ Filtered List ============
  const filteredStaff = staffList.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.mobile?.includes(searchTerm)
    );
  });

  // ============ Stats ============
  const stats = {
    total: staffList.length,
    active: staffList.filter((s) => s.isActive).length,
    inactive: staffList.filter((s) => !s.isActive).length,
  };

  return (
    <div className="space-y-6 pb-10">
      {/* ============ Header ============ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <UserCog size={28} className="text-[#C026D3]" />
            Staff Management
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Create, edit, and manage staff members with permissions
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/staff/create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Create Staff
        </button>
      </div>

      {/* ============ Stats Cards ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Total Staff</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#C026D3]/20 flex items-center justify-center">
              <UserCog size={22} className="text-[#C026D3]" />
            </div>
          </div>
        </div>

        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Active</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <UserCheck size={22} className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Inactive</p>
              <p className="text-3xl font-bold text-red-400 mt-1">
                {stats.inactive}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <UserX size={22} className="text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ============ Search ============ */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
            <input
              type="text"
              placeholder="Search by name, email or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all"
            />
          </div>
          <button
            onClick={fetchStaff}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ============ Table ============ */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="text-[#C026D3] animate-spin" />
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-20">
            <UserCog size={56} className="text-[#94A3B8] mx-auto mb-4" />
            <p className="text-white text-lg font-semibold">No staff found</p>
            <p className="text-[#94A3B8] text-sm mt-2">
              {searchTerm
                ? "Try adjusting your search"
                : "Click 'Create Staff' to add your first staff member"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {[
                    "Staff",
                    "Contact",
                    "Permissions",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider ${
                        h === "Actions" ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredStaff.map((staff) => (
                  <tr
                    key={staff._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* Staff */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C026D3] to-[#2563EB] flex items-center justify-center text-white font-bold shrink-0">
                          {staff.name?.charAt(0).toUpperCase() || "S"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">
                            {staff.name || "Unnamed"}
                          </p>
                          <p className="text-[#94A3B8] text-xs truncate flex items-center gap-1">
                            <Mail size={10} />
                            {staff.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                        <Phone size={14} />
                        {staff.mobile || "—"}
                      </div>
                    </td>

                    {/* Permissions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(staff.permissions || [])
                          .slice(0, 3)
                          .map((perm, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-[#C026D3]/10 text-[#C026D3] text-xs whitespace-nowrap"
                            >
                              {perm.name}
                            </span>
                          ))}
                        {(staff.permissions || []).length > 3 && (
                          <span
                            className="px-2 py-0.5 rounded bg-white/5 text-[#94A3B8] text-xs"
                            title={`${staff.permissions.length} permissions`}
                          >
                            +{staff.permissions.length - 3} more
                          </span>
                        )}
                        {(staff.permissions || []).length === 0 && (
                          <span className="text-[#94A3B8] text-xs">
                            No permissions
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {staff.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <UserCheck size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                          <UserX size={12} /> Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(staff)}
                          disabled={togglingId === staff._id}
                          className={`p-2 rounded-lg transition-all ${
                            staff.isActive
                              ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                          } disabled:opacity-50`}
                          title={
                            staff.isActive ? "Deactivate" : "Activate"
                          }
                        >
                          {togglingId === staff._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Power size={16} />
                          )}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/staff/edit/${staff._id}`
                            )
                          }
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(staff)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
