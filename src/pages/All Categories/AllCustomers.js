import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API = "http://31.97.228.17:4077/api/admin";

const AllCustomers = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [verificationFilter, setVerificationFilter] = useState("all");
    const customersPerPage = 10;

    const [showWallet, setShowWallet] = useState({});

    // Get token from sessionStorage
    const getToken = () => sessionStorage.getItem("adminToken");

    // Fetch all customers (role = User)
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await axios.get(`${API}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    role: "User", // Filter only customers
                },
            });

            if (response.data.success) {
                // Filter customers on frontend as well for safety
                const customerList = response.data.users.filter(
                    (user) => user.role === "User"
                );
                setCustomers(customerList);
                setTotalCustomers(customerList.length);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch customers",
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
        fetchCustomers();
    }, []);

    // Delete customer
    const deleteCustomer = async (customerId, customerName) => {
        const result = await Swal.fire({
            title: "Delete Customer?",
            text: `Are you sure you want to delete ${customerName || "this customer"}?`,
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
                await axios.delete(`${API}/users/${customerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                Swal.fire({
                    title: "Deleted!",
                    text: "Customer has been deleted successfully",
                    icon: "success",
                    background: "#071236",
                    color: "#FFFFFF",
                    timer: 1500,
                    showConfirmButton: false,
                });

                fetchCustomers(); // Refresh the list
            } catch (error) {
                console.error("Error deleting customer:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete customer",
                    icon: "error",
                    background: "#071236",
                    color: "#FFFFFF",
                    confirmButtonColor: "#C026D3",
                });
            }
        }
    };

    // Filter customers based on search and verification
    const filteredCustomers = customers.filter((customer) => {
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

    // Pagination
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(
        indexOfFirstCustomer,
        indexOfLastCustomer
    );
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <Users size={28} className="text-[#C026D3]" />
                        All Customers
                    </h1>
                    <p className="text-[#94A3B8] text-sm mt-1">
                        Manage and monitor all registered customers
                    </p>
                </div>
                <button
                    onClick={fetchCustomers}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">Total Customers</p>
                            <p className="text-2xl font-bold text-white">{totalCustomers}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#C026D3]/20 flex items-center justify-center">
                            <Users size={20} className="text-[#C026D3]" />
                        </div>
                    </div>
                </div>
                <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">Verified Customers</p>
                            <p className="text-2xl font-bold text-white">
                                {customers.filter((u) => u.isVerified).length}
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
                            <p className="text-[#94A3B8] text-sm">With Addresses</p>
                            <p className="text-2xl font-bold text-white">
                                {
                                    customers.filter(
                                        (u) => u.addresses && u.addresses.length > 0
                                    ).length
                                }
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
                            <p className="text-[#94A3B8] text-sm">With Wallet Balance</p>
                            <p className="text-2xl font-bold text-white">
                                {
                                    customers.filter(
                                        (u) => u.wallet && u.wallet.balance > 0
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <IndianRupee size={20} className="text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
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

                    {/* Verification Filter */}
                    <select
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none transition-all cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-2 border-[#C026D3] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                            Customer
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
                                    {currentCustomers.map((customer) => (
                                        <tr
                                            key={customer._id}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C026D3] to-[#2563EB] flex items-center justify-center text-white font-bold">
                                                        {customer.name
                                                            ? customer.name.charAt(0).toUpperCase()
                                                            : "U"}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-semibold">
                                                            {customer.name || "Unnamed Customer"}
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
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-green-50 text-green-700 border-green-200">
                                                        ₹
                                                        {showWallet[customer._id]
                                                            ? customer.wallet?.balance ?? 0
                                                            : "••••"}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            setShowWallet((prev) => ({
                                                                ...prev,
                                                                [customer._id]: !prev[customer._id],
                                                            }))
                                                        }
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        {showWallet[customer._id] ? (
                                                            <FaEyeSlash />
                                                        ) : (
                                                            <FaEye />
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
                                                                `/dashboard/customers/wallet/${customer._id}`
                                                            )
                                                        }
                                                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all"
                                                        title="View Wallet"
                                                    >
                                                        <IndianRupee size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/customers/${customer._id}`
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
                                                                `/dashboard/customers/edit/${customer._id}`
                                                            )
                                                        }
                                                        className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all"
                                                        title="Edit Customer"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteCustomer(
                                                                customer._id,
                                                                customer.name
                                                            )
                                                        }
                                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                                                        title="Delete Customer"
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                                <p className="text-sm text-[#94A3B8]">
                                    Showing {indexOfFirstCustomer + 1} to{" "}
                                    {Math.min(
                                        indexOfLastCustomer,
                                        filteredCustomers.length
                                    )}{" "}
                                    of {filteredCustomers.length} customers
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllCustomers;