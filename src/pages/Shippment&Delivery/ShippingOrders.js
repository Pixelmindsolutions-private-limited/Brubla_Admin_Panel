import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Eye, Package, Truck, UserPlus, MapPin, Printer, XCircle } from "lucide-react";

const ShippingOrders = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const orders = [
    { id: 1, orderId: "#BR1025", customer: "Rahul", product: "Shirt", partner: "Shiprocket", shipmentId: "SR12345", status: "Shipped" },
    { id: 2, orderId: "#BR1026", customer: "Priya", product: "Dress", partner: "Shiprocket", shipmentId: "SR12346", status: "Pending" },
    { id: 3, orderId: "#BR1027", customer: "Arjun", product: "Kurta", partner: "Delhivery", shipmentId: "SR12347", status: "In Transit" },
  ];

  const summary = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    inTransit: orders.filter((o) => o.status === "In Transit" || o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Shipped: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "In Transit": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Pending}`;
  };

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl md:text-3xl font-bold text-white">Shipping Orders</h1>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
          <input
            type="text"
            placeholder="Search Order ID / Customer / Shipment ID"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {["Shipping Status", "Payment Type", "Delivery Partner", "Date Range"].map((filter) => (
            <div key={filter} className="relative">
              <select className="appearance-none px-4 py-2 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[150px]">
                <option>{filter}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
            </div>
          ))}
          <button className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all">
            Clear
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <p className="text-[#94A3B8] text-xs font-medium mb-1">Total Shipments</p>
          <p className="text-2xl font-bold text-white">{summary.total}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <p className="text-[#94A3B8] text-xs font-medium mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{summary.pending}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <p className="text-[#94A3B8] text-xs font-medium mb-1">In Transit</p>
          <p className="text-2xl font-bold text-purple-400">{summary.inTransit}</p>
        </div>
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
          <p className="text-[#94A3B8] text-xs font-medium mb-1">Delivered</p>
          <p className="text-2xl font-bold text-emerald-400">{summary.delivered}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Order ID", "Customer", "Product", "Partner", "Shipment ID", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((row, index) => {
                const isLastRow = index >= orders.length - 2;
                return (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-medium">{row.orderId}</td>
                    <td className="px-4 py-3 text-sm text-white">{row.customer}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.product}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.partner}</td>
                    <td className="px-4 py-3 text-sm text-[#94A3B8] font-mono">{row.shipmentId}</td>
                    <td className="px-4 py-3">
                      <span className={getStatusBadge(row.status)}>{row.status}</span>
                    </td>
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
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                            <div className={`absolute right-0 z-30 w-56 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden ${isLastRow ? "bottom-full mb-2" : "top-12"}`}>
                              <button
                                onClick={() => { navigate(`/dashboard/orders/${row.orderId}`); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                              >
                                <Eye size={14} /> View Order
                              </button>
                              <button
                                onClick={() => { console.log("Create Shipment", row.id); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10 transition-colors"
                              >
                                <Package size={14} /> Create Shipment
                              </button>
                              <button
                                onClick={() => { console.log("Assign Partner", row.id); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10 transition-colors"
                              >
                                <UserPlus size={14} /> Assign Delivery Partner
                              </button>
                              <button
                                onClick={() => { navigate(`/dashboard/tracking?orderId=${row.orderId}`); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-purple-400 hover:bg-white/10 transition-colors"
                              >
                                <MapPin size={14} /> View Tracking
                              </button>
                              <button
                                onClick={() => { console.log("Print Label", row.id); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                              >
                                <Printer size={14} /> Print Shipping Label
                              </button>
                              <button
                                onClick={() => { console.log("Cancel Shipment", row.id); setActiveDropdown(null); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors border-t border-white/5"
                              >
                                <XCircle size={14} /> Cancel Shipment
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <p className="text-sm text-[#94A3B8]">Showing 1–3 of 3 shipments</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[#94A3B8] text-sm hover:bg-white/10">← Previous</button>
            {[1, 2, 3].map((n) => (
              <button key={n} className={`w-8 h-8 rounded-lg text-sm ${n === 1 ? "bg-[#C026D3] text-white" : "bg-white/5 text-[#94A3B8] hover:bg-white/10"}`}>{n}</button>
            ))}
            <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[#94A3B8] text-sm hover:bg-white/10">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingOrders;