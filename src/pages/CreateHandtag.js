import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  ArrowLeft, Tag, Package, Eye, Download, Printer,
  Save, ChevronDown, Loader2, Sparkles
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

// Format presets
const FORMATS = [
  { id: "small", label: "Small", width: 200, height: 300 },
  { id: "medium", label: "Medium", width: 250, height: 400 },
  { id: "large", label: "Large", width: 300, height: 500 },
  { id: "custom", label: "Custom", width: 250, height: 400 },
];

const SELECT_CLASS =
  "w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 cursor-pointer";

const CreateHandtag = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const previewRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    format: "medium",
    customWidth: 250,
    customHeight: 400,
    // Display options
    showBrand: true,
    showMRP: true,
    showDiscount: true,
    showSize: true,
    showColor: true,
    showSKU: true,
    showQR: false,
    // Product snapshot (for preview)
    productName: "",
    brand: "",
    mrp: 0,
    sellingPrice: 0,
    discount: 0,
    size: "",
    color: "",
    sku: "",
  });

  const getToken = () => sessionStorage.getItem("adminToken");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API}/products?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setProducts(res.data.products || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Load handtag in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchHandtag = async () => {
        try {
          const token = getToken();
          const res = await axios.get(`${API}/handtags/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.success) setFormData(res.data.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchHandtag();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Auto-fill product info when selected
  const handleProductSelect = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const firstVariant = product.variants?.[0];
    const firstSize = firstVariant?.sizes?.[0];

    setFormData((prev) => ({
      ...prev,
      productId,
      productName: product.name || "",
      brand: product.brand || "",
      mrp: firstVariant?.price || 0,
      sellingPrice: firstVariant?.discountPrice || firstVariant?.price || 0,
      discount: firstVariant?.discountPrice
        ? Math.round(((firstVariant.price - firstVariant.discountPrice) / firstVariant.price) * 100)
        : 0,
      size: firstSize?.size || "",
      color: firstVariant?.color || "",
      sku: firstVariant?.sku || firstSize?.sku || "",
    }));
  };

  const getFormatSize = () => {
    if (formData.format === "custom") {
      return {
        width: Number(formData.customWidth) || 250,
        height: Number(formData.customHeight) || 400,
      };
    }
    const f = FORMATS.find((f) => f.id === formData.format);
    return { width: f?.width || 250, height: f?.height || 400 };
  };

  // Generate PDF
  const handleGeneratePDF = async () => {
    if (!previewRef.current) return;

    try {
      setGenerating(true);
      const { width, height } = getFormatSize();

      // Convert px to mm (approx: 1px = 0.264583mm at 96dpi)
      const widthMM = width * 0.264583;
      const heightMM = height * 0.264583;

      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: widthMM > heightMM ? "landscape" : "portrait",
        unit: "mm",
        format: [widthMM, heightMM],
      });

      pdf.addImage(imgData, "PNG", 0, 0, widthMM, heightMM);
      pdf.save(`handtag-${formData.productName || "product"}.pdf`);

      Swal.fire({
        title: "Success!",
        text: "PDF downloaded successfully",
        icon: "success",
        background: "#071236",
        color: "#FFFFFF",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to generate PDF",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Save handtag
  const handleSave = async () => {
    if (!formData.productId) {
      Swal.fire({
        title: "Error!",
        text: "Please select a product",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
      });
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const url = isEditMode ? `${API}/handtags/${id}` : `${API}/handtags`;
      const method = isEditMode ? "put" : "post";

      const res = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: `Handtag ${isEditMode ? "updated" : "created"}`,
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => navigate("/dashboard/handtags"), 1500);
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to save handtag",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
      });
    } finally {
      setLoading(false);
    }
  };

  const { width, height } = getFormatSize();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/handtags")}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isEditMode ? "Edit Handtag" : "Create Handtag"}
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Select product, choose format, and generate printable handtag
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ============ LEFT: FORM ============ */}
        <div className="space-y-6">
          {/* Product Select */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package size={18} className="text-[#C026D3]" />
              Select Product
            </h2>
            <select
              value={formData.productId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className={SELECT_CLASS}
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} {p.brand ? `(${p.brand})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Format Select */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#C026D3]" />
              Select Format
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, format: f.id }))}
                  className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                    formData.format === f.id
                      ? "bg-[#C026D3]/20 border-[#C026D3] text-white"
                      : "bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10"
                  }`}
                >
                  {f.label}
                  <p className="text-xs opacity-70 mt-1">
                    {f.width}×{f.height}
                  </p>
                </button>
              ))}
            </div>

            {formData.format === "custom" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Width (px)</label>
                  <input
                    type="number"
                    name="customWidth"
                    value={formData.customWidth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Height (px)</label>
                  <input
                    type="number"
                    name="customHeight"
                    value={formData.customHeight}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Display Options */}
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Tag size={18} className="text-[#C026D3]" />
              Display Options
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "showBrand", label: "Brand Name" },
                { key: "showMRP", label: "MRP" },
                { key: "showDiscount", label: "Discount %" },
                { key: "showSize", label: "Size" },
                { key: "showColor", label: "Color" },
                { key: "showSKU", label: "SKU" },
                { key: "showQR", label: "QR Code" },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={opt.key}
                    checked={formData[opt.key]}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3]"
                  />
                  <span className="text-white text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Saving...</>
              ) : (
                <><Save size={18} /> Save Handtag</>
              )}
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={generating || !formData.productId}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold transition-all disabled:opacity-50 hover:shadow-lg"
            >
              {generating ? (
                <><Loader2 size={18} className="animate-spin" /> Generating...</>
              ) : (
                <><Download size={18} /> Download PDF</>
              )}
            </button>
          </div>
        </div>

        {/* ============ RIGHT: LIVE PREVIEW ============ */}
        <div className="space-y-6">
          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye size={18} className="text-[#C026D3]" />
              Live Preview
            </h2>

            <div className="flex justify-center">
              <div
                ref={previewRef}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                  padding: "12px",
                  fontFamily: "Arial, sans-serif",
                  color: "#000",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Brand */}
                {formData.showBrand && formData.brand && (
                  <div style={{ textAlign: "center", borderBottom: "1px solid #000", paddingBottom: "4px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "1px" }}>
                      {formData.brand.toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Product Name */}
                <div style={{ textAlign: "center", margin: "8px 0" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", lineHeight: "1.3" }}>
                    {formData.productName || "Product Name"}
                  </div>
                </div>

                {/* Size & Color */}
                <div style={{ display: "flex", justifyContent: "space-around", fontSize: "10px" }}>
                  {formData.showSize && formData.size && (
                    <div><strong>Size:</strong> {formData.size}</div>
                  )}
                  {formData.showColor && formData.color && (
                    <div><strong>Color:</strong> {formData.color}</div>
                  )}
                </div>

                {/* Price */}
                <div style={{ textAlign: "center", margin: "8px 0" }}>
                  {formData.showMRP && formData.mrp > 0 && (
                    <div style={{ fontSize: "11px" }}>
                      <span style={{ textDecoration: "line-through", color: "#666" }}>
                        MRP: ₹{formData.mrp}
                      </span>
                    </div>
                  )}
                  <div style={{ fontSize: "18px", fontWeight: "bold", marginTop: "2px" }}>
                    ₹{formData.sellingPrice || 0}
                  </div>
                  {formData.showDiscount && formData.discount > 0 && (
                    <div style={{ fontSize: "11px", fontWeight: "bold", color: "#C026D3" }}>
                      ({formData.discount}% OFF)
                    </div>
                  )}
                </div>

                {/* SKU + QR */}
                <div style={{ textAlign: "center", fontSize: "9px", marginTop: "auto", paddingTop: "6px", borderTop: "1px solid #ccc" }}>
                  {formData.showSKU && formData.sku && (
                    <div style={{ fontFamily: "monospace" }}>SKU: {formData.sku}</div>
                  )}
                  {formData.showQR && (
                    <div style={{ marginTop: "4px", fontSize: "8px", color: "#666" }}>
                      [QR Code]
                    </div>
                  )}
                  <div style={{ fontSize: "8px", color: "#999", marginTop: "2px" }}>
                    Made in India
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] text-center mt-4">
              Format: {width} × {height} px
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHandtag;