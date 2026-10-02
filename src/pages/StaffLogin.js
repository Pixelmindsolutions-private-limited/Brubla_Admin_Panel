import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Mail, Lock, Loader2, Eye, EyeOff, UserCog } from "lucide-react";
import { getStaffLandingPath } from "../config";

const API = "http://31.97.228.17:4077/api/admin";

const StaffLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============ Handle Submit ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/staff/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data.success) {
        const { token, staff } = res.data.data;

        // Check if staff is active
        if (staff.isActive === false) {
          setError("Your account has been deactivated. Contact admin.");
          Swal.fire({
            title: "Account Inactive",
            text: "Your account has been deactivated. Please contact admin.",
            icon: "warning",
            background: "#071236",
            color: "#FFFFFF",
          });
          setLoading(false);
          return;
        }

        // Save staff auth in localStorage
        localStorage.removeItem("adminToken");
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        sessionStorage.removeItem("adminToken");
        localStorage.setItem("staffToken", token);
        localStorage.setItem("staffUser", JSON.stringify(staff));
        localStorage.setItem(
          "staffPermissions",
          JSON.stringify(staff.permissions || [])
        );

        Swal.fire({
          title: "Welcome!",
          text: `Logged in as ${staff.name}`,
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1200,
          showConfirmButton: false,
        });

        navigate(getStaffLandingPath(staff), { replace: true });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";

      setError(msg);

      Swal.fire({
        title: "Login Failed",
        text: msg,
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
        confirmButtonColor: "#C026D3",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071236] p-4">
      <div className="w-full max-w-md">
        {/* ============ Logo / Header ============ */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C026D3] to-[#2563EB] mb-4">
            <UserCog size={32} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Staff Login
          </h1>
          <p className="text-[#94A3B8] text-sm mt-2">
            Sign in with your staff credentials
          </p>
        </div>

        {/* ============ Login Form ============ */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-5"
        >
          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="john@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-xs text-[#94A3B8]">
            Contact your admin if you don't have staff credentials
          </p>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
