// src/config.js

// Change this ONE line to switch between dev/prod
export const API_HOST = "http://31.97.228.17:4077";
export const API_BASE = `${API_HOST}/api/admin`;

// ---------- Image URL helper ----------
export const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("blob:")) return path;
  return `${API_HOST}${path}`;
};

// ---------- Auth helpers ----------
export const getToken = () =>
  localStorage.getItem("adminToken") ||
  sessionStorage.getItem("adminToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("staffToken") ||
  "";

export const getStaffLandingPath = (staff) => {
  const permissions = Array.isArray(staff?.permissions)
    ? staff.permissions
        .map((permission) =>
          typeof permission === "string" ? permission.trim() : permission?.path?.trim()
        )
        .filter(Boolean)
    : [];
  const landingPermission = permissions.find(
    (path) =>
      !path.includes(":") &&
      STAFF_PERMISSIONS.some((route) => route.path === path)
  );

  return landingPermission || "/dashboard";
};

// Route permissions mirror the paths rendered in App.js. `name` is the
// readable page/element label saved alongside its exact route path.
export const STAFF_PERMISSION_GROUPS = [
  { name: "Dashboard", routes: [{ name: "Dashboard", path: "/dashboard" }] },
  {
    name: "Users",
    routes: [
      { name: "All Users", path: "/dashboard/users" },
      { name: "User Details", path: "/dashboard/users/:id" },
      { name: "Edit User", path: "/dashboard/users/edit/:id" },
      { name: "User Wallet", path: "/dashboard/users/wallet/:id" },
    ],
  },
  {
    name: "Designers",
    routes: [
      { name: "Pending Designers", path: "/dashboard/pending-designers" },
      { name: "All Designers", path: "/dashboard/designers" },
      { name: "Designer Details", path: "/dashboard/designer/:id" },
      { name: "Designer Details (alternate route)", path: "/dashboard/designers/:id" },
      { name: "Edit Designer", path: "/dashboard/designers/edit/:id" },
      {
        name: "Pending Designer Products",
        path: "/dashboard/pending-designers-products",
      },
      { name: "Designer Products", path: "/dashboard/designers-products" },
      {
        name: "Designer Products by Designer",
        path: "/dashboard/designers-products/:designerId",
      },
    ],
  },
  {
    name: "Products",
    routes: [
      { name: "Product Category", path: "/dashboard/productcategory" },
      { name: "All Products", path: "/dashboard/products" },
      { name: "Create Product", path: "/dashboard/products/create" },
      { name: "Edit Product", path: "/dashboard/products/edit/:id" },
      { name: "Product Details", path: "/dashboard/products/:id" },
      { name: "Recommended Products", path: "/dashboard/products/recommended" },
      { name: "Latest Products", path: "/dashboard/products/latest" },
      { name: "Product Brands", path: "/dashboard/products/brands" },
      { name: "Product Reviews", path: "/dashboard/products/reviews" },
    ],
  },
  {
    name: "Categories",
    routes: [
      { name: "All Categories", path: "/dashboard/categories" },
      { name: "Create Category", path: "/dashboard/categories/create" },
      { name: "Edit Category", path: "/dashboard/categories/edit/:id" },
      {
        name: "Create Subcategory",
        path: "/dashboard/categories/:id/subcategories/create",
      },
      {
        name: "Edit Subcategory",
        path: "/dashboard/categories/:id/subcategories/edit/:subId",
      },
      { name: "Delete Category", path: "/dashboard/categories/delete/:id" },
    ],
  },
  {
    name: "Customers",
    routes: [
      { name: "All Customers", path: "/dashboard/customers" },
      { name: "Customer Details", path: "/dashboard/customers/:id" },
      { name: "Create Customer", path: "/dashboard/customers/create" },
      { name: "Edit Customer", path: "/dashboard/customers/edit/:id" },
    ],
  },
  {
    name: "Collections",
    routes: [
      { name: "All Collections", path: "/dashboard/collections" },
      { name: "Collection Details", path: "/dashboard/collections/:id" },
      {
        name: "Add Products to Collection",
        path: "/dashboard/collections/:id/add-products",
      },
      {
        name: "Collection Products",
        path: "/dashboard/collections/products/:collectionId",
      },
      { name: "Homepage Collections", path: "/dashboard/collections/homepage" },
    ],
  },
  {
    name: "Inventory",
    routes: [
      { name: "Stock Management", path: "/dashboard/stock-management" },
      { name: "Stock Adjustment", path: "/dashboard/stock-adjustment" },
      {
        name: "Stock Audit History",
        path: "/dashboard/stock-management/audit-history",
      },
      { name: "Available Stock", path: "/dashboard/inventory/available" },
      { name: "Low Stock", path: "/dashboard/inventory/low-stock" },
      { name: "Out of Stock", path: "/dashboard/inventory/out-of-stock" },
      { name: "Stock Updates", path: "/dashboard/inventory/updates" },
    ],
  },
  {
    name: "Orders",
    routes: [
      { name: "All Orders", path: "/dashboard/orders" },
      { name: "Order Tracking", path: "/dashboard/orders/tracking" },
      { name: "Customer Order History", path: "/dashboard/customers/:id/orders" },
      { name: "Pending Orders", path: "/dashboard/orders/pending" },
      { name: "Processing Orders", path: "/dashboard/orders/processing" },
      { name: "Shipped Orders", path: "/dashboard/orders/shipped" },
      { name: "Delivered Orders", path: "/dashboard/orders/delivered" },
      { name: "Cancelled Orders", path: "/dashboard/orders/cancelled" },
    ],
  },
  {
    name: "Payments",
    routes: [
      { name: "All Transactions", path: "/dashboard/payments" },
      { name: "Online Payments", path: "/dashboard/payments/online" },
      { name: "Cash on Delivery", path: "/dashboard/payments/cod" },
      { name: "Pending COD", path: "/dashboard/payments/cod/pending" },
      { name: "Collected COD", path: "/dashboard/payments/cod/collected" },
      { name: "Failed COD", path: "/dashboard/payments/cod/failed" },
      {
        name: "COD Reconciliation",
        path: "/dashboard/payments/cod/reconciliation",
      },
    ],
  },
  {
    name: "Returns",
    routes: [
      { name: "Return Requests", path: "/dashboard/returns" },
      { name: "Return Details", path: "/dashboard/returns/details" },
      { name: "Approved Returns", path: "/dashboard/returns/approved" },
      { name: "Rejected Returns", path: "/dashboard/returns/rejected" },
      { name: "Refund Status", path: "/dashboard/returns/refunds" },
    ],
  },
  {
    name: "Offers",
    routes: [
      { name: "Offers and Discounts", path: "/dashboard/offers" },
      { name: "Create Offer", path: "/dashboard/offers/create-offer" },
      { name: "Edit Offer", path: "/dashboard/offers/edit/:id" },
      { name: "Coupons", path: "/dashboard/coupons" },
      { name: "Create Coupon", path: "/dashboard/coupons/create" },
      { name: "Edit Coupon", path: "/dashboard/coupons/edit/:id" },
      { name: "Promo Codes", path: "/dashboard/promo-codes" },
      { name: "Create Promo Code", path: "/dashboard/promo-codes/create" },
      { name: "Edit Promo Code", path: "/dashboard/promo-codes/edit/:id" },
      { name: "Seasonal Sales", path: "/dashboard/seasonal-sales" },
      { name: "Create Seasonal Sale", path: "/dashboard/seasonal-sales/create" },
      { name: "Edit Seasonal Sale", path: "/dashboard/seasonal-sales/edit/:id" },
    ],
  },
  {
    name: "Shipping",
    routes: [
      { name: "Delivery Partners", path: "/dashboard/shipping/partners" },
      { name: "Add Delivery Partner", path: "/dashboard/add-shipping-delivery" },
      { name: "Edit Delivery Partner", path: "/dashboard/shipping/edit/:id" },
      { name: "Delivery Status", path: "/dashboard/deliverystatus" },
      { name: "Delivery Details", path: "/dashboard/deliverydetails/:id" },
      { name: "Shipping Orders", path: "/dashboard/shipping-orders" },
      { name: "Tracking", path: "/dashboard/tracking" },
    ],
  },
  {
    name: "Handtags",
    routes: [
      { name: "All Handtags", path: "/dashboard/handtags" },
      { name: "Create Handtag", path: "/dashboard/handtags/create" },
      { name: "Edit Handtag", path: "/dashboard/handtags/edit/:id" },
    ],
  },
  {
    name: "Size Charts",
    routes: [
      { name: "All Size Charts", path: "/dashboard/size-charts" },
      { name: "Create Size Chart", path: "/dashboard/size-charts/create" },
      { name: "Edit Size Chart", path: "/dashboard/size-charts/edit/:id" },
      { name: "Preview Size Chart", path: "/dashboard/size-charts/preview/:id" },
    ],
  },
  {
    name: "Website Content",
    routes: [
      { name: "Website Content", path: "/dashboard/content" },
      { name: "Login Banners", path: "/dashboard/login-banners" },
      { name: "Hero Banners", path: "/dashboard/hero-banners" },
      { name: "Ad Banners", path: "/dashboard/ad-banners" },
    ],
  },
  {
    name: "Other Pages",
    routes: [
      { name: "Reports", path: "/dashboard/reports" },
      { name: "Notifications", path: "/dashboard/notifications" },
      { name: "Staff Management", path: "/dashboard/staff" },
      { name: "Create Staff", path: "/dashboard/staff/create" },
      { name: "Edit Staff", path: "/dashboard/staff/edit/:id" },
      { name: "Admin and Employees", path: "/dashboard/admin-management" },
      { name: "Settings", path: "/dashboard/settings" },
    ],
  },
];

export const STAFF_PERMISSIONS = STAFF_PERMISSION_GROUPS.flatMap(
  (group) => group.routes
);

export const getStaffPermissionPaths = () => {
  try {
    const storedPermissions = JSON.parse(
      localStorage.getItem("staffPermissions") || "[]"
    );
    return Array.isArray(storedPermissions)
      ? storedPermissions
          .map((permission) =>
            typeof permission === "string" ? permission : permission?.path
          )
          .filter(
            (path) =>
              typeof path === "string" && path.startsWith("/dashboard")
          )
          .map((path) => path.replace(/\/$/, "") || "/dashboard")
      : [];
  } catch {
    return [];
  }
};

export const hasStaffPathPermission = (pathname) => {
  const path = pathname.replace(/\/$/, "") || "/dashboard";
  const matchedRoute = STAFF_PERMISSIONS.filter((route) => {
    const routeParts = route.path.split("/").filter(Boolean);
    const pathParts = path.split("/").filter(Boolean);
    return (
      routeParts.length === pathParts.length &&
      routeParts.every(
        (part, index) => part.startsWith(":") || part === pathParts[index]
      )
    );
  }).sort((first, second) => {
    const staticCount = (route) =>
      route.path
        .split("/")
        .filter((part) => part && !part.startsWith(":")).length;
    return staticCount(second) - staticCount(first);
  })[0];

  return Boolean(
    matchedRoute &&
      getStaffPermissionPaths().some(
        (permission) => permission.replace(/\/$/, "") === matchedRoute.path
      )
  );
};

export const getAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("admin") || "null");
  } catch {
    return null;
  }
};

export const setAuth = ({ token, admin }) => {
  if (token) {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("token", token); // backup key
    sessionStorage.setItem("adminToken", token);
  }
  if (admin) {
    localStorage.setItem("admin", JSON.stringify(admin));
  }
};

export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  localStorage.removeItem("user");
  localStorage.removeItem("staffToken");
  localStorage.removeItem("staffUser");
  localStorage.removeItem("staffPermissions");
  sessionStorage.clear();
};

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------- Fetch wrapper that auto-logouts on 401 ----------
export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...authHeaders(),
    },
  });

  if (res.status === 401) {
    logout();
    window.location.href = "/";
    throw new Error("Session expired. Please log in again.");
  }

  return res;
};
