import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Plus, Eye, Edit, Trash2 } from "lucide-react";

const SeasonalSales = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Sales ko state mein rakha taaki toggle kar sakein
  const [sales, setSales] = useState([
    {
      id: 1,
      name: "Diwali Sale",
      products: 120,
      discount: "Up to 40%",
      dates: "Oct–Nov",
      status: "Active",
    },
    {
      id: 2,
      name: "Summer Sale",
      products: 75,
      discount: "20%",
      dates: "Apr–May",
      status: "Ended",
    },
  ]);

  // Status Toggle Handler
  const toggleStatus = (id) => {
    setSales((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;

        // Toggle logic: Active ↔ Inactive
        // Ended aur Scheduled ko bhi toggle karne do
        let newStatus;
        if (s.status === "Active") {
          newStatus = "Inactive";
        } else if (s.status === "Inactive") {
          newStatus = "Active";
        } else if (s.status === "Ended") {
          newStatus = "Active";
        } else if (s.status === "Scheduled") {
          newStatus = "Active";
        } else {
          newStatus = "Active";
        }

        return { ...s, status: newStatus };
      }),
    );
    // Real API: axios.patch(`${API}/seasonal-sales/${id}/toggle-status`)
  };

  // Status ke hisaab se color nikalta hai
  const getStatusStyles = (status) => {
    const styles = {
      Active: {
        btn: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30",
        dot: "bg-emerald-400",
      },
      Inactive: {
        btn: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30",
        dot: "bg-red-400",
      },
      Ended: {
        btn: "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30",
        dot: "bg-gray-400",
      },
      Scheduled: {
        btn: "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30",
        dot: "bg-blue-400",
      },
    };
    return styles[status] || styles.Ended;
  };

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl md:text-3xl font-bold text-white">
        Seasonal Sales
      </h1>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Sale"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            {["Status", "Season", "Date"].map((filter) => (
              <div key={filter} className="relative">
                <select className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer">
                  <option>{filter}</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                  size={14}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/dashboard/seasonal-sales/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Create Seasonal Sale
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {[
                  "Sale Name",
                  "Products",
                  "Discount",
                  "Dates",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sales.map((row, index) => {
                const isLastRow = index >= sales.length - 2;
                const statusStyles = getStatusStyles(row.status);

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">
                      {row.products}
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-400 font-semibold">
                      {row.discount}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">
                      {row.dates}
                    </td>

                    {/* Status Column - Toggle Button */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(row.id)}
                        title="Click to toggle status"
                        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusStyles.btn}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${statusStyles.dot}`}
                        />
                        {row.status}
                      </button>
                    </td>

                    {/* Actions Column */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Manage Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === row.id ? null : row.id,
                              )
                            }
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
                                    navigate(
                                      `/dashboard/seasonal-sales/edit/${row.id}`,
                                    );
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

                        {/* Delete */}
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

export default SeasonalSales;
