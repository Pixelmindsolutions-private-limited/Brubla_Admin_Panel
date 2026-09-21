import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
    Layers,
    Plus,
    Edit,
    Trash2,
    X,
    Check,
    Image as ImageIcon,
    Loader,
    Search,
    RefreshCw,
    Tag,
    Calendar,
    TrendingUp,
    AlertCircle,
    Eye,
    EyeOff,
    ArrowUpDown,
    Filter,
    Grid3x3,
    List,
    Clock,
    Hash,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Shirt,
    Package,
    ChevronDown,
    Minus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://31.97.228.17:4077/api/admin";

const CollectionManager = () => {
    const navigate = useNavigate();

    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("order");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterActive, setFilterActive] = useState("all");
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    const [showModal, setShowModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        tag: "",
        description: "",
        order: 0,
        isActive: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const getToken = () => sessionStorage.getItem("adminToken");

    // Fetch collections
    const fetchCollections = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await axios.get(`${API}/collections`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setCollections(response.data.data);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Error fetching collections:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to fetch collections",
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
        fetchCollections();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            Swal.fire({
                title: "Error!",
                text: "Collection title is required",
                icon: "error",
                background: "#071236",
                color: "#FFFFFF",
            });
            return;
        }

        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("tag", formData.tag);
        submitData.append("description", formData.description);
        submitData.append("order", formData.order.toString());
        if (imageFile) submitData.append("image", imageFile);

        try {
            setSubmitting(true);
            const token = getToken();
            let response;

            if (editingCollection) {
                response = await axios.put(
                    `${API}/collections/${editingCollection._id}`,
                    submitData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            } else {
                response = await axios.post(`${API}/collections`, submitData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            if (response.data.success) {
                Swal.fire({
                    title: "Success!",
                    text: `Collection ${editingCollection ? "updated" : "created"} successfully`,
                    icon: "success",
                    background: "#071236",
                    color: "#FFFFFF",
                    timer: 1500,
                    showConfirmButton: false,
                });
                resetModal();
                fetchCollections();
            }
        } catch (error) {
            console.error("Error saving collection:", error);
            Swal.fire({
                title: "Error!",
                text:
                    error.response?.data?.message ||
                    `Failed to ${editingCollection ? "update" : "create"} collection`,
                icon: "error",
                background: "#071236",
                color: "#FFFFFF",
                confirmButtonColor: "#C026D3",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (collection) => {
        const result = await Swal.fire({
            title: "Delete Collection?",
            text: `Are you sure you want to delete "${collection.title}"?`,
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
                await axios.delete(`${API}/collections/${collection._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                Swal.fire({
                    title: "Deleted!",
                    text: "Collection deleted successfully",
                    icon: "success",
                    background: "#071236",
                    color: "#FFFFFF",
                    timer: 1500,
                    showConfirmButton: false,
                });
                fetchCollections();
            } catch (error) {
                console.error("Error deleting collection:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete collection",
                    icon: "error",
                    background: "#071236",
                    color: "#FFFFFF",
                    confirmButtonColor: "#C026D3",
                });
            }
        }
    };

    const toggleActive = async (collection) => {
        try {
            const token = getToken();
            const formData = new FormData();
            formData.append("isActive", !collection.isActive);

            const response = await axios.put(
                `${API}/collections/${collection._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) fetchCollections();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const openCreateModal = () => {
        setEditingCollection(null);
        setFormData({
            title: "",
            tag: "",
            description: "",
            order: 0,
            isActive: true,
        });
        setImageFile(null);
        setImagePreview("");
        setShowModal(true);
    };

    const openEditModal = (collection) => {
        setEditingCollection(collection);
        setFormData({
            title: collection.title,
            tag: collection.tag || "",
            description: collection.description || "",
            order: collection.order || 0,
            isActive: collection.isActive,
        });
        setImagePreview(collection.image);
        setImageFile(null);
        setShowModal(true);
    };

    const resetModal = () => {
        setShowModal(false);
        setEditingCollection(null);
        setFormData({
            title: "",
            tag: "",
            description: "",
            order: 0,
            isActive: true,
        });
        setImageFile(null);
        setImagePreview("");
        setSubmitting(false);
    };

    const filteredCollections = collections
        .filter((collection) => {
            const matchesSearch = collection.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesFilter =
                filterActive === "all" ||
                (filterActive === "active" && collection.isActive) ||
                (filterActive === "inactive" && !collection.isActive);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === "order") {
                aVal = a.order || 0;
                bVal = b.order || 0;
            }
            if (sortBy === "createdAt") {
                aVal = new Date(a.createdAt).getTime();
                bVal = new Date(b.createdAt).getTime();
            }

            if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
            return aVal < bVal ? 1 : -1;
        });

    const totalItems = filteredCollections.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredCollections.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterActive, sortBy, sortOrder]);

    const getPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(1);
            if (startPage > 2) items.push("ellipsis");
        }
        for (let i = startPage; i <= endPage; i++) items.push(i);
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) items.push("ellipsis");
            items.push(totalPages);
        }
        return items;
    };

    const handlePageChange = (page) => {
        if (page === "ellipsis") return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const stats = {
        total: collections.length,
        active: collections.filter((c) => c.isActive).length,
        totalProducts: collections.reduce(
            (acc, c) => acc + (c.products?.length || 0),
            0
        ),
        avgOrder:
            Math.round(
                collections.reduce((acc, c) => acc + (c.order || 0), 0) /
                    collections.length
            ) || 0,
    };

    // ========================================
    // MANAGE DROPDOWN - PORTAL VERSION
    // ========================================
    const ManageDropdown = ({ collection }) => {
        const isOpen = activeDropdown === collection._id;
        const [coords, setCoords] = useState({ top: 0, left: 0 });

        const handleToggle = (e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 4,
                left: rect.right - 224, // w-56 = 224px
            });
            setActiveDropdown(isOpen ? null : collection._id);
        };

        return (
            <>
                <button
                    onClick={handleToggle}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all relative z-20"
                >
                    Manage <ChevronDown size={12} />
                </button>

                {isOpen &&
                    createPortal(
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-[9998]"
                                onClick={() => setActiveDropdown(null)}
                            />

                            {/* Dropdown */}
                            <div
                                className="fixed z-[9999] w-56 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                style={{
                                    top: coords.top,
                                    left: Math.max(8, coords.left),
                                }}
                            >
                                <button
                                    onClick={() => {
                                        navigate(`/dashboard/collections/${collection._id}`);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                                >
                                    <Eye size={14} /> View Collection
                                </button>

                                <button
                                    onClick={() => {
                                        openEditModal(collection);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10 transition-colors"
                                >
                                    <Edit size={14} /> Edit Collection
                                </button>

                                <button
                                    onClick={() => {
                                        navigate(`/dashboard/collections/${collection._id}/add-products`);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10 transition-colors"
                                >
                                    <Plus size={14} /> Add Products
                                </button>

                                <button
                                    onClick={() => {
                                        navigate(`/dashboard/collections/products/${collection._id}`);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-400 hover:bg-white/10 transition-colors"
                                >
                                    <Minus size={14} /> Remove Products
                                </button>

                                <button
                                    onClick={() => {
                                        toggleActive(collection);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10 transition-colors"
                                >
                                    {collection.isActive ? (
                                        <>
                                            <EyeOff size={14} /> Deactivate Collection
                                        </>
                                    ) : (
                                        <>
                                            <Check size={14} /> Activate Collection
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        handleDelete(collection);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors border-t border-white/5"
                                >
                                    <Trash2 size={14} /> Delete Collection
                                </button>
                            </div>
                        </>,
                        document.body
                    )}
            </>
        );
    };

    // ========================================
    // GRID VIEW
    // ========================================
    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentItems.map((collection) => (
                <div
                    key={collection._id}
                    className="group relative bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 hover:border-[#C026D3]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                >
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        {collection.image ? (
                            <img
                                src={collection.image}
                                alt={collection.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#C026D3]/20 to-[#2563EB]/20 flex items-center justify-center">
                                <Layers size={48} className="text-[#94A3B8]" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071236] via-transparent to-transparent" />

                        <div className="absolute top-3 right-3">
                            <span
                                className={`px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-md ${
                                    collection.isActive
                                        ? "bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                                        : "bg-red-500/30 text-red-400 border border-red-500/30"
                                }`}
                            >
                                {collection.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div className="absolute bottom-3 left-3">
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
                                <Hash size={12} className="text-[#94A3B8]" />
                                <span className="text-white text-xs font-medium">
                                    Order: {collection.order || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
                            {collection.title}
                        </h3>

                        {collection.tag && (
                            <div className="flex items-center gap-1 mb-2">
                                <Tag size={12} className="text-[#C026D3]" />
                                <span className="text-[#C026D3] text-xs font-medium">
                                    {collection.tag}
                                </span>
                            </div>
                        )}

                        <p className="text-[#94A3B8] text-sm line-clamp-2 mb-3">
                            {collection.description || "No description"}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                                <Package size={12} />
                                <span>{collection.products?.length || 0} products</span>
                            </div>
                            <ManageDropdown collection={collection} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // ========================================
    // LIST VIEW
    // ========================================
    const ListView = () => (
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Image
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Tag
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Order
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Products
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {currentItems.map((collection) => (
                            <tr
                                key={collection._id}
                                className="hover:bg-white/5 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    {collection.image ? (
                                        <img
                                            src={collection.image}
                                            alt={collection.title}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                                            <Layers size={20} className="text-[#94A3B8]" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-white font-medium">
                                            {collection.title}
                                        </p>
                                        <p className="text-[#94A3B8] text-xs line-clamp-1">
                                            {collection.description}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {collection.tag && (
                                        <span className="px-2 py-1 rounded-lg bg-[#C026D3]/10 text-[#C026D3] text-xs font-medium">
                                            {collection.tag}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-white">
                                        {collection.order || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[#94A3B8]">
                                        {collection.products?.length || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                            collection.isActive
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : "bg-red-500/20 text-red-400"
                                        }`}
                                    >
                                        {collection.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end">
                                        <ManageDropdown collection={collection} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // ========================================
    // PAGINATION
    // ========================================
    const Pagination = () => {
        if (totalPages <= 1) return null;
        const paginationItems = getPaginationItems();

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
                <div className="text-sm text-[#94A3B8]">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                    {totalItems} collections
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer"
                    >
                        <option value={6}>6 per page</option>
                        <option value={12}>12 per page</option>
                        <option value={24}>24 per page</option>
                        <option value={48}>48 per page</option>
                    </select>

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1.5">
                        {paginationItems.map((item, index) =>
                            item === "ellipsis" ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-3 py-2 text-[#94A3B8]"
                                >
                                    <MoreHorizontal size={16} />
                                </span>
                            ) : (
                                <button
                                    key={item}
                                    onClick={() => handlePageChange(item)}
                                    className={`min-w-[36px] h-9 px-3 rounded-lg font-medium transition-all ${
                                        currentPage === item
                                            ? "bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white shadow-lg"
                                            : "bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white"
                                    }`}
                                >
                                    {item}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    };

    // ========================================
    // MAIN RENDER
    // ========================================
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                        <Layers size={28} className="text-[#C026D3]" />
                        Collections
                    </h1>
                    <p className="text-[#94A3B8] text-sm mt-1">
                        Manage your product collections and promotional campaigns
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all"
                >
                    <Plus size={18} />
                    Create Collection
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 p-5 hover:border-[#C026D3]/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">Total Collections</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[#C026D3]/20 flex items-center justify-center">
                            <Layers size={22} className="text-[#C026D3]" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 p-5 hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">Active Collections</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {stats.active}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Check size={22} className="text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 p-5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">Total Products</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {stats.totalProducts}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Package size={22} className="text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 p-5 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">Avg. Order</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {stats.avgOrder}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <TrendingUp size={22} className="text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    />
                    <input
                        type="text"
                        placeholder="Search collections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={filterActive}
                        onChange={(e) => setFilterActive(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 transition-all cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [newSortBy, newSortOrder] = e.target.value.split("-");
                            setSortBy(newSortBy);
                            setSortOrder(newSortOrder);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 transition-all cursor-pointer"
                    >
                        <option value="order-asc">Order (Low to High)</option>
                        <option value="order-desc">Order (High to Low)</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                    </select>

                    <button
                        onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
                    >
                        {viewMode === "grid" ? <List size={20} /> : <Grid3x3 size={20} />}
                    </button>

                    <button
                        onClick={fetchCollections}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Collections Display */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-3 border-[#C026D3] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredCollections.length === 0 ? (
                <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-16 text-center">
                    <AlertCircle size={56} className="text-[#94A3B8] mx-auto mb-4" />
                    <p className="text-white text-xl font-semibold">
                        No collections found
                    </p>
                    <p className="text-[#94A3B8] text-sm mt-2">
                        {searchTerm || filterActive !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "Click 'Create Collection' to add your first collection"}
                    </p>
                </div>
            ) : (
                <>
                    {viewMode === "grid" ? <GridView /> : <ListView />}
                    <Pagination />
                </>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#071236] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#071236] flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">
                                {editingCollection ? "Edit Collection" : "Create New Collection"}
                            </h2>
                            <button
                                onClick={resetModal}
                                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X size={20} className="text-[#94A3B8]" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Collection Image
                                </label>
                                <div className="flex items-center gap-4">
                                    {imagePreview && (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-24 h-24 rounded-xl object-cover border border-white/10"
                                            />
                                            <button
                                                onClick={() => {
                                                    setImagePreview("");
                                                    setImageFile(null);
                                                }}
                                                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                    <label className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center cursor-pointer hover:bg-white/10 transition-all">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        {imagePreview ? "Change Image" : "Upload Image"}
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 transition-all"
                                    placeholder="e.g., Summer Collection 2024"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Tag
                                    </label>
                                    <input
                                        type="text"
                                        name="tag"
                                        value={formData.tag}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 transition-all"
                                        placeholder="e.g., summer, winter, sale"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-white mb-2">
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 transition-all"
                                        placeholder="Display order"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 transition-all resize-none"
                                    placeholder="Describe your collection..."
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
                                    />
                                    <span className="text-white text-sm">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-[#071236] flex items-center justify-end gap-3 p-6 border-t border-white/10">
                            <button
                                onClick={resetModal}
                                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {editingCollection ? (
                                            <Edit size={18} />
                                        ) : (
                                            <Plus size={18} />
                                        )}
                                        {editingCollection
                                            ? "Update Collection"
                                            : "Create Collection"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionManager;