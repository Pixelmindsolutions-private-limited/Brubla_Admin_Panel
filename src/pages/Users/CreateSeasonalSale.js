import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Upload, ImageIcon } from "lucide-react";

const CreateSeasonalSale = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bannerImage: null,
    discountType: "Percentage",
    discountValue: "",
    applyTo: "Selected Products",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    status: "Active",
  });

  const [bannerPreview, setBannerPreview] = useState(null);

  // Load existing data for Edit mode
  useEffect(() => {
    if (isEditMode) {
      // Real: axios.get(`${API}/seasonal-sales/${id}`)
      const mockSale = {
        name: "Diwali Sale",
        discountType: "Percentage",
        discountValue: "40",
        applyTo: "Selected Products",
        startDate: "2026-10-01",
        startTime: "10:00",
        endDate: "2026-11-15",
        endTime: "23:59",
        status: "Active",
      };
      setFormData((prev) => ({ ...prev, ...mockSale }));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImage: file }));
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (isEditMode) {
      console.log("UPDATE Sale:", id, formData);
      // Real: axios.put(`${API}/seasonal-sales/${id}`, formData)
    } else {
      console.log("CREATE Sale:", formData);
      // Real: axios.post(`${API}/seasonal-sales`, formData)
    }

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/seasonal-sales");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isEditMode ? "Edit Seasonal Sale" : "Create Seasonal Sale"}
        </h1>
        {isEditMode && (
          <span className="text-xs text-[#94A3B8] bg-white/5 px-3 py-1 rounded-lg">
            ID: {id}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-6">

        {/* Sale Name */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Sale Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Diwali Sale"
            className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        {/* Banner Image */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Banner / Campaign Image</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm flex items-center gap-2">
              <Upload size={16} /> Upload Image
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
            </label>
            {bannerPreview && (
              <img src={bannerPreview} alt="Banner Preview" className="w-20 h-12 rounded-lg object-cover border border-white/10" />
            )}
            {!bannerPreview && (
              <div className="w-20 h-12 rounded-lg bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-[#94A3B8]">
                <ImageIcon size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Discount Type & Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Discount Type</label>
            <div className="relative">
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
              >
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Discount Value</label>
            <div className="relative">
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                placeholder="30"
                className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 pr-10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                {formData.discountType === "Percentage" ? "%" : "₹"}
              </span>
            </div>
          </div>
        </div>

        {/* Apply To */}
        <div className="pt-4 border-t border-white/10">
          <label className="block text-sm font-semibold text-white mb-3">Apply To</label>
          <div className="space-y-2">
            {["All Products", "Category", "Subcategory", "Selected Products"].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="applyTo"
                  value={option}
                  checked={formData.applyTo === option}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#C026D3] bg-white/5 border-white/10 focus:ring-[#C026D3]"
                />
                <span className="text-sm text-white">{option}</span>
              </label>
            ))}
          </div>

          {formData.applyTo === "Selected Products" && (
            <button
              type="button"
              className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all"
            >
              [ Select Products ]
            </button>
          )}
        </div>

        {/* Validity Dates & Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
        </div>

        {/* Status */}
        <div className="pt-4 border-t border-white/10">
          <label className="block text-sm font-semibold text-white mb-2">Status</label>
          <div className="relative w-48">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            >
              <option>Active</option>
              <option>Scheduled</option>
              <option>Inactive</option>
              <option>Ended</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
          </div>
        </div>

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
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Sale"
              : "Create Sale"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateSeasonalSale;