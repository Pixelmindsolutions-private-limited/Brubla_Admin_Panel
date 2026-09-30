import { useState, useEffect, useCallback } from "react";
import {
  Bell, Plus, Edit3, Trash2, Power, RefreshCw, X, Check,
  AlertTriangle, Loader2, Eye, EyeOff, Sparkles,
} from "lucide-react";
import { apiFetch } from "../config";

// =================================================================
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [sectionActive, setSectionActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formText, setFormText] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // ---------- Flash ----------
  const flash = (msg, type = "success") => {
    if (type === "success") {
      setSuccess(msg);
      setTimeout(() => setSuccess(""), 2500);
    } else {
      setError(msg);
      setTimeout(() => setError(""), 3500);
    }
  };

  // ---------- Load ----------
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch("/notificationlabels");
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to load notifications");
      }

      const payload = data.data || data;
      setNotifications(payload.notifications || []);
      setSectionActive(
        typeof payload.isActive === "boolean" ? payload.isActive : true
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- Modal ----------
  const openCreate = () => {
    setEditingId(null);
    setFormText("");
    setShowModal(true);
  };

  const openEdit = (n) => {
    setEditingId(n._id);
    setFormText(n.text);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormText("");
  };

  // ---------- Save ----------
  const handleSave = async (e) => {
    e?.preventDefault();
    if (!formText.trim()) {
      flash("Notification text is required", "error");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        // ---------- UPDATE ----------
        const res = await apiFetch(`/notificationlabels/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ text: formText.trim() }),
        });
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Failed to update");
        }
        setNotifications((list) =>
          list.map((n) =>
            n._id === editingId ? { ...n, text: formText.trim() } : n
          )
        );
        flash("Notification updated");
      } else {
        // ---------- CREATE — array of strings ✅ ----------
        const res = await apiFetch(`/notificationlabels`, {
          method: "POST",
          body: JSON.stringify({
            notifications: [formText.trim()],
          }),
        });
        const data = await res.json();
        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Failed to create");
        }
        await load();
        flash("Notification added");
      }

      closeModal();
    } catch (err) {
      flash(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Toggle one ----------
  const toggleOne = async (n) => {
    try {
      setTogglingId(n._id);
      const res = await apiFetch(`/notificationlabels/${n._id}/toggle`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !n.isActive }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to toggle");
      }
      setNotifications((list) =>
        list.map((x) =>
          x._id === n._id ? { ...x, isActive: !x.isActive } : x
        )
      );
    } catch (err) {
      flash(err.message, "error");
    } finally {
      setTogglingId(null);
    }
  };

  // ---------- Toggle section ----------
  const toggleSection = async () => {
    try {
      const res = await apiFetch(`/notificationlabels/toggle-section`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !sectionActive }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to toggle section");
      }
      setSectionActive((s) => !s);
      flash(!sectionActive ? "Section enabled" : "Section disabled");
    } catch (err) {
      flash(err.message, "error");
    }
  };

  // ---------- Delete ----------
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await apiFetch(
        `/notificationlabels/${deleteTarget._id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to delete");
      }
      setNotifications((list) =>
        list.filter((n) => n._id !== deleteTarget._id)
      );
      flash("Notification deleted");
      setDeleteTarget(null);
    } catch (err) {
      flash(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  // =================================================================
  return (
    <div className="space-y-6 pb-10 text-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Bell className="text-[#C026D3]" size={26} />
            Notification Labels
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Scrolling messages shown on the storefront top bar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={toggleSection}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
              sectionActive
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                : "bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
            }`}
            title={sectionActive ? "Disable section" : "Enable section"}
          >
            <Power size={14} />
            {sectionActive ? "Section ON" : "Section OFF"}
          </button>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white text-sm font-semibold hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add Label
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm flex items-center gap-2">
          <Check size={16} />
          {success}
        </div>
      )}

      {!sectionActive && (
        <div className="px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm flex items-center gap-2">
          <EyeOff size={16} />
          Notification section is currently <b>disabled</b>. It won't show
          on the storefront until re-enabled.
        </div>
      )}

      {/* List */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#94A3B8] text-sm flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-[#94A3B8] text-sm">
            <Sparkles size={32} className="mx-auto mb-3 text-[#64748B]" />
            No notification labels yet.
            <br />
            Click <b className="text-white">Add Label</b> to create one.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((n, idx) => (
              <div
                key={n._id}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-[#94A3B8] flex-shrink-0">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      n.isActive
                        ? "text-white"
                        : "text-[#64748B] line-through"
                    }`}
                  >
                    {n.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        n.isActive
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/10 text-red-300 border-red-500/30"
                      }`}
                    >
                      {n.isActive ? "Active" : "Disabled"}
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      ID: {n._id.slice(-6)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(n)}
                    className="p-2 rounded-lg bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                  </button>

                  <button
                    disabled={togglingId === n._id}
                    onClick={() => toggleOne(n)}
                    className={`p-2 rounded-lg transition-all disabled:opacity-40 ${
                      n.isActive
                        ? "bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20"
                        : "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                    }`}
                    title={n.isActive ? "Disable" : "Enable"}
                  >
                    {togglingId === n._id ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Power size={15} />
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteTarget(n)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 text-xs text-[#94A3B8] flex items-start gap-3">
        <Eye size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-300 font-semibold mb-1">
            Where do these appear?
          </p>
          <p>
            These labels appear as a scrolling ticker at the top of your
            storefront. Order matters — the first label appears first in
            the rotation.
          </p>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#071236] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Label" : "Add Notification Label"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Label Text <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="e.g. 🎉 Winter Collection 2026 is here"
                  rows={3}
                  autoFocus
                  maxLength={120}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 resize-none"
                />
                <p className="text-xs text-[#64748B] mt-1">
                  {formText.length}/120 characters
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formText.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      {editingId ? "Save Changes" : "Add Label"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#071236] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">
                Delete Notification?
              </h3>
            </div>
            <p className="text-sm text-[#94A3B8]">
              Are you sure you want to delete{" "}
              <span className="text-white font-semibold">
                "{deleteTarget.text}"
              </span>
              ? This cannot be undone.
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
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;