import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  X,
  Package,
  Tag,
  MapPin,
  Hash,
  Truck,
  Settings,
  Info,
  Layers,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Box
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

// Reusable dropdown class (matches AllUsers page)
const SELECT_CLASS =
  "w-full px-4 py-2.5 rounded-xl bg-black border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 transition-all cursor-pointer";

const CreateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [categories, setCategories] = useState([]);

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    basic: true,
    description: true,
    specs: true,
    images: true,
    variants: true,
    inventory: true,
    shipping: false,
    delivery: false,
    tags: true,
    settings: true,
  });

  // Form State
  const [formData, setFormData] = useState({
    // 1. Basic Info
    name: "",
    categoryId: "",
    subcategoryId: "",
    brand: "",
    gender: "",
    isActive: true,

    // 2. Description
    shortDescription: "",
    description: "",

    // 3. Specifications
    specs: {
      fabric: "",
      color: "",
      pattern: "",
      fit: "",
      sleeve: "",
      neck: "",
      occasion: "",
      washCare: "",
      length: "",
    },

    // 4. Images
    mainImage: null,
    mainVideo: null,
    additionalImages: [],

    // 5. Variants
    variants: [],

    // 6. Inventory
    totalStock: 0,

    // 7. Shipping
    shipping: {
      weight: "",
      length: "",
      width: "",
      height: "",
    },

    // 8. Delivery
    deliveryAddresses: [],
    returnPolicy: "",

    // 9. Tags
    tags: [],

    // 10. Additional Settings
    settings: {
      newArrival: false,
      featured: false,
      returnable: true,
      bestSeller: false,
      exchangeAvailable: false,
    },
  });

  // Temporary States for Inputs
  const [newAddress, setNewAddress] = useState("");
  const [newTag, setNewTag] = useState("");
  const [currentVariant, setCurrentVariant] = useState({
    color: "",
    price: "",
    discountPrice: "",
    sizes: [],
  });
  const [currentSize, setCurrentSize] = useState({
    size: "",
    sku: "",
    mrp: "",
    sellingPrice: "",
    stock: "",
  });

  // Image Previews
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  const getToken = () => sessionStorage.getItem("adminToken");

  // --- API Calls ---
  const fetchCategories = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const p = response.data.product;
        setFormData({
          name: p.name || "",
          categoryId: p.categoryId?._id || p.categoryId || "",
          subcategoryId: p.subcategoryId?._id || p.subcategoryId || "",
          brand: p.brand || "",
          gender: p.gender || "",
          isActive: p.isActive ?? true,
          shortDescription: p.shortDescription || "",
          description: p.description || "",
          specs:
            p.specifications ||
            p.specs || {
              fabric: "",
              color: "",
              pattern: "",
              fit: "",
              sleeve: "",
              neck: "",
              occasion: "",
              washCare: "",
              length: "",
            },
          mainImage: null,
          mainVideo: null,
          additionalImages: [],
          variants: p.variants || [],
          totalStock: p.totalStock || 0,
          shipping:
            p.shipping || { weight: "", length: "", width: "", height: "" },
          deliveryAddresses:
            p.deliveryOptions?.availablePincodes || p.deliveryAddresses || [],
          returnPolicy:
            p.deliveryOptions?.returnPolicy || p.returnPolicy || "",
          tags: p.tags || [],
          settings: Array.isArray(p.additionalSettings)
            ? p.additionalSettings.reduce(
                (settings, setting) => ({
                  ...settings,
                  [setting.key]: setting.value,
                }),
                {}
              )
            : p.settings || {
                newArrival: false,
                featured: false,
                returnable: true,
                bestSeller: false,
                exchangeAvailable: false,
              },
        });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch product details",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
      });
      navigate("/dashboard/products");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (isEditMode) fetchProduct();
    else setFetching(false);
  }, [id]);

  // --- Handlers ---
  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [name]: value },
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [name]: value },
    }));
  };

  const handleSettingChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: !prev.settings[key] },
    }));
  };

  // Images
  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, mainImage: file }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImages = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      additionalImages: [...prev.additionalImages, ...files],
    }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setAdditionalPreviews((prev) => [...prev, ...previews]);
  };

  const removeAdditionalImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
    setAdditionalPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Tags
  const addTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()],
      }));
      setNewTag("");
    }
  };
  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  // Addresses
  const addAddress = () => {
    if (newAddress.trim()) {
      setFormData((prev) => ({
        ...prev,
        deliveryAddresses: [...prev.deliveryAddresses, newAddress.trim()],
      }));
      setNewAddress("");
    }
  };
  const removeAddress = (index) => {
    setFormData((prev) => ({
      ...prev,
      deliveryAddresses: prev.deliveryAddresses.filter((_, i) => i !== index),
    }));
  };

  // Variants
  const addSizeToVariant = () => {
    if (currentSize.size && currentSize.stock) {
      setCurrentVariant((prev) => ({
        ...prev,
        sizes: [...prev.sizes, { ...currentSize }],
      }));
      setCurrentSize({
        size: "",
        sku: "",
        mrp: "",
        sellingPrice: "",
        stock: "",
      });
    }
  };

  const removeSizeFromVariant = (index) => {
    setCurrentVariant((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const addVariant = () => {
    if (!currentVariant.color || !currentVariant.price) {
      Swal.fire({
        title: "Missing Fields",
        text: "Color and Price are required for a variant.",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, currentVariant],
    }));
    setCurrentVariant({ color: "", price: "", discountPrice: "", sizes: [] });
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId || formData.variants.length === 0) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill Product Name, Category, and at least one Variant.",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
      });
      return;
    }

    const submitData = new FormData();

    submitData.append("name", formData.name);
    submitData.append("categoryId", formData.categoryId);
    if (formData.subcategoryId) submitData.append("subcategoryId", formData.subcategoryId);
    if (formData.brand) submitData.append("brand", formData.brand);
    if (formData.gender) submitData.append("gender", formData.gender);
    if (formData.shortDescription) submitData.append("shortDescription", formData.shortDescription);
    if (formData.description) submitData.append("description", formData.description);

    const specifications = Object.fromEntries(
      Object.entries(formData.specs).filter(([, value]) => value !== "")
    );
    if (Object.keys(specifications).length) {
      submitData.append("specifications", JSON.stringify(specifications));
    }

    const shipping = Object.fromEntries(
      Object.entries(formData.shipping).filter(([, value]) => value !== "")
    );
    if (Object.keys(shipping).length) submitData.append("shipping", JSON.stringify(shipping));

    const deliveryOptions = {};
    if (formData.deliveryAddresses.length)
      deliveryOptions.availablePincodes = formData.deliveryAddresses;
    if (formData.returnPolicy) deliveryOptions.returnPolicy = formData.returnPolicy;
    if (Object.keys(deliveryOptions).length)
      submitData.append("deliveryOptions", JSON.stringify(deliveryOptions));

    if (formData.tags.length) submitData.append("tags", JSON.stringify(formData.tags));

    const additionalSettings = Object.entries(formData.settings).map(([key, value]) => ({
      key,
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (letter) => letter.toUpperCase()),
      value,
    }));
    if (additionalSettings.length)
      submitData.append("additionalSettings", JSON.stringify(additionalSettings));

    const variantsForJson = formData.variants.map((v) => ({
      color: v.color,
      price: Number(v.price),
      ...(v.discountPrice !== "" && { discountPrice: Number(v.discountPrice) }),
      sizes: v.sizes.map((size) => ({
        ...size,
        ...(size.stock !== "" && { stock: Number(size.stock) }),
      })),
    }));
    submitData.append("variants", JSON.stringify(variantsForJson));

    if (formData.mainImage) submitData.append("variant_0_images", formData.mainImage);
    formData.additionalImages.forEach((img) => {
      submitData.append("variant_0_images", img);
    });
    if (formData.mainVideo) submitData.append("product_video", formData.mainVideo);

    try {
      setLoading(true);
      const token = getToken();
      const url = isEditMode ? `${API}/products/${id}` : `${API}/products`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: submitData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          text: `Product ${isEditMode ? "updated" : "created"} successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFFFFF",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => navigate("/dashboard/products"), 1500);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong.",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-8 h-8 border-2 border-[#C026D3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Helper for Section Header
  const SectionHeader = ({ title, icon: Icon, sectionKey }) => (
    <div
      className="flex items-center justify-between cursor-pointer py-2 border-b border-white/10 mb-4"
      onClick={() => toggleSection(sectionKey)}
    >
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <Icon size={18} className="text-[#C026D3]" />
        {title}
      </h2>
      <div className="text-[#94A3B8]">
        {openSections[sectionKey] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/products")}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {isEditMode ? "Edit Product" : "Create New Product"}
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Add a new product to your catalog
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic Information */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader title="1. Basic Information" icon={Info} sectionKey="basic" />
          {openSections.basic && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={SELECT_CLASS}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Subcategory
                </label>
                <select
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  className={SELECT_CLASS}
                >
                  <option value="">Select Subcategory</option>
                  {categories
                    .find((c) => c._id === formData.categoryId)
                    ?.subcategories?.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                  placeholder="Brand Name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={SELECT_CLASS}
                >
                  <option value="">Select Gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
                  />
                  <span className="text-white text-sm">Product Status (Active)</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 2. Description */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader title="2. Description" icon={Layers} sectionKey="description" />
          {openSections.description && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                  placeholder="Brief summary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 resize-none"
                  placeholder="Full product details"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. Product Specifications */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader title="3. Product Specifications" icon={Settings} sectionKey="specs" />
          {openSections.specs && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {["fabric", "color", "pattern", "fit", "sleeve", "neck", "occasion", "washCare", "length"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-[#94A3B8] mb-1 capitalize">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={formData.specs[field]}
                      onChange={handleSpecChange}
                      className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* 4. Product Images */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader title="4. Product Images" icon={ImageIcon} sectionKey="images" />
          {openSections.images && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Main Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImage}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#C026D3] file:text-white hover:file:bg-[#A020B0] cursor-pointer"
                  />
                  {mainImagePreview && (
                    <img
                      src={mainImagePreview}
                      alt="Main Preview"
                      className="mt-2 w-20 h-20 rounded-lg object-cover"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Main Video (Optional)
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setFormData({ ...formData, mainVideo: e.target.files[0] })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#C026D3] file:text-white hover:file:bg-[#A020B0] cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Additional Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAdditionalImages}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#C026D3] file:text-white hover:file:bg-[#A020B0] cursor-pointer"
                />
                <div className="flex gap-2 mt-3 flex-wrap">
                  {additionalPreviews.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${idx}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(idx)}
                        className="absolute -top-1 -right-1 p-0.5 rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Product Variants */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader title="5. Product Variants" icon={Hash} sectionKey="variants" />
          {openSections.variants && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Add Variant Form */}
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <h3 className="text-white font-semibold mb-3 text-sm">Add New Variant</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Color *"
                    value={currentVariant.color}
                    onChange={(e) =>
                      setCurrentVariant({ ...currentVariant, color: e.target.value })
                    }
                    className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Price *"
                    value={currentVariant.price}
                    onChange={(e) =>
                      setCurrentVariant({ ...currentVariant, price: e.target.value })
                    }
                    className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Discount Price"
                    value={currentVariant.discountPrice}
                    onChange={(e) =>
                      setCurrentVariant({
                        ...currentVariant,
                        discountPrice: e.target.value,
                      })
                    }
                    className="px-4 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                  />
                </div>

                {/* Sizes Sub-section */}
                <div className="mb-4">
                  <label className="text-xs text-[#94A3B8] mb-2 block">
                    Sizes, SKU, MRP, Selling Price, Stock
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Size (S, M, L)"
                      value={currentSize.size}
                      onChange={(e) =>
                        setCurrentSize({ ...currentSize, size: e.target.value })
                      }
                      className="w-20 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="SKU"
                      value={currentSize.sku}
                      onChange={(e) =>
                        setCurrentSize({ ...currentSize, sku: e.target.value })
                      }
                      className="w-24 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="MRP"
                      value={currentSize.mrp}
                      onChange={(e) =>
                        setCurrentSize({ ...currentSize, mrp: e.target.value })
                      }
                      className="w-20 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Selling Price"
                      value={currentSize.sellingPrice}
                      onChange={(e) =>
                        setCurrentSize({
                          ...currentSize,
                          sellingPrice: e.target.value,
                        })
                      }
                      className="w-24 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={currentSize.stock}
                      onChange={(e) =>
                        setCurrentSize({ ...currentSize, stock: e.target.value })
                      }
                      className="w-20 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                    />
                    <button
                      type="button"
                      onClick={addSizeToVariant}
                      className="px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm transition-all"
                    >
                      Add Size
                    </button>
                  </div>

                  {/* Added Sizes List */}
                  <div className="flex flex-wrap gap-2">
                    {currentVariant.sizes.map((size, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-white text-xs"
                      >
                        {size.size} | SKU: {size.sku || "-"} | MRP: {size.mrp} | Sell:{" "}
                        {size.sellingPrice} | Stock: {size.stock}
                        <button
                          type="button"
                          onClick={() => removeSizeFromVariant(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all text-sm"
                >
                  Add Variant
                </button>
              </div>

              {/* Existing Variants */}
              {formData.variants.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-sm">
                    Added Variants ({formData.variants.length})
                  </h3>
                  {formData.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-xl p-3 flex justify-between items-start"
                    >
                      <div>
                        <p className="text-white font-semibold">{variant.color}</p>
                        <p className="text-[#94A3B8] text-xs">
                          Price: {variant.price}{" "}
                          {variant.discountPrice && `(Disc: ${variant.discountPrice})`}
                        </p>
                        <p className="text-[#94A3B8] text-xs mt-1">
                          Sizes:{" "}
                          {variant.sizes.map((s) => `${s.size}(${s.stock})`).join(", ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 6. Inventory */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader title="6. Inventory" icon={Box} sectionKey="inventory" />
          {openSections.inventory && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-semibold text-white mb-2">
                Total Stock
              </label>
              <input
                type="number"
                name="totalStock"
                value={formData.totalStock}
                onChange={handleChange}
                className="w-full md:w-1/3 px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                placeholder="Total stock count"
              />
            </div>
          )}
        </div>

        {/* 7. Shipping */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader title="7. Shipping (Optional)" icon={Truck} sectionKey="shipping" />
          {openSections.shipping && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Weight
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.shipping.weight}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Length
                </label>
                <input
                  type="number"
                  name="length"
                  value={formData.shipping.length}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Width
                </label>
                <input
                  type="number"
                  name="width"
                  value={formData.shipping.width}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Height
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.shipping.height}
                  onChange={handleShippingChange}
                  className="w-full px-3 py-2 rounded-lg bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* 8. Delivery Options */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader title="8. Delivery options" icon={MapPin} sectionKey="delivery" />
          {openSections.delivery && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Available Locations / Pincodes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                    placeholder="Enter city or pincode"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addAddress())
                    }
                  />
                  <button
                    type="button"
                    onClick={addAddress}
                    className="px-4 py-2.5 rounded-xl bg-[#C026D3]/20 hover:bg-[#C026D3]/30 text-[#C026D3] transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.deliveryAddresses.map((addr, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-white text-sm"
                    >
                      {addr}
                      <button
                        type="button"
                        onClick={() => removeAddress(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Return Policy Details
                </label>
                <textarea
                  name="returnPolicy"
                  value={formData.returnPolicy}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 resize-none text-sm"
                  placeholder="Enter return policy details"
                />
              </div>
            </div>
          )}
        </div>

        {/* 9. Product Tags */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader title="9. Product Tags" icon={Tag} sectionKey="tags" />
          {openSections.tags && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
                  placeholder="Enter tags..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2.5 rounded-xl bg-[#C026D3]/20 hover:bg-[#C026D3]/30 text-[#C026D3] transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C026D3]/10 text-[#C026D3] text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 10. Additional Settings */}
        <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <SectionHeader
            title="10. Additional Settings"
            icon={Settings}
            sectionKey="settings"
          />
          {openSections.settings && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {Object.keys(formData.settings).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings[key]}
                    onChange={() => handleSettingChange(key)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
                  />
                  <span className="text-white text-sm capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditMode ? "Update Product" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;