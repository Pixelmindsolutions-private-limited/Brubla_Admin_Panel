import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Upload, ImageIcon, Plus } from "lucide-react";

// Backend base URL
const API_HOST = "http://31.97.228.17:4077";
const API_BASE = `${API_HOST}/api/admin`;

const AddCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState("Active");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [subcategories, setSubcategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Helper: build full image URL from relative path
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;      // already absolute
    if (path.startsWith("blob:")) return path;     // local preview
    return `${API_HOST}${path}`;                   // relative → absolute
  };

  // ---------- Load existing category in edit mode ----------
  useEffect(() => {
    if (!isEditMode) return;

    const fetchCategory = async () => {
      try {
        setFetching(true);
        setError("");

        const res = await fetch(`${API_BASE}/categories/${id}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Failed to load category");
        }

        const cat = data.category || data;
        setCategoryName(cat.name || "");
        setStatus(cat.isActive ? "Active" : "Disabled");
        setImagePreview(buildImageUrl(cat.image));
        setSubcategories(cat.subcategories || []);
      } catch (err) {
        setError(err.message || "Failed to load category.");
      } finally {
        setFetching(false);
      }
    };

    fetchCategory();
  }, [id, isEditMode]);

  // ---------- Image upload ----------
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // local preview
    }
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", categoryName.trim());
      formData.append("isActive", status === "Active" ? "true" : "false");
      if (imageFile) formData.append("image", imageFile);

      const url = isEditMode
        ? `${API_BASE}/categories/${id}`
        : `${API_BASE}/categories`;

      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        body: formData,
        // DO NOT set Content-Type manually with FormData
        // If auth needed:
        // headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Something went wrong");
      }

      // Use the backend's returned image path for the preview
      const savedCat = data.category;
      if (savedCat?.image) {
        setImagePreview(buildImageUrl(savedCat.image));
      }

      setSuccess(
        data.message ||
          (isEditMode ? "Category updated!" : "Category created!")
      );

      // Optionally reset form after create
      if (!isEditMode) {
        setCategoryName("");
        setImageFile(null);
        setStatus("Active");
      }

      // Navigate back after a short delay
      setTimeout(() => navigate("/dashboard/categories"), 900);
    } catch (err) {
      setError(err.message || "Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Loading state ----------
  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64 text-[#94A3B8]">
        Loading category...
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isEditMode ? "Edit Category" : "Add Category"}
        </h1>
        {isEditMode && (
          <span className="text-xs text-[#94A3B8] bg-white/5 px-3 py-1 rounded-lg">
            ID: {id}
          </span>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-6"
      >
        {/* Category Name */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Category Name
          </label>
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
          <label className="block text-sm font-semibold text-white mb-2">
            Category Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/80?text=No+Image";
                }}
                className="w-20 h-20 rounded-xl object-cover border border-white/10"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-[#94A3B8]">
                <ImageIcon size={20} />
              </div>
            )}
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm flex items-center gap-2">
              <Upload size={16} />
              {imagePreview ? "Replace Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Status
          </label>
          <div className="relative w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            >
              <option>Active</option>
              <option>Disabled</option>
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={16}
            />
          </div>
        </div>

        {/* Subcategories (Edit mode only) */}
        {isEditMode && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider">
                Subcategories
              </h2>
              <button
                type="button"
                onClick={() =>
                  navigate(`/dashboard/categories/${id}/subcategories/create`)
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30 transition-all"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {subcategories.length === 0 ? (
              <p className="text-xs text-[#94A3B8]">No subcategories yet.</p>
            ) : (
              <div className="space-y-2">
                {subcategories.map((sub, idx) => (
                  <div
                    key={sub._id || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <span className="text-sm text-white">{sub.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#94A3B8]">
                        {sub.products ?? 0} products
                      </span>
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
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Save"
              : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;