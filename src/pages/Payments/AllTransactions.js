import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search, ChevronDown, RefreshCw, Eye, Package, CheckCircle2,
  Clock, XCircle, IndianRupee, AlertTriangle, Phone,
  MapPin, CreditCard, Calendar, ChevronRight, User,
  ArrowLeft, Mail, Copy, Check, Wallet, Banknote, TrendingUp,
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

// ---------- Payment status styles ----------
const PAYMENT_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  paid: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  failed: "bg-red-500/20 text-red-300 border-red-500/30",
  refunded: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  cod: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

const paymentPill = (s = "pending") =>
  PAYMENT_STYLES[s?.toLowerCase()] || PAYMENT_STYLES.pending;

const ORDER_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  shipped: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  delivered: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
};

const orderPill = (s = "pending") =>
  ORDER_STYLES[s?.toLowerCase()] || ORDER_STYLES.pending;

// =================================================================
const AllTransactions = () => {
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
  const [paymentFilter, setPaymentFilter] = useState("all"); // all | cod | online
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
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
        `/orders?paymentMethod=${paymentFilter}&page=${page}`
      );
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to load transactions");
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
  }, [paymentFilter]);

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

    if (paymentStatusFilter !== "all") {
      list = list.filter(
        (o) =>
          (o.paymentStatus || "").toLowerCase() ===
          paymentStatusFilter.toLowerCase()
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
  }, [orders, search, paymentStatusFilter, sortBy]);

  // ---------- Derived totals ----------
  const totals = useMemo(() => {
    const totalAmount = orders.reduce(
      (s, o) => s + (o.finalAmount || 0),
      0
    );
    const pendingAmount = orders
      .filter((o) => o.paymentStatus === "pending")
      .reduce((s, o) => s + (o.finalAmount || 0), 0);
    const completedAmount = orders
      .filter(
        (o) =>
          o.paymentStatus === "completed" || o.paymentStatus === "paid"
      )
      .reduce((s, o) => s + (o.finalAmount || 0), 0);

    return { totalAmount, pendingAmount, completedAmount };
  }, [orders]);

  const summaryTiles = [
    {
      label: "Transactions",
      value: pagination.total || 0,
      color: "text-white",
      icon: Wallet,
    },
    {
      label: "Total Value",
      value: inr(totals.totalAmount),
      color: "text-blue-400",
      icon: IndianRupee,
    },
    {
      label: "Completed",
      value: inr(totals.completedAmount),
      color: "text-emerald-400",
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: inr(totals.pendingAmount),
      color: "text-yellow-400",
      icon: Clock,
    },
  ];

  // =================================================================
  //  DETAIL VIEW
  // =================================================================
  if (viewingOrder) {
    const o = viewingOrder;

    return (
      <div className="space-y-6 pb-10 text-white max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewingOrder(null)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Transaction #{o.orderId}
                </h1>
                <button
                  onClick={() => copyOrderId(o.orderId)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-[#94A3B8] hover:text-white"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p className="text-sm text-[#94A3B8] mt-1 flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDateTime(o.createdAt)}
              </p>
              <div className="mt-2 space-y-1 text-xs text-[#94A3B8]">
                <p className="break-all">
                  Payment ID: <span className="text-white">{String(o.paymentId || o.transactionId || o._id || "—")}</span>
                </p>
                <p className="break-all">
                  Order ID: <span className="text-white">{String(o.orderId || "—")}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 ${paymentPill(
                o.paymentStatus
              )}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {o.paymentStatus?.toUpperCase()}
            </span>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 ${orderPill(
                o.orderStatus
              )}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {o.orderStatus?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Amount Hero */}
        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(192,38,211,0.15) 0%, rgba(37,99,235,0.15) 100%)",
          }}
        >
          <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-2">
            Total Transaction Amount
          </p>
          <p className="text-4xl font-black text-white">
            {inr(o.finalAmount)}
          </p>
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              {o.paymentMethod === "cod" ? (
                <Banknote size={16} className="text-blue-400" />
              ) : (
                <CreditCard size={16} className="text-purple-400" />
              )}
              <span className="text-sm text-[#94A3B8]">
                {o.paymentMethod?.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {o.paymentStatus === "completed" ||
              o.paymentStatus === "paid" ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : o.paymentStatus === "failed" ? (
                <XCircle size={16} className="text-red-400" />
              ) : (
                <Clock size={16} className="text-yellow-400" />
              )}
              <span className="text-sm capitalize text-[#94A3B8]">
                {o.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Customer + breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-5">
            <h3 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider">
              Customer
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
                  <p>
                    {o.deliveryAddress?.address},{" "}
                    {o.deliveryAddress?.city},{" "}
                    {o.deliveryAddress?.state} -{" "}
                    {o.deliveryAddress?.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-3">
            <h3 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider flex items-center gap-1.5">
              <IndianRupee size={12} /> Breakdown
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
                      {item.variant?.color || "Product"}
                      {item.variant?.size && (
                        <span className="text-[#94A3B8] font-normal ml-3">
                          Size: {item.variant.size}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Qty: {item.quantity} × {inr(unitPrice)}
                    </p>
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
            All Transactions
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            View all customer payments and payment statuses
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
              placeholder="Search by order ID, customer, email, phone..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>

          {/* Payment method filter */}
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className={SELECT_CLASS}
            >
              <option style={OPTION_STYLE} value="all">All Methods</option>
              <option style={OPTION_STYLE} value="cod">COD</option>
              <option style={OPTION_STYLE} value="online">Online</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={14}
            />
          </div>

          {/* Payment status filter */}
          <div className="relative">
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className={SELECT_CLASS}
            >
              <option style={OPTION_STYLE} value="all">All Status</option>
              <option style={OPTION_STYLE} value="pending">Pending</option>
              <option style={OPTION_STYLE} value="completed">Completed</option>
              <option style={OPTION_STYLE} value="failed">Failed</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
              size={14}
            />
          </div>

          {/* Sort */}
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
            Loading transactions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[#94A3B8] text-sm">
            {search
              ? "No transactions match your search."
              : "No transactions found."}
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

                    {/* Method */}
                    <div className="min-w-[100px]">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-semibold border inline-flex items-center gap-1 ${
                          order.paymentMethod === "cod"
                            ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                            : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                        }`}
                      >
                        {order.paymentMethod === "cod" ? (
                          <Banknote size={10} />
                        ) : (
                          <CreditCard size={10} />
                        )}
                        {order.paymentMethod?.toUpperCase()}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="min-w-[120px]">
                      <p className="text-sm font-bold text-white">
                        {inr(order.finalAmount)}
                      </p>
                    </div>

                    {/* Payment Status */}
                    <div className="min-w-[110px]">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 ${paymentPill(
                          order.paymentStatus
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {order.paymentStatus}
                      </span>
                    </div>

                    {/* Actions */}
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
                            <User size={12} /> Customer
                          </h4>
                          <div className="text-sm text-white space-y-0.5 pl-4">
                            <p className="font-semibold">
                              {order.userId?.name}
                            </p>
                            <p className="text-[#94A3B8] flex items-center gap-1.5">
                              <Mail size={12} />{" "}
                              {order.userId?.email}
                            </p>
                            <p className="text-[#94A3B8] flex items-center gap-1.5">
                              <Phone size={12} />{" "}
                              {order.userId?.mobile}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-[#C026D3] uppercase tracking-wider flex items-center gap-1.5">
                            <IndianRupee size={12} /> Breakdown
                          </h4>
                          <div className="text-sm pl-4 space-y-1">
                            <Row
                              label="Subtotal"
                              value={inr(order.subtotal)}
                            />
                            <Row
                              label="Discount"
                              value={`- ${inr(order.discountAmount)}`}
                            />
                            <Row
                              label="Total"
                              value={inr(order.finalAmount)}
                              bold
                            />
                            <p className="text-xs text-[#94A3B8] mt-2 flex items-center gap-1.5">
                              <Calendar size={12} />{" "}
                              {formatDateTime(order.createdAt)}
                            </p>
                          </div>
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
const Row = ({ label, value, bold, valueClass = "" }) => (
  <div className="flex items-center justify-between">
    <span className="text-[#94A3B8] text-xs">{label}</span>
    <span
      className={`text-xs ${bold ? "text-white font-bold text-sm" : "text-white"} ${valueClass}`}
    >
      {value}
    </span>
  </div>
);

export default AllTransactions;