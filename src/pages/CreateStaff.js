import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { STAFF_PERMISSION_GROUPS, STAFF_PERMISSIONS } from "../config";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Shield,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const CreateStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    permissions: [],
    isActive: true,
  });

  const getToken = () =>
    localStorage.getItem("staffToken") ||
    sessionStorage.getItem("adminToken");

  // ============================================
  // FETCH STAFF IN EDIT MODE — FIXED
  // ============================================
  useEffect(() => {
    if (!isEditMode) {
      setFetching(false);
      return;
    }

    const fetchStaff = async () => {
      try {
        setFetching(true);
        const token = getToken();

        const res = await axios.get(`${API}/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🔍 Staff fetch response:", res.data);

        if (res.data.success) {
          // ✅ Handle all possible response shapes
          const staff =
            res.data.data?.staff ||  // { data: { staff: {...} } }
            res.data.staff ||          // { staff: {...} }
            res.data.data ||           // { data: {...} }
            res.data;                  // { ...staffFields }

          console.log("✅ Extracted staff:", staff);

          // ✅ Pre-fill form with staff data
          setFormData({
            name: staff?.name || "",
            email: staff?.email || "",
            mobile: staff?.mobile || "",
            password: "", // Never pre-fill password
            permissions: Array.isArray(staff?.permissions)
              ? staff.permissions
              : [],
            isActive: staff?.isActive ?? true,
          });
        }
      } catch (err) {
        console.error("❌ Fetch staff error:", err);
        Swal.fire({
          title: "Error!",
          text:
            err.response?.data?.message ||
            "Failed to fetch staff details",
          icon: "error",
          background: "#071236",
          color: "#FFF",
        });
        navigate("/dashboard/staff");
      } finally {
        setFetching(false);
      }
    };

    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  // ============ Handlers ============
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isPermissionSelected = (path) => {
    return formData.permissions.some((permission) => {
      // Handle both string and object permission formats
      const permPath =
        typeof permission === "string" ? permission : permission.path;
      return permPath === path;
    });
  };

  const togglePermission = (perm) => {
    setFormData((prev) => {
      const exists = prev.permissions.some((permission) => {
        const permPath =
          typeof permission === "string" ? permission : permission.path;
        return permPath === perm.path;
      });
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((permission) => {
              const permPath =
                typeof permission === "string"
                  ? permission
                  : permission.path;
              return permPath !== perm.path;
            })
          : [...prev.permissions, perm],
      };
    });
  };

  const selectAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [...STAFF_PERMISSIONS],
    }));
  };

  const clearAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  };

  // ============ Validation ============
  const validate = () => {
    if (!formData.name.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Name is required",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return false;
    }
    if (!formData.email.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Email is required",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return false;
    }
    if (!isEditMode && !formData.password.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Password is required for new staff",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return false;
    }
    if (formData.permissions.length === 0) {
      Swal.fire({
        title: "No Permissions",
        text: "Select at least one permission",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return false;
    }
    const hasLandingPage = formData.permissions.some((permission) => {
      const path =
        typeof permission === "string" ? permission : permission.path;
      return typeof path === "string" && !path.includes(":");
    });
    if (!hasLandingPage) {
      Swal.fire({
        title: "Select a Main Page",
        text: "Select at least one page without an ID parameter so staff has a page to open after login.",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return false;
    }
    return true;
  };

  // ============ Submit ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const token = getToken();

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        permissions: formData.permissions,
        isActive: formData.isActive,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      let res;
      if (isEditMode) {
        res = await axios.put(`${API}/staff/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await axios.post(`${API}/staff`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: `Staff ${isEditMode ? "updated" : "created"} successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => navigate("/dashboard/staff"), 1500);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} staff`,
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={32} className="text-[#C026D3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* ============ Header ============ */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/staff")}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isEditMode ? "Edit Staff" : "Create New Staff"}
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            {isEditMode
              ? "Update staff information and permissions"
              : "Add a new staff member with specific permissions"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============ Basic Information ============ */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
            <User size={16} /> BASIC INFORMATION
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Staff"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">
                Password{" "}
                {isEditMode && (
                  <span className="text-[#94A3B8] text-xs font-normal">
                    (leave blank to keep unchanged)
                  </span>
                )}
                {!isEditMode && " *"}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditMode ? "••••••••" : "Enter password"}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
                />
                <span className="text-white text-sm">
                  Mark as Active (staff can login)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ============ Permissions ============ */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
              <Shield size={16} /> PERMISSIONS ({formData.permissions.length}{" "}
              selected)
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20"
              >
                Clear All
              </button>
            </div>
          </div>

          <p className="text-xs text-[#94A3B8] mb-4">
            Select each App.js page this staff member can open. View, create,
            edit, and details pages have separate permissions.
          </p>

          <div className="space-y-5">
            {STAFF_PERMISSION_GROUPS.map((group) => (
              <section key={group.name}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/80">
                  {group.name}
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {group.routes.map((perm) => {
                    const selected = isPermissionSelected(perm.path);
                    return (
                      <button
                        key={perm.path}
                        type="button"
                        onClick={() => togglePermission(perm)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${
                          selected
                            ? "border-[#C026D3]/50 bg-[#C026D3]/15 text-white"
                            : "border-white/10 bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all ${
                            selected
                              ? "border-[#C026D3] bg-[#C026D3]"
                              : "border-2 border-white/30 bg-transparent"
                          }`}
                        >
                          {selected && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{perm.name}</span>
                          <span className="mt-0.5 block truncate font-mono text-[10px] text-[#94A3B8]">
                            {perm.path}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Selected summary */}
          {formData.permissions.length > 0 && (
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-xs text-[#94A3B8] mb-2">
                Selected permissions will be sent as array of objects:
              </p>
              <pre className="text-xs text-emerald-400 bg-black/30 p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(formData.permissions, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* ============ Buttons ============ */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/staff")}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEditMode ? "Update Staff" : "Create Staff"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStaff;