import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Plus, Trash2 } from "lucide-react";

const StockAdjustment = () => {
  const navigate = useNavigate();

  const [adjustmentId] = useState("ADJ-2026-0041");
  const [reason, setReason] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("5");
  const [notes, setNotes] = useState("");

  // Adjustment items state
  const [items, setItems] = useState([
    { id: 1, name: "Cotton Shirt (M)", sku: "CSH-001-M", currentStock: 45, type: "Add", qty: 15 },
    { id: 2, name: "Linen Shirt (L)", sku: "LSH-004-L", currentStock: 4, type: "Remove", qty: 2 },
    { id: 3, name: "Printed Shirt (S)", sku: "PSH-012-S", currentStock: 0, type: "Add", qty: 20 },
  ]);

  // Update item field
  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Add new row
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: "", sku: "", currentStock: 0, type: "Add", qty: 0 },
    ]);
  };

  // Remove row
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate new stock
  const getNewStock = (item) => {
    const qty = parseInt(item.qty) || 0;
    return item.type === "Add"
      ? item.currentStock + qty
      : item.currentStock - qty;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Apply Adjustment:", { adjustmentId, reason, items, lowStockAlert, notes });
    navigate("/dashboard/inventory");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10 text-white">
      <h1 className="text-2xl md:text-3xl font-bold">Stock Adjustment</h1>

      <form onSubmit={handleSubmit} className="bg-[#071236]/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-6">

        {/* Adjustment ID & Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Adjustment Reference / ID</label>
            <input
              type="text"
              value={adjustmentId}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] font-mono focus:outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Adjustment Reason</label>
            <div className="relative">
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
              >
                <option value="">Select Reason</option>
                <option>New Purchase / Restock</option>
                <option>Damaged / Expired</option>
                <option>Inventory Count Sync</option>
                <option>Customer Return</option>
                <option>Promotional Sample</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Select Items Section */}
        <div className="pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider mb-4">
            Select Items to Adjust
          </h2>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
            <input
              type="text"
              placeholder="Search by Product Name or SKU"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
            />
          </div>

          {/* Items Table */}
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    {["Product Name", "Current Stock", "Adjustment Type", "Quantity", "New Stock", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-white">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-[#94A3B8]">{item.currentStock}</td>
                      <td className="px-4 py-3">
                        <select
                          value={item.type}
                          onChange={(e) => updateItem(item.id, "type", e.target.value)}
                          className="appearance-none px-3 py-1.5 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50 cursor-pointer"
                        >
                          <option value="Add">Add (+)</option>
                          <option value="Remove">Remove (-)</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                          className="w-20 px-3 py-1.5 rounded-lg bg-[#071236]/50 border border-white/10 text-white text-sm focus:outline-none focus:border-[#C026D3]/50"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-emerald-400">
                        {getNewStock(item)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all"
          >
            <Plus size={16} /> Add Another Item
          </button>
        </div>

        {/* Threshold & Alert Settings */}
        <div className="pt-4 border-t border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-[#C026D3] uppercase tracking-wider">
            Threshold & Alert Settings (Optional)
          </h2>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Low Stock Alert Level</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={lowStockAlert}
                onChange={(e) => setLowStockAlert(e.target.value)}
                className="w-32 px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50"
              />
              <span className="text-sm text-[#94A3B8]">units</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Notes / Remarks</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Batch restock from Supplier shipment invoice #94021."
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl bg-[#071236]/50 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Adjusted By</label>
            <input
              type="text"
              value="Admin User"
              readOnly
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold hover:shadow-lg transition-all"
          >
            Apply Adjustment
          </button>
        </div>

      </form>
    </div>
  );
};

export default StockAdjustment;