import { AlertTriangle, X } from "lucide-react";

const RemoveProductModal = ({ product, collectionName, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#071236] border border-white/10 rounded-2xl max-w-md w-full p-6 relative">

        {/* Close */}
        <button
          onClick={onCancel}
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
        <h2 className="text-lg font-bold text-white text-center mb-3">
          Remove Product
        </h2>

        {/* Message */}
        <p className="text-sm text-[#94A3B8] text-center mb-2">
          Are you sure you want to remove
        </p>
        <p className="text-sm text-white font-semibold text-center mb-4">
          "{product?.name}"
        </p>
        <p className="text-sm text-[#94A3B8] text-center mb-4">
          from the <span className="text-[#C026D3]">"{collectionName}"</span> collection?
        </p>

        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-6">
          <p className="text-xs text-yellow-400 text-center">
            ⚠️ The product will NOT be deleted from the website. It will only be
            removed from this collection.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveProductModal;