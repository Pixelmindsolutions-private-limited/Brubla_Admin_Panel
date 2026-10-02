import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ArrowLeft, Save } from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const EditDesigner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    brandName: "",
    about: "",
  });

  useEffect(() => {
    const fetchDesigner = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");

        // ✅ FIX: GET request (not PUT), no body
        const response = await axios.get(`${API}/designers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const designer =
          response.data.data?.designer || response.data.designer;

        if (!response.data.success || !designer) {
          throw new Error("Designer not found");
        }

        setForm({
          name: designer.name || "",
          email: designer.email || "",
          mobile: designer.mobile || "",
          brandName: designer.brandName || "",
          about: designer.about || "",
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch designer",
          icon: "error",
          background: "#071236",
          color: "#FFFFFF",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDesigner();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const token = sessionStorage.getItem("adminToken");

      // ✅ PUT with form data (correct)
      await axios.put(`${API}/designers/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Swal.fire({
        title: "Updated!",
        text: "Designer details updated successfully",
        icon: "success",
        background: "#071236",
        color: "#FFFFFF",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(`/dashboard/designers/${id}`);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update designer",
        icon: "error",
        background: "#071236",
        color: "#FFFFFF",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-[#94A3B8]">
        Loading designer...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 text-white">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-white/5 p-2 hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit Designer</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Update designer information
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-[#071236]/50 p-6"
      >
        {[
          ["name", "Name", "text"],
          ["email", "Email", "email"],
          ["mobile", "Mobile", "text"],
          ["brandName", "Brand Name", "text"],
        ].map(([field, label, type]) => (
          <label key={field} className="block text-sm text-[#94A3B8]">
            {label}
            <input
              required={field !== "brandName"}
              type={type}
              value={form[field]}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [field]: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#071236] px-4 py-3 text-white outline-none focus:border-[#C026D3]/50"
            />
          </label>
        ))}

        <label className="block text-sm text-[#94A3B8]">
          About
          <textarea
            rows={4}
            value={form.about}
            onChange={(event) =>
              setForm((current) => ({ ...current, about: event.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#071236] px-4 py-3 text-white outline-none focus:border-[#C026D3]/50"
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl bg-white/5 px-5 py-2.5 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] px-5 py-2.5 font-semibold disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDesigner;