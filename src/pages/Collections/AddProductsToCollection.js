import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Search,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const AddProductsToCollection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collectionName, setCollectionName] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [existingIds, setExistingIds] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getToken = () => sessionStorage.getItem("adminToken");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();

      // Collection name
      const colRes = await axios.get(`${API}/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (colRes.data.success) setCollectionName(colRes.data.data.title);

      // Existing products
      const existRes = await axios.get(
        `${API}/collections/${id}/products`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (existRes.data.success) {
        setExistingIds(existRes.data.data.map((p) => p._id));
      }

      // All products
      const res = await axios.get(`${API}/products?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAllProducts(res.data.products);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, page]);

  const availableProducts = allProducts.filter(
    (p) => !existingIds.includes(p._id)
  );

  const filtered = availableProducts.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (productId) => {
    setSelected((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map((p) => p._id));
    }
  };

  const handleAdd = async () => {
    if (selected.length === 0) {
      Swal.fire({
        title: "Error!",
        text: "Select at least one product",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
      return;
    }

    try {
      const token = getToken();
      await axios.post(
        `${API}/collections/${id}/products/bulk`,
        { productIds: selected },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        title: "Success!",
        text: `${selected.length} product(s) added`,
        icon: "success",
        background: "#071236",
        color: "#FFF",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(`/dashboard/collections/${id}`);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to add products",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    }
  };

  return (
    <div className="space-y-6 pb-10 text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Add Products</h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Collection: <span className="text-[#C026D3]">{collectionName}</span>
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            size={16}
          />
          <input
            type="text"
            placeholder="Search product by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option>Category</option>
          </select>
          <select className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option>Subcategory</option>
          </select>
        </div>
      </div>

      {/* Select All */}
      <div className="flex items-center gap-3 px-4">
        <input
          type="checkbox"
          checked={
            selected.length === filtered.length && filtered.length > 0
          }
          onChange={toggleSelectAll}
          className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
        />
        <span className="text-sm text-[#94A3B8]">Select All</span>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-[#C026D3] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-[#94A3B8]">
            No products available
          </div>
        ) : (
          filtered.map((p) => (
            <label
              key={p._id}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                selected.includes(p._id)
                  ? "bg-[#C026D3]/10 border-[#C026D3]/40"
                  : "bg-[#071236]/50 border-white/10 hover:bg-white/5"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(p._id)}
                onChange={() => toggleSelect(p._id)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
              />

              {p.mainImages?.[0] ? (
                <img
                  src={p.mainImages[0]}
                  alt={p.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center">
                  <ImageIcon size={20} className="text-[#94A3B8]" />
                </div>
              )}

              <div className="flex-1">
                <p className="text-white font-medium">{p.name}</p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  SKU: {p.variants?.[0]?.sku || "N/A"} | ₹
                  {p.displayPrice || p.price || 0} | Stock: {p.totalStock || 0}
                </p>
              </div>
            </label>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-[#94A3B8]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between p-4 bg-[#071236]/50 rounded-xl border border-white/10">
        <p className="text-sm text-[#94A3B8]">
          Selected Products: <span className="text-white">{selected.length}</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={selected.length === 0}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm disabled:opacity-50"
          >
            Add Selected Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductsToCollection;