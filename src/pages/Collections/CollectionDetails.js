import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Layers,
  Tag,
  Calendar,
  Edit,
  Plus,
  Search,
  ChevronDown,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import RemoveProductModal from "./RemoveProductModal";

const API = "http://31.97.228.17:4077/api/admin";

const CollectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

  const getToken = () => sessionStorage.getItem("adminToken");

  const fetchCollection = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setCollection(res.data.data);

      const prodRes = await axios.get(`${API}/collections/${id}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (prodRes.data.success) setProducts(prodRes.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch collection details",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [id]);

  const handleRemoveClick = (product) => {
    setProductToRemove(product);
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    try {
      const token = getToken();
      await axios.delete(
        `${API}/collections/${id}/products/${productToRemove._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        title: "Removed!",
        text: "Product removed from collection",
        icon: "success",
        background: "#071236",
        color: "#FFF",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowRemoveModal(false);
      setProductToRemove(null);
      fetchCollection();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to remove product",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-8 h-8 border-2 border-[#C026D3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-20">
        <p className="text-[#94A3B8]">Collection not found</p>
      </div>
    );
  }

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10 text-white">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/collections")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Collection Details</h1>
            <p className="text-[#94A3B8] text-sm mt-1">
              Manage collection information and products
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            navigate(`/dashboard/collections/edit/${collection._id}`)
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <Edit size={16} /> Edit Collection
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-[#94A3B8]">Collection ID</p>
            <p className="text-sm font-mono mt-1">{collection._id?.slice(-8)}</p>
          </div>
          <div>
            <p className="text-xs text-[#94A3B8]">Collection Name</p>
            <p className="text-sm mt-1">{collection.title}</p>
          </div>
          <div>
            <p className="text-xs text-[#94A3B8]">Collection Type</p>
            <p className="text-sm mt-1">{collection.type || "Custom"}</p>
          </div>
          <div>
            <p className="text-xs text-[#94A3B8]">Created Date</p>
            <p className="text-sm mt-1">
              {new Date(collection.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <label className="text-xs text-[#94A3B8] block mb-2">Status</label>
          <div className="relative w-48">
            <select
              value={collection.isActive ? "Active" : "Inactive"}
              className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            >
              <option>Active</option>
              <option>Scheduled</option>
              <option>Inactive</option>
              <option>Expired</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Collection Information */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h3 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
          <Layers size={16} /> COLLECTION INFORMATION
        </h3>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="flex-shrink-0">
            {collection.image ? (
              <img
                src={collection.image}
                alt={collection.title}
                className="w-40 h-40 rounded-xl object-cover border border-white/10"
              />
            ) : (
              <div className="w-40 h-40 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                <ImageIcon size={32} className="text-[#94A3B8]" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-[#94A3B8]">Collection Name</p>
              <p className="text-white mt-1">{collection.title}</p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Description</p>
              <p className="text-white text-sm mt-1">
                {collection.description || "No description"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-[#94A3B8]">Start Date</p>
                <p className="text-sm mt-1">
                  {collection.startDate
                    ? new Date(collection.startDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">End Date</p>
                <p className="text-sm mt-1">
                  {collection.endDate
                    ? new Date(collection.endDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products in Collection */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <Tag size={16} /> PRODUCTS IN COLLECTION ({products.length})
          </h3>
          <button
            onClick={() =>
              navigate(`/dashboard/collections/${id}/add-products`)
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            <Plus size={16} /> Add Products
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <select className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option>Category</option>
          </select>
          <select className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option>Subcategory</option>
          </select>
          <select className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option>Stock Status</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Product ID", "Product", "Category", "Price", "Stock", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-[#94A3B8]">
                    {p._id?.slice(-6)}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">
                    {p.categoryId?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">
                    ₹{p.displayPrice || p.price || 0}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">
                    {p.totalStock || 0}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleRemoveClick(p)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-all"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#94A3B8]">
                    No products in this collection yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remove Product Modal */}
      {showRemoveModal && productToRemove && (
        <RemoveProductModal
          product={productToRemove}
          collectionName={collection.title}
          onCancel={() => setShowRemoveModal(false)}
          onConfirm={confirmRemove}
        />
      )}
    </div>
  );
};

export default CollectionDetails;