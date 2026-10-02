import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Home,
  Briefcase,
  Wallet,
  Plus,
  IndianRupee,
  FileText,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const SingleCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => sessionStorage.getItem("adminToken");

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCustomer(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch customer details",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
        confirmButtonColor: "#C026D3",
      });
      navigate("/dashboard/customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const deleteCustomer = async () => {
    const result = await Swal.fire({
      title: "Delete Customer?",
      text: `Are you sure you want to delete ${customer?.name || "this customer"}?`,
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
        await axios.delete(`${API}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          title: "Deleted!",
          text: "Customer has been deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/dashboard/customers");
      } catch (error) {
        console.error("Error deleting customer:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete customer",
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
        <div className="w-8 h-8 border-2 border-[#C026D3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-[#94A3B8]">Customer not found</p>
      </div>
    );
  }

  // ===== Order Summary from real orders array =====
  const orders = customer.orders || [];
  const orderSummary = {
    total: orders.length,
    completed: orders.filter((o) => o.orderStatus === "delivered" || o.orderStatus === "completed").length,
    cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
    returned: orders.filter((o) => o.orderStatus === "returned").length,
    totalSpent: orders
      .filter((o) => o.orderStatus !== "cancelled")
      .reduce((sum, o) => sum + (o.finalAmount || 0), 0),
  };

  // ===== Default Address =====
  const defaultAddress =
    customer.addresses?.find((a) => a.isDefault) || customer.addresses?.[0];

  // ===== All Addresses =====
  const allAddresses = customer.addresses || [];

  return (
    <div className="space-y-6">
      {/* ========== HEADER ========== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/customers")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Customer Details
            </h1>
            <p className="text-[#94A3B8] text-sm mt-1">
              View complete customer information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate("/dashboard/customers/create")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-all"
          >
            <Plus size={16} />
            Add Customer
          </button>

          <button
            onClick={() =>
              navigate(`/dashboard/customers/edit/${customer._id}`, {
                state: { customer },
              })
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all"
          >
            <Edit size={16} />
            Edit Customer
          </button>

          <button
            onClick={deleteCustomer}
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
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#C026D3] to-[#2563EB] flex items-center justify-center text-white text-3xl font-bold mb-4">
                {customer.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className="text-xl font-bold text-white">
                {customer.name || "Unnamed"}
              </h2>
              <p className="text-[#94A3B8] text-xs mt-1 font-mono">
                ID: {customer._id?.slice(-8)}
              </p>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                    customer.isVerified
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {customer.isVerified ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {customer.isVerified ? "Active" : "Unverified"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <Mail size={16} className="text-[#C026D3] shrink-0" />
                <span className="text-sm truncate">
                  {customer.email || "No email"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <Phone size={16} className="text-[#C026D3] shrink-0" />
                <span className="text-sm">
                  {customer.mobile || "No mobile"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <Calendar size={16} className="text-[#C026D3] shrink-0" />
                <span className="text-sm">
                  Registered: {new Date(customer.createdAt).toLocaleDateString()}
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
              ₹{customer.wallet?.balance ?? 0}
            </p>
          </div>
        </div>

        {/* ========== RIGHT COLUMN ========== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
              <Shield size={16} /> CUSTOMER INFORMATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#94A3B8]">Customer ID</p>
                <p className="text-sm text-white font-mono">{customer._id}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Name</p>
                <p className="text-sm text-white">{customer.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Email</p>
                <p className="text-sm text-white">{customer.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Mobile</p>
                <p className="text-sm text-white">{customer.mobile || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Account Status</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                    customer.isVerified
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {customer.isVerified ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Registered On</p>
                <p className="text-sm text-white">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* ========== ADDRESSES — ALL VISIBLE ========== */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
              <MapPin size={16} /> ADDRESSES ({allAddresses.length})
            </h3>

            {allAddresses.length === 0 ? (
              <p className="text-sm text-[#94A3B8] text-center py-6">
                No addresses saved
              </p>
            ) : (
              <div className="space-y-3">
                {allAddresses.map((address, index) => (
                  <div
                    key={address._id || index}
                    className={`rounded-xl p-4 border transition-all ${
                      address.isDefault
                        ? "bg-emerald-500/5 border-emerald-500/30"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {address.type === "home" ? (
                          <Home size={14} className="text-emerald-400" />
                        ) : address.type === "work" ? (
                          <Briefcase size={14} className="text-blue-400" />
                        ) : (
                          <MapPin size={14} className="text-purple-400" />
                        )}
                        <span className="text-white text-sm font-semibold capitalize">
                          {address.type || "Other"}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[#94A3B8] text-sm">
                      <span className="text-white font-medium">
                        {address.fullName}
                      </span>{" "}
                      • {address.mobile}
                    </p>
                    <p className="text-white text-sm mt-2">{address.address}</p>
                    <p className="text-[#94A3B8] text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    {address.landmark && (
                      <p className="text-[#94A3B8] text-xs mt-1">
                        Landmark: {address.landmark}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
              <ShoppingBag size={16} /> ORDER SUMMARY
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {orderSummary.total}
                </p>
                <p className="text-xs text-[#94A3B8]">Total Orders</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {orderSummary.completed}
                </p>
                <p className="text-xs text-[#94A3B8]">Completed</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-red-400">
                  {orderSummary.cancelled}
                </p>
                <p className="text-xs text-[#94A3B8]">Cancelled</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {orderSummary.returned}
                </p>
                <p className="text-xs text-[#94A3B8]">Returned</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#C026D3]/10 to-[#2563EB]/10 border border-[#C026D3]/20">
              <div className="flex items-center gap-2">
                <IndianRupee size={18} className="text-[#C026D3]" />
                <span className="text-sm text-white font-medium">
                  Total Spent
                </span>
              </div>
              <span className="text-xl font-bold text-white">
                ₹{orderSummary.totalSpent.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() =>
                navigate(`/dashboard/customers/${customer._id}/orders`)
              }
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-all"
            >
              <FileText size={16} /> View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCustomer;
