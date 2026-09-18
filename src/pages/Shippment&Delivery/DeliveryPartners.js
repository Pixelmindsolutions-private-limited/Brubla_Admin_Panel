import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Plus, Eye, Edit, Settings, Power, Truck, Package, Users, Zap } from "lucide-react";

const DeliveryPartners = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Static data
  const [partners, setPartners] = useState([
    { id: 1, name: "Shiprocket", serviceType: "Courier Aggregator", orders: 125, status: "Active" },
    { id: 2, name: "Partner 2", serviceType: "Courier", orders: 45, status: "Active" },
    { id: 3, name: "Delhivery", serviceType: "Express Delivery", orders: 210, status: "Inactive" },
  ]);

  // Summary calculations
  const totalPartners = partners.length;
  const activePartners = partners.filter((p) => p.status === "Active").length;
  const inactivePartners = partners.filter((p) => p.status === "Inactive").length;

  // Toggle status
  const toggleStatus = (id) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p
      )
    );
  };

  const getStatusStyles = (status) => {
    return status === "Active"
      ? {
          btn: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30",
          dot: "bg-emerald-400",
        }
      : {
          btn: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30",
          dot: "bg-red-400",
        };
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Delivery Partners</h1>
        <button
          onClick={() => navigate("/dashboard/add-shipping-delivery")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Add Partner
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Search Delivery Partner"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[140px]">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
          </div>

          <div className="relative">
            <select className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[160px]">
              <option>Service Type</option>
              <option>Courier</option>
              <option>Courier Aggregator</option>
              <option>Local Delivery</option>
              <option>Same-Day Delivery</option>
              <option>Express Delivery</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#C026D3]/20 text-[#C026D3]">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[#94A3B8] text-xs font-medium">Total Partners</p>
            <p className="text-2xl font-bold text-white">{totalPartners}</p>
          </div>
        </div>

        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-[#94A3B8] text-xs font-medium">Active</p>
            <p className="text-2xl font-bold text-emerald-400">{activePartners}</p>
          </div>
        </div>

        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
            <Power size={20} />
          </div>
          <div>
            <p className="text-[#94A3B8] text-xs font-medium">Inactive</p>
            <p className="text-2xl font-bold text-red-400">{inactivePartners}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Partner", "Service Type", "Orders", "Status", "Manage"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {partners.map((row, index) => {
                const isLastRow = index >= partners.length - 2;
                const statusStyles = getStatusStyles(row.status);

                return (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-medium flex items-center gap-2">
                      <Truck size={16} className="text-[#C026D3]" />
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.serviceType}</td>
                    <td className="px-4 py-3 text-sm text-white">
                      <span className="flex items-center gap-1">
                        <Package size={14} className="text-[#94A3B8]" />
                        {row.orders}
                      </span>
                    </td>

                    {/* Status - Click to Toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(row.id)}
                        title="Click to toggle status"
                        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusStyles.btn}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${statusStyles.dot}`} />
                        {row.status}
                      </button>
                    </td>

                    {/* Manage Dropdown */}
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-all"
                        >
                          Manage <ChevronDown size={14} />
                        </button>

                        {activeDropdown === row.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div
                              className={`absolute right-0 z-30 w-48 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden ${
                                isLastRow ? "bottom-full mb-2" : "top-12"
                              }`}
                            >
                              <button
                                onClick={() => {
                                  console.log("View", row.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                              >
                                <Eye size={14} /> View Details
                              </button>
                              <button
                                onClick={() => {
                                  navigate(`/dashboard/shipping/edit/${row.id}`);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10 transition-colors"
                              >
                                <Edit size={14} /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Configure", row.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-purple-400 hover:bg-white/10 transition-colors"
                              >
                                <Settings size={14} /> Configure
                              </button>
                              <button
                                onClick={() => {
                                  toggleStatus(row.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10 transition-colors border-t border-white/5"
                              >
                                <Power size={14} /> Activate / Deactivate
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartners;