import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Search,
  ChevronDown,
  Plus,
  Eye,
  Edit3,
  Bell,
  History,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const Stockmanagement = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSubcategory, setFilterSubcategory] = useState("all");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getToken = () => sessionStorage.getItem("adminToken");

  // ========== Fetch Stock Products ==========
  const fetchStockProducts = async () => {
    try {
      setLoading(true);
      setLoadError("");
      const token = getToken();

      const res = await axios.get(`${API}/products/stock`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        // ✅ Handle response shape: res.data.data.products
        const list =
          res.data.data?.products ||
          res.data.products ||
          res.data.data ||
          [];
        setProducts(list);
      }
    } catch (error) {
      console.error("Error fetching stock:", error);
      setLoadError(error.response?.data?.message || "Failed to fetch stock products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockProducts();
  }, []);

  // ========== Status Badge ==========
  const getStatusBadge = (status) => {
    const styles = {
      Available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      "Low Stock": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Out of Stock": "bg-red-500/20 text-red-400 border-red-500/30",
      Inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium border ${
      styles[status] || styles["Out of Stock"]
    }`;
  };

  // ========== Unique Categories from data ==========
  const categories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  const subcategories = ["all", ...new Set(products
    .filter((p) => filterCategory === "all" || p.category === filterCategory)
    .map((p) => p.subcategory).filter(Boolean))];
  const warehouses = ["all", ...new Set(products.map((p) => p.warehouse).filter(Boolean))];

  // ========== Filter Logic ==========
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      [product.productName, product.name, product.sku, product.barcode,
        ...(product.variants || []).map((variant) => variant.sku)]
        .some((value) => String(value || "").toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    const matchesStatus =
      filterStatus === "all" || (product.stockStatus || product.status) === filterStatus;

    const matchesSubcategory = filterSubcategory === "all" || product.subcategory === filterSubcategory;
    const matchesWarehouse = filterWarehouse === "all" || product.warehouse === filterWarehouse;

    return matchesSearch && matchesCategory && matchesSubcategory && matchesWarehouse && matchesStatus;
  });

  // ========== Stats ==========
  const stats = {
    total: products.length,
    available: products.filter((p) => (p.stockStatus || p.status) === "Available").length,
    lowStock: products.filter((p) => (p.stockStatus || p.status) === "Low Stock").length,
    outOfStock: products.filter((p) => (p.stockStatus || p.status) === "Out of Stock").length,
  };

  return (
    <div className="space-y-6 pb-10">
      {/* ========== Header ========== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Inventory / Stock Management
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Track and manage product stock levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStockProducts}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/dashboard/stock-adjustment")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Stock Adjustment
          </button>
        </div>
      </div>

      {/* ========== Stats Cards ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-sm">Total Products</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-sm">Available</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {stats.available}
          </p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-sm">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {stats.lowStock}
          </p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {stats.outOfStock}
          </p>
        </div>
      </div>

      {/* ========== Search & Filters ========== */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Product Name, SKU, or Barcode"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[150px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={14}
            />
          </div>

          {warehouses.length > 1 && <div className="relative">
            <select value={filterWarehouse} onChange={(e) => setFilterWarehouse(e.target.value)} className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm min-w-[170px]">
              {warehouses.map((value) => <option key={value} value={value}>{value === "all" ? "All Warehouses" : value}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
          </div>}

          <div className="relative">
            <select value={filterSubcategory} onChange={(e) => setFilterSubcategory(e.target.value)} className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm min-w-[170px]">
              {subcategories.map((value) => <option key={value} value={value}>{value === "all" ? "All Subcategories" : value}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
          </div>

          {/* Stock Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* ========== Table ========== */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-[#C026D3] animate-spin" />
          </div>
        ) : loadError ? (
          <div className="text-center py-16"><p className="text-red-300">{loadError}</p><button onClick={fetchStockProducts} className="mt-3 px-4 py-2 rounded-lg bg-white/10 text-white">Retry</button></div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle
              size={56}
              className="text-[#94A3B8] mx-auto mb-4"
            />
            <p className="text-white text-lg font-semibold">
              No products found
            </p>
            <p className="text-[#94A3B8] text-sm mt-2">
              {searchTerm || filterCategory !== "all" || filterSubcategory !== "all" || filterWarehouse !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "No stock products available"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {[
                    "Product Name",
                    "SKU",
                    "Category",
                    "In Stock",
                    "Reserved",
                    "Available",
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
                {filteredProducts.map((row, index) => {
                  const isLastRow = index >= filteredProducts.length - 2;
                  return (
                    <tr
                      key={row.productId || row._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-white font-medium">
                        {row.productName || row.name || "Unnamed"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#94A3B8] font-mono">
                        {row.sku || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#94A3B8]">
                        {row.category || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-semibold">
                        {row.totalStock ?? row.inStock ?? 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#94A3B8]">
                        {row.reserved ?? 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#94A3B8]">
                        {row.availableStock ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <span className={getStatusBadge(row.stockStatus || row.status)}>
                          {row.stockStatus || row.status || "Unknown"}
                        </span>
                      </td>

                      {/* Manage Dropdown */}
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === (row.productId || row._id) ? null : (row.productId || row._id)
                              )
                            }
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-all"
                          >
                            Manage <ChevronDown size={14} />
                          </button>

                          {activeDropdown === (row.productId || row._id) && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveDropdown(null)}
                              />
                              <div
                                className={`absolute right-0 z-30 w-56 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden ${
                                  isLastRow ? "bottom-full mb-2" : "top-12"
                                }`}
                              >
                                <button
                                  onClick={() => {
                                    axios.get(`${API}/products/${row.productId || row._id}/stock`, { headers: { Authorization: `Bearer ${getToken()}` } }).then((res) => setSelectedProduct(res.data.data)).catch((err) => Swal.fire({ icon: "error", text: err.response?.data?.message || "Unable to load stock details" }));
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                                >
                                  <Eye size={14} /> View Stock Details
                                </button>
                                <button
                                  onClick={() => {
                                    navigate(
                                      `/dashboard/stock-adjustment?productId=${row.productId || row._id}`
                                    );
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10 transition-colors"
                                >
                                  <Edit3 size={14} /> Quick Adjust Stock
                                </button>
                                <button
                                  onClick={() => {
                                    const id = row.productId || row._id;
                                    Swal.fire({ title: "Low stock threshold", input: "number", inputValue: row.lowStockThreshold ?? 5, inputAttributes: { min: 0, step: 1 }, showCancelButton: true, confirmButtonText: "Save" }).then(async (result) => {
                                      if (!result.isConfirmed) return;
                                      try {
                                        await axios.put(`${API}/products/${id}/stock-threshold`, { threshold: Number(result.value) }, { headers: { Authorization: `Bearer ${getToken()}` } });
                                        await fetchStockProducts();
                                        Swal.fire({ icon: "success", title: "Threshold updated", timer: 1200, showConfirmButton: false });
                                      } catch (error) { Swal.fire({ icon: "error", text: error.response?.data?.message || "Could not update threshold" }); }
                                    });
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10 transition-colors"
                                >
                                  <Bell size={14} /> Set Threshold Alert
                                </button>
                                <button
                                  onClick={() => {
                                    navigate(
                                      `/dashboard/stock-management/audit-history?productId=${row.productId || row._id}`
                                    );
                                    setActiveDropdown(null);
                                  }}
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
        )}
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#071236] border border-white/10 rounded-2xl p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex justify-between gap-4 mb-5"><div><h2 className="text-xl font-bold">{selectedProduct.productName} stock</h2><p className="text-sm text-[#94A3B8]">Total {selectedProduct.totalStock} | Available {selectedProduct.availableStock} | Reserved {selectedProduct.reserved}</p><p className="text-sm text-[#94A3B8]">Warehouse: {selectedProduct.warehouse || "Not configured"} | Low stock alert: {selectedProduct.lowStockThreshold ?? "Not configured"}</p></div><button onClick={() => setSelectedProduct(null)} aria-label="Close stock details" className="text-white">Close</button></div>
            {(selectedProduct.variants || []).map((variant) => <div key={variant.variantId} className="mb-3 rounded-xl border border-white/10 p-4"><h3 className="font-semibold">{variant.color} <span className="text-xs text-[#94A3B8]">{variant.sku}</span></h3><div className="mt-2 flex flex-wrap gap-2">{variant.sizes.map((item) => <span key={item.sizeId} className="rounded-lg bg-white/5 px-3 py-2 text-sm">{item.size}: {item.quantity}</span>)}</div></div>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stockmanagement;
