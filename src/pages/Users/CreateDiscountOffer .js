import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

const CreateDiscountOffer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);

  const [offerName, setOfferName] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [applyTo, setApplyTo] = useState("All Products");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("Active");

  // Static product list
  const availableProducts = [
    { id: 1, name: "Cotton Shirt", price: "₹1,299" },
    { id: 2, name: "Linen Shirt", price: "₹1,499" },
    { id: 3, name: "Printed Shirt", price: "₹999" },
    { id: 4, name: "Casual Shirt", price: "₹1,199" },
  ];

  // Load existing data in Edit mode
  useEffect(() => {
    if (isEditMode) {
      // Real: axios.get(`${API}/offers/${id}`)
      const mockOffer = {
        offerName: "Summer Sale",
        discountType: "Percentage",
        discountValue: "20",
        applyTo: "Selected Products",
        selectedProducts: [1, 3],
        startDate: "2026-09-01",
        startTime: "10:00",
        endDate: "2026-09-15",
        endTime: "23:59",
        status: "Active",
      };
      setOfferName(mockOffer.offerName);
      setDiscountType(mockOffer.discountType);
      setDiscountValue(mockOffer.discountValue);
      setApplyTo(mockOffer.applyTo);
      setSelectedProducts(mockOffer.selectedProducts);
      setStartDate(mockOffer.startDate);
      setStartTime(mockOffer.startTime);
      setEndDate(mockOffer.endDate);
      setEndTime(mockOffer.endTime);
      setStatus(mockOffer.status);
    }
  }, [id, isEditMode]);

  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      offerName,
      discountType,
      discountValue,
      applyTo,
      selectedProducts,
      startDate,
      startTime,
      endDate,
      endTime,
      status,
    };

    if (isEditMode) {
      console.log("UPDATE Offer:", id, payload);
      // Real: axios.put(`${API}/offers/${id}`, payload)
    } else {
      console.log("CREATE Offer:", payload);
      // Real: axios.post(`${API}/offers`, payload)
    }

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/offers");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isEditMode ? "Edit Discount Offer" : "Create Discount Offer"}
        </h1>
        {isEditMode && (
          <span className="text-xs text-[#94A3B8] bg-white/5 px-3 py-1 rounded-lg">
            ID: {id}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-6">

        {/* Offer Name */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Offer Name</label>
          <input
            type="text"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            placeholder="e.g. Summer Shirt Sale"
            className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        {/* Discount Type & Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Discount Type</label>
            <div className="relative">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
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
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "Percentage" ? "e.g. 20%" : "e.g. 300"}
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
        </div>

        {/* Apply Offer To */}
        <div className="pt-4 border-t border-white/10">
          <label className="block text-sm font-semibold text-white mb-3">Apply Offer To</label>
          <div className="space-y-2">
            {["All Products", "Category", "Subcategory", "Selected Products"].map((option) => (
              <label key={option} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="applyTo"
                  value={option}
                  checked={applyTo === option}
                  onChange={(e) => setApplyTo(e.target.value)}
                  className="w-4 h-4 text-[#C026D3] bg-white/5 border-white/10 focus:ring-[#C026D3]"
                />
                <span className="text-sm text-white">{option}</span>
              </label>
            ))}
          </div>

          {applyTo === "Selected Products" && (
            <button
              type="button"
              className="mt-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10"
            >
              [ Select Products ]
            </button>
          )}
        </div>

        {/* Select Products Section */}
        {applyTo === "Selected Products" && (
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3">Select Products</h3>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
              <input
                type="text"
                placeholder="Search Product"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
              />
            </div>
            <div className="space-y-3">
              {availableProducts.map((prod) => (
                <label key={prod.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(prod.id)}
                      onChange={() => toggleProduct(prod.id)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
                    />
                    <span className="text-sm text-white">{prod.name}</span>
                  </div>
                  <span className="text-sm text-[#94A3B8]">{prod.price}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Validity Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Start Date & Time</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-28 px-3 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">End Date & Time</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-28 px-3 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
              />
            </div>
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
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Offer"
              : "Create Offer"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateDiscountOffer;