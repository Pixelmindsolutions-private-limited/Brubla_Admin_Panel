import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
    Users,
    Search,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    UserX,
    Phone,
    Calendar,
    RefreshCw,
    MapPin,
    IndianRupee,
    Scissors,
    Palette,
    BadgeCheck,
    Loader2,
} from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API = "http://31.97.228.17:4077/api/admin";

const AllCustomers = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [users, setUsers] = useState([]);
    const [designers, setDesigners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [verificationFilter, setVerificationFilter] = useState("all");

    const initialRole = searchParams.get("role") || "User";
    const [roleFilter, setRoleFilter] = useState(initialRole);

    const itemsPerPage = 10;
    const [showWallet, setShowWallet] = useState({});

    const getToken = () => sessionStorage.getItem("adminToken");

    // ========== Fetch ==========
    const fetchAll = async () => {
        try {
            setLoading(true);
            const token = getToken();

            const [usersRes, designersRes] = await Promise.allSettled([
                axios.get(`${API}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API}/alldesigners`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (usersRes.status === "fulfilled" && usersRes.value.data.success) {
                const rawUsers =
                    usersRes.value.data.users ||
                    usersRes.value.data.data ||
                    [];
                setUsers(
                    rawUsers.map((user) =>
                        (user.role || "").trim().toLowerCase() === "tailor"
                            ? { ...user, role: "User" }
                            : user
                    )
                );

                // 🔍 DEBUG: Log all roles in console
                const roles = rawUsers.map((u) => u.role);
                const uniqueRoles = [...new Set(roles)];
                console.log("🔍 All roles from /users API:", uniqueRoles);
                console.log("👥 Users count:", rawUsers.length);
                console.log(
                    "✂️ Tailors count:",
                    rawUsers.filter((u) => u.role === "Tailor").length
                );
            } else {
                setUsers([]);
            }

            if (
                designersRes.status === "fulfilled" &&
                designersRes.value.data.success
            ) {
                const rawDesigners =
                    designersRes.value.data.designers ||
                    designersRes.value.data.data ||
                    [];

                const normalized = rawDesigners.map((d) => ({
                    _id: d._id,
                    name: d.name,
                    email: d.email,
                    mobile: d.mobile,
                    role: "Designer",
                    profileImage: d.profileImage || "",
                    brandName: d.brandName || "",
                    about: d.about || "",
                    isVerified: d.isVerified ?? false,
                    isActive: d.isActive ?? true,
                    isApproved: d.isApproved ?? false,
                    wallet: d.wallet || { balance: 0 },
                    addresses: d.addresses || [],
                    createdAt: d.createdAt,
                    updatedAt: d.updatedAt,
                    productStats: d.productStats,
                    sales: d.sales,
                    status: d.status,
                }));

                setDesigners(normalized);
            } else {
                setDesigners([]);
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch data",
                icon: "error",
                background: "#071236",
                color: "#FFFFFF",
                confirmButtonColor: "#C026D3",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // ==================================================
    // 🎯 BULLETPROOF STRICT FILTER
    // ==================================================
    // User     → ONLY role === "User" (case-insensitive)
    // Tailor   → ONLY role === "Tailor" (case-insensitive)
    // Designer → ONLY from /alldesigners API
    // NO MIXING. EVER.
    // ==================================================

    let roleFilteredList = [];

    if (roleFilter === "Designer") {
        // Only designers array
        roleFilteredList = designers;
    } else if (roleFilter === "Tailor") {
        // ONLY users whose role is exactly "tailor" (case-insensitive)
        roleFilteredList = users.filter((u) => {
            const role = (u.role || "").trim().toLowerCase();
            return role === "tailor";
        });
    } else {
        // User (default)
        roleFilteredList = users.filter((u) => {
            const role = (u.role || "").trim().toLowerCase();
            return role === "user";
        });
    }

    // 🔍 DEBUG: Log filtered result
    console.log(`🎯 Filtered (${roleFilter}):`, roleFilteredList.length);

    // ========== Search + Verification ==========
    const filteredList = roleFilteredList.filter((customer) => {
        const matchesSearch =
            searchTerm === "" ||
            (customer.name &&
                customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.email &&
                customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.mobile && customer.mobile.includes(searchTerm));

        const matchesVerification =
            verificationFilter === "all" ||
            (verificationFilter === "verified" && customer.isVerified) ||
            (verificationFilter === "unverified" && !customer.isVerified);

        return matchesSearch && matchesVerification;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, verificationFilter, roleFilter]);

    // ========== Pagination ==========
    const totalItems = filteredList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirst, indexOfLast);

    // ========== Role Config ==========
    const roleConfig = {
        User: {
            label: "Users",
            singular: "User",
            title: "All Customers",
            subtitle: "Manage and monitor all registered customers",
            icon: Users,
        },
        Tailor: {
            label: "Tailors",
            singular: "Tailor",
            title: "All Tailors",
            subtitle: "Manage and monitor all registered tailors",
            icon: Scissors,
        },
        Designer: {
            label: "Designers",
            singular: "Designer",
            title: "All Designers",
            subtitle: "Manage and monitor all registered designers",
            icon: Palette,
        },
    };

    const currentRole = roleConfig[roleFilter] || roleConfig.User;
    const RoleIcon = currentRole.icon;

    // ========== Stats ==========
    const stats = {
        total: roleFilteredList.length,
        verified: roleFilteredList.filter((u) => u.isVerified).length,
        withAddress: roleFilteredList.filter(
            (u) => u.addresses && u.addresses.length > 0
        ).length,
        withWallet: roleFilteredList.filter(
            (u) => u.wallet && u.wallet.balance > 0
        ).length,
    };

    // ========== Delete ==========
    const deleteUser = async (id, name, role) => {
        const result = await Swal.fire({
            title: "Delete?",
            text: `Are you sure you want to delete ${name || "this record"}?`,
            icon: "warning",
            showCancelButton: true,
            background: "#071236",
            color: "#FFFFFF",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#64748B",
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                const token = getToken();
                const endpoint = role === "Designer" ? "designers" : "users";

                await axios.delete(`${API}/${endpoint}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                Swal.fire({
                    title: "Deleted!",
                    text: "Record deleted successfully",
                    icon: "success",
                    background: "#071236",
                    color: "#FFFFFF",
                    timer: 1500,
                    showConfirmButton: false,
                });

                fetchAll();
            } catch (error) {
                console.error("Error deleting:", error);
                Swal.fire({
                    title: "Error!",
                    text: error.response?.data?.message || "Failed to delete",
                    icon: "error",
                    background: "#071236",
                    color: "#FFFFFF",
                    confirmButtonColor: "#C026D3",
                });
            }
        }
    };

    // ========== Empty check ==========
    const isCurrentRoleEmpty = !loading && roleFilteredList.length === 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <RoleIcon size={28} className="text-[#C026D3]" />
                        {currentRole.title}
                    </h1>
                    <p className="text-[#94A3B8] text-sm mt-1">
                        {currentRole.subtitle}
                    </p>
                </div>
                <button
                    onClick={fetchAll}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Filters (Always visible) */}
            <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                        />
                        <input
                            type="text"
                            placeholder="Search by name, email or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all"
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[150px]"
                    >
                        <option value="User">Users</option>
                        <option value="Tailor">Tailors</option>
                        <option value="Designer">Designers</option>
                    </select>

                    <select
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 cursor-pointer min-w-[140px]"
                    >
                        <option value="all">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-[#C026D3] animate-spin" />
                </div>
            ) : isCurrentRoleEmpty ? (
                /* ========== EMPTY STATE ========== */
                <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-16 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-[#C026D3]/10 flex items-center justify-center mb-4">
                        <RoleIcon size={40} className="text-[#94A3B8]" />
                    </div>
                    <p className="text-white text-xl font-semibold">
                        No {currentRole.label} Registered Yet
                    </p>
                    <p className="text-[#94A3B8] text-sm mt-2 max-w-md mx-auto">
                        There are currently no {currentRole.label.toLowerCase()}{" "}
                        in the system. Once they register, they will appear here.
                    </p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#94A3B8] text-sm">
                                        Total {currentRole.label}
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {stats.total}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-[#C026D3]/20 flex items-center justify-center">
                                    <RoleIcon size={20} className="text-[#C026D3]" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#94A3B8] text-sm">Verified</p>
                                    <p className="text-2xl font-bold text-white">
                                        {stats.verified}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <UserCheck size={20} className="text-emerald-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#94A3B8] text-sm">
                                        With Addresses
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {stats.withAddress}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <MapPin size={20} className="text-blue-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#94A3B8] text-sm">
                                        With Wallet
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {stats.withWallet}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <IndianRupee size={20} className="text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                        {filteredList.length === 0 ? (
                            <div className="text-center py-20">
                                <RoleIcon
                                    size={56}
                                    className="text-[#94A3B8] mx-auto mb-4"
                                />
                                <p className="text-white text-lg font-semibold">
                                    No {currentRole.label.toLowerCase()} found
                                </p>
                                <p className="text-[#94A3B8] text-sm mt-2">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white/5 border-b border-white/10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                                    {currentRole.singular}
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                                    Contact
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                                    Wallet
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                                    Joined
                                                </th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {currentItems.map((customer) => (
                                                <tr
                                                    key={customer._id}
                                                    className="hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C026D3] to-[#2563EB] flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
                                                                {customer.profileImage ? (
                                                                    <img
                                                                        src={`http://31.97.228.17:4077/${customer.profileImage.replace(
                                                                            /\\/g,
                                                                            "/"
                                                                        )}`}
                                                                        alt={customer.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.style.display = "none";
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    customer.name
                                                                        ?.charAt(0)
                                                                        .toUpperCase() || "U"
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-semibold flex items-center gap-1.5">
                                                                    {customer.name || "Unnamed"}
                                                                    {customer.isApproved && (
                                                                        <BadgeCheck
                                                                            size={14}
                                                                            className="text-blue-400"
                                                                        />
                                                                    )}
                                                                </p>
                                                                <p className="text-[#94A3B8] text-xs">
                                                                    {customer.email || "No email"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
                                                            <Phone size={14} />
                                                            {customer.mobile || "No mobile"}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        {customer.isVerified ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                                <UserCheck size={12} />
                                                                Verified
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                                                                <UserX size={12} />
                                                                Unverified
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-green-500/10 text-green-400 border-green-500/30">
                                                                ₹
                                                                {showWallet[customer._id]
                                                                    ? customer.wallet?.balance ?? 0
                                                                    : "••••"}
                                                            </span>

                                                            <button
                                                                onClick={() =>
                                                                    setShowWallet((prev) => ({
                                                                        ...prev,
                                                                        [customer._id]:
                                                                            !prev[customer._id],
                                                                    }))
                                                                }
                                                                className="text-[#94A3B8] hover:text-white transition-colors"
                                                            >
                                                                {showWallet[customer._id] ? (
                                                                    <FaEyeSlash size={14} />
                                                                ) : (
                                                                    <FaEye size={14} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-[#94A3B8] text-xs">
                                                            <Calendar size={12} />
                                                            {new Date(
                                                                customer.createdAt
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    navigate(
                                                                        customer.role === "Designer"
                                                                            ? `/dashboard/designers/${customer._id}`
                                                                            : `/dashboard/customers/${customer._id}`
                                                                    )
                                                                }
                                                                className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all"
                                                                title="View Details"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    navigate(
                                                                        customer.role === "Designer"
                                                                            ? `/dashboard/designers/edit/${customer._id}`
                                                                            : `/dashboard/customers/edit/${customer._id}`
                                                                    )
                                                                }
                                                                className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all"
                                                                title="Edit"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    deleteUser(
                                                                        customer._id,
                                                                        customer.name,
                                                                        customer.role
                                                                    )
                                                                }
                                                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                                        <p className="text-sm text-[#94A3B8]">
                                            Showing {indexOfFirst + 1} to{" "}
                                            {Math.min(indexOfLast, totalItems)} of{" "}
                                            {totalItems}{" "}
                                            {currentRole.label.toLowerCase()}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.max(prev - 1, 1)
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <span className="px-3 py-1 rounded-lg bg-[#C026D3]/20 text-white text-sm">
                                                {currentPage} / {totalPages}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.min(prev + 1, totalPages)
                                                    )
                                                }
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AllCustomers;
