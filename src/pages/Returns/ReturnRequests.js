import { useState } from "react";
import { Search, ChevronDown, Eye, CheckCircle, XCircle, RefreshCw, FileText } from "lucide-react";

const ReturnRequests = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const summaryData = [
    { label: "Total Returns", value: 48, color: "text-white" },
    { label: "Return Requests", value: 48, color: "text-blue-400" },
    { label: "Pending Returns", value: 12, color: "text-yellow-400" },
    { label: "Approved", value: 28, color: "text-emerald-400" },
    { label: "Rejected", value: 8, color: "text-red-400" },
    { label: "Refund Pending", value: 15, color: "text-orange-400" },
  ];

  const returns = [
    { id: "RET001", orderId: "ORD1023", customer: "Rahul", product: "Shirt", reason: "Size", returnStatus: "Pending", refundStatus: "—" },
    { id: "RET002", orderId: "ORD1018", customer: "Priya", product: "Dress", reason: "Damaged", returnStatus: "Approved", refundStatus: "Pending" },
    { id: "RET003", orderId: "ORD1005", customer: "Arjun", product: "Kurta", reason: "Wrong", returnStatus: "Rejected", refundStatus: "Not Applicable" },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      Rejected: "bg-red-500/20 text-red-400 border-red-500/30",
      "Not Applicable": "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Pending}`;
  };

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl md:text-3xl font-bold text-white">Returns & Refunds</h1>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID / Customer / Return ID"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {["Return Status", "Refund Status", "Payment Type", "Return Reason", "Date Range"].map((filter) => (
            <div key={filter} className="relative">
              <select className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer">
                <option>{filter}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
            </div>
          ))}
          <button className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryData.map((item) => (
          <div key={item.label} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <p className="text-[#94A3B8] text-xs font-medium mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Return ID", "Order ID", "Customer", "Product", "Reason", "Return Status", "Refund Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {returns.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">{row.id}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.orderId}</td>
                  <td className="px-4 py-3 text-sm text-white">{row.customer}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.product}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.reason}</td>
                  <td className="px-4 py-3"><span className={getStatusBadge(row.returnStatus)}>{row.returnStatus}</span></td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.refundStatus}</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-all"
                    >
                      Manage <ChevronDown size={14} />
                    </button>
                    {activeDropdown === row.id && (
                      <div className="absolute right-4 top-12 z-20 w-48 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10"><Eye size={14} /> View Details</button>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10"><CheckCircle size={14} /> Approve Return</button>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10"><XCircle size={14} /> Reject Return</button>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10"><RefreshCw size={14} /> Update Status</button>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10"><FileText size={14} /> Process Refund</button>
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10"><FileText size={14} /> View Order</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <p className="text-sm text-[#94A3B8]">Showing 1–25 of 48 returns</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[#94A3B8] text-sm hover:bg-white/10">← Previous</button>
            {[1, 2, 3].map((n) => (
              <button key={n} className={`w-8 h-8 rounded-lg text-sm ${n === 1 ? "bg-[#C026D3] text-white" : "bg-white/5 text-[#94A3B8] hover:bg-white/10"}`}>{n}</button>
            ))}
            <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[#94A3B8] text-sm hover:bg-white/10">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequests;