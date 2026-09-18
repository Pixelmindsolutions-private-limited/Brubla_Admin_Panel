import { useState } from "react";
import { ChevronDown } from "lucide-react";

const RefundStatus = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Updated data to match the screenshot exactly
  const refunds = [
    { 
      id: "RF001", 
      orderId: "ORD1023", 
      customer: "Rahul", 
      paymentType: "Razorpay", 
      amount: "₹999", 
      status: "Pending", 
      date: "—" 
    },
    { 
      id: "RF002", 
      orderId: "ORD1018", 
      customer: "Priya", 
      paymentType: "COD", 
      amount: "₹1,499", 
      status: "Initiated", 
      date: "10 Sep" 
    },
  ];

  const getBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Initiated: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.Pending}`;
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold text-white">Refund Status</h1>

      {/* Table Section */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Refund ID", "Order ID", "Customer", "Payment Type", "Refund Amount", "Refund Status", "Refund Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {refunds.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">{row.id}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.orderId}</td>
                  <td className="px-4 py-3 text-sm text-white">{row.customer}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8]">{row.paymentType}</td>
                  <td className="px-4 py-3 text-sm text-white font-semibold">{row.amount}</td>
                  <td className="px-4 py-3">
                    <span className={getBadge(row.status)}>{row.status}</span>
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
                        <button className="w-full text-left px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10 transition-colors">
                          Process Refund
                        </button>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10 transition-colors">
                          Retry Refund
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

      {/* Detail Views Section (Matching the bottom of the screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Online Pay Detail Card */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">For Online Pay</h3>
          <div className="space-y-2 text-sm">
            <p className="text-[#94A3B8]">Payment Type: <span className="text-white font-medium">Razorpay</span></p>
            <p className="text-[#94A3B8]">Refund Amount: <span className="text-white font-medium">₹999</span></p>
            <p className="text-[#94A3B8]">Refund Status: <span className="text-blue-400 font-medium">Initiated</span></p>
            <p className="text-[#94A3B8]">Refund ID: <span className="text-white font-medium">XXXXX</span></p>
            <p className="text-[#94A3B8]">Refund Date: <span className="text-white font-medium">10 Sep 2026</span></p>
          </div>
        </div>

        {/* COD Detail Card */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">For COD</h3>
          <div className="space-y-2 text-sm">
            <p className="text-[#94A3B8]">Payment Type: <span className="text-white font-medium">COD</span></p>
            <p className="text-[#94A3B8]">Refund Amount: <span className="text-white font-medium">₹999</span></p>
            <p className="text-[#94A3B8]">Refund Method: <span className="text-white font-medium">Bank Transfer / Other configured method</span></p>
            <p className="text-[#94A3B8]">Refund Status: <span className="text-yellow-400 font-medium">Pending</span></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RefundStatus;