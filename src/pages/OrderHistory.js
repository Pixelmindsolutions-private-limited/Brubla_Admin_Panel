import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronDown, IndianRupee, Download } from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const OrderHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");
        const response = await fetch(`${API}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Failed to load orders");
        setCustomer(data.user);
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [id]);

  const totalSpent = orders
    .filter((order) => order.orderStatus !== "cancelled")
    .reduce((total, order) => total + (order.finalAmount || 0), 0);

  if (loading) return <div className="p-8 text-center text-[#94A3B8]">Loading customer orders...</div>;
  if (error) return <div className="p-8 text-center text-red-300">{error}</div>;

  const getStatusBadge = (status) => {
    const normalizedStatus = status
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : "Pending";
    const styles = {
      Delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
      Shipped: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "In Transit": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium border ${styles[normalizedStatus] || styles.Pending}`;
  };

  const getPaymentBadge = (payment) => {
    return payment === "COD"
      ? "px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30"
      : "px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30";
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Order History</h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            View all orders placed by this customer
          </p>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C026D3] to-[#2563EB] flex items-center justify-center text-white font-bold text-xl">
              {customer?.name?.charAt(0).toUpperCase() || "C"}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{customer?.name}</h2>
              <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Customer ID: {customer?._id}
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-xs text-[#94A3B8]">Total Orders</p>
              <p className="text-xl font-bold text-white mt-1">{orders.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#94A3B8]">Total Spent</p>
              <p className="text-xl font-bold text-[#C026D3] mt-1 flex items-center gap-0.5">
                <IndianRupee size={16} />
                {totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              placeholder="Search by Order ID..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>

          <div className="relative">
            <select className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer">
              <option>Status</option>
              <option>Delivered</option>
              <option>Pending</option>
              <option>Cancelled</option>
              <option>Shipped</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
          </div>

          <div className="relative">
            <select className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer">
              <option>Payment</option>
              <option>Razorpay</option>
              <option>COD</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={14} />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-all">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Order History Table (No Actions) */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {["Order ID", "Date", "Products", "Amount", "Payment", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((row) => (
                <tr key={row._id} onClick={() => navigate("/dashboard/orders", { state: { orderId: row.orderId } })} className="cursor-pointer hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium font-mono">{row.orderId}</td>
                  <td className="px-4 py-3 text-sm text-[#94A3B8] whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-white">
                    <div className="space-y-1">
                      {row.items?.length ? row.items.map((item, index) => (
                        <div key={item._id || index}>
                          <p>{item.productName || "Product details unavailable"}</p>
                          <p className="text-xs text-[#94A3B8]">
                            {[item.color, item.sizeName].filter(Boolean).join(" / ")} {item.quantity ? `· Qty ${item.quantity}` : ""}
                          </p>
                        </div>
                      )) : <span className="text-[#94A3B8]">No products listed</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white font-semibold whitespace-nowrap">
                    ₹{(row.finalAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={getPaymentBadge(row.paymentMethod)}>{row.paymentMethod || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadge(row.orderStatus)}>{row.orderStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <p className="text-sm text-[#94A3B8]">
            Showing {orders.length} orders
          </p>
          <div className="text-sm text-[#94A3B8]">
            Total: <span className="text-white font-semibold">₹{totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
