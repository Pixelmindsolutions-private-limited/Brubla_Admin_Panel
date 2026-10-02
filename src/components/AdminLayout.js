import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStaffLandingPath, hasStaffPathPermission } from "../config";

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isStaff = Boolean(localStorage.getItem("staffToken"));

  if (isStaff && !hasStaffPathPermission(location.pathname)) {
    let staff = null;
    try {
      staff = JSON.parse(localStorage.getItem("staffUser") || "null");
    } catch {
      staff = null;
    }
    const landingPath = getStaffLandingPath(staff);

    if (
      landingPath !== location.pathname &&
      hasStaffPathPermission(landingPath)
    ) {
      return <Navigate to={landingPath} replace />;
    }

    return (
      <div className="m-6 rounded-xl border border-white/10 bg-[#071236] p-6 text-white">
        You do not have permission to view this page.
      </div>
    );
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#071236] to-[#020617]">
      {/* Sidebar — fixed, never scrolls */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar — pinned top */}
        <div className="flex-shrink-0">
          <Navbar onMenuClick={toggleMobileMenu} sidebarOpen={mobileMenuOpen} />
        </div>

        {/* Outlet — only this scrolls */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
