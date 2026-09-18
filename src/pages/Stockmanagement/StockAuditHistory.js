import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowLeft } from "lucide-react";

const StockAuditHistory = () => {
  const navigate = useNavigate();

  const history = [
    {
      id: 1,
      date: "16 Sep 2026, 02:15 PM",
      sku: "CSH-001-M",
      prevStock: 30,
      change: "+15",
      final: 45,
      reason: "Restock",
      user: "Admin_Bhuvanesh",
      changeColor: "text-emerald-400",
    },
    {
      id: 2,
      date: "15 Sep 2026, 11:30 AM",
      sku: "LSH-004-L",
      prevStock: 5,
      change: "-1",
      final: 4,
      reason: "Damaged",
      user: "Staff_Ravi",
      changeColor: "text-red-400",
    },
    {
      id: 3,
      date: "14 Sep 2026, 09:45 AM",
      sku: "PSH-012-S",
      prevStock: 0,
      change: "+20",
      final: 20,
      reason: "New Purchase",
      user: "Admin_Bhuvanesh",
      changeColor: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">Stock Audit History</h1>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Search Ref / SKU"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {["Date Range", "Changed By", "Action Type"].map((filter) => (
            <div key={filter} className="relative">
              <select className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[150px]">
                <option>{filter}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
            </div>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Date & Time", "Product / SKU", "Prev Stock", "Change", "Final", "Reason", "User"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-[#94A3B8] whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-3 text-sm text-white font-mono">{row.sku}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.prevStock}</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${row.changeColor}`}>{row.change}</td>
                  <td className="px-4 py-3 text-sm text-white font-semibold">{row.final}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.reason}</td>
                  <td className="px-4 py-3 text-sm text-white">{row.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockAuditHistory;