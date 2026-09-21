import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
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
// import ShippingDelivery from "./pages/Shippment&Delivery/ShippingDelivery";
import WebsiteContentManagement from "./pages/WebsiteContentManagement";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import Notifications from "./pages/Notifications";
import AdminEmployeeManagement from "./pages/AdminEmployeeManagement";
import Settings from "./pages/Settings";
import ReturnDetails from "./pages/Returns/ReturnDetails";
import CreateDiscountOffer from "./pages/Users/CreateDiscountOffer ";
import Coupons from "./pages/Users/Coupons";
import CreateCoupon from "./pages/Users/CreateCoupon";
import PromoCodes from "./pages/Users/PromoCodes";
import CreatePromoCode from "./pages/Users/CreatePromoCode";
import SeasonalSales from "./pages/Users/SeasonalSales";
import CreateSeasonalSale from "./pages/Users/CreateSeasonalSale";
import AddDeliveryPartner from "./pages/Shippment&Delivery/AddDeliveryPartner";
import DeliveryPartners from "./pages/Shippment&Delivery/DeliveryPartners";
import DeliveryStatus from "./pages/Shippment&Delivery/DeliveryStatus";
import DeliveryDetails from "./pages/Shippment&Delivery/DeliveryDetails";
import Tracking from "./pages/Shippment&Delivery/Tracking";
import ShippingOrders from "./pages/Shippment&Delivery/ShippingOrders";
import Stockmanagement from "./pages/Stockmanagement/Stockmanagement";
import StockAuditHistory from "./pages/Stockmanagement/StockAuditHistory";
import StockAdjustment from "./pages/Stockmanagement/Stockadjustment";
import Categories from "./pages/All Categories/Categories";
import AddCategory from "./pages/All Categories/AddCategory";
import AddSubcategory from "./pages/All Categories/AddSubcategory";
import DeleteCategoryModal from "./pages/All Categories/DeleteCategoryModal";
import SingleCustomer from "./pages/All Categories/SingleCustomer";
import AllCustomers from "./pages/All Categories/AllCustomers";
import OrderHistory from "./pages/OrderHistory";
import CollectionDetails from "./pages/Collections/CollectionDetails";
import AddProductsToCollection from "./pages/Collections/AddProductsToCollection";

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
          <Route
            path="pending-designers-products"
            element={<PendingDesignerProducts />}
          />
          <Route path="designers-products" element={<DesignerProducts />} />
          <Route
            path="designers-products/:designerId"
            element={<DesignerProducts />}
          />
          <Route path="stock-management" element={<Stockmanagement />} />

          <Route path="stock-adjustment" element={<StockAdjustment />} />
          <Route
            path="stock-management/audit-history"
            element={<StockAuditHistory />}
          />
          <Route path="/dashboard/categories" element={<Categories />} />
          <Route
            path="/dashboard/categories/create"
            element={<AddCategory />}
          />
          <Route
            path="/dashboard/categories/edit/:id"
            element={<AddCategory />}
          />
          <Route
            path="/dashboard/categories/:id/subcategories/create"
            element={<AddSubcategory />}
          />
          <Route
            path="/dashboard/categories/:id/subcategories/edit/:subId"
            element={<AddSubcategory />}
          />
          <Route
            path="/dashboard/categories/delete/:id"
            element={<DeleteCategoryModal />}
          />
          <Route path="productcategory" element={<ProductCategory />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="products/edit/:id" element={<CreateProduct />} />
          <Route path="products/:id" element={<SingleProduct />} />
          <Route
            path="products/recommended"
            element={<RecommendedProducts />}
          />
          <Route path="products/latest" element={<LatestProducts />} />
          <Route path="products/brands" element={<ProductBrands />} />
          <Route path="products/reviews" element={<ProductReviews />} />

          <Route path="collections" element={<CollectionManager />} />
          <Route
            path="collections/products/:collectionId"
            element={<CollectionProducts />}
          />
          <Route
            path="/dashboard/collections/:id"
            element={<CollectionDetails />}
          />
          <Route
            path="/dashboard/collections/:id/add-products"
            element={<AddProductsToCollection />}
          />
          <Route
            path="/dashboard/collections/products/:collectionId"
            element={<CollectionProducts />}
          />
          <Route
            path="collections/homepage"
            element={<HomepageCollections />}
          />

          <Route path="login-banners" element={<LoginBanners />} />
          <Route path="hero-banners" element={<HeroBanners />} />
          <Route path="ad-banners" element={<AdBanners />} />

          <Route path="inventory/available" element={<AvailableStock />} />
          <Route path="inventory/low-stock" element={<LowStock />} />
          <Route path="inventory/out-of-stock" element={<OutOfStock />} />
          <Route path="inventory/updates" element={<StockUpdates />} />

          <Route path="customers" element={<AllCustomers />} />
          <Route path="customers/:id" element={<SingleCustomer />} />

          <Route path="orders" element={<AllOrders title="All Orders" />} />
          <Route
            path="orders/tracking"
            element={<OrderTracking title="Order Tracking" />}
          />
          <Route
            path="/dashboard/customers/:id/orders"
            element={<OrderHistory />}
          />

          <Route
            path="orders/pending"
            element={<PendingOrders title="Pending Orders" />}
          />
          <Route
            path="orders/processing"
            element={<ProcessingOrders title="Processing Orders" />}
          />
          <Route
            path="orders/shipped"
            element={<ShippedOrders title="Shipped Orders" />}
          />
          <Route
            path="orders/delivered"
            element={<DeliveredOrders title="Delivered Orders" />}
          />
          <Route
            path="orders/cancelled"
            element={<CancelledOrders title="Cancelled Orders" />}
          />

          <Route path="payments" element={<AllTransactions />} />
          <Route path="payments/online" element={<OnlinePayments />} />
          <Route path="payments/cod" element={<CashOnDelivery />} />
          <Route path="payments/cod/pending" element={<CODPending />} />
          <Route path="payments/cod/collected" element={<CODCollected />} />
          <Route path="payments/cod/failed" element={<CODFailed />} />
          <Route
            path="payments/cod/reconciliation"
            element={<CODReconciliation />}
          />
          <Route path="returns" element={<ReturnRequests />} />
          <Route path="returns/details" element={<ReturnDetails />} />
          <Route path="returns/approved" element={<ApprovedReturns />} />
          <Route path="returns/rejected" element={<RejectedReturns />} />
          <Route path="returns/refunds" element={<RefundStatus />} />
          <Route path="offers" element={<OffersDiscounts />} />
          <Route path="offers/create-offer" element={<CreateDiscountOffer />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="coupons/create" element={<CreateCoupon />} />
          <Route
            path="/dashboard/coupons/edit/:id"
            element={<CreateCoupon />}
          />
          <Route path="promo-codes" element={<PromoCodes />} />
          <Route path="promo-codes/create" element={<CreatePromoCode />} />
          <Route
            path="/dashboard/promo-codes/edit/:id"
            element={<CreatePromoCode />}
          />
          <Route path="seasonal-sales" element={<SeasonalSales />} />
          <Route
            path="seasonal-sales/create"
            element={<CreateSeasonalSale />}
          />
          <Route
            path="/dashboard/seasonal-sales/edit/:id"
            element={<CreateSeasonalSale />}
          />
          <Route
            path="seasonal-sales/create"
            element={<CreateDiscountOffer />}
          />
          <Route
            path="/dashboard/offers/create-offer"
            element={<CreateDiscountOffer />}
          />
          <Route
            path="/dashboard/offers/edit/:id"
            element={<CreateDiscountOffer />}
          />
          {/* <Route path="shipping" element={<ShippingDelivery />} /> */}
          <Route
            path="add-shipping-delivery"
            element={<AddDeliveryPartner />}
          />
          <Route
            path="/dashboard/shipping/edit/:id"
            element={<AddDeliveryPartner />}
          />
          <Route
            path="/dashboard/shipping/partners"
            element={<DeliveryPartners />}
          />
          <Route
            path="/dashboard/deliverystatus"
            element={<DeliveryStatus />}
          />
          <Route
            path="/dashboard/deliverydetails/:id"
            element={<DeliveryDetails />}
          />
          <Route
            path="/dashboard/shipping-orders"
            element={<ShippingOrders />}
          />
          <Route path="/dashboard/tracking" element={<Tracking />} />
          <Route path="content" element={<WebsiteContentManagement />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route
            path="admin-management"
            element={<AdminEmployeeManagement />}
          />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
