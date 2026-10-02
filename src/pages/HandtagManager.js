import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Tag, Plus, Search, Eye, Edit, Trash2, Printer, Download,
  RefreshCw, Filter, ChevronDown, AlertCircle, Loader2, Package
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const HandtagManager = () => {
  const navigate = useNavigate();
  const [handtags, setHandtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () => sessionStorage.getItem("adminToken");

  const fetchHandtags = async () => {
    try {
      setLoading(true);
      const token = getToken();
      // Note: Backend endpoint banana padega
      const response = await axios.get(`${API}/handtags`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setHandtags(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching handtags:", error);
      setHandtags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHandtags();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Handtag?",
      text: "Ye handtag permanently delete ho jayega.",
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
        await axios.delete(`${API}/handtags/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          title: "Deleted!",
          text: "Handtag deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchHandtags();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete handtag",
          icon: "error",
          background: "#071236",
          color: "#FFFFFF",
        });
      }
    }
  };

  const filteredHandtags = handtags.filter((tag) =>
    tag.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Tag size={28} className="text-[#C026D3]" />
            Handtag Management
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Generate and manage product handtags for printing
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/handtags/create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Create Handtag
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by product name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <button
            onClick={fetchHandtags}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
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
        ) : filteredHandtags.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={56} className="text-[#94A3B8] mx-auto mb-4" />
            <p className="text-white text-lg font-semibold">No handtags found</p>
            <p className="text-[#94A3B8] text-sm mt-2">
              Click "Create Handtag" to generate your first handtag
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {["Product", "Brand", "Format", "Price", "Created", "Actions"].map((h) => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredHandtags.map((tag) => (
                  <tr key={tag._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{tag.productName}</p>
                      <p className="text-[#94A3B8] text-xs">{tag.sku || "No SKU"}</p>
                    </td>
                    <td className="px-6 py-4 text-white">{tag.brand || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-[#C026D3]/10 text-[#C026D3] text-xs font-medium">
                        {tag.format || "Medium"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      ₹{tag.sellingPrice || 0}
                    </td>
                    <td className="px-6 py-4 text-[#94A3B8] text-xs">
                      {new Date(tag.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/handtags/preview/${tag._id}`)}
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                          title="Preview & Download"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/handtags/edit/${tag._id}`)}
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(tag._id)}
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

export default HandtagManager;