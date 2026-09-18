import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Upload, ImageIcon } from "lucide-react";

const AddSubcategory = () => {
  const navigate = useNavigate();
  const { id, subId } = useParams();
  const isEditMode = !!subId;

  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      setName("T-Shirts");
      setStatus("Active");
    }
  }, [subId, isEditMode]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isEditMode ? "Update Subcategory" : "Create Subcategory", { name, status, parentCategory: id });
    navigate(`/dashboard/categories/edit/${id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10 text-white">
      <h1 className="text-2xl md:text-3xl font-bold">
        {isEditMode ? "Edit Subcategory" : "Add Subcategory"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-6">

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Subcategory Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. T-Shirts"
            className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Subcategory Image</label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-white/10" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-[#94A3B8]">
                <ImageIcon size={20} />
              </div>
            )}
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2">
              <Upload size={16} /> Upload Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all">
            {isEditMode ? "Save Changes" : "Create Subcategory"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSubcategory;