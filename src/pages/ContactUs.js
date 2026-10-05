import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  RefreshCw,
  AlertCircle,
  Search,
  FileText,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const ContactUs = () => {
  // ============ State ============
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const getToken = () =>
    localStorage.getItem("staffToken") ||
    sessionStorage.getItem("adminToken");

  // ============ Fetch All Contacts ============
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const res = await axios.get(`${API}/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setContacts(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch contacts error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to fetch contacts",
        icon: "error",
        background: "#071236",
        color: "#FFF",
        confirmButtonColor: "#C026D3",
      });
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ============ Modal Helpers ============
  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      fullName: contact.fullName || "",
      email: contact.email || "",
      phone: contact.phone || "",
      subject: contact.subject || "",
      message: contact.message || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
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

  // ============ Validation ============
  const validate = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errors.email = "Enter a valid email address";
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============ Submit (Update Only) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!editingContact?._id) return;

    try {
      setSubmitting(true);
      const token = getToken();

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      // ✅ PUT /api/admin/contact/:id
      const res = await axios.put(
        `${API}/contacts/${editingContact._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Contact updated successfully",
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });

        closeModal();
        fetchContacts();
      }
    } catch (err) {
      console.error("Update contact error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to update contact",
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
  const handleDelete = async (contact) => {
    const result = await Swal.fire({
      title: "Delete Contact?",
      text: `Are you sure you want to delete the contact from "${contact.fullName}"?`,
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
      setDeletingId(contact._id);
      const token = getToken();

      // ✅ DELETE /api/admin/contacts/:id
      const res = await axios.delete(`${API}/contacts/${contact._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Deleted!",
          text: "Contact deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchContacts();
      }
    } catch (err) {
      console.error("Delete contact error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to delete contact",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ============ Filter ============
  const filteredContacts = contacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.subject?.toLowerCase().includes(term) ||
      c.phone?.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6 pb-10">
      {/* ============ Header ============ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <MessageSquare size={28} className="text-[#C026D3]" />
            Contact Us
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage customer inquiries and contact messages
          </p>
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
              placeholder="Search by name, email, subject or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all"
            />
          </div>
          <button
            onClick={fetchContacts}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ============ Content ============ */}
      {loading ? (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 flex justify-center items-center py-20">
          <Loader2 size={32} className="text-[#C026D3] animate-spin" />
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 py-20 text-center">
          <AlertCircle size={56} className="text-[#94A3B8] mx-auto mb-4" />
          <p className="text-white text-lg font-semibold">
            {searchTerm ? "No results found" : "No contact messages yet"}
          </p>
          <p className="text-[#94A3B8] text-sm mt-2">
            {searchTerm
              ? "Try adjusting your search"
              : "Customer inquiries will appear here"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 hover:border-[#C026D3]/30 transition-all flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#C026D3]/20 flex items-center justify-center text-[#C026D3] shrink-0">
                  <User size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold truncate">
                    {contact.fullName || "Unnamed"}
                  </p>
                  <p className="text-[#94A3B8] text-xs truncate">
                    {contact.email || "No email"}
                  </p>
                </div>
              </div>

              {/* Subject */}
              {contact.subject && (
                <div className="mb-3 p-2.5 rounded-lg bg-[#C026D3]/10 border border-[#C026D3]/20">
                  <p className="text-xs text-[#94A3B8] mb-0.5">Subject</p>
                  <p className="text-sm text-white font-medium truncate">
                    {contact.subject}
                  </p>
                </div>
              )}

              {/* Message Preview */}
              {contact.message && (
                <div className="mb-4 flex-1">
                  <div className="flex items-start gap-2 text-sm text-[#94A3B8]">
                    <FileText
                      size={14}
                      className="text-[#C026D3] shrink-0 mt-0.5"
                    />
                    <p className="line-clamp-3">{contact.message}</p>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-2 mb-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Mail size={14} className="text-[#C026D3] shrink-0" />
                  <span className="truncate">
                    {contact.email || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Phone size={14} className="text-[#C026D3] shrink-0" />
                  <span className="truncate">
                    {contact.phone || "—"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => openEditModal(contact)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium transition-all"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(contact)}
                  disabled={deletingId === contact._id}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-all disabled:opacity-50"
                >
                  {deletingId === contact._id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ Modal (Edit Only) ============ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#071236] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#071236] z-10 flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                Edit Contact Message
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
              {/* Full Name */}
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
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                      formErrors.fullName
                        ? "border-red-500/50"
                        : "border-white/10 focus:border-[#C026D3]/50"
                    }`}
                  />
                </div>
                {formErrors.fullName && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="john@example.com"
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

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="General Inquiry"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all ${
                    formErrors.subject
                      ? "border-red-500/50"
                      : "border-white/10 focus:border-[#C026D3]/50"
                  }`}
                />
                {formErrors.subject && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter message..."
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border text-white placeholder:text-[#94A3B8] focus:outline-none transition-all resize-none ${
                    formErrors.message
                      ? "border-red-500/50"
                      : "border-white/10 focus:border-[#C026D3]/50"
                  }`}
                />
                {formErrors.message && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.message}
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
                      Update
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

export default ContactUs;