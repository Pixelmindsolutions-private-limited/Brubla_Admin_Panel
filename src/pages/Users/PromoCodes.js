import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Plus, Eye, Edit, Trash2 } from "lucide-react";

const PromoCodes = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Promos ko state mein rakha taaki toggle kar sakein
  const [promos, setPromos] = useState([
    { id: 1, code: "FESTIVE20", discount: "20%", applicableTo: "Selected Products", usage: "80/200", validity: "Sep–Oct", status: "Active" },
    { id: 2, code: "NEWUSER10", discount: "10%", applicableTo: "All Products", usage: "150/500", validity: "Sep–Dec", status: "Active" },
  ]);

  // Status Toggle Handler
  const toggleStatus = (id) => {
    setPromos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p
      )
    );
    // Real API: axios.patch(`${API}/promo-codes/${id}/toggle-status`)
  };

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl md:text-3xl font-bold text-white">Promo Codes</h1>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Search Promo Code"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {["Status", "Discount Type", "Date"].map((filter) => (
              <div key={filter} className="relative">
                <select className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer">
                  <option>{filter}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/dashboard/promo-codes/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Create Promo Code
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Code", "Discount", "Applicable To", "Usage", "Validity", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {promos.map((row, index) => {
                const isLastRow = index >= promos.length - 2;
                const isActive = row.status === "Active";

                return (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-medium">{row.code}</td>
                    <td className="px-4 py-3 text-sm text-emerald-400 font-semibold">{row.discount}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.applicableTo}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.usage}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.validity}</td>

                    {/* Status Column - Toggle Button */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(row.id)}
                        title="Click to toggle status"
                        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          isActive
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isActive ? "bg-emerald-400" : "bg-gray-400"
                          }`}
                        />
                        {row.status}
                      </button>
                    </td>

                    {/* Actions Column */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">

                        {/* Manage Dropdown (View + Edit) */}
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
                                className={`absolute right-0 z-30 w-44 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden ${
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
                                  <Eye size={14} /> View
                                </button>
                                <button
                                  onClick={() => {
                                    navigate(`/dashboard/promo-codes/edit/${row.id}`);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10 transition-colors"
                                >
                                  <Edit size={14} /> Edit
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Delete Button (Direct) */}
                        <button
                          onClick={() => console.log("Delete", row.id)}
                          title="Delete"
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>

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

export default PromoCodes;