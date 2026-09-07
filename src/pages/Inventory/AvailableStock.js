import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AlertCircle, Boxes, RefreshCw } from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const AvailableStock = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [loading, setLoading] = useState(true);
  const token = () => sessionStorage.getItem("adminToken");

  const load = async () => {
    setLoading(true);
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        axios.get(`${API}/products`, { headers: { Authorization: `Bearer ${token()}` } }),
        axios.get(`${API}/categories`, { headers: { Authorization: `Bearer ${token()}` } }),
      ]);
      if (productResponse.data.success) setProducts(productResponse.data.products || []);
      if (categoryResponse.data.success) setCategories(categoryResponse.data.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const selectedCategory = categories.find((item) => item._id === categoryId);
  const rows = useMemo(() => products.filter((product) => {
    const productCategory = product.categoryId?._id || product.categoryId;
    return (!categoryId || productCategory === categoryId) && (!subcategory || product.subcategoryName === subcategory);
  }), [products, categoryId, subcategory]);
  const stockOf = (product) => Array.isArray(product.sizes) ? product.sizes.reduce((sum, size) => sum + Number(size.stock || 0), 0) : Number(product.stock || 0);

  return <div className="space-y-6">
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div><h1 className="text-2xl font-bold text-white">Available Stock</h1><p className="text-sm text-[#94A3B8] mt-1">Live product inventory from the existing product catalogue.</p></div>
      <button onClick={load} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white" aria-label="Refresh stock"><RefreshCw size={18} /></button>
    </div>
    <div className="grid md:grid-cols-2 gap-4 bg-[#071236]/50 border border-white/10 rounded-2xl p-4">
      <label className="text-sm text-white">Category<select value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setSubcategory(""); }} className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white"><option value="">All categories</option>{categories.map((item) => <option className="text-black" key={item._id} value={item._id}>{item.name}</option>)}</select></label>
      <label className="text-sm text-white">Subcategory<select value={subcategory} onChange={(event) => setSubcategory(event.target.value)} disabled={!selectedCategory} className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white disabled:opacity-50"><option value="">All subcategories</option>{(selectedCategory?.subcategories || []).map((item) => <option className="text-black" key={item._id} value={item.name}>{item.name}</option>)}</select></label>
    </div>
    {loading ? <div className="py-16 text-center text-[#94A3B8]">Loading inventory…</div> : rows.length === 0 ? <div className="py-16 text-center rounded-2xl bg-[#071236]/50 border border-white/10"><AlertCircle className="mx-auto text-[#94A3B8] mb-3" /><p className="text-white">No products match these filters.</p></div> : <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full text-sm"><thead className="bg-white/5 text-[#94A3B8]"><tr><th className="p-4 text-left">Product</th><th className="p-4 text-left">Category</th><th className="p-4 text-left">Subcategory</th><th className="p-4 text-left">Available stock</th></tr></thead><tbody>{rows.map((product) => <tr key={product._id} className="border-t border-white/10 text-white"><td className="p-4 font-medium">{product.name}</td><td className="p-4">{product.categoryId?.name || "—"}</td><td className="p-4">{product.subcategoryName || "—"}</td><td className="p-4"><span className="inline-flex items-center gap-2"><Boxes size={15} className="text-[#C026D3]" />{stockOf(product)}</span></td></tr>)}</tbody></table></div>}
  </div>;
};

export default AvailableStock;
