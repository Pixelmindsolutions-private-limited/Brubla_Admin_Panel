import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Phone,
  Mail,
  Building2,
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

const ContactDetails = () => {
  // ============ Single object state ============
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ============ Modal state ============
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    mobileNumber: "",
    email: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const getToken = () =>
    localStorage.getItem("staffToken") ||
    sessionStorage.getItem("adminToken");

  // ============ Fetch Single Contact ============
  const fetchContact = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/contact-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // ✅ Store res.data.data directly (single object)
        setContact(res.data.data || null);
      } else {
        setContact(null);
      }
    } catch (err) {
      // If 404 — no contact exists yet
      if (err.response?.status === 404) {
        setContact(null);
      } else {
        console.error("Fetch contact error:", err);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to fetch contact details",
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
    fetchContact();
  }, []);

  // ============ Modal Helpers ============
  const openAddModal = () => {
    setEditing(false);
    setFormData({
      companyName: "",
      mobileNumber: "",
      email: "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = () => {
    setEditing(true);
    setFormData({
      companyName: contact?.companyName || "",
      mobileNumber: contact?.mobileNumber || "",
      email: contact?.email || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(false);
    setFormData({ companyName: "", mobileNumber: "", email: "" });
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

    // Company Name
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    }

    // Mobile Number
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }

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
        companyName: formData.companyName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email.trim().toLowerCase(),
      };

      let res;
      if (editing && contact?._id) {
        // ✅ UPDATE — single record
        res = await axios.put(
          `${API}/contact-details/${contact._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // ✅ CREATE — single record
        res = await axios.post(`${API}/contact-details`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (res.data.success) {
        // Update state with response data directly
        setContact(res.data.data || null);

        Swal.fire({
          title: "Success!",
          text: `Contact details ${editing ? "updated" : "added"} successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });

        closeModal();
        // No page reload — state already updated
      }
    } catch (err) {
      console.error("Save contact error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          `Failed to ${editing ? "update" : "add"} contact details`,
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
    if (!contact?._id) return;

    const result = await Swal.fire({
      title: "Delete Contact Details?",
      text: "Are you sure you want to delete these contact details?",
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

      const res = await axios.delete(
        `${API}/contact-details/${contact._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setContact(null);

        Swal.fire({
          title: "Deleted!",
          text: "Contact details deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Delete contact error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message || "Failed to delete contact details",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      {/* ============ Header ============ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Phone size={28} className="text-[#C026D3]" />
            Contact Details
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage your company contact information
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchContact}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* Show Add button only if no contact exists */}
          {!loading && !contact && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
            >
              <Plus size={16} /> Add Contact Details
            </button>
          )}
        </div>
      </div>

      {/* ============ Content ============ */}
      {loading ? (
        // Loading
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 flex justify-center items-center py-20">
          <Loader2 size={32} className="text-[#C026D3] animate-spin" />
        </div>
      ) : !contact ? (
        // Empty state
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 py-20 text-center">
          <AlertCircle size={56} className="text-[#94A3B8] mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">
            No contact details yet
          </p>
          <p className="text-[#94A3B8] text-sm mt-2">
            Click 'Add Contact Details' to add your company contact information.
          </p>
          <button
            onClick={openAddModal}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add Contact Details
          </button>
        </div>
      ) : (
        // Contact exists — single card
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8">
          {/* Company Header */}
          <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-[#C026D3]/20 flex items-center justify-center text-[#C026D3] shrink-0">
              <Building2 size={28} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">
                Company
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-white break-words">
                {contact.companyName || "Unnamed Company"}
              </h2>
            </div>
          </div>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Mobile */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 flex items-center justify-center text-[#2563EB] shrink-0">
                <Phone size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">
                  Mobile Number
                </p>
                <p className="text-white font-medium break-all">
                  {contact.mobileNumber || "—"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C026D3]/20 flex items-center justify-center text-[#C026D3] shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">
                  Email
                </p>
                <p className="text-white font-medium break-all">
                  {contact.email || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
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
      )}

      {/* ============ Modal (Add / Edit) ============ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#071236] border border-white/10 rounded-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editing ? "Edit Contact Details" : "Add Contact Details"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-[#94A3B8]" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g., PixelMind Solutions"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                      formErrors.companyName
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-[#C026D3]/50"
                    }`}
                  />
                </div>
                {formErrors.companyName && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.companyName}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  />
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="9876543210"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                      formErrors.mobileNumber
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-[#C026D3]/50"
                    }`}
                  />
                </div>
                {formErrors.mobileNumber && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.mobileNumber}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email *
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
                    placeholder="info@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                      formErrors.email
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-[#C026D3]/50"
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.email}
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
                      {editing ? "Update" : "Add"}
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

export default ContactDetails;