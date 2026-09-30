import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck, Mail, Calendar, RefreshCw, Loader2, AlertTriangle,
  Download, Copy, Check, QrCode, User, Clock, Key, Eye, EyeOff,
  BadgeCheck, Activity, Lock, Settings,
} from "lucide-react";
import { apiFetch } from "../config";

// =================================================================
const AdminEmployeeManagement = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  const [showQr, setShowQr] = useState(true);

  // ---------- Load profile ----------
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch("/profile");
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to load admin profile");
      }
      setAdmin(data.admin || data.data || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- Copy ----------
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
    setSuccess("Copied to clipboard");
    setTimeout(() => setSuccess(""), 1500);
  };

  // ---------- Download QR ----------
  const downloadQr = () => {
    if (!admin?.QRimage) return;
    try {
      const link = document.createElement("a");
      link.href = admin.QRimage;
      link.download = `admin-qr-${admin._id.slice(-6)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccess("QR code downloaded");
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError("Failed to download QR");
    }
  };

  // ---------- Date formatters ----------
  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const formatDateTime = (iso) =>
    iso
      ? new Date(iso).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  // =================================================================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#94A3B8] gap-3">
        <Loader2 size={24} className="animate-spin" />
        <p className="text-sm">Loading admin profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 text-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-[#C026D3]" size={26} />
            Admin & Employee Management
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage your admin profile and access credentials
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
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

      {!admin ? (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center text-[#94A3B8]">
          No admin data available.
        </div>
      ) : (
        <>
          {/* Hero Card */}
          <div
            className="rounded-3xl border border-white/10 p-6 md:p-8 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(192,38,211,0.15) 0%, rgba(37,99,235,0.15) 100%)",
            }}
          >
            <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#C026D3]/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-[#2563EB]/20 blur-3xl" />

            <div className="relative z-10 flex items-center gap-5 flex-wrap">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#C026D3] to-[#2563EB] flex items-center justify-center shadow-2xl flex-shrink-0">
                <User size={36} className="text-white" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-black text-white">
                    Admin
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <BadgeCheck size={10} />
                    VERIFIED
                  </span>
                </div>
                <p className="text-[#94A3B8] text-sm flex items-center gap-1.5 mt-1">
                  <Mail size={13} /> {admin.email}
                </p>
                <p className="text-[#94A3B8] text-xs mt-1">
                  Admin ID:{" "}
                  <span className="text-white font-mono">
                    {admin._id}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Two column: profile info + QR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2 bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-5">
              <h3 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider flex items-center gap-1.5">
                <User size={12} /> Profile Details
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="p-2 rounded-lg bg-[#C026D3]/20 text-[#C026D3] flex-shrink-0">
                    <Mail size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#94A3B8] mb-0.5">
                      Email Address
                    </p>
                    <p className="text-sm text-white font-medium truncate">
                      {admin.email}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(admin.email, "email")
                    }
                    className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors flex-shrink-0"
                    title="Copy"
                  >
                    {copiedField === "email" ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                {/* Admin ID */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="p-2 rounded-lg bg-[#2563EB]/20 text-[#2563EB] flex-shrink-0">
                    <Key size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#94A3B8] mb-0.5">
                      Admin ID
                    </p>
                    <p className="text-sm text-white font-mono truncate">
                      {admin._id}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(admin._id, "id")
                    }
                    className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors flex-shrink-0"
                    title="Copy"
                  >
                    {copiedField === "id" ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                {/* Created */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#94A3B8] mb-0.5">
                      Account Created
                    </p>
                    <p className="text-sm text-white font-medium">
                      {formatDateTime(admin.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Updated */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 flex-shrink-0">
                    <Clock size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#94A3B8] mb-0.5">
                      Last Updated
                    </p>
                    <p className="text-sm text-white font-medium">
                      {formatDateTime(admin.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security note */}
              <div className="pt-4 border-t border-white/10 flex items-start gap-3 text-xs text-[#94A3B8]">
                <Lock
                  size={14}
                  className="text-[#C026D3] flex-shrink-0 mt-0.5"
                />
                <p>
                  Password changes and 2FA setup are handled from the
                  Settings page. This is a read-only view of your admin
                  account.
                </p>
              </div>
            </div>

            {/* QR Code Card */}
            <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 flex flex-col items-center">
              <h3 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider flex items-center gap-1.5 mb-4 self-start">
                <QrCode size={12} /> Admin QR Code
              </h3>

              {admin.QRimage ? (
                <>
                  <div className="bg-white rounded-2xl p-3 shadow-2xl">
                    <img
                      src={admin.QRimage}
                      alt="Admin QR"
                      className="w-52 h-52 object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  <p className="text-xs text-[#94A3B8] text-center mt-4">
                    Scan this QR to quickly access your admin account
                  </p>

                  <div className="flex gap-2 mt-5 w-full">
                    <button
                      onClick={() => setShowQr((s) => !s)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all"
                    >
                      {showQr ? (
                        <>
                          <EyeOff size={12} /> Hide
                        </>
                      ) : (
                        <>
                          <Eye size={12} /> Show
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadQr}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white text-xs font-semibold hover:shadow-lg transition-all"
                    >
                      <Download size={12} /> Download
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-52 h-52 rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center text-[#94A3B8] gap-2">
                  <QrCode size={28} />
                  <p className="text-xs">No QR generated</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Role",
                value: "Admin",
                icon: ShieldCheck,
                color: "text-[#C026D3]",
                bg: "from-fuchsia-500/20 to-purple-500/20",
              },
              {
                label: "Status",
                value: "Active",
                icon: BadgeCheck,
                color: "text-emerald-400",
                bg: "from-emerald-500/20 to-teal-500/20",
              },
              {
                label: "Access Level",
                value: "Full",
                icon: Key,
                color: "text-blue-400",
                bg: "from-blue-500/20 to-cyan-500/20",
              },
              {
                label: "2FA",
                value: "Disabled",
                icon: Lock,
                color: "text-yellow-400",
                bg: "from-yellow-500/20 to-orange-500/20",
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#94A3B8] text-xs font-medium">
                    {label}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bg} flex items-center justify-center`}
                  >
                    <Icon size={14} className={color} />
                  </div>
                </div>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Activity Timeline */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider flex items-center gap-1.5 mb-5">
              <Activity size={12} /> Account Timeline
            </h3>

            <div className="space-y-4 relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-white/10" />

              {[
                {
                  label: "Account created",
                  date: formatDateTime(admin.createdAt),
                  color: "bg-emerald-500",
                  text: "text-emerald-400",
                },
                {
                  label: "Last profile update",
                  date: formatDateTime(admin.updatedAt),
                  color: "bg-blue-500",
                  text: "text-blue-400",
                },
                {
                  label: "Currently active",
                  date: "Now",
                  color: "bg-[#C026D3] animate-pulse",
                  text: "text-[#C026D3]",
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 relative z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center flex-shrink-0 ring-4 ring-[#071236]`}
                  >
                    <Check size={14} className="text-white" />
                  </div>
                  <div className="pt-2">
                    <p
                      className={`text-sm font-semibold ${step.text}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      {step.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings CTA */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <Settings size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Need to change password or enable 2FA?
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Visit the Settings page to update security preferences.
                </p>
              </div>
            </div>
            <a
              href="/dashboard/settings"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-semibold transition-all"
            >
              Go to Settings →
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEmployeeManagement;