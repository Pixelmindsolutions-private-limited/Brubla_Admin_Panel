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
import ModuleUnavailable from "./pages/ModuleUnavailable";


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
          <Route path="products/brands" element={<ModuleUnavailable title="Brands" />} />
          <Route path="products/reviews" element={<ModuleUnavailable title="Product Reviews" />} />

          <Route path="collections" element={<CollectionManager />} />
          <Route path="collections/products/:collectionId" element={<CollectionProducts />} />
          <Route path="collections/homepage" element={<HomepageCollections />} />

          <Route path="login-banners" element={<LoginBanners />} />
          <Route path="hero-banners" element={<HeroBanners />} />
          <Route path="ad-banners" element={<AdBanners />} />

          <Route path="inventory/available" element={<AvailableStock />} />
          <Route path="inventory/low-stock" element={<ModuleUnavailable title="Low Stock" />} />
          <Route path="inventory/out-of-stock" element={<ModuleUnavailable title="Out of Stock" />} />
          <Route path="inventory/updates" element={<ModuleUnavailable title="Stock Updates" />} />

          <Route path="customers" element={<AllUsers />} />
          <Route path="customers/:id" element={<SingleUser />} />

          <Route path="orders" element={<ModuleUnavailable title="All Orders" />} />
          <Route path="orders/tracking" element={<ModuleUnavailable title="Order Tracking" />} />
          <Route path="orders/pending" element={<ModuleUnavailable title="Pending Orders" />} />
          <Route path="orders/processing" element={<ModuleUnavailable title="Processing Orders" />} />
          <Route path="orders/shipped" element={<ModuleUnavailable title="Shipped Orders" />} />
          <Route path="orders/delivered" element={<ModuleUnavailable title="Delivered Orders" />} />
          <Route path="orders/cancelled" element={<ModuleUnavailable title="Cancelled Orders" />} />

          <Route path="payments" element={<ModuleUnavailable title="All Transactions" />} />
          <Route path="payments/online" element={<ModuleUnavailable title="Online Payments" />} />
          <Route path="payments/cod" element={<ModuleUnavailable title="Cash on Delivery" description="COD reconciliation requires an orders endpoint that returns a COD payment flag and reconciliation status, plus an authenticated update endpoint." />} />
          <Route path="payments/cod/pending" element={<ModuleUnavailable title="COD Pending" />} />
          <Route path="payments/cod/collected" element={<ModuleUnavailable title="COD Collected" />} />
          <Route path="payments/cod/failed" element={<ModuleUnavailable title="COD Failed / Not Collected" />} />
          <Route path="payments/cod/reconciliation" element={<ModuleUnavailable title="COD Reconciliation" />} />
          <Route path="returns" element={<ModuleUnavailable title="Return Requests" />} />
          <Route path="returns/approved" element={<ModuleUnavailable title="Approved Returns" />} />
          <Route path="returns/rejected" element={<ModuleUnavailable title="Rejected Returns" />} />
          <Route path="returns/refunds" element={<ModuleUnavailable title="Refund Status" />} />
          <Route path="offers" element={<ModuleUnavailable title="Offers & Discounts" />} />
          <Route path="shipping" element={<ModuleUnavailable title="Shipping & Delivery" />} />
          <Route path="content" element={<ModuleUnavailable title="Website Content Management" />} />
          <Route path="reports" element={<ModuleUnavailable title="Reports & Analytics" />} />
          <Route path="notifications" element={<ModuleUnavailable title="Notifications" />} />
          <Route path="admin-management" element={<ModuleUnavailable title="Admin & Employee Management" />} />
          <Route path="settings" element={<ModuleUnavailable title="Settings" />} />

        </Route>
      </Route>

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" />} />

    </Routes >
  );
};

export default App;
