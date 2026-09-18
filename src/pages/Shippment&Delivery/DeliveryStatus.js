import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Eye, Truck, RefreshCw, FileText, Package, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";

const DeliveryStatus = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Static delivery data
  const [deliveries] = useState([
    { id: 1, orderId: "#BR1025", shipmentId: "SR12345", customer: "Rahul", partner: "Shiprocket", status: "In Transit", expectedDate: "13 Sep" },
    { id: 2, orderId: "#BR1026", shipmentId: "SR12346", customer: "Priya", partner: "Shiprocket", status: "Delivered", expectedDate: "11 Sep" },
    { id: 3, orderId: "#BR1027", shipmentId: "SR12347", customer: "Arjun", partner: "Delhivery", status: "Out for Delivery", expectedDate: "14 Sep" },
    { id: 4, orderId: "#BR1028", shipmentId: "SR12348", customer: "Sneha", partner: "Shiprocket", status: "Pending", expectedDate: "15 Sep" },
    { id: 5, orderId: "#BR1029", shipmentId: "SR12349", customer: "Vikram", partner: "BlueDart", status: "Failed", expectedDate: "12 Sep" },
  ]);

  // Summary counts
  const summary = {
    Pending: deliveries.filter((d) => d.status === "Pending").length,
    "Picked Up": deliveries.filter((d) => d.status === "Picked Up").length,
    "In Transit": deliveries.filter((d) => d.status === "In Transit").length,
    "Out for Delivery": deliveries.filter((d) => d.status === "Out for Delivery").length,
    Delivered: deliveries.filter((d) => d.status === "Delivered").length,
    Failed: deliveries.filter((d) => d.status === "Failed").length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Picked Up": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "In Transit": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Out for Delivery": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      Delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      Failed: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Pending}`;
  };

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl md:text-3xl font-bold text-white">Delivery Status</h1>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Search Order ID / Shipment ID"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {["Status", "Delivery Partner", "Date Range"].map((filter) => (
            <div key={filter} className="relative">
              <select className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[160px]">
                <option>{filter}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-xs font-medium mb-1 flex items-center gap-1">
            <Clock size={12} /> Pending
          </p>
          <p className="text-2xl font-bold text-yellow-400">{summary.Pending}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-xs font-medium mb-1 flex items-center gap-1">
            <Package size={12} /> Picked Up
          </p>
          <p className="text-2xl font-bold text-blue-400">{summary["Picked Up"]}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-xs font-medium mb-1 flex items-center gap-1">
            <Truck size={12} /> In Transit
          </p>
          <p className="text-2xl font-bold text-purple-400">{summary["In Transit"]}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-xs font-medium mb-1 flex items-center gap-1">
            <MapPin size={12} /> Out for Delivery
          </p>
          <p className="text-2xl font-bold text-cyan-400">{summary["Out for Delivery"]}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-xs font-medium mb-1 flex items-center gap-1">
            <CheckCircle size={12} /> Delivered
          </p>
          <p className="text-2xl font-bold text-emerald-400">{summary.Delivered}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <p className="text-[#94A3B8] text-xs font-medium mb-1 flex items-center gap-1">
            <XCircle size={12} /> Failed
          </p>
          <p className="text-2xl font-bold text-red-400">{summary.Failed}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Order ID", "Shipment ID", "Customer", "Partner", "Status", "Expected Date", "Manage"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {deliveries.map((row, index) => {
                const isLastRow = index >= deliveries.length - 2;
                return (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-medium">{row.orderId}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8] font-mono">{row.shipmentId}</td>
                    <td className="px-4 py-3 text-sm text-white">{row.customer}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.partner}</td>
                    <td className="px-4 py-3">
                      <span className={getStatusBadge(row.status)}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.expectedDate}</td>

                    {/* Manage Dropdown */}
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-all"
                        >
                          Manage <ChevronDown size={14} />
                        </button>

                        {activeDropdown === row.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveDropdown(null)}
                            />
                            <div
                              className={`absolute right-0 z-30 w-48 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden ${
                                isLastRow ? "bottom-full mb-2" : "top-12"
                              }`}
                            >
                              <button
                                onClick={() => {
                                  navigate(`/dashboard/delivery-status/${row.id}`);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                              >
                                <Eye size={14} /> View Details
                              </button>
                              <button
                                onClick={() => {
                                  console.log("View Tracking", row.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10 transition-colors"
                              >
                                <Truck size={14} /> View Tracking
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Update Status", row.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10 transition-colors"
                              >
                                <RefreshCw size={14} /> Update Status
                              </button>
                              <button
                                onClick={() => {
                                  console.log("View Order", row.id);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors border-t border-white/5"
                              >
                                <FileText size={14} /> View Order
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStatus;