import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const ApprovedReturns = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Updated data to match the new columns (Pickup Status added, Reason removed)
  const returns = [
    { id: "RET002", orderId: "ORD1018", product: "Dress", customer: "Priya", pickupStatus: "Picked Up", refundStatus: "Pending" },
    { id: "RET005", orderId: "ORD1030", product: "Jeans", customer: "Amit", pickupStatus: "In Transit", refundStatus: "Completed" },
    { id: "RET008", orderId: "ORD1055", product: "Shirt", customer: "Rohan", pickupStatus: "Pending Pickup", refundStatus: "Processing" },
  ];

  const getPickupBadge = (status) => {
    const styles = {
      "Picked Up": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      "In Transit": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Pending Pickup": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles["Pending Pickup"]}`;
  };

  const getRefundBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      Processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Pending}`;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-white">Approved Returns</h1>

      {/* Filters Section (Status, Date, Payment Type) */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap gap-3">
          {["Status", "Date", "Payment Type"].map((filter) => (
            <div key={filter} className="relative">
              <select className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[140px]">
                <option value="">{filter}</option>
                {/* Options can be added here later */}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Return ID", "Order ID", "Product", "Customer", "Pickup Status", "Refund Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {returns.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">{row.id}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.orderId}</td>
                  <td className="px-4 py-3 text-sm text-white">{row.product}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.customer}</td>
                  <td className="px-4 py-3">
                    <span className={getPickupBadge(row.pickupStatus)}>{row.pickupStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={getRefundBadge(row.refundStatus)}>{row.refundStatus}</span>
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-all"
                    >
                      Manage <ChevronDown size={14} />
                    </button>
                    
                    {/* Dropdown Menu (Optional, but good for "Actions") */}
                    {activeDropdown === row.id && (
                      <div className="absolute right-4 top-12 z-20 w-40 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                        <button className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10">View Details</button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10">Mark Pickup</button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10">Process Refund</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovedReturns;