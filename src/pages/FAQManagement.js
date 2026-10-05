import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  MessageSquare,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

// ============ Type Options (from screenshot) ============
const TYPE_OPTIONS = [
  "All",
  "Orders & Shipping",
  "Returns & Exchange",
  "Payments",
  "Account & Offers",
  "Partners",
];

const FAQManagement = () => {
  // ============ State ============
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const [formData, setFormData] = useState({
    tag: "FAQ",
    title: "",
    description: "",
    questions: [
      { type: "Orders & Shipping", question: "", description: "" },
    ],
  });

  const [formErrors, setFormErrors] = useState({});

  const getToken = () =>
    localStorage.getItem("staffToken") ||
    sessionStorage.getItem("adminToken");

  // ============ Fetch All FAQs ============
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const res = await axios.get(`${API}/faq`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const records = Array.isArray(res.data.data)
          ? res.data.data
          : res.data.data
            ? [res.data.data]
            : [];
        if (records.length) {
          const canonicalFAQ =
            records.find(
              (faq) =>
                faq.title?.trim().toLowerCase() === "frequently asked questions" ||
                faq.tag?.trim().toLowerCase() === "faq",
            ) || records[0];
          const mergedQuestions = records.flatMap((faq) => faq.questions || []);
          setFaqs([{ ...canonicalFAQ, questions: mergedQuestions }]);
        } else {
          setFaqs([]);
        }
      }
    } catch (err) {
      console.error("Fetch FAQs error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to fetch FAQs",
        icon: "error",
        background: "#071236",
        color: "#FFF",
        confirmButtonColor: "#C026D3",
      });
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // ============ Modal Helpers ============
  const openCreateModal = () => {
    setEditingFaq(null);
    setFormData({
      tag: "FAQ",
      title: "",
      description: "",
      questions: [
        { type: "Orders & Shipping", question: "", description: "" },
      ],
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);

    // Preserve existing question _id when editing
    const preparedQuestions = (faq.questions || []).map((q) => ({
      _id: q._id,
      type: q.type || "Orders & Shipping",
      question: q.question || "",
      description: q.description || "",
    }));

    setFormData({
      tag: faq.tag || "FAQ",
      title: faq.title || "",
      description: faq.description || "",
      questions:
        preparedQuestions.length > 0
          ? preparedQuestions
          : [
              {
                type: "Orders & Shipping",
                question: "",
                description: "",
              },
            ],
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFaq(null);
    setFormData({
      tag: "FAQ",
      title: "",
      description: "",
      questions: [
        { type: "Orders & Shipping", question: "", description: "" },
      ],
    });
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

  const handleQuestionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
    const errorKey = `q_${index}_${field}`;
    if (formErrors[errorKey]) {
      setFormErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          type: "Orders & Shipping",
          question: "",
          description: "",
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length === 1) {
      Swal.fire({
        title: "Cannot Remove",
        text: "At least one question is required",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  // ============ Validation ============
  const validate = () => {
    const errors = {};

    if (!formData.tag.trim()) errors.tag = "Tag is required";
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";

    formData.questions.forEach((q, i) => {
      if (!q.type?.trim()) errors[`q_${i}_type`] = "Type is required";
      if (!q.question?.trim())
        errors[`q_${i}_question`] = "Question is required";
      if (!q.description?.trim())
        errors[`q_${i}_description`] = "Description is required";
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

      const payload = {
        tag: formData.tag.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        questions: formData.questions.map((q) => {
          const base = {
            type: q.type.trim(),
            question: q.question.trim(),
            description: q.description.trim(),
          };
          if (q._id) base._id = q._id;
          return base;
        }),
      };

      let res;
      if (editingFaq) {
        res = await axios.put(`${API}/faq/${editingFaq._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        res = await axios.post(`${API}/faq`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: `FAQ ${editingFaq ? "updated" : "created"} successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });

        closeModal();
        fetchFAQs();
      }
    } catch (err) {
      console.error("Save FAQ error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          `Failed to ${editingFaq ? "update" : "create"} FAQ`,
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
  const handleDelete = async (faq) => {
    const result = await Swal.fire({
      title: "Delete FAQ?",
      text: `Are you sure you want to delete "${faq.title}"? This will remove all ${faq.questions?.length || 0} question(s).`,
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
      setDeletingId(faq._id);
      const token = getToken();

      const res = await axios.delete(`${API}/faq/${faq._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Deleted!",
          text: "FAQ deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchFAQs();
      }
    } catch (err) {
      console.error("Delete FAQ error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to delete FAQ",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* ============ Header ============ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <HelpCircle size={28} className="text-[#C026D3]" />
            FAQ Management
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage frequently asked questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchFAQs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          {faqs.length === 0 && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
            >
              <Plus size={16} /> Add FAQ
            </button>
          )}
        </div>
      </div>

      {/* ============ Content ============ */}
      {loading ? (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 flex justify-center items-center py-20">
          <Loader2 size={32} className="text-[#C026D3] animate-spin" />
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 py-20 text-center">
          <HelpCircle size={56} className="text-[#94A3B8] mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">No FAQs found</p>
          <p className="text-[#94A3B8] text-sm mt-2">
            Click 'Add FAQ' to create your first FAQ section.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add FAQ
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {faqs.map((faq) => {
            const isExpanded = expandedFaq === faq._id;

            return (
              <div
                key={faq._id}
                className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-[#C026D3]/30 transition-all"
              >
                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {faq.tag && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#C026D3]/20 text-[#C026D3] border border-[#C026D3]/30 mb-2">
                          <Tag size={10} /> {faq.tag}
                        </span>
                      )}

                      <h2 className="text-xl font-bold text-white mb-2">
                        {faq.title || "Untitled FAQ"}
                      </h2>

                      <p className="text-[#94A3B8] text-sm">
                        {faq.description || "No description"}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-[#94A3B8]">
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} />
                          {faq.questions?.length || 0} question(s)
                        </span>
                        {faq.createdAt && (
                          <span>
                            Created:{" "}
                            {new Date(faq.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setExpandedFaq(isExpanded ? null : faq._id)
                        }
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all"
                        title={isExpanded ? "Collapse" : "Expand"}
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>

                      <button
                        onClick={() => openEditModal(faq)}
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(faq)}
                        disabled={deletingId === faq._id}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === faq._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/10 bg-black/20">
                    {faq.questions && faq.questions.length > 0 ? (
                      <div className="p-5 md:p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-[#C026D3] uppercase tracking-wider">
                          Questions ({faq.questions.length})
                        </h3>

                        {faq.questions.map((q, idx) => (
                          <div
                            key={q._id || idx}
                            className="p-4 rounded-xl bg-white/5 border border-white/10"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-lg bg-[#C026D3]/20 flex items-center justify-center text-[#C026D3] shrink-0 text-xs font-bold">
                                {idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                {q.type && (
                                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/30 mb-2">
                                    {q.type}
                                  </span>
                                )}

                                <p className="text-white font-semibold mb-2">
                                  {q.question || "Untitled question"}
                                </p>

                                <p className="text-[#94A3B8] text-sm leading-relaxed">
                                  {q.description || "No answer provided"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-[#94A3B8] text-sm">
                        No questions added yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ============ MODAL (Create / Edit) ============ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#071236] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#071236] z-10 flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-[#94A3B8]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* FAQ Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider">
                  FAQ Details
                </h3>

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
                      placeholder="e.g., FAQ"
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
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Frequently Asked Questions"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                      formErrors.title
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-[#C026D3]/50"
                    }`}
                  />
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
                    rows="2"
                    placeholder="Find answers to common questions."
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
              </div>

              {/* Questions */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider">
                    Questions ({formData.questions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30 transition-all"
                  >
                    <Plus size={14} /> Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white/60">
                          Question #{idx + 1}
                        </span>
                        {formData.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(idx)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {/* Type — DROPDOWN */}
                      <div>
                        <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                          Type *
                        </label>
                        <select
                          value={q.type}
                          onChange={(e) =>
                            handleQuestionChange(idx, "type", e.target.value)
                          }
                          className={`w-full px-3 py-2 rounded-lg bg-[#071236]/50 border text-white text-sm focus:outline-none transition-all cursor-pointer ${
                            formErrors[`q_${idx}_type`]
                              ? "border-red-500/50"
                              : "border-white/10 focus:border-[#C026D3]/50"
                          }`}
                        >
                          <option value="">-- Select Type --</option>
                          {TYPE_OPTIONS.filter((t) => t !== "All").map(
                            (type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            )
                          )}
                        </select>
                        {formErrors[`q_${idx}_type`] && (
                          <p className="text-red-400 text-xs mt-1">
                            {formErrors[`q_${idx}_type`]}
                          </p>
                        )}
                      </div>

                      {/* Question */}
                      <div>
                        <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                          Question *
                        </label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) =>
                            handleQuestionChange(
                              idx,
                              "question",
                              e.target.value
                            )
                          }
                          placeholder="What is Brubla?"
                          className={`w-full px-3 py-2 rounded-lg bg-[#071236]/50 border text-white text-sm placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                            formErrors[`q_${idx}_question`]
                              ? "border-red-500/50"
                              : "border-white/10 focus:border-[#C026D3]/50"
                          }`}
                        />
                        {formErrors[`q_${idx}_question`] && (
                          <p className="text-red-400 text-xs mt-1">
                            {formErrors[`q_${idx}_question`]}
                          </p>
                        )}
                      </div>

                      {/* Answer */}
                      <div>
                        <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                          Answer / Description *
                        </label>
                        <textarea
                          value={q.description}
                          onChange={(e) =>
                            handleQuestionChange(
                              idx,
                              "description",
                              e.target.value
                            )
                          }
                          rows="2"
                          placeholder="Brubla is a platform..."
                          className={`w-full px-3 py-2 rounded-lg bg-[#071236]/50 border text-white text-sm placeholder:text-[#94A3B8] focus:outline-none transition-all resize-none ${
                            formErrors[`q_${idx}_description`]
                              ? "border-red-500/50"
                              : "border-white/10 focus:border-[#C026D3]/50"
                          }`}
                        />
                        {formErrors[`q_${idx}_description`] && (
                          <p className="text-red-400 text-xs mt-1">
                            {formErrors[`q_${idx}_description`]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                      {editingFaq ? "Update" : "Create"}
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

export default FAQManagement;