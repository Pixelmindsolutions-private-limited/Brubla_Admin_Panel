import { ArrowLeft, User, Package, Truck, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReturnDetails = () => {
  const navigate = useNavigate();

  // Status list from your screenshot (Image 4)
  const returnStatuses = [
    "Requested", "Under Review", "Approved", "Pickup Scheduled",
    "Picked Up", "Received", "Quality Check", "Refund Initiated",
    "Completed", "Rejected"
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-white">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Return Details</h1>
      </div>

      {/* 1. Basic Return Info */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-2">
        <p className="text-sm text-[#94A3B8]">Return ID: <span className="text-white font-medium">RET001</span></p>
        <p className="text-sm text-[#94A3B8]">Order ID: <span className="text-white font-medium">ORD1023</span></p>
        <p className="text-sm text-[#94A3B8]">Return Requested: <span className="text-white font-medium">10 Sep 2026</span></p>
      </div>

      {/* 2. Customer Section */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-3 flex items-center gap-2">
          <User size={16} /> CUSTOMER
        </h2>
        <div className="space-y-1 text-sm">
          <p className="text-[#94A3B8]">Name: <span className="text-white">Rahul Kumar</span></p>
          <p className="text-[#94A3B8]">Phone: <span className="text-white">XXXXXXXX</span></p>
          <p className="text-[#94A3B8]">Email: <span className="text-white">XXXXXXXX</span></p>
        </div>
      </div>

      {/* 3. Product Section */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-3 flex items-center gap-2">
          <Package size={16} /> PRODUCT
        </h2>
        <div className="flex gap-4">
          {/* Product Image Placeholder */}
          <div className="w-20 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-[#94A3B8]">
            [Image]
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-[#94A3B8]">Product: <span className="text-white">Cotton Shirt</span></p>
            <p className="text-[#94A3B8]">SKU: <span className="text-white">BS001</span></p>
            <p className="text-[#94A3B8]">Size: <span className="text-white">L</span></p>
            <p className="text-[#94A3B8]">Quantity: <span className="text-white">1</span></p>
            <p className="text-[#94A3B8]">Price: <span className="text-white font-medium">₹999</span></p>
          </div>
        </div>
      </div>

      {/* 4. Return Information */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-3">RETURN INFORMATION</h2>
        <p className="text-sm text-[#94A3B8]">Reason: <span className="text-white">Size doesn't fit</span></p>
        <p className="text-sm text-[#94A3B8]">Customer Comment:</p>
        <p className="text-sm text-white italic">"Product is good but the size is large."</p>
        
        <div>
          <p className="text-sm text-[#94A3B8] mb-1">Return Status:</p>
          <select className="px-4 py-2 rounded-lg bg-[#071236] border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]">
            {returnStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <p className="text-sm text-[#94A3B8]">Return Request Date: <span className="text-white">10 Sep 2026</span></p>
      </div>

      {/* 5. Pickup Information */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-3 flex items-center gap-2">
          <Truck size={16} /> PICKUP INFORMATION
        </h2>
        <div className="space-y-1 text-sm">
          <p className="text-[#94A3B8]">Pickup Status: <span className="text-white">Pending</span></p>
          <p className="text-[#94A3B8]">Pickup Date: <span className="text-white">—</span></p>
          <p className="text-[#94A3B8]">Courier Partner: <span className="text-white">—</span></p>
          <p className="text-[#94A3B8]">Tracking ID: <span className="text-white">—</span></p>
        </div>
      </div>

      {/* 6. Refund Section */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-3 flex items-center gap-2">
          <CreditCard size={16} /> REFUND
        </h2>
        <div className="space-y-1 text-sm">
          <p className="text-[#94A3B8]">Payment Type: <span className="text-white">Razorpay</span></p>
          <p className="text-[#94A3B8]">Refund Amount: <span className="text-white">₹999</span></p>
          <p className="text-[#94A3B8]">Refund Status: <span className="text-yellow-400">Pending</span></p>
        </div>
      </div>

      {/* 7. Action Buttons (from Image 4) */}
      <div className="flex gap-3 justify-end pt-4">
        <button className="px-6 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-medium transition-all">
          Approve Return
        </button>
        <button className="px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-medium transition-all">
          Reject Return
        </button>
      </div>

    </div>
  );
};

export default ReturnDetails;