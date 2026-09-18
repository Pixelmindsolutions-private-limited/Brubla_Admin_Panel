import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const CreateCoupon = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id; // Agar id hai to Edit mode

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "Percentage",
    discountValue: "",
    maxDiscount: "",
    minOrder: "",
    usageLimit: "",
    perCustomerLimit: "",
    startDate: "",
    endDate: "",
    status: "Active",
  });

  // Agar Edit mode hai, to purana data fetch karo
  useEffect(() => {
    if (isEditMode) {
      // Real app: axios.get(`${API}/coupons/${id}`)
      const mockCoupon = {
        code: "WELCOME500",
        discountType: "Flat Amount",
        discountValue: "500",
        maxDiscount: "500",
        minOrder: "2000",
        usageLimit: "50",
        perCustomerLimit: "1",
        startDate: "2026-09-01",
        endDate: "2026-09-15",
        status: "Active",
      };
      setFormData(mockCoupon);
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
      console.log("UPDATE Coupon:", id, formData);
      // Real: axios.put(`${API}/coupons/${id}`, formData)
    } else {
      console.log("CREATE Coupon:", formData);
      // Real: axios.post(`${API}/coupons`, formData)
    }

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/coupons");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isEditMode ? "Edit Coupon" : "Create Coupon"}
        </h1>
        {isEditMode && (
          <span className="text-xs text-[#94A3B8] bg-white/5 px-3 py-1 rounded-lg">
            ID: {id}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-5">

        {/* Coupon Code */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g. WELCOME500"
            className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
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
                <option>Flat Amount</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Discount Value</label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
        </div>

        {/* Max & Min */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Maximum Discount</label>
            <input
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
              placeholder="e.g. 500"
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
              placeholder="e.g. 999"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
        </div>

        {/* Usage Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Usage Limit</label>
            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="e.g. 100"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Per Customer Limit</label>
            <input
              type="number"
              name="perCustomerLimit"
              value={formData.perCustomerLimit}
              onChange={handleChange}
              placeholder="e.g. 1"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
        </div>

        {/* Dates */}
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
            <label className="block text-sm font-semibold text-white mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Status</label>
          <div className="relative w-48">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            >
              <option>Active</option>
              <option>Inactive</option>
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
            {loading ? "Saving..." : isEditMode ? "Update Coupon" : "Create Coupon"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateCoupon;