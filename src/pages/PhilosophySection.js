import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const PhilosophySection = () => {
  // ============ State ============
  const [philosophy, setPhilosophy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ============ Modal State ============
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const getToken = () =>
    localStorage.getItem("staffToken") ||
    sessionStorage.getItem("adminToken");

  // ============ Fetch ============
  const fetchPhilosophy = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const res = await axios.get(`${API}/philosophy`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPhilosophy(res.data.data || null);
      } else {
        setPhilosophy(null);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setPhilosophy(null);
      } else {
        console.error("Fetch philosophy error:", err);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to fetch philosophy",
          icon: "error",
          background: "#071236",
          color: "#FFF",
          confirmButtonColor: "#C026D3",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhilosophy();
  }, []);

  // ============ Modal Helpers ============
  const openAddModal = () => {
    setEditing(false);
    setFormData({ title: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = () => {
    setEditing(true);
    setFormData({ title: philosophy?.title || "" });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(false);
    setFormData({ title: "" });
    setFormErrors({});
  };

  // ============ Handlers ============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ============ Validation ============
  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============ Submit (Create / Update) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const token = getToken();

      const payload = {
        title: formData.title.trim(),
      };

      let res;
      if (editing) {
        // PUT
        res = await axios.put(`${API}/philosophy`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        // POST
        res = await axios.post(`${API}/philosophy`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (res.data.success) {
        setPhilosophy(res.data.data || null);

        Swal.fire({
          title: "Success!",
          text: `Philosophy ${editing ? "updated" : "created"} successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });

        closeModal();
        fetchPhilosophy();
      }
    } catch (err) {
      console.error("Save philosophy error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          `Failed to ${editing ? "update" : "create"} philosophy`,
        icon: "error",
        background: "#071236",
        color: "#FFF",
        confirmButtonColor: "#C026D3",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============ Delete ============
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Philosophy?",
      text: "Are you sure you want to delete the philosophy section?",
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
      setDeleting(true);
      const token = getToken();

      const res = await axios.delete(`${API}/philosophy`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPhilosophy(null);

        Swal.fire({
          title: "Deleted!",
          text: "Philosophy deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Delete philosophy error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message || "Failed to delete philosophy",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setDeleting(false);
    }
  };

  // ============ Loading ============
  if (loading) {
    return (
      <div className="space-y-6 pb-10 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="h-8 w-64 bg-white/5 rounded-xl animate-pulse mb-2" />
            <div className="h-4 w-96 max-w-full bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 py-20 text-center animate-pulse">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 mb-4" />
          <div className="h-8 w-64 mx-auto bg-white/5 rounded mb-3" />
          <div className="h-4 w-96 max-w-full mx-auto bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      {/* ============ Header ============ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles size={28} className="text-[#C026D3]" />
            Philosophy Section
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage your philosophy section title
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPhilosophy}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* Add button only if no philosophy exists */}
          {!philosophy && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
            >
              <Plus size={16} /> Add Philosophy
            </button>
          )}
        </div>
      </div>

      {/* ============ Content ============ */}
      {!philosophy ? (
        // ============ EMPTY STATE ============
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 py-20 text-center">
          <AlertCircle size={56} className="text-[#94A3B8] mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">
            No philosophy section yet
          </p>
          <p className="text-[#94A3B8] text-sm mt-2">
            Click 'Add Philosophy' to create your philosophy section.
          </p>
          <button
            onClick={openAddModal}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add Philosophy
          </button>
        </div>
      ) : (
        // ============ PHILOSOPHY CARD ============
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-12">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C026D3] to-[#2563EB] mb-6 shadow-[0_10px_40px_rgba(192,38,211,0.35)]">
              <Sparkles size={28} className="text-white" />
            </div>

            {/* Dynamic Title */}
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              {philosophy.title || "Philosophy"}
            </h2>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C026D3]" />
              <div className="w-2 h-2 rounded-full bg-[#C026D3]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C026D3]" />
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-[#94A3B8] mb-8">
              {philosophy.createdAt && (
                <span>
                  Created:{" "}
                  {new Date(philosophy.createdAt).toLocaleDateString()}
                </span>
              )}
              {philosophy.updatedAt && (
                <span>
                  Updated:{" "}
                  {new Date(philosophy.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-white/10">
              <button
                onClick={openEditModal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium transition-all"
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-all disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL (Add / Edit) ============ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#071236] border border-white/10 rounded-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editing ? "Edit Philosophy" : "Add Philosophy"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-[#94A3B8]" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Philosophy Title *
                </label>
                <div className="relative">
                  <Sparkles
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Our Philosophy"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                      formErrors.title
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-[#C026D3]/50"
                    }`}
                  />
                </div>
                {formErrors.title && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editing ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhilosophySection;