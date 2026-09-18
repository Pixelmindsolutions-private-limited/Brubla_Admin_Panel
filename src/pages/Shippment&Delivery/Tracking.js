import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, MapPin, Calendar, Truck, FileText, CheckCircle } from "lucide-react";

const Tracking = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("#BR1025");

  // Static tracking data
  const orderInfo = {
    orderId: "#BR1025",
    customer: "Rahul Kumar",
    destination: "Hyderabad, Telangana",
    partner: "Shiprocket",
    trackingNo: "SR123456789",
    currentStatus: "In Transit",
    currentLocation: "Bengaluru, Karnataka",
    expectedDelivery: "13 September 2026",
  };

  const trackingHistory = [
    { id: 1, status: "Order Shipped", location: "Hyderabad, Telangana", time: "10 Sep | 10:30 AM", done: true },
    { id: 2, status: "Package Picked Up", location: "Hyderabad, Telangana", time: "10 Sep | 4:20 PM", done: true },
    { id: 3, status: "Shipment In Transit", location: "Bengaluru, Karnataka", time: "11 Sep | 9:15 AM", done: true },
    { id: 4, status: "Next Hub", location: "Chennai, Tamil Nadu", time: "Expected: 11 Sep", done: false },
    { id: 5, status: "Out for Delivery", location: "Hyderabad, Telangana", time: "Pending", done: false },
    { id: 6, status: "Delivered", location: "Customer Address", time: "Pending", done: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-white">
      <h1 className="text-2xl md:text-3xl font-bold">Tracking</h1>

      {/* Search Bar */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Order ID / Tracking Number"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all">
            Search
          </button>
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
          <Package size={16} /> ORDER INFORMATION
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <p className="text-[#94A3B8]">Order ID: <span className="text-white font-medium">{orderInfo.orderId}</span></p>
          <p className="text-[#94A3B8]">Customer: <span className="text-white">{orderInfo.customer}</span></p>
          <p className="text-[#94A3B8]">Destination: <span className="text-white">{orderInfo.destination}</span></p>
          <p className="text-[#94A3B8]">Delivery Partner: <span className="text-white">{orderInfo.partner}</span></p>
          <p className="text-[#94A3B8] md:col-span-2">Tracking No.: <span className="text-white font-mono">{orderInfo.trackingNo}</span></p>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-2">CURRENT STATUS</h2>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-lg font-semibold text-emerald-400">{orderInfo.currentStatus}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2 border-t border-white/10">
          <p className="text-[#94A3B8]">Current Location: <span className="text-white">{orderInfo.currentLocation}</span></p>
          <p className="text-[#94A3B8]">Expected Delivery: <span className="text-white">{orderInfo.expectedDelivery}</span></p>
        </div>
      </div>

      {/* Tracking History */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-6 flex items-center gap-2">
          <MapPin size={16} /> TRACKING HISTORY
        </h2>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-white/10" />

          <div className="space-y-6">
            {trackingHistory.map((step) => (
              <div key={step.id} className="flex gap-4 relative">
                {/* Dot */}
                <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  step.done ? "bg-emerald-500/30 border-2 border-emerald-400" : "bg-white/5 border-2 border-white/20"
                }`}>
                  {step.done && <CheckCircle size={10} className="text-emerald-400" />}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <p className={`text-sm font-semibold ${step.done ? "text-white" : "text-[#94A3B8]"}`}>
                    {step.status}
                  </p>
                  <p className="text-xs text-[#94A3B8]">{step.location}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-2">
        <button
          onClick={() => navigate(`/dashboard/orders/${orderInfo.orderId}`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
        >
          <FileText size={16} /> View Order
        </button>
        <button
          onClick={() => navigate(`/dashboard/delivery-status`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all"
        >
          <Truck size={16} /> View Delivery Details
        </button>
      </div>
    </div>
  );
};

export default Tracking;