import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  Home,
  Briefcase,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const AddCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    isVerified: true,
  });

  const [addresses, setAddresses] = useState([
    {
      type: "home",
      fullName: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      isDefault: true,
    },
  ]);

  const getToken = () => sessionStorage.getItem("adminToken");

  // Load existing customer in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCustomer = async () => {
        try {
          setLoading(true);
          const token = getToken();
          const res = await axios.get(`${API}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.success) {
            const u = location.state?.customer || res.data.user;
            setFormData({
              name: u.name || "",
              email: u.email || "",
              mobile: u.mobile || "",
              password: "",
              isVerified: u.isVerified ?? true,
            });
            if (Array.isArray(u.addresses) && u.addresses.length > 0) {
              setAddresses(
                u.addresses.map((address) => ({
                  type: address.type || "home",
                  fullName: address.fullName || "",
                  mobile: address.mobile || "",
                  address: address.address || "",
                  city: address.city || "",
                  state: address.state || "",
                  pincode: address.pincode || "",
                  landmark: address.landmark || "",
                  isDefault: Boolean(address.isDefault),
                }))
              );
            }
          }
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error!",
            text: "Failed to fetch customer",
            icon: "error",
            background: "#071236",
            color: "#FFF",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id, isEditMode, location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressChange = (index, field, value) => {
    setAddresses((prev) =>
      prev.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr))
    );
  };

  const addAddress = () => {
    setAddresses((prev) => [
      ...prev,
      {
        type: "home",
        fullName: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        isDefault: false,
      },
    ]);
  };

  const removeAddress = (index) => {
    if (addresses.length === 1) {
      Swal.fire({
        title: "Error!",
        text: "At least one address is required",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
      return;
    }
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Name, Email, and Mobile are required",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
      return;
    }

    if (!isEditMode && !formData.password.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Password is required for new customer",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const payload = {
        ...formData,
        addresses: addresses.filter((a) => a.address.trim()),
      };

      let response;
      if (isEditMode) {
        response = await axios.put(`${API}/users/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(`${API}/users`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: `Customer ${isEditMode ? "updated" : "created"} successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => navigate("/dashboard/customers"), 1500);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} customer`,
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {isEditMode ? "Edit Customer" : "Add New Customer"}
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            {isEditMode
              ? "Update customer information"
              : "Add a new customer manually (for support cases)"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===== Basic Info ===== */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <User size={16} /> BASIC INFORMATION
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Kumar"
                className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
              />
            </div>

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
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">
                Email Address *
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
                  placeholder="customer@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-white mb-2">
                Password {isEditMode ? "(Leave blank to keep unchanged)" : "*"}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
                />
                <span className="text-sm text-white">
                  Mark as Verified (Active Account)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ===== Addresses ===== */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
              <MapPin size={16} /> ADDRESSES ({addresses.length})
            </h2>
            <button
              type="button"
              onClick={addAddress}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30 transition-all"
            >
              <Plus size={14} /> Add Address
            </button>
          </div>

          {addresses.map((addr, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {addr.type === "home" ? (
                    <Home size={14} className="text-emerald-400" />
                  ) : (
                    <Briefcase size={14} className="text-blue-400" />
                  )}
                  <span className="text-sm font-semibold text-white">
                    Address #{index + 1}
                  </span>
                  {addr.isDefault && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      Default
                    </span>
                  )}
                </div>
                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAddress(index)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">
                    Address Type
                  </label>
                  <select
                    value={addr.type}
                    onChange={(e) =>
                      handleAddressChange(index, "type", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={addr.fullName}
                    onChange={(e) =>
                      handleAddressChange(index, "fullName", e.target.value)
                    }
                    placeholder="Receiver's name"
                    className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">
                    Mobile
                  </label>
                  <input
                    type="text"
                    value={addr.mobile}
                    onChange={(e) =>
                      handleAddressChange(index, "mobile", e.target.value)
                    }
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={addr.pincode}
                    onChange={(e) =>
                      handleAddressChange(index, "pincode", e.target.value)
                    }
                    placeholder="500001"
                    className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-[#94A3B8] mb-1">
                    Full Address
                  </label>
                  <input
                    type="text"
                    value={addr.address}
                    onChange={(e) =>
                      handleAddressChange(index, "address", e.target.value)
                    }
                    placeholder="House No, Street, Area"
                    className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={addr.city}
                    onChange={(e) =>
                      handleAddressChange(index, "city", e.target.value)
                    }
                    placeholder="Hyderabad"
                    className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={addr.state}
                    onChange={(e) =>
                      handleAddressChange(index, "state", e.target.value)
                    }
                    placeholder="Telangana"
                    className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <input
                    type="radio"
                    name="defaultAddress"
                    checked={addr.isDefault}
                    onChange={() =>
                      setAddresses((prev) =>
                        prev.map((a, i) => ({
                          ...a,
                          isDefault: i === index,
                        }))
                      )
                    }
                    className="w-4 h-4 text-[#C026D3] bg-white/5 border-white/10"
                  />
                  <span className="text-xs text-[#94A3B8]">
                    Set as default address
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Action Buttons ===== */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                {isEditMode ? "Update Customer" : "Create Customer"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
