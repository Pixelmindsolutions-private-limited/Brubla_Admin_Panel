import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Loader2,
  Package,
  User,
  MapPin,
  CreditCard,
  Eye,
  RefreshCw,
  X,
  BellRing,
} from "lucide-react";

const API_URL = "http://31.97.228.17:4077/api/admin/orders";
const KNOWN_ORDER_IDS_STORAGE_KEY = "adminKnownOrderIds";
const getOrdersAuthToken = () =>
  sessionStorage.getItem("adminToken") ||
  localStorage.getItem("staffToken") ||
  localStorage.getItem("adminToken") ||
  localStorage.getItem("token") ||
  "";

const persistKnownOrderIds = (ids) => {
  try {
    sessionStorage.setItem(KNOWN_ORDER_IDS_STORAGE_KEY, JSON.stringify([...ids]));
  } catch (err) {
    console.warn("Could not persist known order IDs:", err.message);
  }
};

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  processing: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  shipped: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
};

const paymentStatusColors = {
  pending: "bg-yellow-500/20 text-yellow-300",
  completed: "bg-green-500/20 text-green-300",
  failed: "bg-red-500/20 text-red-300",
};

const StatCard = ({ label, value, accent }) => (
  <div className="rounded-xl border border-white/10 bg-[#071236]/70 p-4">
    <p className="text-xs uppercase tracking-wider text-[#94A3B8]">{label}</p>
    <p className={`mt-1 text-2xl font-bold ${accent || "text-white"}`}>{value}</p>
  </div>
);

const OrderModal = ({ order, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!order) return null;

  const statusClass =
    statusColors[order.orderStatus] || "bg-white/10 text-white border-white/20";
  const payClass =
    paymentStatusColors[order.paymentStatus] || "bg-white/10 text-white";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#050d28] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#94A3B8]">
              Order Details
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-white">
              <Package size={20} className="text-[#C026D3]" />
              {order.orderId}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusClass}`}
              >
                {order.orderStatus}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${payClass}`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-[#071236]/70 p-2 text-[#94A3B8] hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#071236]/70 p-5">
            <p className="mb-3 flex items-center gap-2 text-base font-bold text-white">
              <User size={18} className="text-[#C026D3]" /> Customer
            </p>
            <p className="text-sm text-[#94A3B8]">{order.userId?.name}</p>
            <p className="break-all text-xs text-[#64748B]">Customer ID: {String(order.userId?._id || order.userId || "—")}</p>
            <p className="text-sm text-[#94A3B8]">{order.userId?.email}</p>
            <p className="text-sm text-[#94A3B8]">{order.userId?.mobile}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#071236]/70 p-5">
            <p className="mb-3 flex items-center gap-2 text-base font-bold text-white">
              <MapPin size={18} className="text-[#C026D3]" /> Delivery
            </p>
            <p className="text-sm text-[#94A3B8]">
              {order.deliveryAddress?.fullName} •{" "}
              {order.deliveryAddress?.mobile}
            </p>
            <p className="text-sm text-[#94A3B8]">
              {order.deliveryAddress?.address},{" "}
              {order.deliveryAddress?.city}, {order.deliveryAddress?.state} -{" "}
              {order.deliveryAddress?.pincode}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#071236]/70 p-5">
            <p className="mb-3 flex items-center gap-2 text-base font-bold text-white">
              <CreditCard size={18} className="text-[#C026D3]" /> Payment
            </p>
            <p className="text-sm uppercase text-[#94A3B8]">
              Method: {order.paymentMethod}
            </p>
            <p className="text-sm text-[#94A3B8]">
              Subtotal: ₹{order.subtotal?.toFixed(2)}
            </p>
            <p className="text-sm text-[#94A3B8]">
              Delivery: ₹{order.deliveryCharge?.toFixed(2)}
            </p>
            <p className="text-sm font-bold text-white">
              Total: ₹{order.finalAmount?.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#071236]/70 p-5">
            <p className="mb-3 text-base font-bold text-white">Order Info</p>
            <p className="text-sm text-[#94A3B8]">
              Placed: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-[#94A3B8]">
              Updated: {new Date(order.updatedAt).toLocaleString()}
            </p>
            {order.deliveredAt && (
              <p className="text-sm text-[#94A3B8]">
                Delivered: {new Date(order.deliveredAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-base font-bold text-white">
            Items ({order.items?.length})
          </p>
          <div className="space-y-2">
            {order.items?.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#071236]/70 p-3"
              >
                {(item.productImage || item.variant?.mainImage) && (
                  <img
                    src={item.productImage || item.variant.mainImage}
                    alt={item.productName || "product"}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="break-all text-[11px] text-[#64748B]">Product ID: {String(item.productId?._id || item.productId || "—")}</p>
                  {item.productName && (
                    <p className="truncate text-sm font-semibold text-white">
                      {item.productName}
                    </p>
                  )}
                  <p className="truncate text-sm text-white">
                    {item.variant?.color} • {item.variant?.size}
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <p className="font-semibold text-white">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AllOrders = ({ title, description }) => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const knownOrderIdsRef = useRef(new Set());
  const hasKnownOrdersBaselineRef = useRef(null);
  if (hasKnownOrdersBaselineRef.current === null) {
    try {
      const savedIds = sessionStorage.getItem(KNOWN_ORDER_IDS_STORAGE_KEY);
      if (savedIds !== null) {
        knownOrderIdsRef.current = new Set(JSON.parse(savedIds));
        hasKnownOrdersBaselineRef.current = true;
      } else {
        hasKnownOrdersBaselineRef.current = false;
      }
    } catch {
      try { sessionStorage.removeItem(KNOWN_ORDER_IDS_STORAGE_KEY); } catch { /* storage unavailable */ }
      hasKnownOrdersBaselineRef.current = false;
    }
  }
  const pollingIntervalRef = useRef(null);
  const audioRef = useRef(null);
  const isPollingRef = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  const playNotificationSound = async () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/sounds/new-order.mp3");
        audioRef.current.preload = "auto";
        audioRef.current.volume = 0.8;
      }
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (err) {
      console.warn("Order sound could not be played:", err.message);
    }
  };

  // ==================================================
  // 🔊 Detect New Orders
  // ==================================================
  const detectNewOrders = (newOrders) => {
    if (!hasKnownOrdersBaselineRef.current) {
      newOrders.forEach((o) => knownOrderIdsRef.current.add(o._id));
      hasKnownOrdersBaselineRef.current = true;
      persistKnownOrderIds(knownOrderIdsRef.current);
      console.log(
        `🔍 Initial load — registered ${knownOrderIdsRef.current.size} orders`
      );
      return;
    }

    const brandNewOrders = newOrders.filter(
      (o) => !knownOrderIdsRef.current.has(o._id)
    );

    if (brandNewOrders.length > 0) {
      console.log(`🎉 ${brandNewOrders.length} NEW ORDER(S) DETECTED!`);
      brandNewOrders.forEach((o) => knownOrderIdsRef.current.add(o._id));
      persistKnownOrderIds(knownOrderIdsRef.current);
      playNotificationSound();
      setUnreadCount((prev) => prev + brandNewOrders.length);
    } else {
      // Keep the baseline across page navigation and browser refreshes in this tab.
      newOrders.forEach((o) => knownOrderIdsRef.current.add(o._id));
      persistKnownOrderIds(knownOrderIdsRef.current);
      console.log("✅ No new orders");
    }
  };

  // ==================================================
  // 🔄 Fetch Orders
  // ==================================================
  const fetchOrders = async (silent = false) => {
    if (silent && isPollingRef.current) return;
    if (silent) isPollingRef.current = true;
    if (!silent) setLoading(true);
    if (!silent) setError(null);

    const token = getOrdersAuthToken();

    if (!token) {
      setError("No active session. Please log in again.");
      if (silent) isPollingRef.current = false;
      if (!silent) setLoading(false);
      setTimeout(() => navigate("/"), 1500);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401 || res.status === 403) {
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("admin");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("token");
        localStorage.removeItem("staffToken");
        localStorage.removeItem("staffUser");
        localStorage.removeItem("staffPermissions");
        setError("Session expired. Please log in again.");
        if (!silent) setLoading(false);
        setTimeout(() => navigate("/"), 1500);
        return;
      }

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();
      if (!data.success) throw new Error("API returned success: false");

      const fetchedOrders = data.orders || [];

      detectNewOrders(fetchedOrders);

      setOrders(fetchedOrders);
      setStats(data.stats || null);
      setInitialLoadComplete(true);
    } catch (err) {
      if (!silent) {
        setError(err.message || "Failed to load orders");
      } else {
        console.warn("⚠️ Silent polling error:", err.message);
      }
    } finally {
      if (silent) isPollingRef.current = false;
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialLoadComplete) return undefined;
    pollingIntervalRef.current = setInterval(() => {
      fetchOrders(true);
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        console.log("🛑 Polling stopped");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoadComplete]);

  useEffect(() => {
    const orderId = location.state?.orderId;
    if (!orderId) return;
    const token = getOrdersAuthToken();
    fetch(`${API_URL}/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.order) setSelectedOrder(data.order);
      })
      .catch((err) => console.error("Failed to load selected order:", err));
  }, [location.state]);

  if (loading) {
    return (
      <div className="max-w-5xl rounded-2xl border border-white/10 bg-[#071236]/50 p-8 text-center">
        <Loader2 size={42} className="mx-auto mb-4 animate-spin text-[#C026D3]" />
        <p className="text-[#94A3B8]">Loading orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl rounded-2xl border border-white/10 bg-[#071236]/50 p-8 text-center">
        <AlertCircle size={42} className="mx-auto mb-4 text-red-400" />
        <h1 className="text-2xl font-bold text-white">{title || "All Orders"}</h1>
        <p className="mt-3 text-red-300">{error}</p>
        <button
          onClick={() => fetchOrders(false)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#C026D3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a21caf]"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {title || "All Orders"}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-[#94A3B8]">{description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300">
            <BellRing size={16} /> Notifications ON
            {unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          <button
            onClick={() => fetchOrders(false)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#071236]/70 px-3 py-2 text-sm text-[#94A3B8] hover:text-white"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total Orders" value={stats.totalOrders} />
          <StatCard
            label="Revenue"
            value={`₹${stats.totalRevenue?.toFixed(2)}`}
            accent="text-[#C026D3]"
          />
          <StatCard
            label="Avg Order"
            value={`₹${stats.averageOrderValue?.toFixed(2)}`}
          />
          <StatCard
            label="Pending"
            value={stats.pendingOrders}
            accent="text-yellow-300"
          />
          <StatCard
            label="Shipped"
            value={stats.shippedOrders}
            accent="text-purple-300"
          />
          <StatCard
            label="Delivered"
            value={stats.deliveredOrders}
            accent="text-green-300"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#071236]/60">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.4fr_0.8fr] items-center gap-4 border-b border-white/10 bg-[#0B1A45] px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          <span>Order</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Customer</span>
          <span className="text-right">Actions</span>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-[#94A3B8]">No orders found.</div>
        ) : (
          orders.map((order) => {
            const statusClass =
              statusColors[order.orderStatus] ||
              "bg-white/10 text-white border-white/20";
            const payClass =
              paymentStatusColors[order.paymentStatus] ||
              "bg-white/10 text-white";

            return (
              <div
                key={order._id}
                className="border-b border-white/5 last:border-b-0"
              >
                <div className="grid grid-cols-[1.4fr_1fr_1fr_1.4fr_0.8fr] items-center gap-4 px-6 py-4 hover:bg-white/5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Package size={18} className="shrink-0 text-[#C026D3]" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {order.orderId}
                      </p>
                      <p className="truncate text-xs text-[#94A3B8]">
                        ₹{order.finalAmount?.toFixed(2)} •{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusClass}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${payClass}`}
                    >
                      {order.paymentStatus}
                    </span>
                    <p className="mt-1 text-xs uppercase text-[#94A3B8]">
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">
                      {order.userId?.name}
                    </p>
                    <p className="truncate text-xs text-[#94A3B8]">
                      {order.userId?.email}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#C026D3]/40 bg-[#C026D3]/15 px-3 py-1.5 text-xs font-semibold text-[#E879F9] hover:bg-[#C026D3]/30 hover:text-white transition"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default AllOrders;
