import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const API = "http://31.97.228.17:4077/api/admin";
const config = () => ({ headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken") || ""}` } });

export default function StockAdjustmentDynamic() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productId = params.get("productId");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [variantId, setVariantId] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("add");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API}/products/stock`, config()).then(({ data }) => {
      const list = data.data?.products || data.data || [];
      setProducts(list);
      if (productId) loadProduct(productId);
    }).catch((e) => setError(e.response?.data?.message || "Could not load products."));
  }, [productId]);

  const loadProduct = async (id) => {
    setError("");
    try {
      const { data } = await axios.get(`${API}/products/${id}/stock`, config());
      setProduct(data.data);
      setVariantId(""); setSize("");
    } catch (e) { setError(e.response?.data?.message || "Could not load product stock."); }
  };

  const variant = product?.variants?.find((item) => item.variantId === variantId);
  const selectedSize = variant?.sizes?.find((item) => item.size === size);
  const submit = async (event) => {
    event.preventDefault();
    if (!product || !variantId || !size || !reason.trim() || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      setError("Select a variant and size, enter a positive quantity, and provide a reason."); return;
    }
    setBusy(true); setError("");
    try {
      await axios.put(`${API}/products/${product.productId}/stock`, { variantId, size, quantity: Number(quantity), type, reason: reason.trim() }, config());
      navigate("/dashboard/stock-management");
    } catch (e) { setError(e.response?.data?.message || "Stock adjustment failed."); }
    finally { setBusy(false); }
  };

  return <div className="max-w-3xl mx-auto space-y-6 text-white"><h1 className="text-2xl font-bold">Adjust Stock</h1><form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-[#071236]/50 p-6">
    {!productId && <label className="block text-sm">Product<select value={product?.productId || ""} onChange={(e) => e.target.value && loadProduct(e.target.value)} className="mt-2 w-full rounded-xl bg-[#071236] border border-white/10 p-3"><option value="">Select product</option>{products.map((item) => <option key={item.productId} value={item.productId}>{item.productName} · {item.sku}</option>)}</select></label>}
    {product && <><div className="rounded-xl bg-white/5 p-4"><strong>{product.productName}</strong><p className="text-sm text-[#94A3B8]">Total stock: {product.totalStock}</p></div><div className="grid gap-4 md:grid-cols-2"><label className="text-sm">Variant<select required value={variantId} onChange={(e) => { setVariantId(e.target.value); setSize(""); }} className="mt-2 w-full rounded-xl bg-[#071236] border border-white/10 p-3"><option value="">Select color variant</option>{product.variants.map((item) => <option key={item.variantId} value={item.variantId}>{item.color} · {item.sku}</option>)}</select></label><label className="text-sm">Size<select required value={size} onChange={(e) => setSize(e.target.value)} disabled={!variant} className="mt-2 w-full rounded-xl bg-[#071236] border border-white/10 p-3"><option value="">Select size</option>{variant?.sizes.map((item) => <option key={item.sizeId} value={item.size}>{item.size} (current: {item.quantity})</option>)}</select></label><label className="text-sm">Adjustment type<select value={type} onChange={(e) => setType(e.target.value)} className="mt-2 w-full rounded-xl bg-[#071236] border border-white/10 p-3"><option value="add">Add stock</option><option value="remove">Remove stock</option></select></label><label className="text-sm">Quantity<input type="number" min="1" step="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-2 w-full rounded-xl bg-[#071236] border border-white/10 p-3" /></label></div>{selectedSize && <p className="text-sm text-[#94A3B8]">Selected size currently has {selectedSize.quantity} units.</p>}<label className="block text-sm">Reason<input required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Restock, damaged goods, stock count correction…" className="mt-2 w-full rounded-xl bg-[#071236] border border-white/10 p-3" /></label></>}
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={() => navigate(-1)} className="rounded-xl bg-white/10 px-5 py-2.5">Cancel</button><button disabled={busy || !product} className="rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] px-5 py-2.5 font-semibold disabled:opacity-50">{busy ? "Saving…" : "Apply Adjustment"}</button></div>
  </form></div>;
}
