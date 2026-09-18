import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Plus, Eye, Edit3, Bell, History } from "lucide-react";

const Stockmanagement = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const products = [
    { id: 1, name: "Cotton Shirt (M)", sku: "CSH-001-M", category: "Shirts", inStock: 45, reserved: 3, status: "Available" },
    { id: 2, name: "Linen Shirt (L)", sku: "LSH-004-L", category: "Shirts", inStock: 4, reserved: 1, status: "Low Stock" },
    { id: 3, name: "Printed Shirt (S)", sku: "PSH-012-S", category: "Shirts", inStock: 0, reserved: 0, status: "Out of Stock" },
    { id: 4, name: "Casual Trouser", sku: "CTR-008-32", category: "Pants", inStock: 62, reserved: 5, status: "Available" },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      Available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      "Low Stock": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Out of Stock": "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Inventory / Stock Management</h1>
        <button
          onClick={() => navigate("/dashboard/stock-adjustment")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Stock Adjustment
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Search by Product Name, SKU, or Barcode"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {["Category", "Subcategory", "Stock Status", "Warehouse"].map((filter) => (
            <div key={filter} className="relative">
              <select className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[150px]">
                <option>{filter}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Product Name", "SKU", "Category", "In Stock", "Reserved", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((row, index) => {
                const isLastRow = index >= products.length - 2;
                return (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8] font-mono">{row.sku}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.category}</td>
                    <td className="px-4 py-3 text-sm text-white font-semibold">{row.inStock}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.reserved}</td>
                    <td className="px-4 py-3">
                      <span className={getStatusBadge(row.status)}>{row.status}</span>
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
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                            <div className={`absolute right-0 z-30 w-56 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden ${isLastRow ? "bottom-full mb-2" : "top-12"}`}>
                              <button
                                onClick={() => { console.log("View Stock Details", row.id); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                              >
                                <Eye size={14} /> View Stock Details
                              </button>
                              <button
                                onClick={() => { navigate(`/dashboard/stock-adjustment?sku=${row.sku}`); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10 transition-colors"
                              >
                                <Edit3 size={14} /> Quick Adjust Stock
                              </button>
                              <button
                                onClick={() => { console.log("Set Threshold", row.id); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10 transition-colors"
                              >
                                <Bell size={14} /> Set Threshold Alert
                              </button>
                              <button
                                onClick={() => { navigate(`/dashboard/stock-management/audit-history?sku=${row.sku}`); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10 transition-colors border-t border-white/5"
                              >
                                <History size={14} /> View Audit History
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

export default Stockmanagement;