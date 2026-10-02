import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
    Layers, Plus, Edit, Trash2, X, Check, Loader, Search, RefreshCw,
    Tag, Calendar, AlertCircle, Eye, EyeOff, Grid3x3, List, Hash,
    ChevronLeft, ChevronRight, MoreHorizontal, Package, ChevronDown, Minus, Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://31.97.228.17:4077/api/admin";

// ✅ FALLBACK config (agar backend fail ho to ye use hoga)
const DEFAULT_CONFIG = {
    types: ["Flash Sale", "Seasonal Sale", "New Arrivals", "Trending", "Custom Collection"],
    statuses: ["Draft", "Scheduled", "Active", "Inactive", "Expired"],
    statusColors: {
        Draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        Scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        Inactive: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        Expired: "bg-red-500/20 text-red-400 border-red-500/30",
    },
    sortOptions: [
        { value: "order-asc", label: "Order (Low to High)" },
        { value: "order-desc", label: "Order (High to Low)" },
        { value: "title-asc", label: "Title (A-Z)" },
        { value: "title-desc", label: "Title (Z-A)" },
        { value: "createdAt-desc", label: "Newest First" },
        { value: "createdAt-asc", label: "Oldest First" },
    ],
    itemsPerPageOptions: [6, 12, 24, 48],
};

