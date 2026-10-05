import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  X,
  Menu,
  ChevronDown,
  List,
  PlusCircle,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  ImagesIcon,
  BookMarked,
  Bell,
  LogOut,
  IndianRupee,
  Boxes,
  Leaf,
  AlertCircle,
  RefreshCw,
  Check,
  Tag,
  ShoppingCart,
  CreditCard,
  RotateCcw,
  Truck,
  BarChart3,
  Settings,
  ShieldCheck,
  Tags,
  Warehouse,
  CheckCircle,
  XCircle,
  Clock,
  Ruler,
} from "lucide-react";
import { FaPercentage, FaShoppingBag } from "react-icons/fa";
import { PiEmpty } from "react-icons/pi";
import logo from "../assets/logo.png";
import Swal from "sweetalert2";
import { hasStaffPathPermission, logout as clearAuth } from "../config";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/dashboard/users",
    label: "Users",
    icon: Users,
    children: [{ to: "/dashboard/users", label: "All Users", icon: List }],
  },
  {
    to: "/dashboard/staff",
    label: "Staff Management",
    icon: Users,
    children: [
      { to: "/dashboard/staff", label: "All Staff", icon: List },
      {
        to: "/dashboard/staff/create",
        label: "Create Staff",
        icon: PlusCircle,
      },
    ],
  },
  {
    to: "/dashboard/productcategory",
    label: "Products",
    icon: Boxes,
    children: [
      { to: "/dashboard/products", label: "All Products", icon: Eye },
      {
        to: "/dashboard/products/create",
        label: "Create Product",
        icon: PlusCircle,
      },
      {
        to: "/dashboard/productcategory",
        label: "All Categories",
        icon: List,
      },
      {
        to: "/dashboard/products/recommended",
        label: "Recommended",
        icon: Star,
      },
      { to: "/dashboard/products/latest", label: "Latest", icon: Leaf },
      { to: "/dashboard/products/brands", label: "Brands", icon: Tag },
      {
        to: "/dashboard/products/reviews",
        label: "Reviews",
        icon: Star,
      },
    ],
  },
  {
    to: "/dashboard/orders",
    label: "Order Management",
    icon: ShoppingCart,
    children: [
      { to: "/dashboard/orders", label: "All Orders", icon: List },
      {
        to: "/dashboard/orders/pending",
        label: "Pending Orders",
        icon: Clock,
      },
      {
        to: "/dashboard/orders/processing",
        label: "Processing Orders",
        icon: RefreshCw,
      },
      {
        to: "/dashboard/orders/shipped",
        label: "Shipped Orders",
        icon: Truck,
      },
      {
        to: "/dashboard/orders/delivered",
        label: "Delivered Orders",
        icon: Check,
      },
      {
        to: "/dashboard/orders/cancelled",
        label: "Cancelled Orders",
        icon: XCircle,
      },
    ],
  },
  {
    to: "/dashboard/philosophy",
    label: "Philosophy",
    icon: ShieldCheck,
    children: [
      {
        to: "/dashboard/philosophy",
        label: "Philosophy Section",
        icon: ShieldCheck,
      },
    ],
  },
  {
    to: "/dashboard/categories",
    label: "All Categories",
    icon: Warehouse,
    children: [
      {
        to: "/dashboard/categories",
        label: "All Categories",
        icon: Eye,
      },
    ],
  },
  {
    to: "/dashboard/customers",
    label: "Customers",
    icon: UserCircle,
    children: [
      {
        to: "/dashboard/customers",
        label: "All Customers",
        icon: List,
      },
    ],
  },
  {
    to: "/dashboard/contact-us",
    label: "Contact Us",
    icon: AlertCircle,
    children: [
      {
        to: "/dashboard/contact-us",
        label: "Contact Us",
        icon: AlertCircle,
      },
    ],
  },
  {
    to: "/dashboard/payments",
    label: "Payments",
    icon: CreditCard,
    children: [
      {
        to: "/dashboard/payments",
        label: "All Transactions",
        icon: List,
      },
      {
        to: "/dashboard/payments/online",
        label: "Online",
        icon: Check,
      },
      {
        to: "/dashboard/payments/cod",
        label: "Cash on Delivery",
        icon: IndianRupee,
      },
    ],
  },
  {
    to: "/dashboard/returns",
    label: "Returns & Refunds",
    icon: RotateCcw,
    children: [
      {
        to: "/dashboard/returns",
        label: "Return Requests",
        icon: List,
      },
    ],
  },
  {
    to: "/dashboard/offers",
    label: "Offers & Discounts",
    icon: Tags,
    children: [
      {
        to: "/dashboard/offers",
        label: "Coupons & Promos",
        icon: FaPercentage,
      },
    ],
  },
  {
    to: "/dashboard/shipping/partners",
    label: "Shipping",
    icon: Truck,
    children: [
      {
        to: "/dashboard/shipping/partners",
        label: "Delivery Partners",
        icon: Truck,
      },
    ],
  },
  {
    to: "/dashboard/hero-banners",
    label: "Website Content",
    icon: ImagesIcon,
    children: [
      {
        to: "/dashboard/hero-banners",
        label: "Hero Banner",
        icon: PlusCircle,
      },
      {
        to: "/dashboard/ad-banners",
        label: "Ad Banners",
        icon: Eye,
      },
    ],
  },
  {
    to: "/dashboard/contact-details",
    label: "Contact Details",
    icon: AlertCircle,
    children: [
      {
        to: "/dashboard/contact-details",
        label: "Contact Details",
        icon: AlertCircle,
      },
    ],
  },
  {
    to: "/dashboard/exclusive-section",
    label: "Exclusive Section",
    icon: Star,
    children: [
      {
        to: "/dashboard/exclusive-section",
        label: "Exclusive Section",
        icon: Star,
      },
    ],
  },
  {
    to: "/dashboard/collections",
    label: "Collections",
    icon: BookMarked,
    children: [
      {
        to: "/dashboard/collections",
        label: "All Collections",
        icon: List,
      },
      
     
    ],
  },
  {
    to: "/dashboard/designers",
    label: "Designer",
    icon: FaShoppingBag,
    children: [
      {
        to: "/dashboard/designers",
        label: "All Designers",
        icon: List,
      },
      {
        to: "/dashboard/pending-designers",
        label: "Pending Designers",
        icon: PiEmpty,
      },
    ],
  },
  {
    to: "/dashboard/stock-management",
    label: "Stock Management",
    icon: Boxes,
    children: [
      {
        to: "/dashboard/stock-management",
        label: "Stock Management",
        icon: Boxes,
      },
      {
        to: "/dashboard/stock-adjustment",
        label: "Stock Adjustment",
        icon: RefreshCw,
      },
      {
        to: "/dashboard/stock-management/audit-history",
        label: "Audit History",
        icon: CheckCircle,
      },
    ],
  },
  {
    to: "dashboard/faq",
    label: "FAQ Management",
    icon: BookMarked,
    children: [
      {
        to: "dashboard/faq", 
        label: "All FAQs",
        icon: List,
      },
    ],
  },
  {
    to: "/dashboard/reports",
    label: "Reports",
    icon: BarChart3,
    children: [
      {
        to: "/dashboard/reports",
        label: "Analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    to: "/dashboard/handtags",
    label: "Hash Tags",
    icon: Tag,
    children: [
      {
        to: "/dashboard/handtags",
        label: "All Handtags",
        icon: Tag,
      },
      // {
      //   to: "/dashboard/handtags/create",
      //   label: "Create Handtag",
      //   icon: PlusCircle,
      // },
    ],
  },
  {
    to: "/dashboard/size-charts",
    label: "Size Charts",
    icon: Ruler,
    children: [
      {
        to: "/dashboard/size-charts",
        label: "All Size Charts",
        icon: Ruler,
      },
    ],
  },
  {
    to: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    children: [
      {
        to: "/dashboard/notifications",
        label: "All Notifications",
        icon: Bell,
      },
    ],
  },
  {
    to: "/dashboard/admin-management",
    label: "Admin & Employees",
    icon: ShieldCheck,
    children: [
      {
        to: "/dashboard/admin-management",
        label: "Users & Roles",
        icon: Users,
      },
    ],
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    children: [
      {
        to: "/dashboard/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];

// ── Dropdown ─────────────────────────────────────────────
const DropdownItem = ({ to, item, setMobileOpen, collapsed }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const currentPath = window.location.pathname;
  const hasActiveChild = item.children.some((c) => currentPath === c.to);

  return (
    <div className="relative group">
      <button
        onClick={() => {
          if (!collapsed) setOpen(!open);
          navigate(to);
        }}
        title={collapsed ? item.label : undefined}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold
          ${collapsed ? "justify-center" : ""}
          ${open && !collapsed ? "bg-white/20" : ""}
          ${
            hasActiveChild && !collapsed && !open
              ? "bg-white/10 ring-1 ring-[#C026D3]/30"
              : ""
          }
          hover:bg-white/20`}
      >
        <item.icon size={18} className="flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left tracking-wide text-white">
              {item.label}
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 opacity-70 text-[#94A3B8] ${
                open ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {collapsed && (
        <div className="absolute left-full top-0 ml-3 z-50 hidden group-hover:block">
          <div className="bg-gradient-to-br from-[#071236] via-[#020617] to-[#020617] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2 w-48 border border-white/20 backdrop-blur-sm">
            <p className="px-4 py-2 text-[10px] font-black text-[#C026D3] uppercase tracking-widest border-b border-white/20 mb-1">
              {item.label}
            </p>
            {item.children.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-all
                  ${
                    isActive
                      ? "bg-[#C026D3]/30 text-white border-l-2 border-[#C026D3]"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <Icon size={13} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {!collapsed && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-white/20 pl-3 pb-1">
            {item.children.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all
                  ${
                    isActive
                      ? "bg-[#C026D3]/30 text-white border-l-2 border-[#C026D3]"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <Icon size={13} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sidebar ──────────────────────────────────────────────
const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const isStaff = Boolean(localStorage.getItem("staffToken"));
  const visibleNavItems = isStaff
    ? navItems
        .map((item) => {
          if (!item.children) {
            return hasStaffPathPermission(item.to) ? item : null;
          }

          const children = item.children.filter((child) =>
            hasStaffPathPermission(child.to),
          );
          if (!children.length && !hasStaffPathPermission(item.to)) {
            return null;
          }

          return {
            ...item,
            to: hasStaffPathPermission(item.to) ? item.to : children[0].to,
            children,
          };
        })
        .filter(Boolean)
    : navItems;

  // ---------- FIXED LOGOUT ----------
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      background: "#071236",
      color: "#FFFFFF",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl",
        confirmButton:
          "bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-xl font-semibold mr-3",
        cancelButton:
          "bg-[#1E293B] text-white px-6 py-2 rounded-xl font-semibold",
      },
    });

    if (result.isConfirmed) {
      clearAuth(); // ✅ wipes localStorage + sessionStorage

      await Swal.fire({
        title: "Logged Out!",
        text: "You have been logged out successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#071236",
        color: "#FFFFFF",
        customClass: { popup: "rounded-3xl" },
      });

      window.location.href = "/";
    }
  };

  const sidebarContent = (isCollapsed) => (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#071236] via-[#020617] to-[#020617] text-white shadow-xl">
      {/* Logo */}
      <div
        className={`flex items-center flex-shrink-0 border-b border-white/10 ${
          isCollapsed ? "justify-center p-4" : "justify-between px-5 py-[18px]"
        }`}
      >
        {!isCollapsed && (
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={logo}
                alt="Brubla"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white">
                Brubla
              </span>
              <span className="block text-[10px] text-[#C026D3] font-medium -mt-0.5 tracking-widest uppercase">
                Admin Panel
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={logo}
              alt="Brubla"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0 text-white hover:scale-110"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {visibleNavItems.map((item) =>
          item.children ? (
            <DropdownItem
              key={item.label}
              to={item.to}
              item={item}
              setMobileOpen={setMobileOpen}
              collapsed={isCollapsed}
            />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={() => setMobileOpen(false)}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold tracking-wide ${
                  isCollapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-[#C026D3]/30 text-white ring-1 ring-[#C026D3]/50"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/10"
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ),
        )}

        {/* Logout button — uses isCollapsed, not outer collapsed */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide ${
            isCollapsed ? "justify-center" : ""
          } text-red-400 hover:bg-red-500/10 transition-all`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-white/10 p-3">
        <div
          className={`flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-2.5 ${
            isCollapsed ? "justify-center" : ""
          } hover:bg-white/10 transition-colors`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#C026D3] to-[#A020B0] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <img
              src={logo}
              className="w-8 h-8 rounded-xl object-contain"
              alt="Admin"
            />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold leading-tight truncate text-white">
                Brubla Admin
              </p>
              <p className="text-[10px] text-[#94A3B8] truncate">
                Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2.5 rounded-xl text-white bg-gradient-to-r from-[#C026D3] to-[#A020B0] shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 md:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent(false)}
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden md:flex flex-col fixed top-0 left-0 h-screen z-20 transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {sidebarContent(collapsed)}
      </div>

      {/* Desktop spacer */}
      <div
        className={`hidden md:block flex-shrink-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </>
  );
};

export default Sidebar;
