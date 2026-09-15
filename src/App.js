import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import './App.css';
import Login from "./components/Login";
import AllUsers from "./pages/Users/AllUsers";
import SingleUser from "./pages/Users/SingleUser";
import EditUser from "./pages/Users/EditUser";
import ProductCategory from "./pages/products/ProductCategory";
import CreateProduct from "./pages/products/CreateProduct";
import AllProducts from "./pages/products/AllProducts";
import SingleProduct from "./pages/products/SingleProduct";
import CollectionManager from "./pages/Collections/CollectionManager";
import CollectionProducts from "./pages/Collections/CollectionProducts";
import HomepageCollections from "./pages/Collections/HomePageCollection";
import RecommendedProducts from "./pages/products/RecommendedProducts";
import LoginBanners from "./pages/Banners/LoginBanners";
import HeroBanners from "./pages/Banners/HeroBanner";
import AdBanners from "./pages/Banners/AdBanners";
import LatestProducts from "./pages/products/LatestProducts";
import AdminUserWallet from "./pages/Users/AdminUserWallet";
import AllDesigners from "./pages/Designers/AllDesigners";
import SingleDesigner from "./pages/Designers/SingleDesigner";
import PendingDesigners from "./pages/Designers/PendingDesigners";
import DesignerProducts from "./pages/Designers/DesignerProducts";
import PendingDesignerProducts from "./pages/Designers/PendingDesignerProducts";
import AvailableStock from "./pages/Inventory/AvailableStock";
import AllOrders from "./pages/AllOrders";
import PendingOrders from "./pages/PendingOrders";
import OrderTracking from "./pages/Orders/OrderTracking";
import ProcessingOrders from "./pages/Orders/ProcessingOrders";
import ShippedOrders from "./pages/Orders/ShippedOrders";
import DeliveredOrders from "./pages/Orders/DeliveredOrders";
import CancelledOrders from "./pages/Orders/CancelledOrders";
import ProductBrands from "./pages/products/ProductBrands";
import ProductReviews from "./pages/products/ProductReviews";
import LowStock from "./pages/Inventory/LowStock";
import OutOfStock from "./pages/Inventory/OutOfStock";
import StockUpdates from "./pages/Inventory/StockUpdates";
import AllTransactions from "./pages/Payments/AllTransactions";
import OnlinePayments from "./pages/Payments/OnlinePayments";
import CashOnDelivery from "./pages/Payments/CashOnDelivery";
import CODPending from "./pages/Payments/CODPending";
import CODCollected from "./pages/Payments/CODCollected";
import CODFailed from "./pages/Payments/CODFailed";
import CODReconciliation from "./pages/Payments/CODReconciliation";
import ReturnRequests from "./pages/Returns/ReturnRequests";
import ApprovedReturns from "./pages/Returns/ApprovedReturns";
import RejectedReturns from "./pages/Returns/RejectedReturns";
import RefundStatus from "./pages/Returns/RefundStatus";
import OffersDiscounts from "./pages/OffersDiscounts";
import ShippingDelivery from "./pages/ShippingDelivery";
import WebsiteContentManagement from "./pages/WebsiteContentManagement";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import Notifications from "./pages/Notifications";
import AdminEmployeeManagement from "./pages/AdminEmployeeManagement";
import Settings from "./pages/Settings";


const App = () => {
  return (
    <Routes>

      {/* Login Route */}
      <Route path="/" element={<Login />} />

      <Route element={<PrivateRoute />}>
        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<AdminLayout />}>

          <Route index element={<Dashboard />} />

          <Route path="users" element={<AllUsers />} />
          <Route path="users/:id" element={<SingleUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="users/wallet/:id" element={<AdminUserWallet />} />

          <Route path="pending-designers" element={<PendingDesigners />} />
          <Route path="designers" element={<AllDesigners />} />
          <Route path="designer/:id" element={<SingleDesigner />} />
          <Route path="pending-designers-products" element={<PendingDesignerProducts />} />
          <Route path="designers-products" element={<DesignerProducts />} />
          <Route path="designers-products/:designerId" element={<DesignerProducts />} />

          <Route path="productcategory" element={<ProductCategory />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="products/edit/:id" element={<CreateProduct />} />
          <Route path="products/:id" element={<SingleProduct />} />
          <Route path="products/recommended" element={<RecommendedProducts />} />
          <Route path="products/latest" element={<LatestProducts />} />
          <Route path="products/brands" element={<ProductBrands />} />
          <Route path="products/reviews" element={<ProductReviews />} />

          <Route path="collections" element={<CollectionManager />} />
          <Route path="collections/products/:collectionId" element={<CollectionProducts />} />
          <Route path="collections/homepage" element={<HomepageCollections />} />

          <Route path="login-banners" element={<LoginBanners />} />
          <Route path="hero-banners" element={<HeroBanners />} />
          <Route path="ad-banners" element={<AdBanners />} />

          <Route path="inventory/available" element={<AvailableStock />} />
          <Route path="inventory/low-stock" element={<LowStock />} />
          <Route path="inventory/out-of-stock" element={<OutOfStock />} />
          <Route path="inventory/updates" element={<StockUpdates />} />

          <Route path="customers" element={<AllUsers />} />
          <Route path="customers/:id" element={<SingleUser />} />

          <Route path="orders" element={<AllOrders title="All Orders" />} />
          <Route path="orders/tracking" element={<OrderTracking title="Order Tracking" />} />
          <Route path="orders/pending" element={<PendingOrders title="Pending Orders" />} />
          <Route path="orders/processing" element={<ProcessingOrders title="Processing Orders" />} />
          <Route path="orders/shipped" element={<ShippedOrders title="Shipped Orders" />} />
          <Route path="orders/delivered" element={<DeliveredOrders title="Delivered Orders" />} />
          <Route path="orders/cancelled" element={<CancelledOrders title="Cancelled Orders" />} />

          <Route path="payments" element={<AllTransactions />} />
          <Route path="payments/online" element={<OnlinePayments />} />
          <Route path="payments/cod" element={<CashOnDelivery />} />
          <Route path="payments/cod/pending" element={<CODPending />} />
          <Route path="payments/cod/collected" element={<CODCollected />} />
          <Route path="payments/cod/failed" element={<CODFailed />} />
          <Route path="payments/cod/reconciliation" element={<CODReconciliation />} />
          <Route path="returns" element={<ReturnRequests />} />
          <Route path="returns/approved" element={<ApprovedReturns />} />
          <Route path="returns/rejected" element={<RejectedReturns />} />
          <Route path="returns/refunds" element={<RefundStatus />} />
          <Route path="offers" element={<OffersDiscounts />} />
          <Route path="shipping" element={<ShippingDelivery />} />
          <Route path="content" element={<WebsiteContentManagement />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="admin-management" element={<AdminEmployeeManagement />} />
          <Route path="settings" element={<Settings />} />

        </Route>
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" />} />

    </Routes >
  );
};

export default App;
