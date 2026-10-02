import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Package,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Wallet,
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  BadgeCheck,
  Loader2,
  Plus,
  Store,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const SingleDesigner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [designer, setDesigner] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => sessionStorage.getItem("adminToken");

  const fetchDesigner = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(`${API}/designers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const d = response.data.designer || response.data.data;
        setDesigner(d);
      }
    } catch (error) {
      console.error("Error fetching designer:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch designer details",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
        confirmButtonColor: "#C026D3",
      });
      navigate("/dashboard/customers?role=Designer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigner();
  }, [id]);

  const deleteDesigner = async () => {
    const result = await Swal.fire({
      title: "Delete Designer?",
      text: `Are you sure you want to delete ${designer?.name || "this designer"}?`,
      icon: "warning",
      showCancelButton: true,
      background: "#071236",
      color: "#FFFFFF",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = getToken();
        await axios.delete(`${API}/designers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          title: "Deleted!",
          text: "Designer deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/dashboard/customers?role=Designer");
      } catch (error) {
        console.error("Error deleting designer:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete designer",
          icon: "error",
          background: "#071236",
          color: "#FFFFFF",
          confirmButtonColor: "#C026D3",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 text-[#C026D3] animate-spin" />
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="text-center py-20">
        <p className="text-[#94A3B8]">Designer not found</p>
      </div>
    );
  }

  // ===== Wallet =====
  const wallet = designer.wallet || { balance: 0 };

  // ===== Product Stats =====
  const productStats = designer.productStats || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0,
  };

  // ===== Sales =====
  const sales = designer.sales || {
    totalOrders: 0,
    totalItemsSold: 0,
    totalSales: 0,
  };

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/customers?role=Designer")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Designer Details
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">
              View complete designer information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/dashboard/designers/edit/${designer._id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all"
          >
            <Edit size={16} />
            Edit Designer
          </button>

          <button
            onClick={deleteDesigner}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* ========== MAIN GRID ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ========== LEFT COLUMN ========== */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#C026D3] to-[#2563EB] flex items-center justify-center text-white text-3xl font-bold mb-4 overflow-hidden">
                {designer.profileImage ? (
                  <img
                    src={`http://31.97.228.17:4077/${designer.profileImage.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={designer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  designer.name?.charAt(0).toUpperCase() || "D"
                )}
              </div>

              <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                {designer.name || "Unnamed"}
                {designer.isApproved && (
                  <BadgeCheck size={18} className="text-blue-400" />
                )}
              </h2>
              {designer.brandName && (
                <p className="text-[#C026D3] text-sm mt-1 font-medium">
                  {designer.brandName}
                </p>
              )}
              <p className="text-[#94A3B8] text-xs mt-1 font-mono">
                ID: {designer._id?.slice(-8)}
              </p>

              <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                {designer.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                    <CheckCircle size={12} /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400">
                    <XCircle size={12} /> Unverified
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <Mail size={16} className="text-[#C026D3] shrink-0" />
                <span className="text-sm truncate">
                  {designer.email || "No email"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <Phone size={16} className="text-[#C026D3] shrink-0" />
                <span className="text-sm">
                  {designer.mobile || "No mobile"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <Calendar size={16} className="text-[#C026D3] shrink-0" />
                <span className="text-sm">
                  Registered:{" "}
                  {new Date(designer.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Wallet size={16} className="text-[#C026D3]" />
              Wallet Balance
            </h3>
            <p className="text-2xl font-bold text-white">
              ₹{wallet.balance ?? 0}
            </p>
          </div>
        </div>

        {/* ========== RIGHT COLUMN ========== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Designer Information */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
              <Shield size={16} /> DESIGNER INFORMATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#94A3B8]">Designer ID</p>
                <p className="text-sm text-white font-mono">{designer._id}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Name</p>
                <p className="text-sm text-white">{designer.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Brand Name</p>
                <p className="text-sm text-white">
                  {designer.brandName || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Email</p>
                <p className="text-sm text-white">{designer.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Mobile</p>
                <p className="text-sm text-white">{designer.mobile || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Account Status</p>
                <div className="flex gap-2 mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                      designer.isVerified
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {designer.isVerified ? "Verified" : "Unverified"}
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                      designer.isApproved
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {designer.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Registered On</p>
                <p className="text-sm text-white">
                  {new Date(designer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Last Updated</p>
                <p className="text-sm text-white">
                  {new Date(designer.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {designer.rejectionReason && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 font-semibold mb-1">
                  Rejection Reason
                </p>
                <p className="text-sm text-white">
                  {designer.rejectionReason}
                </p>
              </div>
            )}
          </div>

          {/* Product Summary (Customer ke "Order Summary" jaisa) */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
              <Package size={16} /> PRODUCT SUMMARY
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {productStats.total}
                </p>
                <p className="text-xs text-[#94A3B8]">Total Products</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {productStats.approved}
                </p>
                <p className="text-xs text-[#94A3B8]">Approved</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {productStats.pending}
                </p>
                <p className="text-xs text-[#94A3B8]">Pending</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-red-400">
                  {productStats.rejected}
                </p>
                <p className="text-xs text-[#94A3B8]">Rejected</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#C026D3]/10 to-[#2563EB]/10 border border-[#C026D3]/20">
              <div className="flex items-center gap-2">
                <IndianRupee size={18} className="text-[#C026D3]" />
                <span className="text-sm text-white font-medium">
                  Total Sales
                </span>
              </div>
              <span className="text-xl font-bold text-white">
                ₹{sales.totalSales || 0}
              </span>
            </div>
          </div>

          {/* Sales Summary */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
              <TrendingUp size={16} /> SALES SUMMARY
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {sales.totalOrders || 0}
                </p>
                <p className="text-xs text-[#94A3B8]">Total Orders</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {sales.totalItemsSold || 0}
                </p>
                <p className="text-xs text-[#94A3B8]">Items Sold</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#C026D3]">
                  ₹{sales.totalSales || 0}
                </p>
                <p className="text-xs text-[#94A3B8]">Total Sales</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {designer.totalProductsSold || 0}
                </p>
                <p className="text-xs text-[#94A3B8]">Products Sold</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDesigner;