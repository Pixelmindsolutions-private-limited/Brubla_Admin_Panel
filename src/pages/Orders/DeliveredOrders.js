import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search, ChevronDown, RefreshCw, Eye, Package, CheckCircle2,
  Clock, XCircle, IndianRupee, AlertTriangle, Phone,
  MapPin, CreditCard, Calendar, ChevronRight, Truck, User,
  ArrowLeft, Mail, Copy, Check, BadgeCheck,
} from "lucide-react";
import { buildImageUrl, apiFetch } from "../../config";

// ---------- Reusable dropdown styles (matches AllUsers page) ----------
const SELECT_CLASS =
  "appearance-none px-4 py-2.5 pr-10 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 transition-all cursor-pointer";

// Force black background for native dropdown options (browser override)
const OPTION_STYLE = { backgroundColor: "#000", color: "#fff" };

// ---------- Format helpers ----------
const inr = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  shipped: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  delivered: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const statusPill = (s = "delivered") =>
  STATUS_STYLES[s?.toLowerCase()] || STATUS_STYLES.delivered;

const ORDER_FLOW = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

// =================================================================
const DeliveredOrders = () => {
  const STATUS = "delivered";

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    total: 0,
    page: 1,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expanded, setExpanded] = useState(null);

  const [viewingOrder, setViewingOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  // ---------- Load ----------
  const loadOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch(
        `/orders?status=${STATUS}&page=${page}`
      );
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to load orders");
      }
      setOrders(data.orders || []);
      setStats(data.stats || null);
      setPagination({
        count: data.count || 0,
        total: data.total || 0,
        page: data.page || 1,
        pages: data.pages || 1,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(1);
  }, [loadOrders]);

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // ---------- Filter + Sort ----------
  const filtered = useMemo(() => {
    let list = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderId?.toLowerCase().includes(q) ||
          o.userId?.name?.toLowerCase().includes(q) ||
          o.userId?.email?.toLowerCase().includes(q) ||
          o.userId?.mobile?.includes(q)
      );
    }
    switch (sortBy) {
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "amount-high":
        list.sort((a, b) => (b.finalAmount || 0) - (a.finalAmount || 0));
        break;
      case "amount-low":
        list.sort((a, b) => (a.finalAmount || 0) - (b.finalAmount || 0));
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [orders, search, sortBy]);

  // ---------- Summary ----------
  const summaryTiles = [
    {
      label: "Delivered",
      value: pagination.count,
      color: "text-emerald-400",
      icon: CheckCircle2,
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      color: "text-white",
      icon: Package,
    },
    {
      label: "Avg. Value",
      value: inr(stats?.averageOrderValue ?? 0),
      color: "text-yellow-400",
      icon: IndianRupee,
    },
    {
      label: "Total Revenue",
      value: inr(stats?.totalRevenue ?? 0),
      color: "text-blue-400",
      icon: IndianRupee,
    },
  ];

  // =================================================================
  //  DETAIL VIEW
  // =================================================================
  if (viewingOrder) {
    const o = viewingOrder;
    const currentIdx = ORDER_FLOW.indexOf(o.orderStatus);

    return (
      <div className="space-y-6 pb-10 text-white max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewingOrder(null)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              title="Back to list"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Order #{o.orderId}
                </h1>
                <button
                  onClick={() => copyOrderId(o.orderId)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-[#94A3B8] hover:text-white"
                  title="Copy order ID"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-sm text-[#94A3B8] mt-1 flex items-center gap-1.5">
                <Calendar size={13} />
                Placed on {formatDateTime(o.createdAt)}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium border inline-flex items-center gap-2 ${statusPill(
              o.orderStatus
            )}`}
          >
            <BadgeCheck size={14} />
            {o.orderStatus?.toUpperCase()}
          </span>
        </div>

        {/* Delivered banner */}
        {o.deliveredAt && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Delivered successfully
              </p>
              <p className="text-xs text-[#94A3B8]">
                on {formatDateTime(o.deliveredAt)}
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h3 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider mb-5">
            Order Progress
          </h3>

          {o.orderStatus === "cancelled" ? (
            <div className="flex items-center gap-3 text-red-300">
              <XCircle size={20} />
              <span className="font-semibold">This order was cancelled</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              {ORDER_FLOW.map((step, idx) => {
                const isDone = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                const Icon =
                  idx === 0
                    ? Clock
                    : idx === 1
                    ? CheckCircle2
                    : idx === 2
                    ? Package
                    : idx === 3
                    ? Truck
                    : CheckCircle2;

                return (
                  <div
                    key={step}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    {idx < ORDER_FLOW.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 ${
                          idx < currentIdx ? "bg-[#C026D3]" : "bg-white/10"
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isDone
                          ? "bg-[#C026D3] border-[#C026D3] text-white"
                          : "bg-[#071236] border-white/10 text-[#94A3B8]"
                      } ${isCurrent ? "ring-4 ring-[#C026D3]/30" : ""}`}
                    >
                      <Icon size={16} />
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium capitalize ${
                        isDone ? "text-white" : "text-[#94A3B8]"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Customer + Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-5">
            <h3 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider">
              Customer & Delivery
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <User size={14} className="text-[#94A3B8]" />
                  <p className="font-semibold">
                    {o.userId?.name || "Unknown"}
                  </p>
                </div>
                <div className="space-y-1 text-sm text-[#94A3B8] pl-6">
                  {o.userId?.email && (
                    <p className="flex items-center gap-1.5">
                      <Mail size={12} /> {o.userId.email}
                    </p>
                  )}
                  {o.userId?.mobile && (
                    <p className="flex items-center gap-1.5">
                      <Phone size={12} /> {o.userId.mobile}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <MapPin size={14} className="text-[#94A3B8]" />
                  <p className="font-semibold">
                    {o.deliveryAddress?.fullName}
                  </p>
                </div>
                <div className="text-sm text-[#94A3B8] pl-6 space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <Phone size={12} /> {o.deliveryAddress?.mobile}
                  </p>
                  <p>
                    {o.deliveryAddress?.address},{" "}
                    {o.deliveryAddress?.city},{" "}
                    {o.deliveryAddress?.state} -{" "}
                    {o.deliveryAddress?.pincode}
                  </p>
                  {o.deliveryAddress?.landmark && (
                    <p className="text-xs">
                      Landmark: {o.deliveryAddress.landmark}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-3">
            <h3 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard size={12} /> Payment
            </h3>
            <div className="space-y-2">
              <Row label="Subtotal" value={inr(o.subtotal)} />
              <Row label="Delivery" value={inr(o.deliveryCharge)} />
              <Row label="Platform Fee" value={inr(o.platformFee)} />
              <Row label="Discount" value={`- ${inr(o.discountAmount)}`} />
              <div className="border-t border-white/10 pt-2 mt-2">
                <Row label="Total" value={inr(o.finalAmount)} bold />
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
              <Row
                label="Method"
                value={(o.paymentMethod || "—").toUpperCase()}
              />
              <Row
                label="Status"
                value={o.paymentStatus || "—"}
                valueClass={
                  o.paymentStatus === "paid" ||
                  o.paymentStatus === "completed"
                    ? "text-emerald-400"
                    : o.paymentStatus === "failed"
                    ? "text-red-400"
                    : "text-yellow-400"
                }
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h3 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Package size={12} /> Items ({o.items?.length || 0})
          </h3>
          <div className="space-y-3">
            {o.items?.map((item, idx) => {
              const unitPrice =
                item.variant?.discountPrice ?? item.price ?? 0;
              const lineTotal = unitPrice * (item.quantity || 1);

              return (
                <div
                  key={item._id || idx}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  {item.variant?.mainImage ? (
                    <img
                      src={buildImageUrl(item.variant.mainImage)}
                      alt="item"
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                      onError={(e) =>
                        (e.currentTarget.style.display = "none")
                      }
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] flex-shrink-0">
                      <Package size={20} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">
                      {item.variant?.color && (
                        <span className="text-[#94A3B8] font-normal">
                          Color:{" "}
                        </span>
                      )}
                      {item.variant?.color || "Product"}
                      {item.variant?.size && (
                        <>
                          <span className="text-[#94A3B8] font-normal ml-3">
                            Size:{" "}
                          </span>
                          {item.variant.size}
                        </>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
                      <span>Qty: {item.quantity}</span>
                      {item.variant?.discountPrice != null &&
                        item.variant?.actualPrice != null &&
                        item.variant.discountPrice <
                          item.variant.actualPrice && (
                          <>
                            <span className="line-through">
                              {inr(item.variant.actualPrice)}
                            </span>
                            <span className="text-emerald-400">
                              {inr(item.variant.discountPrice)}
                            </span>
                          </>
                        )}
                      {item.variant?.discountPrice == null &&
                        item.price != null && (
                          <span>{inr(item.price)}</span>
                        )}
                    </div>
                    {item.status && (
                      <span
                        className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full border ${statusPill(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-white flex-shrink-0">
                    {inr(lineTotal)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =================================================================
  //  LIST VIEW
  // =================================================================
  return (
    <div className="space-y-6 pb-10 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Delivered Orders
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Orders successfully delivered to customers
          </p>
        </div>
        <button
          onClick={() => loadOrders(pagination.page)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryTiles.map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#94A3B8] text-xs font-medium">{label}</p>
              <Icon size={16} className={color} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, name, email, phone..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={SELECT_CLASS}
            >
              <option style={OPTION_STYLE} value="newest">Newest First</option>
              <option style={OPTION_STYLE} value="oldest">Oldest First</option>
              <option style={OPTION_STYLE} value="amount-high">Amount (High → Low)</option>
              <option style={OPTION_STYLE} value="amount-low">Amount (Low → High)</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#94A3B8] text-sm">
            Loading delivered orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[#94A3B8] text-sm">
            {search
              ? "No delivered orders match your search."
              : "No delivered orders right now."}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((order) => {
              const isExpanded = expanded === order._id;
              const firstItem = order.items?.[0];
              const otherCount = (order.items?.length || 0) - 1;

              return (
                <div key={order._id}>
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 hover:bg-white/5 transition-all">
                    {/* Order ID */}
                    <div className="flex-1 min-w-[180px]">
                      <button
                        onClick={() =>
                          setExpanded(isExpanded ? null : order._id)
                        }
                        className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#C026D3]"
                      >
                        <ChevronRight
                          size={14}
                          className={`text-[#94A3B8] transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                        {order.orderId}
                      </button>
                      <p className="text-xs text-[#94A3B8] mt-1 pl-6">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Customer */}
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-sm font-medium text-white truncate">
                        {order.userId?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-[#94A3B8] truncate">
                        {order.userId?.email ||
                          order.userId?.mobile ||
                          "—"}
                      </p>
                    </div>

                    {/* Thumbnail */}
                    <div className="flex items-center gap-2 min-w-[120px]">
                      {firstItem?.variant?.mainImage ? (
                        <img
                          src={buildImageUrl(firstItem.variant.mainImage)}
                          alt="product"
                          className="w-10 h-10 rounded-lg object-cover border border-white/10"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8]">
                          <Package size={14} />
                        </div>
                      )}
                      <span className="text-xs text-[#94A3B8]">
                        {order.items?.length || 0}{" "}
                        {order.items?.length === 1 ? "item" : "items"}
                        {otherCount > 0 && (
                          <span className="text-white">
                            {" "}
                            (+{otherCount})
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="min-w-[110px]">
                      <p className="text-sm font-bold text-white">
                        {inr(order.finalAmount)}
                      </p>
                      <p className="text-xs text-[#94A3B8] uppercase">
                        {order.paymentMethod}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="min-w-[110px]">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 ${statusPill(
                          order.orderStatus
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* Actions — only Eye */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Inline expanded */}
                  {isExpanded && (
                    <div className="bg-white/5 border-t border-white/5 p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin size={12} /> Delivery Address
                          </h4>
                          <div className="text-sm text-white space-y-0.5 pl-4">
                            <p className="font-semibold">
                              {order.deliveryAddress?.fullName}
                            </p>
                            <p className="text-[#94A3B8] flex items-center gap-1.5">
                              <Phone size={12} />
                              {order.deliveryAddress?.mobile}
                            </p>
                            <p className="text-[#94A3B8]">
                              {order.deliveryAddress?.address},{" "}
                              {order.deliveryAddress?.city},{" "}
                              {order.deliveryAddress?.state} -{" "}
                              {order.deliveryAddress?.pincode}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider flex items-center gap-1.5">
                            <CreditCard size={12} /> Payment Summary
                          </h4>
                          <div className="text-sm pl-4 space-y-1">
                            <Row
                              label="Subtotal"
                              value={inr(order.subtotal)}
                            />
                            <Row
                              label="Total"
                              value={inr(order.finalAmount)}
                              bold
                            />
                            {order.deliveredAt && (
                              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5">
                                <CheckCircle2 size={12} />
                                Delivered:{" "}
                                {formatDateTime(order.deliveredAt)}
                              </p>
                            )}
                            <p className="text-xs text-[#94A3B8] flex items-center gap-1.5">
                              <Calendar size={12} />
                              Placed: {formatDateTime(order.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <Package size={12} /> Items (
                          {order.items?.length || 0})
                        </h4>
                        <div className="space-y-2">
                          {order.items?.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-3 p-3 rounded-xl bg-[#071236]/40 border border-white/5"
                            >
                              {item.variant?.mainImage ? (
                                <img
                                  src={buildImageUrl(
                                    item.variant.mainImage
                                  )}
                                  alt="item"
                                  className="w-14 h-14 rounded-lg object-cover border border-white/10"
                                  onError={(e) =>
                                    (e.currentTarget.style.display = "none")
                                  }
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8]">
                                  <Package size={18} />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white">
                                  <span className="text-[#94A3B8]">
                                    Color:
                                  </span>{" "}
                                  {item.variant?.color || "—"}{" "}
                                  <span className="text-[#94A3B8] ml-2">
                                    Size:
                                  </span>{" "}
                                  {item.variant?.size || "—"}
                                </p>
                                <p className="text-xs text-[#94A3B8] mt-0.5">
                                  Qty: {item.quantity} × {inr(item.price)}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-white">
                                {inr(item.quantity * item.price)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between text-sm text-[#94A3B8]">
          <span>
            Page {pagination.page} of {pagination.pages} ·{" "}
            {pagination.total} total
          </span>
          <div className="flex gap-2">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() => loadOrders(pagination.page - 1)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={pagination.page >= pagination.pages || loading}
              onClick={() => loadOrders(pagination.page + 1)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Row helper ----------
const Row = ({ label, value, bold, big, valueClass = "" }) => (
  <div className="flex items-center justify-between">
    <span className="text-[#94A3B8] text-xs">{label}</span>
    <span
      className={`${bold ? "text-white font-bold" : "text-white"} ${
        big ? "text-lg" : "text-sm"
      } ${valueClass}`}
    >
      {value}
    </span>
  </div>
);

export default DeliveredOrders;