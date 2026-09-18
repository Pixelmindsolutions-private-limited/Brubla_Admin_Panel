import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const CreatePromoCode = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "Percentage",
    discountValue: "",
    maxDiscount: "",
    minOrder: "",
    applyTo: "All Products",
    customerEligibility: "All Customers",
    totalUsage: "",
    perCustomer: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    status: "Scheduled",
  });

  // Load existing data if Edit mode
  useEffect(() => {
    if (isEditMode) {
      // Real app: axios.get(`${API}/promo-codes/${id}`)
      const mockPromo = {
        code: "FESTIVE20",
        name: "Festive Season Offer",
        description: "20% off on selected products during festive season",
        discountType: "Percentage",
        discountValue: "20",
        maxDiscount: "500",
        minOrder: "999",
        applyTo: "Selected Products",
        customerEligibility: "All Customers",
        totalUsage: "200",
        perCustomer: "1",
        startDate: "2026-09-01",
        startTime: "10:00",
        endDate: "2026-10-31",
        endTime: "23:59",
        status: "Active",
      };
      setFormData(mockPromo);
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (isEditMode) {
      console.log("UPDATE Promo:", id, formData);
      // Real: axios.put(`${API}/promo-codes/${id}`, formData)
    } else {
      console.log("CREATE Promo:", formData);
      // Real: axios.post(`${API}/promo-codes`, formData)
    }

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/promo-codes");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isEditMode ? "Edit Promo Code" : "Create Promo Code"}
        </h1>
        {isEditMode && (
          <span className="text-xs text-[#94A3B8] bg-white/5 px-3 py-1 rounded-lg">
            ID: {id}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-6">

        {/* === Basic Details === */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider border-b border-white/10 pb-2">Basic Details</h2>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Promo Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. BRUBLA20"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Promo Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. New Customer Offer"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description..."
              rows="2"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 resize-none"
            />
          </div>
        </div>

        {/* === Discount Details === */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider pb-2">Discount Details</h2>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Discount Type</label>
            <div className="flex gap-6">
              {["Percentage", "Fixed Amount"].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="discountType"
                    value={type}
                    checked={formData.discountType === type}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#C026D3] bg-white/5 border-white/10 focus:ring-[#C026D3]"
                  />
                  <span className="text-sm text-white">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Discount Value</label>
              <div className="relative">
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder="20"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 pr-10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  {formData.discountType === "Percentage" ? "%" : "₹"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Maximum Discount</label>
              <input
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                placeholder="₹500"
                className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Minimum Order Value</label>
              <input
                type="number"
                name="minOrder"
                value={formData.minOrder}
                onChange={handleChange}
                placeholder="₹999"
                className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
              />
            </div>
          </div>
        </div>

        {/* === Applicable Products === */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider pb-2">Applicable Products</h2>
          <label className="block text-sm font-semibold text-white mb-2">Apply To</label>
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
        </div>

        {/* === Customer Eligibility === */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider pb-2">Customer Eligibility</h2>
          <div className="space-y-2">
            {["All Customers", "New Customers Only", "Selected Customers"].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="customerEligibility"
                  value={option}
                  checked={formData.customerEligibility === option}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#C026D3] bg-white/5 border-white/10 focus:ring-[#C026D3]"
                />
                <span className="text-sm text-white">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* === Usage Limits === */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider pb-2">Usage Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Total Usage Limit</label>
              <input
                type="number"
                name="totalUsage"
                value={formData.totalUsage}
                onChange={handleChange}
                placeholder="500"
                className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Per Customer</label>
              <input
                type="number"
                name="perCustomer"
                value={formData.perCustomer}
                onChange={handleChange}
                placeholder="1"
                className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
              />
            </div>
          </div>
        </div>

        {/* === Validity === */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider pb-2">Validity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* === Status === */}
        <div className="pt-4 border-t border-white/10">
          <label className="block text-sm font-semibold text-white mb-2">Status</label>
          <div className="relative w-48">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            >
              <option>Scheduled</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Expired</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
          </div>
        </div>

        {/* === Action Buttons === */}
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
              ? "Update Promo Code"
              : "Create Promo Code"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreatePromoCode;