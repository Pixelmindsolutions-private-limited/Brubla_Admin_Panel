import { useState, useEffect, useRef } from "react";
import { Bell, Settings, LogOut, User, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import { Maximize, Minimize } from "lucide-react";

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const navigate = useNavigate();

  const [isFullScreen, setIsFullScreen] = useState(false);

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Listen to fullscreen change (handles Esc key too)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Handle Bell icon click → open notifications page
  const handleNotifications = () => {
    navigate("/dashboard/notifications");
  };

  // Handle Profile click → open admin management page
  const handleProfile = () => {
    navigate("/dashboard/admin-management");
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-[#071236]/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] px-4 md:px-6 py-3 flex items-center justify-between gap-4 border-b border-white/10 sticky top-0 z-50">

        {/* Left section - Mobile Menu Button + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo / Brand */}
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C026D3] to-[#A020B0] flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg">Brubla Admin</h1>
              <p className="text-[10px] text-[#C026D3]">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-xl hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors duration-200"
            aria-label="Toggle Fullscreen"
          >
            {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {/* Bell → Notifications Page */}
          <button
            onClick={handleNotifications}
            className="relative p-2 rounded-xl hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors duration-200"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {/* Optional: unread dot — remove if you no longer track unread in navbar */}
            {/* <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C026D3] animate-pulse" /> */}
          </button>

          {/* Profile → Admin Management Page */}
          <button
            onClick={handleProfile}
            className="flex items-center gap-2.5 cursor-pointer hover:bg-white/10 rounded-xl px-2.5 py-1.5 transition-colors duration-200"
            aria-label="Admin management"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C026D3] to-[#A020B0] flex items-center justify-center text-white text-sm font-black overflow-hidden">
              <img
                src={logo}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-white">Brubla Admin</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;