const CollectionManager = () => {
    const navigate = useNavigate();

    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("order");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    const [showModal, setShowModal] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);

    // ✅ FORM uses default config
    const [formData, setFormData] = useState({
        title: "",
        type: DEFAULT_CONFIG.types[0],
        tag: "",
        description: "",
        order: 0,
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        status: DEFAULT_CONFIG.statuses[0],
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // ✅ CONFIG with default fallback
    const [config, setConfig] = useState(DEFAULT_CONFIG);

    const getToken = () => sessionStorage.getItem("adminToken");

    // ========== Fetch Config + Collections ==========
    const fetchAll = async () => {
        try {
            setLoading(true);
            const token = getToken();

            // ✅ Fetch collections
            const collectionsRes = await axios
                .get(`${API}/collections`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .catch((err) => {
                    console.error("❌ Collections fetch failed:", err.message);
                    return null;
                });

            if (collectionsRes?.data?.success) {
                setCollections(collectionsRes.data.data || []);
                setCurrentPage(1);
            }

            // ✅ Fetch config (with fallback)
            const configRes = await axios
                .get(`${API}/collections/config`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .catch((err) => {
                    console.warn("⚠️ Config fetch failed, using defaults:", err.message);
                    return null;
                });

            if (configRes?.data?.success && configRes.data.data) {
                const cfg = configRes.data.data;
                setConfig({
                    types: cfg.types?.length ? cfg.types : DEFAULT_CONFIG.types,
                    statuses: cfg.statuses?.length ? cfg.statuses : DEFAULT_CONFIG.statuses,
                    statusColors: cfg.statusColors || DEFAULT_CONFIG.statusColors,
                    sortOptions: cfg.sortOptions?.length ? cfg.sortOptions : DEFAULT_CONFIG.sortOptions,
                    itemsPerPageOptions: cfg.itemsPerPageOptions || DEFAULT_CONFIG.itemsPerPageOptions,
                });
            }
            // Agar configRes null hai, to DEFAULT_CONFIG already set hai
        } catch (error) {
            console.error("Error:", error);
            // Silent fail — defaults already loaded
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
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

    // ========== Submit ==========
    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            Swal.fire({
                title: "Error!",
                text: "Collection name is required",
                icon: "error",
                background: "#071236",
                color: "#FFFFFF",
            });
            return;
        }

        const submitData = new FormData();
        submitData.append("title", formData.title);
        submitData.append("type", formData.type);
        submitData.append("tag", formData.tag);
        submitData.append("description", formData.description);
        submitData.append("order", formData.order.toString());
        submitData.append("status", formData.status);

        if (formData.startDate) {
            submitData.append(
                "startDate",
                formData.startTime
                    ? `${formData.startDate}T${formData.startTime}`
                    : formData.startDate
            );
        }
        if (formData.endDate) {
            submitData.append(
                "endDate",
                formData.endTime
                    ? `${formData.endDate}T${formData.endTime}`
                    : formData.endDate
            );
        }

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
                fetchAll();
            }
        } catch (error) {
            console.error("Error saving:", error);
            Swal.fire({
                title: "Error!",
                text:
                    error.response?.data?.message ||
                    `Failed to ${editingCollection ? "update" : "create"} collection`,
                icon: "error",
                background: "#071236",
                color: "#FFFFFF",
            });
        } finally {
            setSubmitting(false);
        }
    };

    // ========== Delete ==========
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
                fetchAll();
            } catch (error) {
                console.error("Error deleting:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete collection",
                    icon: "error",
                    background: "#071236",
                    color: "#FFFFFF",
                });
            }
        }
    };

    // ========== Toggle Status ==========
    const toggleActive = async (collection) => {
        try {
            const token = getToken();
            const currentStatus = getCollectionStatus(collection);
            const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

            const formData = new FormData();
            formData.append("status", newStatus);

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

            if (response.data.success) fetchAll();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    // ========== Modal Helpers ==========
    const openCreateModal = () => {
        setEditingCollection(null);
        setFormData({
            title: "",
            type: config.types[0] || DEFAULT_CONFIG.types[0],
            tag: "",
            description: "",
            order: 0,
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            status: config.statuses[0] || DEFAULT_CONFIG.statuses[0],
        });
        setImageFile(null);
        setImagePreview("");
        setShowModal(true);
    };

    const openEditModal = (collection) => {
        setEditingCollection(collection);
        setFormData({
            title: collection.title || "",
            type: collection.type || config.types[0] || DEFAULT_CONFIG.types[0],
            tag: collection.tag || "",
            description: collection.description || "",
            order: collection.order || 0,
            startDate: collection.startDate ? collection.startDate.split("T")[0] : "",
            startTime: collection.startDate
                ? collection.startDate.split("T")[1]?.slice(0, 5) || ""
                : "",
            endDate: collection.endDate ? collection.endDate.split("T")[0] : "",
            endTime: collection.endDate
                ? collection.endDate.split("T")[1]?.slice(0, 5) || ""
                : "",
            status: collection.status || (collection.isActive ? "Active" : "Inactive"),
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
            type: config.types[0] || DEFAULT_CONFIG.types[0],
            tag: "",
            description: "",
            order: 0,
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
            status: config.statuses[0] || DEFAULT_CONFIG.statuses[0],
        });
        setImageFile(null);
        setImagePreview("");
        setSubmitting(false);
    };

    // ========== Helpers ==========
    const getStatusStyle = (status) => {
        return (
            config.statusColors[status] ||
            "bg-gray-500/20 text-gray-400 border-gray-500/30"
        );
    };

    const getCollectionStatus = (collection) => {
        return collection.status || (collection.isActive ? "Active" : "Inactive");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        try {
            return new Date(dateStr).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch {
            return "—";
        }
    };

    // ========== Filter & Sort ==========
    const filteredCollections = collections
        .filter((collection) => {
            const matchesSearch =
                collection.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                collection._id?.toLowerCase().includes(searchTerm.toLowerCase());

            const collStatus = getCollectionStatus(collection);
            const matchesStatus = filterStatus === "all" || collStatus === filterStatus;
            const matchesType = filterType === "all" || collection.type === filterType;

            return matchesSearch && matchesStatus && matchesType;
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
    }, [searchTerm, filterStatus, filterType, sortBy, sortOrder]);

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

    // ========== Stats ==========
    const stats = {
        total: collections.length,
        active: collections.filter((c) => getCollectionStatus(c) === "Active").length,
        scheduled: collections.filter((c) => getCollectionStatus(c) === "Scheduled").length,
        inactive: collections.filter((c) => getCollectionStatus(c) === "Inactive").length,
    };

    // ========================================
    // MANAGE DROPDOWN
    // ========================================
    const ManageDropdown = ({ collection }) => {
        const isOpen = activeDropdown === collection._id;
        const [coords, setCoords] = useState({ top: 0, left: 0 });

        const handleToggle = (e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setCoords({ top: rect.bottom + 4, left: rect.right - 224 });
            setActiveDropdown(isOpen ? null : collection._id);
        };

        const status = getCollectionStatus(collection);

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
                            <div
                                className="fixed inset-0 z-[9998]"
                                onClick={() => setActiveDropdown(null)}
                            />
                            <div
                                className="fixed z-[9999] w-56 bg-[#0A1A4A] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                style={{ top: coords.top, left: Math.max(8, coords.left) }}
                            >
                                <button
                                    onClick={() => {
                                        navigate(`/dashboard/collections/${collection._id}`);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10"
                                >
                                    <Eye size={14} /> View Collection
                                </button>
                                <button
                                    onClick={() => {
                                        openEditModal(collection);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-400 hover:bg-white/10"
                                >
                                    <Edit size={14} /> Edit Collection
                                </button>
                                <button
                                    onClick={() => {
                                        navigate(
                                            `/dashboard/collections/${collection._id}/add-products`
                                        );
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-400 hover:bg-white/10"
                                >
                                    <Plus size={14} /> Add Products
                                </button>
                                <button
                                    onClick={() => {
                                        navigate(
                                            `/dashboard/collections/products/${collection._id}`
                                        );
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-400 hover:bg-white/10"
                                >
                                    <Minus size={14} /> Remove Products
                                </button>
                                <button
                                    onClick={() => {
                                        toggleActive(collection);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10"
                                >
                                    {status === "Active" ? (
                                        <>
                                            <EyeOff size={14} /> Deactivate
                                        </>
                                    ) : (
                                        <>
                                            <Check size={14} /> Activate
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(collection);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 border-t border-white/5"
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
            {currentItems.map((collection) => {
                const status = getCollectionStatus(collection);
                return (
                    <div
                        key={collection._id}
                        className="group relative bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 hover:border-[#C026D3]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    >
                        <div className="relative h-48 overflow-hidden rounded-t-2xl">
                            {collection.image ? (
                                <img
                                    src={collection.image}
                                    alt={collection.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "https://placehold.co/600x400/1a1a2e/94A3B8?text=No+Image";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#C026D3]/20 to-[#2563EB]/20 flex items-center justify-center">
                                    <Layers size={48} className="text-[#94A3B8]" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#071236] via-transparent to-transparent" />

                            <div className="absolute top-3 right-3">
                                <span
                                    className={`px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border ${getStatusStyle(
                                        status
                                    )}`}
                                >
                                    {status}
                                </span>
                            </div>

                            {collection.type && (
                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-[#C026D3]/30 text-white border border-[#C026D3]/40 backdrop-blur-md">
                                        {collection.type}
                                    </span>
                                </div>
                            )}

                            <div className="absolute bottom-3 left-3">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm">
                                    <Hash size={12} className="text-[#94A3B8]" />
                                    <span className="text-white text-xs font-medium font-mono">
                                        {collection._id?.slice(-6)}
                                    </span>
                                </div>
                            </div>
                        </div>

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

                            <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-3">
                                <Calendar size={12} />
                                <span>{formatDate(collection.startDate)}</span>
                                <span>→</span>
                                <span>{formatDate(collection.endDate)}</span>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                                    <Package size={12} />
                                    <span>{collection.products?.length || 0} products</span>
                                </div>
                                <ManageDropdown collection={collection} />
                            </div>
                        </div>
                    </div>
                );
            })}
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
                            {["Collection ID", "Name", "Type", "Products", "Start Date", "End Date", "Status", "Actions"].map(
                                (h) => (
                                    <th
                                        key={h}
                                        className={`px-6 py-4 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider ${
                                            h === "Actions" ? "text-right" : "text-left"
                                        }`}
                                    >
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {currentItems.map((collection) => {
                            const status = getCollectionStatus(collection);
                            return (
                                <tr
                                    key={collection._id}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-white font-mono text-xs">
                                            COL{collection._id?.slice(-5).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {collection.image ? (
                                                <img
                                                    src={collection.image}
                                                    alt={collection.title}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            "https://placehold.co/100x100/1a1a2e/94A3B8?text=N/A";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                                    <Layers size={16} className="text-[#94A3B8]" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white font-medium">
                                                    {collection.title}
                                                </p>
                                                <p className="text-[#94A3B8] text-xs line-clamp-1">
                                                    {collection.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {collection.type && (
                                            <span className="px-2 py-1 rounded-lg bg-[#C026D3]/10 text-[#C026D3] text-xs font-medium">
                                                {collection.type}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-semibold">
                                            {collection.products?.length || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[#94A3B8] text-xs">
                                        {formatDate(collection.startDate)}
                                    </td>
                                    <td className="px-6 py-4 text-[#94A3B8] text-xs">
                                        {formatDate(collection.endDate)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusStyle(
                                                status
                                            )}`}
                                        >
                                            {status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <ManageDropdown collection={collection} />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
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
                        {config.itemsPerPageOptions.map((num) => (
                            <option key={num} value={num}>
                                {num} per page
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">All Collections</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {stats.total}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[#C026D3]/20 flex items-center justify-center">
                            <Layers size={22} className="text-[#C026D3]" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">Active</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {stats.active}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Check size={22} className="text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">Scheduled</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {stats.scheduled}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Clock size={22} className="text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#071236] to-[#0a1445] rounded-2xl border border-white/10 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#94A3B8] text-sm">Inactive</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {stats.inactive}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                            <EyeOff size={22} className="text-yellow-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    />
                    <input
                        type="text"
                        placeholder="Search by Collection Name / Collection ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        {config.types.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        {config.statuses.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [newSortBy, newSortOrder] = e.target.value.split("-");
                            setSortBy(newSortBy);
                            setSortOrder(newSortOrder);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer"
                    >
                        {config.sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
                    >
                        {viewMode === "grid" ? <List size={20} /> : <Grid3x3 size={20} />}
                    </button>

                    <button
                        onClick={fetchAll}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Collections */}
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
                        {searchTerm || filterStatus !== "all" || filterType !== "all"
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#071236] rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#071236] flex items-center justify-between p-6 border-b border-white/10 z-10">
                            <h2 className="text-xl font-bold text-white">
                                {editingCollection
                                    ? "Edit Collection"
                                    : "Create New Collection"}
                            </h2>
                            <button
                                onClick={resetModal}
                                className="p-1 rounded-lg hover:bg-white/10"
                            >
                                <X size={20} className="text-[#94A3B8]" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Collection Name *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                                    placeholder="e.g., Flash Sale"
                                />
                            </div>

                            {/* ID */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Collection ID
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={
                                        editingCollection
                                            ? `COL${editingCollection._id?.slice(-5).toUpperCase()}`
                                            : "Auto Generated"
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] font-mono cursor-not-allowed"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Collection Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 cursor-pointer"
                                >
                                    {config.types.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Image */}
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
                                                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                    <label className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center cursor-pointer hover:bg-white/10">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        {imagePreview ? "Change Image" : "Upload Collection Image"}
                                    </label>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Collection Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 resize-none"
                                    placeholder="Describe your collection..."
                                />
                            </div>

                            {/* Duration */}
                            <div className="pt-4 border-t border-white/10">
                                <h3 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider mb-4">
                                    Collection Duration (Optional)
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "Start Date", name: "startDate", type: "date" },
                                        { label: "Start Time", name: "startTime", type: "time" },
                                        { label: "End Date", name: "endDate", type: "date" },
                                        { label: "End Time", name: "endTime", type: "time" },
                                    ].map((f) => (
                                        <div key={f.name}>
                                            <label className="block text-xs text-[#94A3B8] mb-2">
                                                {f.label}
                                            </label>
                                            <input
                                                type={f.type}
                                                name={f.name}
                                                value={formData[f.name]}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 cursor-pointer"
                                >
                                    {config.statuses.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-3 rounded-xl bg-[#C026D3]/10 border border-[#C026D3]/20">
                                <p className="text-xs text-[#C026D3]">
                                    💡 Products can be added after creating the collection.
                                </p>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-[#071236] flex items-center justify-end gap-3 p-6 border-t border-white/10">
                            <button
                                onClick={resetModal}
                                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Loader size={18} className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        {editingCollection ? <Edit size={18} /> : <Plus size={18} />}
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