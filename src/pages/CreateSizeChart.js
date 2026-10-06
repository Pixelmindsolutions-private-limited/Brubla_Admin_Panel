import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE, API_HOST, getToken } from "../config";
import {
  ArrowLeft, Save, Plus, Trash2, Ruler, Package,
  Eye, X, Loader2, PlusCircle
} from "lucide-react";

const ADMIN_API = API_BASE;
const API = `${API_HOST}/api/admin`;

const SELECT_CLASS =
  "w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 cursor-pointer";

const CreateSizeChart = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);
  const [loadingSizes, setLoadingSizes] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    category: "",
    // Dynamic columns
    measurements: ["Chest", "Shoulder", "Length", "Sleeve"],
    // Dynamic size rows
    sizes: [],
    notes: "",
    isActive: true,
  });

  const [newMeasurement, setNewMeasurement] = useState("");

  // Fetch products for the selector
  useEffect(() => {
    const fetchProducts = async () => {
      const url = `${ADMIN_API}/products?limit=200`;
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Admin token was not found in sessionStorage.");
        }

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 200 },
        });
        const payload = res.data;
        const productList = [
          payload?.products,
          payload?.data,
          payload?.data?.products,
          payload?.result,
        ].find(Array.isArray);

        if (!res.data?.success) {
          throw new Error(payload?.message || "The products endpoint returned success: false.");
        }
        if (!productList) {
          console.error("Unexpected products response shape:", payload);
          throw new Error("The products response did not contain a product list.");
        }

        setProducts(productList.filter((product) => product && product._id));
        setProductsError("");
        if (productList.length === 0) {
          console.info("Products request succeeded but returned an empty list.", { url, payload });
        }
      } catch (err) {
        const status = err.response?.status;
        const responseBody = err.response?.data;
        const message = responseBody?.message || err.message || "Failed to load products.";
        console.error("Failed to load products for size chart", {
          url,
          status,
          message,
          response: responseBody,
          error: err,
        });
        setProductsError(
          status === 401 || status === 403
            ? "Admin authentication failed. Please sign in again."
            : message,
        );
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch size chart in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchSizeChart = async () => {
        try {
          const token = getToken();
          const res = await axios.get(`${API}/size-charts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.success) {
            const sc = res.data.data;
            setFormData({
              productId: sc.productId?._id || sc.productId,
              productName: sc.productName,
              category: sc.category || "",
              measurements: sc.measurements || [],
              sizes: (sc.sizes || []).map((s) => ({
                size: s.size,
                values: s.values ? Object.fromEntries(Object.entries(s.values)) : {},
              })),
              notes: sc.notes || "",
              isActive: sc.isActive ?? true,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setFetching(false);
        }
      };
      fetchSizeChart();
    } else {
      setFetching(false);
    }
  }, [id, isEditMode]);

  // When product selected — fetch its available sizes
  const handleProductSelect = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    setFormData((prev) => ({
      ...prev,
      productId,
      productName: product.name,
      category: product.categoryId?.name || "",
    }));

    // Fetch available sizes from backend
    try {
      setLoadingSizes(true);
      const token = getToken();
      const res = await axios.get(
        `${API}/size-charts/products/${productId}/sizes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const sizes = res.data.data.sizes || [];
        setAvailableSizes(sizes);

        // Auto-generate size rows
        setFormData((prev) => ({
          ...prev,
          sizes: sizes.map((size) => ({
            size,
            values: prev.measurements.reduce(
              (acc, m) => ({ ...acc, [m]: "" }),
              {}
            ),
          })),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch sizes:", err);
      // Fallback: extract from product variants
      const sizesSet = new Set();
      product.variants?.forEach((v) => {
        v.sizes?.forEach((s) => {
          if (s.size) sizesSet.add(s.size);
        });
      });
      const sizes = Array.from(sizesSet);
      setAvailableSizes(sizes);
      setFormData((prev) => ({
        ...prev,
        sizes: sizes.map((size) => ({
          size,
          values: prev.measurements.reduce((acc, m) => ({ ...acc, [m]: "" }), {}),
        })),
      }));
    } finally {
      setLoadingSizes(false);
    }
  };

  // Add measurement column
  const addMeasurement = () => {
    if (!newMeasurement.trim()) return;
    if (formData.measurements.includes(newMeasurement.trim())) {
      Swal.fire({
        title: "Duplicate!",
        text: "Ye measurement column already exists.",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return;
    }

    const newCol = newMeasurement.trim();
    setFormData((prev) => ({
      ...prev,
      measurements: [...prev.measurements, newCol],
      sizes: prev.sizes.map((s) => ({
        ...s,
        values: { ...s.values, [newCol]: "" },
      })),
    }));
    setNewMeasurement("");
  };

  const removeMeasurement = (colToRemove) => {
    setFormData((prev) => ({
      ...prev,
      measurements: prev.measurements.filter((m) => m !== colToRemove),
      sizes: prev.sizes.map((s) => {
        const newValues = { ...s.values };
        delete newValues[colToRemove];
        return { ...s, values: newValues };
      }),
    }));
  };

  const addSizeRow = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        {
          size: "",
          values: prev.measurements.reduce((acc, m) => ({ ...acc, [m]: "" }), {}),
        },
      ],
    }));
  };

  const removeSizeRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const updateSizeValue = (rowIndex, colName, value) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s, i) =>
        i === rowIndex ? { ...s, values: { ...s.values, [colName]: value } } : s
      ),
    }));
  };

  const updateSizeName = (rowIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((s, i) => (i === rowIndex ? { ...s, size: value } : s)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && !formData.productId) {
      Swal.fire({ title: "Error!", text: "Please select a product", icon: "error", background: "#071236", color: "#FFF" });
      return;
    }
    if (!formData.measurements.length) {
      Swal.fire({ title: "Error!", text: "Add at least one measurement column", icon: "error", background: "#071236", color: "#FFF" });
      return;
    }
    if (!formData.sizes.length || formData.sizes.some((s) => !s.size)) {
      Swal.fire({ title: "Error!", text: "Add at least one size with name", icon: "error", background: "#071236", color: "#FFF" });
      return;
    }

    try {
      setLoading(true);
      const token = getToken();
      const url = isEditMode ? `${API}/size-charts/${id}` : `${API}/size-charts`;
      const method = isEditMode ? "put" : "post";

      const res = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Success!",
          text: `Size chart ${isEditMode ? "updated" : "created"} successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => navigate("/dashboard/size-charts"), 1500);
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to save size chart",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={32} className="text-[#C026D3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/size-charts")}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isEditMode ? "Edit Size Chart" : "Create Size Chart"}
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Select product, add measurement columns, and fill size values
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Select */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
            <Package size={16} /> SELECT PRODUCT
          </h2>
          <select
            value={formData.productId}
            onChange={(e) => handleProductSelect(e.target.value)}
            className={SELECT_CLASS}
            disabled={isEditMode || productsLoading || !!productsError}
          >
            <option value="">
              {productsLoading
                ? "Loading products..."
                : productsError
                  ? "Products could not be loaded"
                  : products.length === 0
                    ? "No products found"
                    : "-- Choose a Product --"}
            </option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} {p.brand ? `(${p.brand})` : ""}
              </option>
            ))}
          </select>
          {productsLoading && (
            <p className="mt-2 flex items-center gap-2 text-sm text-[#94A3B8]" role="status">
              <Loader2 size={14} className="animate-spin" /> Loading products...
            </p>
          )}
          {!productsLoading && productsError && (
            <p className="mt-2 text-sm text-red-400" role="alert">{productsError}</p>
          )}
          {!productsLoading && !productsError && products.length === 0 && (
            <p className="mt-2 text-sm text-[#94A3B8]" role="status">
              No products were returned. Check the Network response and that products are available to this admin account.
            </p>
          )}

          {formData.productName && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="text-[#94A3B8]">
                Product: <span className="text-white">{formData.productName}</span>
              </span>
              {formData.category && (
                <span className="text-[#94A3B8]">
                  Category: <span className="text-white">{formData.category}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Measurement Columns */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
            <Ruler size={16} /> MEASUREMENT COLUMNS
          </h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {formData.measurements.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C026D3]/10 text-[#C026D3] text-sm"
              >
                {m}
                <button
                  type="button"
                  onClick={() => removeMeasurement(m)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Waist, Hip, Inseam..."
              value={newMeasurement}
              onChange={(e) => setNewMeasurement(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMeasurement())}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
            <button
              type="button"
              onClick={addMeasurement}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C026D3]/20 hover:bg-[#C026D3]/30 text-[#C026D3] font-medium"
            >
              <PlusCircle size={16} /> Add Column
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#C026D3] flex items-center gap-2">
              <Ruler size={16} /> SIZE MEASUREMENTS
            </h2>
            {loadingSizes ? (
              <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                <Loader2 size={14} className="animate-spin" /> Loading sizes...
              </div>
            ) : (
              <button
                type="button"
                onClick={addSizeRow}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
              >
                <Plus size={14} /> Add Size Row
              </button>
            )}
          </div>

          {formData.sizes.length === 0 ? (
            <div className="text-center py-10 text-[#94A3B8]">
              {formData.productId
                ? "No sizes found for this product. Add manually."
                : "Select a product to auto-load its sizes."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-white/10 rounded-xl overflow-hidden">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase">
                      Size
                    </th>
                    {formData.measurements.map((m) => (
                      <th key={m} className="px-3 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase">
                        {m}
                      </th>
                    ))}
                    <th className="px-3 py-3 text-right text-xs font-semibold text-[#94A3B8] uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {formData.sizes.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={row.size}
                          onChange={(e) => updateSizeName(rowIndex, e.target.value)}
                          placeholder="S/M/28/Free"
                          className="w-24 px-2 py-1.5 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                        />
                      </td>
                      {formData.measurements.map((m) => (
                        <td key={m} className="px-3 py-2">
                          <input
                            type="text"
                            value={row.values[m] || ""}
                            onChange={(e) => updateSizeValue(rowIndex, m, e.target.value)}
                            placeholder="—"
                            className="w-24 px-2 py-1.5 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeSizeRow(rowIndex)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <label className="block text-sm font-semibold text-white mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
            rows="3"
            className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 resize-none"
            placeholder="e.g., All measurements are in inches. Size may vary ±0.5 inch."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/size-charts")}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={16} /> {isEditMode ? "Update" : "Create"} Size Chart</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSizeChart;
