import { useState } from "react";
import { ChevronDown } from "lucide-react";

const RejectedReturns = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Updated data to match screenshot columns (Rejection Reason + Date added)
  const returns = [
    { 
      id: "RET003", 
      orderId: "ORD1005", 
      customer: "Arjun", 
      product: "Kurta", 
      reason: "Wrong Item", 
      rejectionReason: "Item used/washed", 
      date: "12 Sep 2026" 
    },
    { 
      id: "RET006", 
      orderId: "ORD1040", 
      customer: "Sneha", 
      product: "Top", 
      reason: "Late Return", 
      rejectionReason: "Exceeded 7-day window", 
      date: "14 Sep 2026" 
    },
    { 
      id: "RET009", 
      orderId: "ORD1062", 
      customer: "Vikram", 
      product: "Jacket", 
      reason: "Size Issue", 
      rejectionReason: "Tag removed", 
      date: "15 Sep 2026" 
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-white">Rejected Returns</h1>

      {/* Table Section */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Return ID", "Order ID", "Customer", "Product", "Reason", "Rejection Reason", "Date", "Actions"].map((h) => (
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
                  <td className="px-4 py-3 text-sm text-white">{row.customer}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.product}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.reason}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                      {row.rejectionReason}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.date}</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-all"
                    >
                      Manage <ChevronDown size={14} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === row.id && (
                      <div className="absolute right-4 top-12 z-20 w-44 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                        <button className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors">
                          View Details
                        </button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10 transition-colors">
                          Reconsider Return
                        </button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10 transition-colors">
                          View Order
                        </button>
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

export default RejectedReturns;