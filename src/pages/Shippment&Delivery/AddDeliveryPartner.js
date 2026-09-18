import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const AddDeliveryPartner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    serviceType: "Courier",
    contactPerson: "",
    phone: "",
    email: "",
    trackingUrl: "",
    apiKey: "",
    status: "Active",
  });

  // Load data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const mockPartner = {
        name: "Shiprocket",
        serviceType: "Courier Aggregator",
        contactPerson: "Rahul Sharma",
        phone: "+91 98765 43210",
        email: "support@shiprocket.com",
        trackingUrl: "https://shiprocket.co/tracking",
        apiKey: "xxxx-xxxx-xxxx",
        status: "Active",
      };
      setFormData(mockPartner);
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
      console.log("UPDATE Partner:", id, formData);
      // Real: axios.put(`${API}/delivery-partners/${id}`, formData)
    } else {
      console.log("CREATE Partner:", formData);
      // Real: axios.post(`${API}/delivery-partners`, formData)
    }

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard/add-shipping-delivery");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isEditMode ? "Edit Delivery Partner" : "Add Delivery Partner"}
        </h1>
        {isEditMode && (
          <span className="text-xs text-[#94A3B8] bg-white/5 px-3 py-1 rounded-lg">
            ID: {id}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-5">

        {/* Partner Name */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Partner Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Shiprocket"
            className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Service Type</label>
          <div className="relative">
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            >
              <option>Courier</option>
              <option>Courier Aggregator</option>
              <option>Local Delivery</option>
              <option>Same-Day Delivery</option>
              <option>Express Delivery</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="support@partner.com"
            className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        {/* Integration Details */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider">Integration Details</h2>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Tracking URL</label>
            <input
              type="text"
              name="trackingUrl"
              value={formData.trackingUrl}
              onChange={handleChange}
              placeholder="https://partner.com/tracking"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">API Key</label>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="xxxx-xxxx-xxxx"
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
              ? "Update Partner"
              : "Add Partner"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddDeliveryPartner;