import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Truck, FileText, ExternalLink } from "lucide-react";

const DeliveryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock delivery details based on id
  const delivery = {
    orderId: "#BR1025",
    customer: "Rahul Kumar",
    address: {
      name: "Rahul Kumar",
      address: "12-34, Example Street",
      city: "Hyderabad",
      state: "Telangana",
      pinCode: "500001",
      phone: "XXXXX XXXXX",
    },
    info: {
      partner: "Shiprocket",
      shipmentId: "SR123456",
      status: "In Transit",
      expectedDate: "13 Sep 2026",
    },
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "In Transit": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      Failed: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return `px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Pending}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Delivery Details</h1>
          {id && <p className="text-xs text-[#94A3B8] mt-1">ID: {id}</p>}
        </div>
      </div>

      {/* Order & Customer Info */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-2">
        <p className="text-sm text-[#94A3B8]">
          Order ID: <span className="text-white font-medium">{delivery.orderId}</span>
        </p>
        <p className="text-sm text-[#94A3B8]">
          Customer: <span className="text-white font-medium">{delivery.customer}</span>
        </p>
      </div>

      {/* Delivery Address */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
          <MapPin size={16} /> DELIVERY ADDRESS
        </h2>
        <div className="space-y-1 text-sm">
          <p className="text-[#94A3B8]">
            Name: <span className="text-white">{delivery.address.name}</span>
          </p>
          <p className="text-[#94A3B8]">
            Address: <span className="text-white">{delivery.address.address}</span>
          </p>
          <p className="text-[#94A3B8]">
            City: <span className="text-white">{delivery.address.city}</span>
          </p>
          <p className="text-[#94A3B8]">
            State: <span className="text-white">{delivery.address.state}</span>
          </p>
          <p className="text-[#94A3B8]">
            PIN Code: <span className="text-white">{delivery.address.pinCode}</span>
          </p>
          <p className="text-[#94A3B8]">
            Phone: <span className="text-white">{delivery.address.phone}</span>
          </p>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h2 className="text-sm font-semibold text-[#C026D3] mb-4 flex items-center gap-2">
          <Truck size={16} /> DELIVERY INFORMATION
        </h2>
        <div className="space-y-1 text-sm">
          <p className="text-[#94A3B8]">
            Partner: <span className="text-white">{delivery.info.partner}</span>
          </p>
          <p className="text-[#94A3B8]">
            Shipment ID: <span className="text-white font-mono">{delivery.info.shipmentId}</span>
          </p>
          <p className="text-[#94A3B8] flex items-center gap-2">
            Status: <span className={getStatusBadge(delivery.info.status)}>{delivery.info.status}</span>
          </p>
          <p className="text-[#94A3B8]">
            Expected Date: <span className="text-white">{delivery.info.expectedDate}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all">
          <ExternalLink size={16} /> View Tracking
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all">
          <FileText size={16} /> View Order
        </button>
      </div>
    </div>
  );
};

export default DeliveryDetails;