import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  MessageSquare,
  Camera,
  Music2,
  Eye,

} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

// ============ Social Media Options ============
const SOCIAL_OPTIONS = [
  { value: "instagram", label: "Instagram", icon: Camera },
  { value: "facebook", label: "Facebook", icon: FaFacebookF },
  { value: "pinterest", label: "Pinterest", icon: MessageSquare },
  { value: "youtube", label: "YouTube", icon: FaYoutube },
  { value: "twitter", label: "Twitter", icon: FaTwitter },
  { value: "linkedin", label: "LinkedIn", icon: FaLinkedinIn },
  { value: "tiktok", label: "TikTok", icon: Music2 },
];

const getSocialIcon = (type) => {
  const found = SOCIAL_OPTIONS.find((s) => s.value === type?.toLowerCase());
  return found ? found.icon : MessageSquare;
};

// ============ Initial Form ============
const initialForm = {
  description: "",
  socialMedia: [{ type: "instagram", link: "" }],
};

const FooterManagement = () => {
  // ============ State ============
  const [formData, setFormData] = useState(initialForm);
  const [footerId, setFooterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const getToken = () =>
    localStorage.getItem("staffToken") ||
    sessionStorage.getItem("adminToken");

  // ============ Fetch Footer ============
  const fetchFooter = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/footer`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        let footer = res.data.data;
        if (Array.isArray(footer)) {
          footer = footer[0] || null;
        }

        if (footer) {
          setFooterId(footer._id);
          setFormData({
            description: Array.isArray(footer.description)
              ? footer.description.filter(Boolean).join(" ")
              : footer.description || "",
            socialMedia:
              footer.socialMedia?.length > 0
                ? footer.socialMedia
                : [{ type: "instagram", link: "" }],
          });
        } else {
          setFooterId(null);
          setFormData(initialForm);
        }
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setFooterId(null);
        setFormData(initialForm);
      } else {
        console.error("Fetch footer error:", err);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to fetch footer",
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
    fetchFooter();
  }, []);

  // ============ Description Handler ============
  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
    if (formErrors.description) {
      setFormErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  // ============ Social Media Handlers ============
  const handleSocialChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
    const errorKeys = [`social_${index}_type`, `social_${index}_link`];
    setFormErrors((prev) => {
      const updated = { ...prev };
      errorKeys.forEach((k) => delete updated[k]);
      return updated;
    });
  };

  const addSocialMedia = () => {
    setFormData((prev) => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { type: "instagram", link: "" }],
    }));
  };

  const removeSocialMedia = (index) => {
    if (formData.socialMedia.length === 1) {
      Swal.fire({
        title: "Cannot Remove",
        text: "At least one social media link is required",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index),
    }));
  };

  // ============ Validation ============
  const validate = () => {
    const errors = {};

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    const usedTypes = new Set();
    formData.socialMedia.forEach((s, i) => {
      if (!s.type) errors[`social_${i}_type`] = "Type is required";
      if (!s.link.trim()) {
        errors[`social_${i}_link`] = "Link is required";
      } else {
        try {
          new URL(s.link);
        } catch {
          errors[`social_${i}_link`] = "Enter a valid URL";
        }
      }
      if (s.type && usedTypes.has(s.type)) {
        errors[`social_${i}_type`] = "Duplicate type";
      }
      if (s.type) usedTypes.add(s.type);
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============ Submit ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const token = getToken();

      const cleanedDescription = formData.description.trim();

      const cleanedSocial = formData.socialMedia
        .filter((s) => s.type && s.link.trim())
        .map((s) => ({
          type: s.type.toLowerCase(),
          link: s.link.trim(),
        }));

      const payload = {
        // Keep the API's existing array shape while saving one description.
        description: [cleanedDescription],
        socialMedia: cleanedSocial,
      };

      let res;
      if (footerId) {
        res = await axios.put(`${API}/footer/${footerId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        res = await axios.post(`${API}/footer`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (res.data.success) {
        const data = res.data.data;
        if (!footerId && data?._id) setFooterId(data._id);

        Swal.fire({
          title: "Success!",
          text: `Footer ${footerId ? "updated" : "created"} successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Save footer error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          `Failed to ${footerId ? "update" : "create"} footer`,
        icon: "error",
        background: "#071236",
        color: "#FFF",
        confirmButtonColor: "#C026D3",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============ Delete Footer ============
  const handleDeleteFooter = async () => {
    if (!footerId) return;

    const result = await Swal.fire({
      title: "Delete Footer?",
      text: "Are you sure you want to delete the entire footer? This action cannot be undone.",
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
      const res = await axios.delete(`${API}/footer/${footerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setFooterId(null);
        setFormData(initialForm);
        setFormErrors({});
        Swal.fire({
          title: "Deleted!",
          text: "Footer deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Delete footer error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to delete footer",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={32} className="text-[#C026D3] animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all text-sm";

  // Cleaned data for preview
  const previewDescription = formData.description.trim();
  const previewSocial = formData.socialMedia.filter(
    (s) => s.type && s.link.trim()
  );

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      {/* ============ Header ============ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <MessageSquare size={28} className="text-[#C026D3]" />
            Footer Management
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage footer description and social media links
          </p>
        </div>

        <button
          onClick={fetchFooter}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============ Description Section ============ */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
              <MessageSquare size={16} /> FOOTER DESCRIPTION
            </h2>
          </div>

          <textarea
            value={formData.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter the footer description"
            rows={3}
            className={`${inputClass} resize-y ${
              formErrors.description ? "border-red-500/50" : "border-white/10"
            }`}
          />
          {formErrors.description && (
            <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>
          )}
        </div>

        {/* ============ Social Media Section ============ */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
              <Camera size={16} /> SOCIAL MEDIA LINKS
            </h2>
            <button
              type="button"
              onClick={addSocialMedia}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30 transition-all"
            >
              <Plus size={14} /> Add Social Media
            </button>
          </div>

          <div className="space-y-4">
            {formData.socialMedia.map((social, idx) => {
              const Icon = getSocialIcon(social.type);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#C026D3]/20 flex items-center justify-center text-[#C026D3]">
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-bold text-white/60">
                        Social #{idx + 1}
                      </span>
                    </div>
                    {formData.socialMedia.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSocialMedia(idx)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                        Type *
                      </label>
                      <select
                        value={social.type}
                        onChange={(e) =>
                          handleSocialChange(idx, "type", e.target.value)
                        }
                        className={`w-full px-3 py-2 rounded-lg bg-[#071236]/50 border text-white text-sm focus:outline-none transition-all cursor-pointer ${
                          formErrors[`social_${idx}_type`]
                            ? "border-red-500/50"
                            : "border-white/10 focus:border-[#C026D3]/50"
                        }`}
                      >
                        {SOCIAL_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {formErrors[`social_${idx}_type`] && (
                        <p className="text-red-400 text-xs mt-1">
                          {formErrors[`social_${idx}_type`]}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                        Link *
                      </label>
                      <input
                        type="url"
                        value={social.link}
                        onChange={(e) =>
                          handleSocialChange(idx, "link", e.target.value)
                        }
                        placeholder="https://instagram.com/yourbrand"
                        className={`w-full px-3 py-2 rounded-lg bg-[#071236]/50 border text-white text-sm placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                          formErrors[`social_${idx}_link`]
                            ? "border-red-500/50"
                            : "border-white/10 focus:border-[#C026D3]/50"
                        }`}
                      />
                      {formErrors[`social_${idx}_link`] && (
                        <p className="text-red-400 text-xs mt-1">
                          {formErrors[`social_${idx}_link`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ LIVE PREVIEW ============ */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2 mb-4">
            <Eye size={16} /> LIVE PREVIEW (Public Footer)
          </h2>

          {/* Preview Box - Public Style */}
          <div className="bg-[#0a0a0a] rounded-xl p-8 md:p-10 border border-white/5">
            <div className="max-w-4xl mx-auto">
              {/* Description */}
              {previewDescription && (
                <div className="mb-8">
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    {previewDescription}
                  </p>
                </div>
              )}

              {/* Social Media Icons */}
              {previewSocial.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {previewSocial.map((social, idx) => {
                    const Icon = getSocialIcon(social.type);
                    return (
                      <a
                        key={idx}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                        aria-label={social.type}
                        title={social.type}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Empty Preview */}
              {!previewDescription && previewSocial.length === 0 && (
                  <p className="text-gray-600 text-sm italic">
                    Fill the form above to see live preview...
                  </p>
                )}
            </div>
          </div>

          <p className="text-xs text-[#94A3B8] mt-3">
            💡 This is how the footer will appear on the public website
          </p>
        </div>

        {/* ============ Actions ============ */}
        <div className="flex flex-wrap items-center justify-end gap-3 sticky bottom-0 bg-[#071236] py-4 border-t border-white/10">
          {footerId && (
            <button
              type="button"
              onClick={handleDeleteFooter}
              disabled={deleting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-all disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete Footer
                </>
              )}
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {footerId ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {footerId ? "Update Footer" : "Create Footer"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FooterManagement;
