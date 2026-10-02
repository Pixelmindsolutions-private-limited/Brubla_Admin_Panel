import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Ruler, Plus, Search, Eye, Edit, Trash2, RefreshCw,
  AlertCircle, Loader2, Package, Grid3x3
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const SizeChartManager = () => {
  const navigate = useNavigate();
  const [sizeCharts, setSizeCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () => sessionStorage.getItem("adminToken");

  const fetchSizeCharts = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/size-charts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setSizeCharts(res.data.data || []);
    } catch (error) {
      console.error("Error:", error);
      setSizeCharts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizeCharts();
  }, []);

  const handleDelete = async (id, productName) => {
    const result = await Swal.fire({
      title: "Delete Size Chart?",
      text: `"${productName}" ka size chart delete ho jayega.`,
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
        await axios.delete(`${API}/size-charts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          title: "Deleted!",
          text: "Size chart deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchSizeCharts();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete size chart",
          icon: "error",
          background: "#071236",
          color: "#FFFFFF",
        });
      }
    }
  };

  const filteredSizeCharts = sizeCharts.filter(
    (sc) =>
      sc.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sc.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Ruler size={28} className="text-[#C026D3]" />
            Size Chart Management
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage product-specific size charts for customers
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/size-charts/create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Create Size Chart
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <p className="text-[#94A3B8] text-sm">Total Size Charts</p>
          <p className="text-3xl font-bold text-white mt-1">{sizeCharts.length}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <p className="text-[#94A3B8] text-sm">Products with Chart</p>
          <p className="text-3xl font-bold text-emerald-400">
            {sizeCharts.filter((sc) => sc.isActive).length}
          </p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <p className="text-[#94A3B8] text-sm">Pending Products</p>
          <p className="text-3xl font-bold text-yellow-400">—</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <button
            onClick={fetchSizeCharts}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="text-[#C026D3] animate-spin" />
          </div>
        ) : filteredSizeCharts.length === 0 ? (
          <div className="text-center py-20">
            <Ruler size={56} className="text-[#94A3B8] mx-auto mb-4" />
            <p className="text-white text-lg font-semibold">No size charts found</p>
            <p className="text-[#94A3B8] text-sm mt-2">
              Click "Create Size Chart" to add your first size chart
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {["Product", "Category", "Sizes", "Measurements", "Created", "Actions"].map((h) => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredSizeCharts.map((sc) => (
                  <tr key={sc._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{sc.productName}</p>
                      <p className="text-[#94A3B8] text-xs font-mono">
                        {sc.productId?._id?.slice(-8) || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8]">{sc.category || "—"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {sc.sizes?.slice(0, 4).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-[#C026D3]/10 text-[#C026D3] text-xs">
                            {s.size}
                          </span>
                        ))}
                        {sc.sizes?.length > 4 && (
                          <span className="text-[#94A3B8] text-xs">+{sc.sizes.length - 4}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8] text-xs">
                      {sc.measurements?.join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8] text-xs">
                      {new Date(sc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/size-charts/preview/${sc._id}`)}
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/size-charts/edit/${sc._id}`)}
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(sc._id, sc.productName)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeChartManager;