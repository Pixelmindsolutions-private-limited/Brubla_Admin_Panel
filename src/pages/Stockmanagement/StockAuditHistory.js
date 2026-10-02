import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Search, ChevronDown, ArrowLeft } from "lucide-react";

const StockAuditHistory = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const productId = params.get("productId");
  useEffect(() => {
    if (!productId) { setError("Product ID is missing from the audit URL."); setLoading(false); return; }
    axios.get(`http://31.97.228.17:4077/api/admin/products/${productId}/stock-history`, { headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken") || ""}` } })
      .then(({ data }) => setHistory(data.data || []))
      .catch((err) => setError(err.response?.data?.message || "Could not load stock audit history."))
      .finally(() => setLoading(false));
  }, [productId]);

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
              {loading ? <tr><td colSpan="7" className="p-8 text-center text-[#94A3B8]">Loading audit history…</td></tr> : error ? <tr><td colSpan="7" className="p-8 text-center text-red-300">{error}</td></tr> : history.length === 0 ? <tr><td colSpan="7" className="p-8 text-center text-[#94A3B8]">No stock history found.</td></tr> : history.map((row) => (
                <tr key={row._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-[#94A3B8] whitespace-nowrap">{new Date(row.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-white font-mono">{row.productName} · {row.sku} · {row.color} · {row.size}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.previousQuantity}</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${row.changedQuantity >= 0 ? "text-emerald-400" : "text-red-400"}`}>{row.changedQuantity > 0 ? "+" : ""}{row.changedQuantity}</td>
                  <td className="px-4 py-3 text-sm text-white font-semibold">{row.newQuantity}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.reason || "—"}</td>
                  <td className="px-4 py-3 text-sm text-white">{row.referenceId || "—"}</td>
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
