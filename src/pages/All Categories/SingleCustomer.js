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
  Heart,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Home,
  Briefcase,
  Clock,
  Wallet,
  Plus,
  IndianRupee,
  FileText,
  X,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const SingleCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllAddresses, setShowAllAddresses] = useState(false);

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

  // Order summary calculations (mock — replace with real data)
  const orderSummary = {
    total: customer.orders?.length || 8,
    completed: 6,
    cancelled: 1,
    returned: 1,
    totalSpent: 12450,
  };

  const defaultAddress = customer.addresses?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/customers")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Customer Details</h1>
            <p className="text-[#94A3B8] text-sm mt-1">
              View complete customer information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* NEW: Add Customer */}
          <button
            onClick={() => navigate("/dashboard/customers/create")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-all"
          >
            <Plus size={16} />
            Add Customer
          </button>

          {/* Edit Customer */}
          <button
            onClick={() => navigate(`/dashboard/customers/edit/${customer._id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all"
          >
            <Edit size={16} />
            Edit Customer
          </button>

          {/* Delete */}
          <button
            onClick={deleteCustomer}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ========== LEFT COLUMN ========== */}
        <div className="lg:col-span-1 space-y-6">

          {/* Profile Card */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#C026D3] to-[#2563EB] flex items-center justify-center text-white text-3xl font-bold mb-4">
                {customer.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h2 className="text-xl font-bold text-white">{customer.name || "Unnamed"}</h2>
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
                  {customer.isVerified ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {customer.isVerified ? "Active" : "Unverified"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <Mail size={16} className="text-[#C026D3] shrink-0" />
                <span className="text-sm truncate">{customer.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-3 text-[#94A3B8]">
                <Phone size={16} className="text-[#C026D3] shrink-0" />
                <span className="text-sm">{customer.mobile || "No mobile"}</span>
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

          {/* Address Section */}
          {defaultAddress && (
            <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
                  <MapPin size={16} /> ADDRESS
                </h3>
                {customer.addresses?.length > 1 && (
                  <button
                    onClick={() => setShowAllAddresses(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View All Addresses ({customer.addresses.length})
                  </button>
                )}
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  {defaultAddress.type === "home" ? (
                    <Home size={14} className="text-emerald-400" />
                  ) : (
                    <Briefcase size={14} className="text-blue-400" />
                  )}
                  <span className="text-white text-sm font-semibold capitalize">
                    Default ({defaultAddress.type})
                  </span>
                </div>
                <p className="text-[#94A3B8] text-sm">{defaultAddress.fullName}</p>
                <p className="text-[#94A3B8] text-sm">{defaultAddress.mobile}</p>
                <p className="text-white text-sm mt-2">{defaultAddress.address}</p>
                <p className="text-[#94A3B8] text-sm">
                  {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.pincode}
                </p>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
              <ShoppingBag size={16} /> ORDER SUMMARY
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{orderSummary.total}</p>
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
                <span className="text-sm text-white font-medium">Total Spent</span>
              </div>
              <span className="text-xl font-bold text-white">
                ₹{orderSummary.totalSpent.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => navigate(`/dashboard/orders?customer=${customer._id}`)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-all"
            >
              <FileText size={16} /> View Order History
            </button>
          </div>
        </div>
      </div>

      {/* ========== VIEW ALL ADDRESSES MODAL ========== */}
      {showAllAddresses && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#071236] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin size={18} className="text-[#C026D3]" />
                All Addresses ({customer.addresses.length})
              </h3>
              <button
                onClick={() => setShowAllAddresses(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 space-y-3">
              {customer.addresses.map((address, index) => (
                <div key={address._id || index} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {address.type === "home" ? (
                        <Home size={14} className="text-emerald-400" />
                      ) : (
                        <Briefcase size={14} className="text-blue-400" />
                      )}
                      <span className="text-white text-sm font-semibold capitalize">
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[#94A3B8] text-sm">{address.fullName} • {address.mobile}</p>
                  <p className="text-white text-sm mt-2">{address.address}</p>
                  <p className="text-[#94A3B8] text-sm">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCustomer;