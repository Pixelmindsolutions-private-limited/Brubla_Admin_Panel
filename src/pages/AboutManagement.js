import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Save,
  Trash2,
  Plus,
  X,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Users,
  Palette,
  Scissors,
  Sparkles,
  Eye,
  MessageSquare,
} from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

// ============ Initial Form State ============
const initialForm = {
  hero: {
    title: "",
    subtitle: "",
    description: "",
    additionalText: "",
    isActive: true,
  },
  marquee: {
    items: [],
    isActive: true,
  },
  purpose: {
    heading: "",
    paragraphs: [],
    highlightText: "",
    closingText: "",
    isActive: true,
  },
  connections: {
    heading: "",
    items: [],
    bottomText: "",
    isActive: true,
  },
  accessibility: {
    heading: "",
    highlightText: "",
    paragraphs: [],
    isActive: true,
  },
  marketplace: {
    heading: "",
    description: "",
    connections: [],
    isActive: true,
  },
  designers: {
    heading: "",
    paragraphs: [],
    highlightText: "",
    isActive: true,
  },
  tailors: {
    heading: "",
    paragraphs: [],
    journey: [],
    isActive: true,
  },
  vision: {
    heading: "",
    paragraphs: [],
    highlightText: "",
    isActive: true,
  },
  experience: {
    heading: "",
    items: [],
    isActive: true,
  },
  people: {
    heading: "",
    description: "",
    items: [],
    bottomText: "",
    isActive: true,
  },
  future: {
    heading: "",
    paragraphs: [],
    title: "",
    subtitle: "",
    isActive: true,
  },
  isPublished: true,
};

// ============ Section Config ============
const SECTIONS = [
  { key: "hero", label: "Hero", icon: Sparkles },
  { key: "marquee", label: "Marquee", icon: MessageSquare },
  { key: "purpose", label: "Our Purpose", icon: Info },
  { key: "connections", label: "One Platform. Three Connections", icon: Users },
  { key: "accessibility", label: "Making Fashion Accessible", icon: Palette },
  { key: "marketplace", label: "More Than A Marketplace", icon: MessageSquare },
  { key: "designers", label: "Empowering Designers", icon: Palette },
  { key: "tailors", label: "Connecting Local Tailors", icon: Scissors },
  { key: "vision", label: "Our Vision", icon: Eye },
  { key: "experience", label: "The Brubla Experience", icon: Sparkles },
  { key: "people", label: "Built Around People", icon: Users },
  { key: "future", label: "The Future of Personal Fashion", icon: Sparkles },
];

const SECTION_TAB_GROUPS = {
  designers: ["designers", "tailors"],
  purpose: ["connections", "purpose"],
};

const AboutManagement = ({
  sectionOnly = null,
  tabGroup = null,
  initialSection = "designers",
}) => {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exists, setExists] = useState(false);
  const [activeSection, setActiveSection] = useState(initialSection);
  const tabKeys = SECTION_TAB_GROUPS[tabGroup] || [];
  const [expandedSections, setExpandedSections] = useState(
    SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: true }), {})
  );

  const getToken = () =>
    localStorage.getItem("staffToken") ||
    sessionStorage.getItem("adminToken");

  // ============ Fetch About ============
  const fetchAbout = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await axios.get(`${API}/about`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.data) {
        // Merge with initial to ensure all fields exist
        const data = res.data.data;
        setFormData({
          hero: { ...initialForm.hero, ...(data.hero || {}) },
          marquee: { ...initialForm.marquee, ...(data.marquee || {}) },
          purpose: { ...initialForm.purpose, ...(data.purpose || {}) },
          connections: {
            ...initialForm.connections,
            ...(data.connections || {}),
          },
          accessibility: {
            ...initialForm.accessibility,
            ...(data.accessibility || {}),
          },
          marketplace: {
            ...initialForm.marketplace,
            ...(data.marketplace || {}),
          },
          designers: { ...initialForm.designers, ...(data.designers || {}) },
          tailors: { ...initialForm.tailors, ...(data.tailors || {}) },
          vision: { ...initialForm.vision, ...(data.vision || {}) },
          experience: {
            ...initialForm.experience,
            ...(data.experience || {}),
          },
          people: { ...initialForm.people, ...(data.people || {}) },
          future: { ...initialForm.future, ...(data.future || {}) },
          isPublished: data.isPublished ?? true,
        });
        setExists(true);
      } else {
        setFormData(initialForm);
        setExists(false);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Normal — no About exists yet
        setFormData(initialForm);
        setExists(false);
      } else {
        console.error("Fetch About error:", err);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Failed to fetch About page",
          icon: "error",
          background: "#071236",
          color: "#FFF",
          confirmButtonColor: "#C026D3",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // ============ Section Toggle ============
  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ============ Generic Handlers ============
  // Update a simple field inside a section
  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Update nested array field (simple string array)
  const updateStringArray = (section, arrayField, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: prev[section][arrayField].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };

  const addStringArrayItem = (section, arrayField, defaultValue = "") => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: [...(prev[section][arrayField] || []), defaultValue],
      },
    }));
  };

  const removeStringArrayItem = (section, arrayField, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: prev[section][arrayField].filter((_, i) => i !== index),
      },
    }));
  };

  // Update object array field
  const updateObjectArray = (section, arrayField, index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: prev[section][arrayField].map((item, i) =>
          i === index ? { ...item, [key]: value } : item
        ),
      },
    }));
  };

  const addObjectArrayItem = (section, arrayField, defaultObj) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: [...(prev[section][arrayField] || []), defaultObj],
      },
    }));
  };

  const removeObjectArrayItem = (section, arrayField, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayField]: prev[section][arrayField].filter((_, i) => i !== index),
      },
    }));
  };

  // ============ Validation ============
  const validate = () => {
    const requiredHeadings = [
      "purpose",
      "connections",
      "accessibility",
      "marketplace",
      "designers",
      "tailors",
      "vision",
      "experience",
      "people",
      "future",
    ];

    if (!formData.hero.title.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Hero title is required",
        icon: "warning",
        background: "#071236",
        color: "#FFF",
      });
      return false;
    }

    for (const key of requiredHeadings) {
      if (!formData[key].heading?.trim()) {
        Swal.fire({
          title: "Validation Error",
          text: `${key.charAt(0).toUpperCase() + key.slice(1)} heading is required`,
          icon: "warning",
          background: "#071236",
          color: "#FFF",
        });
        return false;
      }
    }
    return true;
  };

  // ============ Submit (Create / Update) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const token = getToken();

      const payload = { ...formData };

      let res;
      if (exists) {
        res = await axios.put(`${API}/about`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        res = await axios.post(`${API}/about`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (res.data.success) {
        setExists(true);
        Swal.fire({
          title: "Success!",
          text: `About page ${exists ? "updated" : "created"} successfully`,
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Save About error:", err);
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.message ||
          `Failed to ${exists ? "update" : "create"} About page`,
        icon: "error",
        background: "#071236",
        color: "#FFF",
        confirmButtonColor: "#C026D3",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============ Delete ============
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete About Page?",
      text: "Are you sure you want to delete the About page? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      background: "#071236",
      color: "#FFFFFF",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setDeleting(true);
      const token = getToken();
      const res = await axios.delete(`${API}/about`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setFormData(initialForm);
        setExists(false);
        Swal.fire({
          title: "Deleted!",
          text: "About page deleted successfully",
          icon: "success",
          background: "#071236",
          color: "#FFF",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error("Delete About error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to delete About page",
        icon: "error",
        background: "#071236",
        color: "#FFF",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={32} className="text-[#C026D3] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      {/* ============ Header ============ */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles size={28} className="text-[#C026D3]" />
            {sectionOnly
              ? SECTIONS.find((section) => section.key === sectionOnly)?.label || "About Page"
              : "About Page"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAbout}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {tabKeys.length > 0 && (
        <nav
          aria-label="About sections"
          className="flex w-full overflow-x-auto whitespace-nowrap rounded-2xl border border-white/10 bg-[#071236]/50"
        >
          {tabKeys.map((key, index) => {
            const tab = SECTIONS.find((section) => section.key === key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSection(key)}
                aria-pressed={activeSection === key}
                className={`min-w-max flex-1 px-4 py-4 text-sm font-medium transition-colors sm:px-5 ${
                  index > 0 ? "border-l border-white/10" : ""
                } ${
                  activeSection === key
                    ? "bg-[#C026D3]/20 text-white"
                    : "bg-transparent text-[#CBD5E1] hover:bg-white/5 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ============ Section Renderer ============ */}
        {SECTIONS.filter((section) => {
          if (tabKeys.length > 0) return tabKeys.includes(section.key) && section.key === activeSection;
          return !sectionOnly || section.key === sectionOnly;
        }).map((section) => (
          <SectionCard
            key={section.key}
            section={section}
            formData={formData}
            isExpanded={expandedSections[section.key]}
            onToggle={() => toggleSection(section.key)}
            updateField={updateField}
            updateStringArray={updateStringArray}
            addStringArrayItem={addStringArrayItem}
            removeStringArrayItem={removeStringArrayItem}
            updateObjectArray={updateObjectArray}
            addObjectArrayItem={addObjectArrayItem}
            removeObjectArrayItem={removeObjectArrayItem}
          />
        ))}

        {/* ============ Publish Toggle ============ */}
        {!sectionOnly && <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isPublished: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
            />
            <span className="text-white text-sm font-medium">
              Publish About Page (visible on public website)
            </span>
          </label>
        </div>}

        {/* ============ Actions ============ */}
        <div className="flex flex-wrap items-center justify-end gap-3 sticky bottom-0 bg-[#071236] py-4 border-t border-white/10">
          {exists && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-all disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete About
                </>
              )}
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {exists ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save size={16} />
                {exists ? "Update About" : "Create About"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================
// Section Card Component
// ============================================
const SectionCard = ({
  section,
  formData,
  isExpanded,
  onToggle,
  updateField,
  updateStringArray,
  addStringArrayItem,
  removeStringArrayItem,
  updateObjectArray,
  addObjectArrayItem,
  removeObjectArrayItem,
}) => {
  const Icon = section.icon;
  const data = formData[section.key];
  const key = section.key;

  return (
    <div className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-[#C026D3]" />
          <span className="text-base font-semibold text-white">
            {section.label}
          </span>
          {data.isActive ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
              Inactive
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="text-[#94A3B8]" />
        ) : (
          <ChevronDown size={18} className="text-[#94A3B8]" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-5 border-t border-white/10 space-y-4">
          {/* Render section-specific fields */}
          <SectionFields
            sectionKey={key}
            data={data}
            updateField={updateField}
            updateStringArray={updateStringArray}
            addStringArrayItem={addStringArrayItem}
            removeStringArrayItem={removeStringArrayItem}
            updateObjectArray={updateObjectArray}
            addObjectArrayItem={addObjectArrayItem}
            removeObjectArrayItem={removeObjectArrayItem}
          />

          {/* Active Toggle */}
          <div className="pt-3 border-t border-white/10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.isActive}
                onChange={(e) => updateField(key, "isActive", e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3] focus:ring-[#C026D3]"
              />
              <span className="text-sm text-white">
                Show this section on public page
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// Section Fields — Per Section Input Rendering
// ============================================
const SectionFields = ({
  sectionKey,
  data,
  updateField,
  updateStringArray,
  addStringArrayItem,
  removeStringArrayItem,
  updateObjectArray,
  addObjectArrayItem,
  removeObjectArrayItem,
}) => {
  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C026D3]/50 transition-all text-sm";

  const textareaClass = inputClass + " resize-none";

  // ============ HERO ============
  if (sectionKey === "hero") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateField("hero", "title", e.target.value)}
            placeholder="About Brubla"
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Subtitle
          </label>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => updateField("hero", "subtitle", e.target.value)}
            placeholder="Where fashion meets craftsmanship"
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Description
          </label>
          <textarea
            rows="2"
            value={data.description}
            onChange={(e) =>
              updateField("hero", "description", e.target.value)
            }
            placeholder="Short description..."
            className={textareaClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Additional Text
          </label>
          <input
            type="text"
            value={data.additionalText}
            onChange={(e) =>
              updateField("hero", "additionalText", e.target.value)
            }
            placeholder="Additional tagline..."
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  // ============ MARQUEE ============
  if (sectionKey === "marquee") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#94A3B8]">
            Marquee Items ({data.items?.length || 0})
          </label>
          <button
            type="button"
            onClick={() => addStringArrayItem("marquee", "items", "")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30 transition-all"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>
        <div className="space-y-2">
          {data.items?.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  updateStringArray("marquee", "items", idx, e.target.value)
                }
                placeholder="Item text"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeStringArrayItem("marquee", "items", idx)}
                className="px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============ PURPOSE ============
  if (sectionKey === "purpose") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) => updateField("purpose", "heading", e.target.value)}
            placeholder="Our Purpose"
            className={inputClass}
          />
        </div>

        {/* Paragraphs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Paragraphs ({data.paragraphs?.length || 0})
            </label>
            <button
              type="button"
              onClick={() =>
                addStringArrayItem("purpose", "paragraphs", "")
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          {data.paragraphs?.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                rows="2"
                value={p}
                onChange={(e) =>
                  updateStringArray(
                    "purpose",
                    "paragraphs",
                    idx,
                    e.target.value
                  )
                }
                placeholder="Paragraph text..."
                className={textareaClass}
              />
              <button
                type="button"
                onClick={() =>
                  removeStringArrayItem("purpose", "paragraphs", idx)
                }
                className="px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all shrink-0 self-start mt-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Highlight Text
          </label>
          <input
            type="text"
            value={data.highlightText}
            onChange={(e) =>
              updateField("purpose", "highlightText", e.target.value)
            }
            placeholder="Highlighted phrase..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Closing Text
          </label>
          <textarea
            rows="2"
            value={data.closingText}
            onChange={(e) =>
              updateField("purpose", "closingText", e.target.value)
            }
            placeholder="Closing statement..."
            className={textareaClass}
          />
        </div>
      </div>
    );
  }

  // ============ CONNECTIONS ============
  if (sectionKey === "connections") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) =>
              updateField("connections", "heading", e.target.value)
            }
            placeholder="One Platform. Three Connections."
            className={inputClass}
          />
        </div>

        {/* Connection Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Connections ({data.items?.length || 0})
            </label>
            <button
              type="button"
              onClick={() =>
                addObjectArrayItem("connections", "items", {
                  number: "",
                  title: "",
                  text: "",
                  isActive: true,
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Connection
            </button>
          </div>
          {data.items?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">
                  Connection #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    removeObjectArrayItem("connections", "items", idx)
                  }
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={item.number}
                  onChange={(e) =>
                    updateObjectArray(
                      "connections",
                      "items",
                      idx,
                      "number",
                      e.target.value
                    )
                  }
                  placeholder="01"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    updateObjectArray(
                      "connections",
                      "items",
                      idx,
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Customers"
                  className={`${inputClass} md:col-span-2`}
                />
              </div>
              <textarea
                rows="2"
                value={item.text}
                onChange={(e) =>
                  updateObjectArray(
                    "connections",
                    "items",
                    idx,
                    "text",
                    e.target.value
                  )
                }
                placeholder="Description..."
                className={textareaClass}
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) =>
                    updateObjectArray(
                      "connections",
                      "items",
                      idx,
                      "isActive",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3]"
                />
                <span className="text-xs text-white">Active</span>
              </label>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Bottom Text
          </label>
          <textarea
            rows="2"
            value={data.bottomText}
            onChange={(e) =>
              updateField("connections", "bottomText", e.target.value)
            }
            placeholder="Closing text..."
            className={textareaClass}
          />
        </div>
      </div>
    );
  }

  // ============ ACCESSIBILITY ============
  if (sectionKey === "accessibility") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) =>
              updateField("accessibility", "heading", e.target.value)
            }
            placeholder="Making Designer Fashion More Accessible"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Highlight Text
          </label>
          <input
            type="text"
            value={data.highlightText}
            onChange={(e) =>
              updateField("accessibility", "highlightText", e.target.value)
            }
            placeholder="Highlighted phrase..."
            className={inputClass}
          />
        </div>

        {/* Paragraphs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Paragraphs ({data.paragraphs?.length || 0})
            </label>
            <button
              type="button"
              onClick={() =>
                addStringArrayItem("accessibility", "paragraphs", "")
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          {data.paragraphs?.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                rows="2"
                value={p}
                onChange={(e) =>
                  updateStringArray(
                    "accessibility",
                    "paragraphs",
                    idx,
                    e.target.value
                  )
                }
                placeholder="Paragraph text..."
                className={textareaClass}
              />
              <button
                type="button"
                onClick={() =>
                  removeStringArrayItem("accessibility", "paragraphs", idx)
                }
                className="px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 shrink-0 self-start mt-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============ MARKETPLACE ============
  if (sectionKey === "marketplace") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) =>
              updateField("marketplace", "heading", e.target.value)
            }
            placeholder="More Than A Fashion Marketplace"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Description
          </label>
          <textarea
            rows="2"
            value={data.description}
            onChange={(e) =>
              updateField("marketplace", "description", e.target.value)
            }
            placeholder="Short description..."
            className={textareaClass}
          />
        </div>

        {/* Connections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Connections ({data.connections?.length || 0})
            </label>
            <button
              type="button"
              onClick={() =>
                addObjectArrayItem("marketplace", "connections", {
                  title: "",
                  text: "",
                  isActive: true,
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          {data.connections?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">
                  Item #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    removeObjectArrayItem("marketplace", "connections", idx)
                  }
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  updateObjectArray(
                    "marketplace",
                    "connections",
                    idx,
                    "title",
                    e.target.value
                  )
                }
                placeholder="Title"
                className={inputClass}
              />
              <textarea
                rows="2"
                value={item.text}
                onChange={(e) =>
                  updateObjectArray(
                    "marketplace",
                    "connections",
                    idx,
                    "text",
                    e.target.value
                  )
                }
                placeholder="Text..."
                className={textareaClass}
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) =>
                    updateObjectArray(
                      "marketplace",
                      "connections",
                      idx,
                      "isActive",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3]"
                />
                <span className="text-xs text-white">Active</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============ DESIGNERS ============
  if (sectionKey === "designers") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) =>
              updateField("designers", "heading", e.target.value)
            }
            placeholder="Empowering Designers"
            className={inputClass}
          />
        </div>

        {/* Paragraphs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Paragraphs ({data.paragraphs?.length || 0})
            </label>
            <button
              type="button"
              onClick={() =>
                addStringArrayItem("designers", "paragraphs", "")
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          {data.paragraphs?.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                rows="2"
                value={p}
                onChange={(e) =>
                  updateStringArray("designers", "paragraphs", idx, e.target.value)
                }
                placeholder="Paragraph..."
                className={textareaClass}
              />
              <button
                type="button"
                onClick={() =>
                  removeStringArrayItem("designers", "paragraphs", idx)
                }
                className="px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 shrink-0 self-start mt-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Highlight Text
          </label>
          <input
            type="text"
            value={data.highlightText}
            onChange={(e) =>
              updateField("designers", "highlightText", e.target.value)
            }
            placeholder="Highlighted phrase..."
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  // ============ TAILORS ============
  if (sectionKey === "tailors") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) =>
              updateField("tailors", "heading", e.target.value)
            }
            placeholder="Connecting Customers with Local Tailors"
            className={inputClass}
          />
        </div>

        {/* Paragraphs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Paragraphs ({data.paragraphs?.length || 0})
            </label>
            <button
              type="button"
              onClick={() => addStringArrayItem("tailors", "paragraphs", "")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          {data.paragraphs?.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                rows="2"
                value={p}
                onChange={(e) =>
                  updateStringArray("tailors", "paragraphs", idx, e.target.value)
                }
                placeholder="Paragraph..."
                className={textareaClass}
              />
              <button
                type="button"
                onClick={() =>
                  removeStringArrayItem("tailors", "paragraphs", idx)
                }
                className="px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 shrink-0 self-start mt-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Journey */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Journey Steps ({data.journey?.length || 0})
            </label>
            <button
              type="button"
              onClick={() => addStringArrayItem("tailors", "journey", "")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Step
            </button>
          </div>
          {data.journey?.map((step, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={step}
                onChange={(e) =>
                  updateStringArray("tailors", "journey", idx, e.target.value)
                }
                placeholder="e.g., Discover"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeStringArrayItem("tailors", "journey", idx)}
                className="px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============ VISION ============
  if (sectionKey === "vision") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) => updateField("vision", "heading", e.target.value)}
            placeholder="Our Vision"
            className={inputClass}
          />
        </div>

        {/* Paragraphs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Paragraphs ({data.paragraphs?.length || 0})
            </label>
            <button
              type="button"
              onClick={() => addStringArrayItem("vision", "paragraphs", "")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          {data.paragraphs?.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                rows="2"
                value={p}
                onChange={(e) =>
                  updateStringArray("vision", "paragraphs", idx, e.target.value)
                }
                placeholder="Paragraph..."
                className={textareaClass}
              />
              <button
                type="button"
                onClick={() =>
                  removeStringArrayItem("vision", "paragraphs", idx)
                }
                className="px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 shrink-0 self-start mt-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Highlight Text
          </label>
          <input
            type="text"
            value={data.highlightText}
            onChange={(e) =>
              updateField("vision", "highlightText", e.target.value)
            }
            placeholder="Highlighted phrase..."
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  // ============ EXPERIENCE ============
  if (sectionKey === "experience") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) =>
              updateField("experience", "heading", e.target.value)
            }
            placeholder="The Brubla Experience"
            className={inputClass}
          />
        </div>

        {/* Experience Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Items ({data.items?.length || 0})
            </label>
            <button
              type="button"
              onClick={() =>
                addObjectArrayItem("experience", "items", {
                  title: "",
                  text: "",
                  isActive: true,
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Experience
            </button>
          </div>
          {data.items?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">
                  Item #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    removeObjectArrayItem("experience", "items", idx)
                  }
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  updateObjectArray(
                    "experience",
                    "items",
                    idx,
                    "title",
                    e.target.value
                  )
                }
                placeholder="Title"
                className={inputClass}
              />
              <textarea
                rows="2"
                value={item.text}
                onChange={(e) =>
                  updateObjectArray(
                    "experience",
                    "items",
                    idx,
                    "text",
                    e.target.value
                  )
                }
                placeholder="Text..."
                className={textareaClass}
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) =>
                    updateObjectArray(
                      "experience",
                      "items",
                      idx,
                      "isActive",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3]"
                />
                <span className="text-xs text-white">Active</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============ PEOPLE ============
  if (sectionKey === "people") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) => updateField("people", "heading", e.target.value)}
            placeholder="Built Around People"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Description
          </label>
          <textarea
            rows="2"
            value={data.description}
            onChange={(e) =>
              updateField("people", "description", e.target.value)
            }
            placeholder="Short description..."
            className={textareaClass}
          />
        </div>

        {/* People Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              People ({data.items?.length || 0})
            </label>
            <button
              type="button"
              onClick={() =>
                addObjectArrayItem("people", "items", {
                  role: "",
                  line: "",
                  isActive: true,
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Person
            </button>
          </div>
          {data.items?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">
                  Person #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeObjectArrayItem("people", "items", idx)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                value={item.role}
                onChange={(e) =>
                  updateObjectArray(
                    "people",
                    "items",
                    idx,
                    "role",
                    e.target.value
                  )
                }
                placeholder="e.g., The Designer"
                className={inputClass}
              />
              <input
                type="text"
                value={item.line}
                onChange={(e) =>
                  updateObjectArray(
                    "people",
                    "items",
                    idx,
                    "line",
                    e.target.value
                  )
                }
                placeholder="e.g., brings the creativity."
                className={inputClass}
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) =>
                    updateObjectArray(
                      "people",
                      "items",
                      idx,
                      "isActive",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#C026D3]"
                />
                <span className="text-xs text-white">Active</span>
              </label>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Bottom Text
          </label>
          <textarea
            rows="2"
            value={data.bottomText}
            onChange={(e) =>
              updateField("people", "bottomText", e.target.value)
            }
            placeholder="Closing text..."
            className={textareaClass}
          />
        </div>
      </div>
    );
  }

  // ============ FUTURE ============
  if (sectionKey === "future") {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Heading *
          </label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) => updateField("future", "heading", e.target.value)}
            placeholder="The Future of Personal Fashion"
            className={inputClass}
          />
        </div>

        {/* Paragraphs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#94A3B8]">
              Paragraphs ({data.paragraphs?.length || 0})
            </label>
            <button
              type="button"
              onClick={() => addStringArrayItem("future", "paragraphs", "")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C026D3]/20 text-[#C026D3] text-xs font-semibold hover:bg-[#C026D3]/30"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>
          {data.paragraphs?.map((p, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                rows="2"
                value={p}
                onChange={(e) =>
                  updateStringArray("future", "paragraphs", idx, e.target.value)
                }
                placeholder="Paragraph..."
                className={textareaClass}
              />
              <button
                type="button"
                onClick={() =>
                  removeStringArrayItem("future", "paragraphs", idx)
                }
                className="px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 shrink-0 self-start mt-2"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateField("future", "title", e.target.value)}
            placeholder="Title..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
            Subtitle
          </label>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => updateField("future", "subtitle", e.target.value)}
            placeholder="Subtitle..."
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default AboutManagement;
