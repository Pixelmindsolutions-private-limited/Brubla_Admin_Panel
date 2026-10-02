import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Ruler, Loader2 } from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const SizeChartPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sizeChart, setSizeChart] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => sessionStorage.getItem("adminToken");

  useEffect(() => {
    const fetchSizeChart = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API}/size-charts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setSizeChart(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSizeChart();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={32} className="text-[#C026D3] animate-spin" />
      </div>
    );
  }

  if (!sizeChart) {
    return (
      <div className="text-center py-20">
        <p className="text-[#94A3B8]">Size chart not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/size-charts")}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ruler size={22} className="text-[#C026D3]" />
            Size Chart Preview
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            {sizeChart.productName} {sizeChart.category && `• ${sizeChart.category}`}
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white text-black rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            {sizeChart.productName} — Size Chart
          </h2>
          {sizeChart.category && (
            <p className="text-sm text-gray-600 mt-1">Category: {sizeChart.category}</p>
          )}
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-bold">
                  Size
                </th>
                {sizeChart.measurements?.map((m) => (
                  <th key={m} className="border border-gray-300 px-4 py-3 text-left text-sm font-bold">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeChart.sizes?.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-4 py-3 text-sm font-semibold">
                    {row.size}
                  </td>
                  {sizeChart.measurements?.map((m) => (
                    <td key={m} className="border border-gray-300 px-4 py-3 text-sm">
                      {row.values?.[m] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sizeChart.notes && (
          <div className="px-6 pb-6">
            <p className="text-sm text-gray-600 italic">
              <strong>Note:</strong> {sizeChart.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeChartPreview;