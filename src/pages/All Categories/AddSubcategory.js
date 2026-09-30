import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Upload, ImageIcon, ArrowLeft, AlertTriangle } from "lucide-react";

const API_HOST = "http://31.97.228.17:4077";
const API_BASE = `${API_HOST}/api/admin`;

// Convert relative image path → absolute URL
const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("blob:")) return path;
  return `${API_HOST}${path}`;
};

const AddSubcategory = () => {
  const navigate = useNavigate();
  const { id, subId } = useParams(); // id = categoryId, subId = subcategoryId (edit)
  const isEditMode = !!subId;

  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------- Load data ----------
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setFetching(true);
        setError("");

        // Always fetch parent category (for header/breadcrumb context)
        const catRes = await fetch(`${API_BASE}/categories/${id}`);
        const catData = await catRes.json();
        if (catRes.ok && catData.success !== false) {
          setParentCategory(catData.category || catData);
        }

        // If editing, load this subcategory
        if (isEditMode) {
          const subRes = await fetch(
            `${API_BASE}/categories/${id}/subcategories/${subId}`
          );
          const subData = await subRes.json();
          if (!subRes.ok || subData.success === false) {
            throw new Error(subData.message || "Failed to load subcategory");
          }
          const sub = subData.subcategory || subData;
          setName(sub.name || "");
          setStatus(sub.isActive ? "Active" : "Disabled");
          setImagePreview(buildImageUrl(sub.image));
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [id, subId, isEditMode]);

  // ---------- Image upload ----------
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2 MB.");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Subcategory name is required.");
      return;
    }

    if (!isEditMode && !imageFile) {
      setError("Subcategory image is required.");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("isActive", status === "Active" ? "true" : "false");
      if (imageFile) fd.append("image", imageFile);

      const url = isEditMode
        ? `${API_BASE}/categories/${id}/subcategories/${subId}`
        : `${API_BASE}/categories/${id}/subcategories`;

      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        body: fd,
        // DO NOT set Content-Type with FormData
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { success: false, message: `Server error (${res.status})` };
      }

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Something went wrong");
      }

      // Update preview from server response
      const saved = data.subcategory;
      if (saved?.image) {
        setImagePreview(buildImageUrl(saved.image));
      }

      setSuccess(
        data.message ||
          (isEditMode
            ? "Subcategory updated successfully!"
            : "Subcategory created successfully!")
      );

      // Redirect back to edit category page
      setTimeout(() => navigate(`/dashboard/categories/edit/${id}`), 900);
    } catch (err) {
      setError(err.message || "Failed to save subcategory.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Loading state ----------
  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64 text-[#94A3B8]">
        Loading...
      </div>
    );
  }

  // ---------- UI ----------
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(`/dashboard/categories/edit/${id}`)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {isEditMode ? "Edit Subcategory" : "Add Subcategory"}
          </h1>
          {parentCategory && (
            <p className="text-sm text-[#94A3B8] mt-1">
              In category:{" "}
              <span className="text-white font-medium">
                {parentCategory.name}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
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
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Subcategory Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. T-Shirts"
            className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Subcategory Image{" "}
            {!isEditMode && <span className="text-red-400">*</span>}
          </label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 rounded-xl object-cover border border-white/10"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/80?text=No+Image";
                }}
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
          <p className="text-xs text-[#94A3B8] mt-2">
            JPG / PNG / WEBP · max 2 MB
          </p>
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

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/categories/edit/${id}`)}
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
              ? "Save Changes"
              : "Create Subcategory"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubcategory;