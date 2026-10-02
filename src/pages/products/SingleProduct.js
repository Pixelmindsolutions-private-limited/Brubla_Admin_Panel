import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Archive,
  Tag,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Hash,
  Image as ImageIcon,
  Star,
  ChevronDown,
  ChevronRight,
  Box,
  Truck,
  RotateCcw,
  Settings,
  History,
  Info,
  Layers,
  Video,
  Ruler,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState(0);
  const [sizeChart, setSizeChart] = useState(null); // ✅ NEW

  // Collapsible sections state (all open by default)
  const [openSections, setOpenSections] = useState({
    overview: true,
    description: true,
    specs: true,
    variants: true,
    sizeChart: true, // ✅ NEW
    inventory: true,
    shipping: true,
    returns: true,
    tags: true,
    settings: true,
    activity: true,
  });

  const getToken = () => sessionStorage.getItem("adminToken");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await axios.get(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setProduct(response.data.product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch product details",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
        confirmButtonColor: "#C026D3",
      });
      navigate("/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Fetch size chart for this product
  const fetchSizeChart = async () => {
    setSizeChart(null);
    try {
      const token = getToken();
      const res = await axios.get(`${API}/size-charts/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setSizeChart(res.data.data);
    } catch (err) {
      // Silent fail — size chart optional hai
      setSizeChart(null);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchSizeChart(); // ✅ NEW
  }, [id]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const deleteProduct = async () => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: `Are you sure you want to delete "${product?.name}"?`,
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
        await axios.delete(`${API}/products/${id}`, {
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
        navigate("/dashboard/products");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-8 h-8 border-2 border-[#C026D3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-[#94A3B8]">Product not found</p>
      </div>
    );
  }

  const discount =
    product.maxDiscount ||
    (product.displayActualPrice && product.displayPrice
      ? Math.round(
          ((product.displayActualPrice - product.displayPrice) /
            product.displayActualPrice) *
            100
        )
      : 0);

  const mediaGallery = [
    ...(product.mainImages || []),
    ...(product.variants?.[0]?.images || []),
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* ========== BACK BUTTON ========== */}
      <button
        onClick={() => navigate("/dashboard/products")}
        className="flex items-center gap-2 text-[#94A3B8] hover:text-white text-sm transition-all"
      >
        <ArrowLeft size={16} /> Back to All Products
      </button>

      {/* ========== HEADER: Product Name + Status ========== */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {product.name?.toUpperCase()}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-[#94A3B8] text-sm font-mono">
                Product ID: {product.sku || product._id?.slice(-8)}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  product.isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.isActive ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all text-sm"
            >
              <Edit size={16} /> Edit Product
            </button>
            <button
              onClick={() => console.log("Duplicate", product._id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all text-sm"
            >
              <Copy size={16} /> Duplicate
            </button>
            <button
              onClick={() => console.log("Archive", product._id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition-all text-sm"
            >
              <Archive size={16} /> Archive
            </button>
            <button
              onClick={deleteProduct}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-sm"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* ========== PRODUCT IMAGES / VIDEO GALLERY ========== */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h3 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
          <ImageIcon size={16} /> PRODUCT IMAGES / VIDEO
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Image */}
          <div className="md:col-span-3">
            {mediaGallery.length > 0 ? (
              <img
                src={mediaGallery[activeMedia]}
                alt="Product Main"
                className="w-full h-80 rounded-xl object-contain bg-black/20 border border-white/10"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/800x600/e5e7eb/64748b?text=No+Image";
                }}
              />
            ) : (
              <div className="w-full h-80 rounded-xl bg-black/20 border border-white/10 flex flex-col items-center justify-center text-[#94A3B8]">
                <ImageIcon size={48} />
                <p className="mt-2 text-sm">No images available</p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="md:col-span-1 grid grid-cols-4 md:grid-cols-2 gap-2">
            {mediaGallery.slice(0, 6).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMedia(idx)}
                className={`rounded-lg overflow-hidden border-2 transition-all ${
                  activeMedia === idx
                    ? "border-[#C026D3]"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className="w-full h-20 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/200x200/e5e7eb/64748b?text=No";
                  }}
                />
              </button>
            ))}

            {/* Video Thumbnail (Mock) */}
            <div className="rounded-lg overflow-hidden border-2 border-white/10 flex items-center justify-center bg-white/5 text-[#94A3B8] h-20">
              <Video size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ========== COLLAPSIBLE SECTIONS ========== */}

      {/* 1. Product Overview */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("overview")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <Info size={16} /> Product Overview
          </h3>
          {openSections.overview ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.overview && (
          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div>
              <p className="text-xs text-[#94A3B8]">Category</p>
              <p className="text-sm text-white mt-1">
                {product.categoryId?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Subcategory</p>
              <p className="text-sm text-white mt-1">
                {product.subcategoryName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Brand</p>
              <p className="text-sm text-white mt-1">{product.brand || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Gender</p>
              <p className="text-sm text-white mt-1">
                {product.gender || "Unisex"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Description */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("description")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <Layers size={16} /> Description
          </h3>
          {openSections.description ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.description && (
          <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
            <div>
              <p className="text-xs text-[#94A3B8]">Short Description</p>
              <p className="text-sm text-white mt-1">
                {product.shortDescription || "No short description"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Detailed Description</p>
              <p className="text-sm text-white mt-1 whitespace-pre-line">
                {product.description || "No detailed description"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Product Specifications */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("specs")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <Settings size={16} /> Product Specifications
          </h3>
          {openSections.specs ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.specs && (
          <div className="px-5 pb-5 border-t border-white/5 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Fabric", value: product.specs?.fabric },
                { label: "Pattern", value: product.specs?.pattern },
                { label: "Fit", value: product.specs?.fit },
                { label: "Sleeve", value: product.specs?.sleeve },
                { label: "Neck", value: product.specs?.neck },
                { label: "Occasion", value: product.specs?.occasion },
                { label: "Wash Care", value: product.specs?.washCare },
                { label: "Length", value: product.specs?.length },
              ].map((spec, idx) => (
                <div key={idx}>
                  <p className="text-xs text-[#94A3B8]">{spec.label}</p>
                  <p className="text-sm text-white mt-1">
                    {spec.value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Variants & Pricing */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("variants")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <Hash size={16} /> Variants & Pricing ({product.variants?.length || 0})
          </h3>
          {openSections.variants ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.variants && (
          <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
            {product.variants?.map((variant, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">{variant.color}</h4>
                  <span className="text-xs text-[#94A3B8] font-mono">
                    SKU: {variant.sku}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-[#94A3B8]">MRP</p>
                    <p className="text-sm text-white">
                      ₹{variant.mrp || variant.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8]">Selling Price</p>
                    <p className="text-sm text-emerald-400 font-semibold">
                      ₹{variant.discountPrice || variant.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8]">Stock</p>
                    <p className="text-sm text-white">
                      {variant.sizes?.reduce((a, b) => a + (b.stock || 0), 0) || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#94A3B8]">Barcode</p>
                    <p className="text-sm text-white font-mono">
                      {variant.barcode || "—"}
                    </p>
                  </div>
                </div>

                {variant.sizes?.length > 0 && (
                  <div>
                    <p className="text-xs text-[#94A3B8] mb-2">Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {variant.sizes.map((size, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs"
                        >
                          {size.size}: {size.stock}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ 5. Size Chart (NEW) */}
      {sizeChart && (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
          <button
            onClick={() => toggleSection("sizeChart")}
            className="w-full flex items-center justify-between p-5"
          >
            <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
              <Ruler size={16} /> Size Chart
            </h3>
            {openSections.sizeChart ? (
              <ChevronDown size={18} className="text-[#94A3B8]" />
            ) : (
              <ChevronRight size={18} className="text-[#94A3B8]" />
            )}
          </button>
          {openSections.sizeChart && (
            <div className="px-5 pb-5 border-t border-white/5 pt-4">
              {/* Table */}
              <div className="overflow-x-auto bg-white rounded-xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-bold text-black">
                        Size
                      </th>
                      {sizeChart.measurements?.map((m) => (
                        <th
                          key={m}
                          className="border border-gray-300 px-4 py-3 text-left text-sm font-bold text-black"
                        >
                          {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.sizes?.map((row, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-black">
                          {row.size}
                        </td>
                        {sizeChart.measurements?.map((m) => (
                          <td
                            key={m}
                            className="border border-gray-300 px-4 py-3 text-sm text-black"
                          >
                            {row.values?.[m] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              {sizeChart.notes && (
                <p className="text-xs text-[#94A3B8] mt-3 italic">
                  <strong>Note:</strong> {sizeChart.notes}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. Inventory */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("inventory")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <Box size={16} /> Inventory
          </h3>
          {openSections.inventory ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.inventory && (
          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-4">
            <div>
              <p className="text-xs text-[#94A3B8]">Total Stock</p>
              <p className="text-lg font-bold text-white mt-1">
                {product.variants?.reduce((total, variant) => total + (variant.sizes || []).reduce((sum, size) => sum + (Number(size.stock) || 0), 0), 0) ?? product.totalStock ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Warehouse</p>
              <p className="text-sm text-white mt-1">
                {product.warehouse || "Not configured"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Low Stock Alert</p>
              <p className="text-sm text-white mt-1">
                {product.lowStockThreshold == null ? "Not configured" : `${product.lowStockThreshold} units`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 7. Shipping & Package Details */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("shipping")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <Truck size={16} /> Shipping & Package Details
          </h3>
          {openSections.shipping ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.shipping && (
          <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-4">
            {[
              { label: "Weight", value: product.shipping?.weight },
              { label: "Length", value: product.shipping?.length },
              { label: "Width", value: product.shipping?.width },
              { label: "Height", value: product.shipping?.height },
            ].map((field, idx) => (
              <div key={idx}>
                <p className="text-xs text-[#94A3B8]">{field.label}</p>
                <p className="text-sm text-white mt-1">
                  {field.value || "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. Return & Exchange */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("returns")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <RotateCcw size={16} /> Return & Exchange
          </h3>
          {openSections.returns ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.returns && (
          <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#94A3B8]">Returnable</p>
                <p
                  className={`text-sm mt-1 font-semibold ${
                    product.settings?.returnable
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {product.settings?.returnable ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Exchange Available</p>
                <p
                  className={`text-sm mt-1 font-semibold ${
                    product.settings?.exchangeAvailable
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {product.settings?.exchangeAvailable ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Return Policy</p>
              <p className="text-sm text-white mt-1">
                {product.returnPolicy || "Standard 7-day return policy"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 9. Product Tags */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("tags")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <Tag size={16} /> Product Tags
          </h3>
          {openSections.tags ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.tags && (
          <div className="px-5 pb-5 border-t border-white/5 pt-4">
            {product.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      navigate(
                        `/dashboard/products?tag=${encodeURIComponent(tag)}`
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#C026D3]/10 text-[#C026D3] text-sm hover:bg-[#C026D3]/20 transition-all"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[#94A3B8] text-sm">No tags available</p>
            )}
          </div>
        )}
      </div>

      {/* 10. Additional Settings */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("settings")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <Star size={16} /> Additional Settings
          </h3>
          {openSections.settings ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.settings && (
          <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-4">
            {[
              { label: "New Arrival", key: "newArrival" },
              { label: "Featured", key: "featured" },
              { label: "Best Seller", key: "bestSeller" },
              { label: "Returnable", key: "returnable" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white/5 rounded-lg p-3"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.settings?.[item.key]
                      ? "bg-emerald-400"
                      : "bg-gray-500"
                  }`}
                />
                <span className="text-sm text-white">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 11. Activity History */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <button
          onClick={() => toggleSection("activity")}
          className="w-full flex items-center justify-between p-5"
        >
          <h3 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
            <History size={16} /> Activity History
          </h3>
          {openSections.activity ? (
            <ChevronDown size={18} className="text-[#94A3B8]" />
          ) : (
            <ChevronRight size={18} className="text-[#94A3B8]" />
          )}
        </button>
        {openSections.activity && (
          <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
            {/* Mock activity items — replace with product.activityLog */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <User size={14} className="text-[#C026D3] mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-white">
                  Product Created by{" "}
                  <span className="text-[#C026D3]">
                    {product.createdBy || "Admin"}
                  </span>
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(product.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <Edit size={14} className="text-blue-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-white">
                  Last Updated by{" "}
                  <span className="text-blue-400">Admin</span>
                </p>
                <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(product.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;
