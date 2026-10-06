import { useState, useEffect, useRef } from "react";
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
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

// ============ REUSABLE IMAGE URL CLEANER ============
const cleanImageUrl = (value) => {
  if (!value) return "";

  // Handle markdown-style: [https://x.com/images.jpg](https://x.com/images.jpg)
  const markdownMatch = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

  if (markdownMatch) {
    return markdownMatch[2];
  }

  return value.trim();
};

// Placeholder for broken images
const PLACEHOLDER_IMG =
  "https://placehold.co/1200x400/1a1a2e/94A3B8?text=No+Image";

const ExclusiveSection = () => {
  // ============ Single object state ============
  const [exclusive, setExclusive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ============ Modal state ============
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    tag: "",
    title: "",
    description: "",
    images: "",
    redirectionLink: "",
    isActive: true,
  });

  // Image file + preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const [formErrors, setFormErrors] = useState({});

  const getToken = () =>
    localStorage.getItem("staffToken") ||
    sessionStorage.getItem("adminToken");

  // ============ Fetch Exclusive ============
  const fetchExclusive = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const res = await axios.get(`http://31.97.228.17:4077/api/homepage/exclusive`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const data = res.data.data || null;

        // ✅ Clean images URL on fetch too (in case backend sends markdown)
        if (data) {
          data.images = (Array.isArray(data.images) ? data.images : [data.images || data.img])
            .filter(Boolean)
            .map(cleanImageUrl);
        }

        setExclusive(data);
      } else {
        setExclusive(null);
      }
    } catch (err) {
      // If 404 — no exclusive section exists yet
      if (err.response?.status === 404) {
        setExclusive(null);
      } else {
        console.error("Fetch exclusive error:", err);
        Swal.fire({
          title: "Error!",
          text:
            err.response?.data?.message ||
            "Failed to fetch exclusive section",
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
    fetchExclusive();
  }, []);

  // ============ Modal Helpers ============
  const openAddModal = () => {
    setEditing(false);
    setFormData({
      tag: "",
      title: "",
      description: "",
      images: "",
      redirectionLink: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = () => {
    setEditing(true);

    // ✅ CLEAN IMAGE URL before storing in form + preview
    const cleanimages = cleanImageUrl(
      exclusive?.images?.[0] || exclusive?.images || exclusive?.img,
    );

    setFormData({
      tag: exclusive?.tag || "",
      title: exclusive?.title || "",
      description: exclusive?.description || "",
      images: cleanimages,
      redirectionLink: exclusive?.redirectionLink || "",
      isActive: exclusive?.isActive ?? true,
    });
    setImageFile(null);
    setImagePreview(cleanimages);
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(false);
    setFormData({
      tag: "",
      title: "",
      description: "",
      images: "",
      redirectionLink: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setFormErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ============ Handlers ============
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, images: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ============ Validation ============
  const validate = () => {
    const errors = {};
    if (!formData.tag.trim()) errors.tag = "Tag is required";
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!imageFile && !formData.images && !imagePreview)
      errors.images = "Image is required";
    if (!formData.redirectionLink.trim())
      errors.redirectionLink = "Redirection link is required";

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

      const submitData = new FormData();
      submitData.append("tag", formData.tag.trim());
      submitData.append("title", formData.title.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("redirectionLink", formData.redirectionLink.trim());
      submitData.append("isActive", formData.isActive ? "true" : "false");

      // ✅ If new file uploaded → send File
      // ✅ Else → send cleaned existing URL (NOT markdown)
      if (imageFile) {
        submitData.append("images", imageFile);
      } else if (formData.images) {
        submitData.append("images", cleanImageUrl(formData.images));
      }

      let res;
      if (editing) {
        res = await axios.put(`${API}/exclusive/`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        res = await axios.post(`${API}/exclusive/`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (res.data.success) {
        const data = res.data.data || null;

        // ✅ Clean the images on response too
        if (data) {
          data.images = (Array.isArray(data.images) ? data.images : [data.images || data.img])
            .filter(Boolean)
            .map(cleanImageUrl);
        }

        setExclusive(data);

        Swal.fire({
          title: "Success!",
          text: `Exclusive section ${
            editing ? "updated" : "created"
          } successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });

        closeModal();
        fetchExclusive();
      }
    } catch (err) {
      console.error("Save exclusive error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          `Failed to ${editing ? "update" : "create"} exclusive section`,
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
      title: "Delete Exclusive Section?",
      text: "Are you sure you want to delete the exclusive section?",
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

      const res = await axios.delete(`${API}/exclusive/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setExclusive(null);

        Swal.fire({
          title: "Deleted!",
          text: "Exclusive section deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Delete exclusive error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          "Failed to delete exclusive section",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      {/* ============ Header ============ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles size={28} className="text-[#C026D3]" />
            Exclusive Section
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage your homepage exclusive section
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchExclusive}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          {!loading && !exclusive && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
            >
              <Plus size={16} /> Add Exclusive
            </button>
          )}
        </div>
      </div>

      {/* ============ Content ============ */}
      {loading ? (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 flex justify-center items-center py-20">
          <Loader2 size={32} className="text-[#C026D3] animate-spin" />
        </div>
      ) : !exclusive ? (
        // ============ EMPTY STATE ============
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 py-20 text-center">
          <AlertCircle size={56} className="text-[#94A3B8] mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">
            No exclusive section yet
          </p>
          <p className="text-[#94A3B8] text-sm mt-2">
            Click 'Add Exclusive' to create your homepage exclusive section.
          </p>
          <button
            onClick={openAddModal}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add Exclusive
          </button>
        </div>
      ) : (
        // ============ EXCLUSIVE CARD ============
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          {/* Image Section */}
          <div className="relative h-64 md:h-80 bg-black/30">
            {exclusive.images?.[0] ? (
              <img
                // ✅ CLEAN URL before rendering
                src={cleanImageUrl(exclusive.images[0])}
                alt={exclusive.title || "Exclusive"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMG;
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8]">
                <ImageIcon size={48} />
                <p className="mt-2 text-sm">No image</p>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {exclusive.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                  <CheckCircle size={12} /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/30 text-red-300 border border-red-500/40 backdrop-blur-md">
                  <XCircle size={12} /> Inactive
                </span>
              )}
            </div>

            {/* Tag Badge */}
            {exclusive.tag && (
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#C026D3]/40 text-white border border-[#C026D3]/50 backdrop-blur-md">
                  <Tag size={12} /> {exclusive.tag}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {exclusive.title || "Untitled"}
            </h2>

            <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed mb-6">
              {exclusive.description || "No description provided."}
            </p>

            {exclusive.redirectionLink && (
              <div className="flex items-center gap-2 text-sm text-[#94A3B8] mb-6 p-3 rounded-xl bg-white/5 border border-white/10">
                <LinkIcon size={16} className="text-[#C026D3] shrink-0" />
                <span className="font-mono break-all">
                  {exclusive.redirectionLink}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-[#94A3B8] mb-6 pb-6 border-b border-white/10">
              {exclusive.createdAt && (
                <span>
                  Created:{" "}
                  {new Date(exclusive.createdAt).toLocaleDateString()}
                </span>
              )}
              {exclusive.updatedAt && (
                <span>
                  Updated:{" "}
                  {new Date(exclusive.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
          <div className="bg-[#071236] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#071236] z-10 flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editing ? "Edit Exclusive Section" : "Add Exclusive Section"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-[#94A3B8]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Image *
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <img
                      // ✅ CLEAN URL before rendering preview
                      src={cleanImageUrl(imagePreview)}
                      alt="Preview"
                      className="w-full h-48 rounded-xl object-cover border border-white/10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMG;
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-white/20 hover:border-[#C026D3]/50 bg-white/5 cursor-pointer transition-all">
                    <Upload size={24} className="text-[#C026D3] mb-2" />
                    <p className="text-sm text-white font-medium">
                      Click to upload image
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      PNG, JPG, JPEG (max 5MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                {formErrors.images && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.images}
                  </p>
                )}
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Tag *
                </label>
                <div className="relative">
                  <Tag
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  />
                  <input
                    type="text"
                    name="tag"
                    value={formData.tag}
                    onChange={handleChange}
                    placeholder="e.g., Exclusive"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                      formErrors.tag
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-[#C026D3]/50"
                    }`}
                  />
                </div>
                {formErrors.tag && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.tag}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Title *
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
                    placeholder="e.g., Premium Collection"
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

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe your exclusive section..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all resize-none ${
                    formErrors.description
                      ? "border-red-500/50"
                      : "border-white/10 focus:border-[#C026D3]/50"
                  }`}
                />
                {formErrors.description && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Redirection Link */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Redirection Link *
                </label>
                <div className="relative">
                  <LinkIcon
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  />
                  <input
                    type="text"
                    name="redirectionLink"
                    value={formData.redirectionLink}
                    onChange={handleChange}
                    placeholder="e.g., /exclusive"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                      formErrors.redirectionLink
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-[#C026D3]/50"
                    }`}
                  />
                </div>
                {formErrors.redirectionLink && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.redirectionLink}
                  </p>
                )}
              </div>

              {/* Active Toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
                  />
                  <span className="text-white text-sm font-medium">
                    Mark as Active
                  </span>
                </label>
              </div>

              {/* Modal Actions */}
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

export default ExclusiveSection;
