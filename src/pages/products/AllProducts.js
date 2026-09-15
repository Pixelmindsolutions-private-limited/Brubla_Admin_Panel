import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Package,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  Tag,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  Grid3x3,
  List,
  TrendingUp,
  Star,
  X,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "rating", label: "Top Rated" },
  { value: "name_asc", label: "Name: A → Z" },
  { value: "name_desc", label: "Name: Z → A" },
];

/* ---------- Custom Dark Dropdown ---------- */
const DarkSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current =
    options.find((o) => String(o.value) === String(value))?.label ||
    placeholder;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((s) => !s)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#071236] border border-white/10 text-sm transition-all focus:outline-none ${
          disabled
            ? "opacity-50 cursor-not-allowed text-[#64748B]"
            : "text-white focus:border-[#C026D3]/50 cursor-pointer"
        }`}
      >
        <span className="truncate text-left">{current}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#071236] shadow-2xl">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[#64748B]">No options</div>
          ) : (
            options.map((o) => {
              const selected = String(o.value) === String(value);
              return (
                <div
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                    selected
                      ? "bg-[#C026D3]/30 text-white"
                      : "text-[#94A3B8] hover:bg-[#C026D3]/15 hover:text-white"
                  }`}
                >
                  {o.label}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const AllProducts = () => {
  const navigate = useNavigate();

  // ---------- Data ----------
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ---------- Categories for dropdowns ----------
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // ---------- Filters (all empty by default) ----------
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    subcategoryId: "",
    isActive: "",
    minPrice: "",
    maxPrice: "",
    colors: "",
    sizes: "",
    rating: "",
    tags: "",
    sortBy: "",
    page: 1,
    limit: 10,
  });

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const getToken = () => sessionStorage.getItem("adminToken");

  // ---------- Selected category object (for subcategory list) ----------
  const selectedCategory = categories.find((c) => c._id === filters.categoryId);
  const subcategoryOptions = (selectedCategory?.subcategories || []).map(
    (s) => ({ value: s._id, label: s.name }),
  );

  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  // ---------- Fetch categories ----------
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const token = getToken();
      const res = await axios.get(`${API}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setCategories(res.data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ---------- Build query string ----------
  const buildQueryString = (f) => {
    const params = new URLSearchParams();
    Object.entries(f).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    return params.toString();
  };

  // ---------- Fetch products ----------
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const qs = buildQueryString(filters);
      const url = qs ? `${API}/products?${qs}` : `${API}/products`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setProducts(response.data.products || []);
        setTotalProducts(response.data.total || response.data.count || 0);
        setTotalPages(response.data.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to fetch products",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
        confirmButtonColor: "#C026D3",
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchInput) return prev;
        return { ...prev, search: searchInput, page: 1 };
      });
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" ? { page: 1 } : {}),
    }));
  };

  // When category changes → reset subcategory
  const handleCategoryChange = (categoryId) => {
    setFilters((prev) => ({
      ...prev,
      categoryId,
      subcategoryId: "",
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      categoryId: "",
      subcategoryId: "",
      isActive: "",
      minPrice: "",
      maxPrice: "",
      colors: "",
      sizes: "",
      rating: "",
      tags: "",
      sortBy: "",
      page: 1,
      limit: 10,
    });
    setSearchInput("");
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) =>
      !["page", "limit"].includes(k) &&
      v !== "" &&
      v !== null &&
      v !== undefined,
  ).length;

  // ---------- Delete ----------
  const deleteProduct = async (productId, productName) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: `Are you sure you want to delete "${productName}"?`,
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
        await axios.delete(`${API}/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          title: "Deleted!",
          text: "Product deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete product",
          icon: "error",
          background: "#071236",
          color: "#FFFFFF",
          confirmButtonColor: "#C026D3",
        });
      }
    }
  };

  // ---------- Product Card ----------
  const ProductCard = ({ product }) => {
    const mainImage =
      product.mainImages?.[0] || product.variants?.[0]?.images?.[0] || null;
    const discount =
      product.maxDiscount ||
      (product.displayActualPrice && product.displayPrice
        ? Math.round(
            ((product.displayActualPrice - product.displayPrice) /
              product.displayActualPrice) *
              100,
          )
        : 0);

    return (
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-[#C026D3]/30 transition-all group">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#020617] to-[#071236]">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x800/e5e7eb/64748b?text=No+Image";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={48} className="text-[#94A3B8]" />
            </div>
          )}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white text-xs font-bold px-2 py-1 rounded-lg">
              {discount}% OFF
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => navigate(`/dashboard/products/${product._id}`)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() =>
                navigate(`/dashboard/products/edit/${product._id}`)
              }
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => deleteProduct(product._id, product.name)}
              className="p-2 rounded-xl bg-white/20 hover:bg-red-500/80 text-white transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[#94A3B8] text-sm mb-2 line-clamp-2">
            {product.description?.substring(0, 80)}...
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[#94A3B8] text-xs">Category:</span>
              <span className="text-white text-xs font-semibold">
                {product.categoryId?.name || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400" />
              <span className="text-white text-xs">
                {product.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {product.displayPrice ? (
                <>
                  <span className="text-[#C026D3] font-bold text-lg">
                    ₹{product.displayPrice}
                  </span>
                  <span className="text-[#94A3B8] text-sm line-through ml-2">
                    ₹{product.displayActualPrice}
                  </span>
                </>
              ) : (
                <span className="text-white font-bold text-lg">
                  ₹{product.variants?.[0]?.price || "N/A"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[#94A3B8] text-xs">
              <ShoppingBag size={12} />
              <span>{product.totalStock || 0} in stock</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.availableColors?.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.availableColors?.length > 3 && (
                <span className="text-[#94A3B8] text-xs">
                  +{product.availableColors.length - 3}
                </span>
              )}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-lg ${
                product.isActive
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const inputClass =
    "w-full px-3 py-2 rounded-xl bg-[#071236] border border-white/10 text-white placeholder:text-[#94A3B8] text-sm focus:outline-none focus:border-[#C026D3]/50 transition-all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Package size={28} className="text-[#C026D3]" />
            All Products
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage your product catalog
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            {viewMode === "grid" ? <List size={18} /> : <Grid3x3 size={18} />}
          </button>
          <button
            onClick={fetchProducts}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => navigate("/dashboard/products/create")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{totalProducts}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#C026D3]/20 flex items-center justify-center">
              <Package size={20} className="text-[#C026D3]" />
            </div>
          </div>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Active Products</p>
              <p className="text-2xl font-bold text-white">
                {products.filter((p) => p.isActive).length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ShoppingBag size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Total Stock</p>
              <p className="text-2xl font-bold text-white">
                {products.reduce((acc, p) => acc + (p.totalStock || 0), 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Tag size={20} className="text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Avg. Discount</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(
                  products.reduce((acc, p) => acc + (p.maxDiscount || 0), 0) /
                    (products.length || 1),
                )}
                %
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Category + Subcategory + Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search — narrower */}
        <div className="relative w-full lg:flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            placeholder="Search products…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071236] border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all"
          />
        </div>

        {/* Category */}
        <div className="w-full lg:w-56 shrink-0">
          <DarkSelect
            value={filters.categoryId}
            onChange={handleCategoryChange}
            placeholder={loadingCategories ? "Loading…" : "All Categories"}
            disabled={loadingCategories}
            options={[
              { value: "", label: "All Categories" },
              ...categoryOptions,
            ]}
          />
        </div>

        {/* Subcategory — only when a category is selected */}
        {/* Subcategory — only when a category is selected */}
        {filters.categoryId && (
          <div className="w-full lg:w-56 shrink-0">
            <DarkSelect
              value={filters.subcategoryId}
              onChange={(v) => updateFilter("subcategoryId", v)}
              placeholder="All Subcategories"
              options={[
                { value: "", label: "All Subcategories" },
                ...subcategoryOptions,
              ]}
            />
          </div>
        )}

        {/* Filters button */}
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all shrink-0"
        >
          <Filter size={18} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#C026D3] text-white text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Clear All */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-all shrink-0"
          >
            <X size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-[#071236]/60 backdrop-blur-sm rounded-2xl border border-white/10 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Status
              </label>
              <DarkSelect
                value={filters.isActive}
                onChange={(v) => updateFilter("isActive", v)}
                placeholder="All"
                options={[
                  { value: "", label: "All" },
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ]}
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Min Rating
              </label>
              <DarkSelect
                value={filters.rating}
                onChange={(v) => updateFilter("rating", v)}
                placeholder="Any"
                options={[
                  { value: "", label: "Any" },
                  { value: "1", label: "1★ & up" },
                  { value: "2", label: "2★ & up" },
                  { value: "3", label: "3★ & up" },
                  { value: "4", label: "4★ & up" },
                  { value: "5", label: "5★" },
                ]}
              />
            </div>

            {/* Min price */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Min Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Max price */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Max Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="10000"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Colors (comma-separated)
              </label>
              <input
                type="text"
                placeholder="Black, Royal Blue, Maroon"
                value={filters.colors}
                onChange={(e) => updateFilter("colors", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                placeholder="S, M, L, XL"
                value={filters.sizes}
                onChange={(e) => updateFilter("sizes", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="premium, ethnic"
                value={filters.tags}
                onChange={(e) => updateFilter("tags", e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Sort By
              </label>
              <DarkSelect
                value={filters.sortBy}
                onChange={(v) => updateFilter("sortBy", v)}
                placeholder="Default"
                options={SORT_OPTIONS}
              />
            </div>

            {/* Per Page */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#94A3B8] mb-1.5">
                Per Page
              </label>
              <DarkSelect
                value={filters.limit}
                onChange={(v) => updateFilter("limit", Number(v))}
                placeholder="10"
                options={[
                  { value: 10, label: "10" },
                  { value: 20, label: "20" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                ]}
              />
            </div>
          </div>

          {/* Query preview */}
          {/* <div className="pt-2 border-t border-white/10">
            <p className="text-[#94A3B8] text-xs mb-1">
              Query preview (only non-empty values are sent):
            </p>
            <code className="block text-[11px] text-[#C026D3] bg-black/30 rounded-lg p-3 break-all">
              /api/admin/products
              {buildQueryString(filters) ? `?${buildQueryString(filters)}` : ""}
            </code>
          </div> */}
        </div>
      )}

      {/* Products Grid / List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-[#C026D3] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
          <AlertCircle size={48} className="text-[#94A3B8] mx-auto mb-4" />
          <p className="text-white text-lg">No products found</p>
          <p className="text-[#94A3B8] text-sm mt-2">
            Try changing your search or filters, or add a new product.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.mainImages?.[0] ? (
                        <img
                          src={product.mainImages[0]}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/600x800/e5e7eb/64748b?text=No+Image";
                          }}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <Package size={16} className="text-[#94A3B8]" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold">
                          {product.name}
                        </p>
                        <p className="text-[#94A3B8] text-xs">{product._id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white text-sm">
                      {product.categoryId?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-[#C026D3] font-semibold">
                        ₹{product.displayPrice || product.variants?.[0]?.price}
                      </span>
                      {product.displayActualPrice && (
                        <span className="text-[#94A3B8] text-xs line-through ml-2">
                          ₹{product.displayActualPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white text-sm">
                      {product.totalStock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${
                        product.isActive
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/products/${product._id}`)
                        }
                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/dashboard/products/edit/${product._id}`)
                        }
                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id, product.name)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-sm text-[#94A3B8]">
            Page {filters.page} of {totalPages} • {totalProducts} total
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateFilter("page", Math.max(filters.page - 1, 1))
              }
              disabled={filters.page === 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-3 py-1 rounded-lg bg-[#C026D3]/20 text-white text-sm">
              {filters.page} / {totalPages}
            </span>
            <button
              onClick={() =>
                updateFilter("page", Math.min(filters.page + 1, totalPages))
              }
              disabled={filters.page === totalPages}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
