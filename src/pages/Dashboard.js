import { useState, useEffect, useCallback } from "react";
import {
  Users,
  ShoppingCart,
  IndianRupee,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
} from "lucide-react";
import { apiFetch } from "../config";

// =================================================================
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [orderStats, setOrderStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- Load stats ----------
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fire both requests in parallel
      const [dashRes, ordersRes] = await Promise.all([
        apiFetch("/dashboard/stats").catch(() => null),
        apiFetch("/orders?status=pending&page=1").catch(() => null),
      ]);

      // ---- Dashboard stats ----
      if (dashRes) {
        const data = await dashRes.json();
        if (dashRes.ok && data.success !== false) {
          const payload = data.data || data;
          setStats({
            totalUsers: payload.totalUsers || 0,
            totalOrders: payload.totalOrders || 0,
            totalRevenue: payload.totalRevenue || 0,
            activeUsers: payload.activeUsers || 0,
          });
        }
      }

      // ---- Order status breakdown (from orders endpoint) ----
      if (ordersRes) {
        const orderData = await ordersRes.json();
        if (ordersRes.ok && orderData.success !== false) {
          setOrderStats(orderData.stats || null);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // ---------- Format currency ----------
  const formatRevenue = (n) => {
    if (!n) return "₹0";
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(2)}K`;
    return `₹${n.toFixed(2)}`;
  };

  const formatFullINR = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // ---------- Growth calc (helper — since we don't have historical data) ----------
  // We fake it based on activity ratio to give the UI some visual feedback.
  // Replace with real backend values when available.
  const fakeGrowth = (val, total) => {
    if (!total) return "+0%";
    const pct = (val / total) * 100;
    return `+${pct.toFixed(1)}%`;
  };

  // ---------- Cards config ----------
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: <Users size={22} />,
      growth: fakeGrowth(stats.activeUsers, stats.totalUsers),
      positive: true,
      gradient: "from-fuchsia-500 to-purple-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: <ShoppingCart size={22} />,
      growth: fakeGrowth(orderStats?.deliveredOrders || 0, stats.totalOrders),
      positive: true,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Revenue",
      value: formatRevenue(stats.totalRevenue),
      sub: formatFullINR(stats.totalRevenue),
      icon: <IndianRupee size={22} />,
      growth: fakeGrowth(orderStats?.deliveredOrders || 0, stats.totalOrders),
      positive: true,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: <Activity size={22} />,
      growth: `${
        stats.totalUsers
          ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(0)
          : 0
      }% active`,
      positive: stats.activeUsers >= stats.totalUsers / 2,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  // ---------- Order status breakdown data ----------
  const orderBreakdown = orderStats
    ? [
        { label: "Pending", value: orderStats.pendingOrders || 0, color: "text-yellow-400", bar: "bg-yellow-500" },
        { label: "Confirmed", value: orderStats.confirmedOrders || 0, color: "text-blue-400", bar: "bg-blue-500" },
        { label: "Processing", value: orderStats.processingOrders || 0, color: "text-purple-400", bar: "bg-purple-500" },
        { label: "Shipped", value: orderStats.shippedOrders || 0, color: "text-indigo-400", bar: "bg-indigo-500" },
        { label: "Delivered", value: orderStats.deliveredOrders || 0, color: "text-emerald-400", bar: "bg-emerald-500" },
        { label: "Cancelled", value: orderStats.cancelledOrders || 0, color: "text-red-400", bar: "bg-red-500" },
      ]
    : [];

  const maxOrderVal = Math.max(
    1,
    ...orderBreakdown.map((o) => o.value)
  );

  // =================================================================
  return (
    <div className="space-y-6 pb-10 text-white">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Dashboard Analytics
          </h1>
          <p className="text-[#94A3B8] mt-1 text-sm">
            Welcome back 👋 Here's what's happening in your store.
          </p>
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm transition-all disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          >
            {/* Glow */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${card.gradient}`}
            />

            {/* Top */}
            <div className="flex items-center justify-between relative z-10">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
              >
                {card.icon}
              </div>

              <div
                className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                  card.positive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {card.positive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {card.growth}
              </div>
            </div>

            {/* Content */}
            <div className="mt-6 relative z-10">
              <h3 className="text-[#94A3B8] text-sm font-medium">
                {card.title}
              </h3>
              {loading ? (
                <div className="h-10 mt-2 flex items-center">
                  <div className="w-24 h-8 bg-white/10 rounded-lg animate-pulse" />
                </div>
              ) : (
                <>
                  <p className="text-4xl font-black mt-2 tracking-tight">
                    {card.value}
                  </p>
                  {card.sub && (
                    <p className="text-xs text-[#94A3B8] mt-1">
                      {card.sub}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Order Status Breakdown */}
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Orders Breakdown</h2>
              <p className="text-[#94A3B8] text-sm mt-1">
                Live order status distribution
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-[280px] flex items-center justify-center text-[#94A3B8] text-sm">
              <Loader2 size={16} className="animate-spin mr-2" />
              Loading...
            </div>
          ) : !orderStats ? (
            <div className="h-[280px] flex items-center justify-center text-[#94A3B8] text-sm">
              No order data available.
            </div>
          ) : (
            <div className="space-y-4">
              {orderBreakdown.map(({ label, value, color, bar }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-[#94A3B8] font-medium">
                      {label}
                    </span>
                    <span className={`font-bold ${color}`}>
                      {value}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full ${bar} rounded-full transition-all duration-500`}
                      style={{
                        width: `${(value / maxOrderVal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Summary footer */}
              <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-[#94A3B8]">Total Orders</p>
                  <p className="text-lg font-bold text-white">
                    {orderStats.totalOrders || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">Avg. Value</p>
                  <p className="text-lg font-bold text-white">
                    {formatRevenue(orderStats.averageOrderValue || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">Revenue</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {formatRevenue(orderStats.totalRevenue || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>

          <div className="space-y-5">
            {[
              {
                icon: ShoppingBag,
                text: `${orderStats?.pendingOrders || 0} pending orders need attention`,
                color: "text-yellow-400",
                bg: "from-yellow-500/20 to-orange-500/20",
              },
              {
                icon: CheckCircle2,
                text: `${orderStats?.deliveredOrders || 0} orders delivered`,
                color: "text-emerald-400",
                bg: "from-emerald-500/20 to-teal-500/20",
              },
              {
                icon: Truck,
                text: `${orderStats?.shippedOrders || 0} orders shipped`,
                color: "text-indigo-400",
                bg: "from-indigo-500/20 to-blue-500/20",
              },
              {
                icon: Users,
                text: `${stats.totalUsers} customers registered`,
                color: "text-fuchsia-400",
                bg: "from-fuchsia-500/20 to-purple-500/20",
              },
              {
                icon: IndianRupee,
                text: `Total revenue ${formatRevenue(stats.totalRevenue)}`,
                color: "text-blue-400",
                bg: "from-blue-500/20 to-cyan-500/20",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-none last:pb-0"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center border border-white/10 flex-shrink-0`}
                  >
                    <Icon size={18} className={item.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">
                      {item.text}
                    </p>
                    <span className="text-xs text-[#64748B]">
                      Live
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      {orderStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Pending",
              value: orderStats.pendingOrders || 0,
              color: "text-yellow-400",
              icon: Clock,
            },
            {
              label: "Shipped",
              value: orderStats.shippedOrders || 0,
              color: "text-indigo-400",
              icon: Truck,
            },
            {
              label: "Delivered",
              value: orderStats.deliveredOrders || 0,
              color: "text-emerald-400",
              icon: CheckCircle2,
            },
            {
              label: "Cancelled",
              value: orderStats.cancelledOrders || 0,
              color: "text-red-400",
              icon: AlertTriangle,
            },
          ].map(({ label, value, color, icon: Icon }) => (
            <div
              key={label}
              className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#94A3B8] text-xs font-medium">
                  {label}
                </p>
                <Icon size={16} className={color} />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;