import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, X } from "lucide-react";

const DeleteCategoryModal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [option, setOption] = useState("disable");

  // Mock data
  const categoryInfo = {
    name: "Men's Fashion",
    subcategories: 6,
    products: 124,
  };

  const handleConfirm = () => {
    console.log("Delete/Disable category", { id, option });
    navigate("/dashboard/categories");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#071236] border border-white/10 rounded-2xl max-w-md w-full p-6 relative">

        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-500/20 border border-red-500/30">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-white text-center mb-2">
          Delete "{categoryInfo.name}"?
        </h2>

        {/* Details */}
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <p className="text-sm text-[#94A3B8] mb-2">This category contains:</p>
          <ul className="space-y-1 text-sm text-white">
            <li>• {categoryInfo.subcategories} subcategories</li>
            <li>• {categoryInfo.products} products</li>
          </ul>
        </div>

        {/* What would you like to do? */}
        <p className="text-sm text-[#94A3B8] mb-3">What would you like to do?</p>

        <div className="space-y-2 mb-6">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
            <input
              type="radio"
              name="deleteOption"
              value="move"
              checked={option === "move"}
              onChange={(e) => setOption(e.target.value)}
              className="w-4 h-4 text-[#C026D3] bg-white/5 border-white/10 focus:ring-[#C026D3]"
            />
            <span className="text-sm text-white">Move products to another category</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
            <input
              type="radio"
              name="deleteOption"
              value="disable"
              checked={option === "disable"}
              onChange={(e) => setOption(e.target.value)}
              className="w-4 h-4 text-[#C026D3] bg-white/5 border-white/10 focus:ring-[#C026D3]"
            />
            <span className="text-sm text-white">Disable category instead</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
          >
            {option === "disable" ? "Disable Category" : "Delete Category"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteCategoryModal;