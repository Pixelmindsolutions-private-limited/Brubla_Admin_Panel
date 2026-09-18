import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Upload, ImageIcon, Plus, X } from "lucide-react";

const AddCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState("Active");
  const [imagePreview, setImagePreview] = useState(null);

  const [subcategories, setSubcategories] = useState([
    { name: "T-Shirts", products: 32 },
    { name: "Shirts", products: 28 },
    { name: "Jeans", products: 24 },
    { name: "Trousers", products: 18 },
    { name: "Jackets", products: 12 },
    { name: "Accessories", products: 10 },
  ]);

  // Load in edit mode
  useEffect(() => {
    if (isEditMode) {
      setCategoryName("Men's Fashion");
      setStatus("Active");
      setImagePreview("https://via.placeholder.com/100");
    }
  }, [id, isEditMode]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isEditMode ? "Update Category" : "Create Category", { categoryName, status });
    navigate("/dashboard/categories");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isEditMode ? "Edit Category" : "Add Category"}
        </h1>
        {isEditMode && (
          <span className="text-xs text-[#94A3B8] bg-white/5 px-3 py-1 rounded-lg">ID: {id}</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-6">

        {/* Category Name */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Men's Fashion"
            className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        {/* Category Image */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Category Image</label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-white/10" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-[#94A3B8]">
                <ImageIcon size={20} />
              </div>
            )}
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm flex items-center gap-2">
              <Upload size={16} /> {imagePreview ? "Replace Image" : "Upload Image"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Status</label>
          <div className="relative w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            >
              <option>Active</option>
              <option>Disabled</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
          </div>
        </div>

        {/* Subcategories Section (Only in Edit Mode) */}
        {isEditMode && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider">Subcategories</h2>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/categories/${id}/subcategories/create`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30 transition-all"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="space-y-2">
              {subcategories.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <span className="text-sm text-white">{sub.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#94A3B8]">{sub.products} products</span>
                    <button
                      type="button"
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      view
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all"
          >
            {isEditMode ? "Save" : "Create Category"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddCategory;