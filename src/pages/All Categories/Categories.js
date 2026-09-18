import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ChevronDown, Plus, RefreshCw, Edit3, FolderPlus,
  Eye, Power, Trash2, ChevronRight, Shirt, User, Users, Footprints
} from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedRow, setExpandedRow] = useState(1);

  const summaryData = [
    { label: "Categories", value: 24, color: "text-white", icon: Shirt },
    { label: "Subcategories", value: 86, color: "text-blue-400", icon: Users },
    { label: "Products", value: "1,248", color: "text-emerald-400", icon: Eye },
    { label: "Disabled", value: 5, color: "text-red-400", icon: Power },
  ];

  const categories = [
    {
      id: 1, name: "Men's Fashion", icon: "👕", subcategories: 6, products: 124,
      status: "Active", created: "12 Aug 2026",
      subcatList: ["T-Shirts", "Shirts", "Jeans", "Trousers", "Jackets", "Accessories"]
    },
    {
      id: 2, name: "Women's Fashion", icon: "👗", subcategories: 5, products: 98,
      status: "Active", created: "10 Aug 2026",
      subcatList: ["Dresses", "Tops", "Jeans", "Sarees", "Accessories"]
    },
    {
      id: 3, name: "Footwear", icon: "👟", subcategories: 4, products: 76,
      status: "Active", created: "08 Aug 2026",
      subcatList: ["Men's Shoes", "Women's Shoes", "Sports Shoes", "Sandals"]
    },
  ];

  const getStatusBadge = (status) => {
    return status === "Active"
      ? "px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 w-fit"
      : "px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 w-fit";
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Categories</h1>
          <p className="text-[#94A3B8] text-sm mt-1">Manage product categories and their subcategories</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/categories/create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryData.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#94A3B8] text-xs font-medium">{item.label}</p>
                <Icon size={16} className={item.color} />
              </div>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>

          <div className="relative">
            <select className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer">
              <option>Status</option>
              <option>Active</option>
              <option>Disabled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
          </div>

          <div className="relative">
            <select className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer">
              <option>Sort by</option>
              <option>Name (A–Z)</option>
              <option>Name (Z–A)</option>
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
          </div>

          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Category", "Subcategories", "Products", "Status", "Created", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.map((row, index) => {
                const isLastRow = index >= categories.length - 2;
                const isExpanded = expandedRow === row.id;

                return (
                  <>
                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedRow(isExpanded ? null : row.id)}
                          className="flex items-center gap-2 text-sm text-white font-medium"
                        >
                          <ChevronRight
                            size={14}
                            className={`text-[#94A3B8] transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          />
                          <span className="text-lg">{row.icon}</span>
                          {row.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.subcategories}</td>
                      <td className="px-4 py-3 text-sm text-white font-semibold">{row.products}</td>
                      <td className="px-4 py-3">
                        <span className={getStatusBadge(row.status)}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Active" ? "bg-emerald-400" : "bg-red-400"}`} />
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#94A3B8] whitespace-nowrap">{row.created}</td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
                          >
                            <ChevronDown size={16} />
                          </button>

                          {activeDropdown === row.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                              <div className={`absolute right-0 z-30 w-56 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden ${isLastRow ? "bottom-full mb-2" : "top-12"}`}>
                                <button
                                  onClick={() => { navigate(`/dashboard/categories/edit/${row.id}`); setActiveDropdown(null); }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10"
                                >
                                  <Edit3 size={14} /> Edit Category
                                </button>
                                <button
                                  onClick={() => { navigate(`/dashboard/categories/${row.id}/subcategories/create`); setActiveDropdown(null); }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10"
                                >
                                  <FolderPlus size={14} /> Add Subcategory
                                </button>
                                <button
                                  onClick={() => { navigate(`/dashboard/products?category=${row.id}`); setActiveDropdown(null); }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10"
                                >
                                  <Eye size={14} /> View Products
                                </button>
                                <button
                                  onClick={() => { console.log("Disable", row.id); setActiveDropdown(null); }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10"
                                >
                                  <Power size={14} /> Disable
                                </button>
                                <button
                                  onClick={() => { navigate(`/dashboard/categories/delete/${row.id}`); setActiveDropdown(null); }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 border-t border-white/5"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Subcategory Row */}
                    {isExpanded && (
                      <tr key={`${row.id}-subcats`} className="bg-white/5">
                        <td colSpan={6} className="px-4 py-3 pl-14">
                          <div className="space-y-1">
                            {row.subcatList.map((sub, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                                <span className="text-[#C026D3]">└─</span>
                                <span>{sub}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;