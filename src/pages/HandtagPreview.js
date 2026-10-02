import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react";

const API = "http://31.97.228.17:4077/api/admin";

const HandtagPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const [handtag, setHandtag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const getToken = () => sessionStorage.getItem("adminToken");

  useEffect(() => {
    const fetchHandtag = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${API}/handtags/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setHandtag(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHandtag();
  }, [id]);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      setGenerating(true);
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [66, 105], // 2.5" x 4"
      });
      pdf.addImage(imgData, "PNG", 0, 0, 66, 105);
      pdf.save(`handtag-${handtag?.productName}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow || !previewRef.current) return;
    printWindow.document.write(`
      <html>
        <head><title>Print Handtag</title></head>
        <body style="margin:0;display:flex;justify-content:center;align-items:center;">
          ${previewRef.current.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 size={32} className="text-[#C026D3] animate-spin" />
      </div>
    );
  }

  if (!handtag) {
    return (
      <div className="text-center py-20">
        <p className="text-[#94A3B8]">Handtag not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/handtags")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Handtag Preview</h1>
            <p className="text-[#94A3B8] text-sm mt-1">{handtag.productName}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold"
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={handleDownload}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C026D3] to-[#2563EB] text-white font-semibold disabled:opacity-50"
          >
            {generating ? (
              <><Loader2 size={16} className="animate-spin" /> Generating...</>
            ) : (
              <><Download size={16} /> Download PDF</>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex justify-center py-10">
        <div
          ref={previewRef}
          style={{
            width: "250px",
            height: "400px",
            background: "#fff",
            border: "1px solid #e5e7eb",
            padding: "12px",
            fontFamily: "Arial",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {handtag.showBrand && handtag.brand && (
            <div style={{ textAlign: "center", borderBottom: "1px solid #000", paddingBottom: "4px" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>{handtag.brand.toUpperCase()}</div>
            </div>
          )}
          <div style={{ textAlign: "center", fontSize: "12px", fontWeight: "600" }}>
            {handtag.productName}
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", fontSize: "10px" }}>
            {handtag.showSize && <div>Size: {handtag.size}</div>}
            {handtag.showColor && <div>Color: {handtag.color}</div>}
          </div>
          <div style={{ textAlign: "center" }}>
            {handtag.showMRP && (
              <div style={{ fontSize: "11px", textDecoration: "line-through", color: "#666" }}>
                MRP: ₹{handtag.mrp}
              </div>
            )}
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>₹{handtag.sellingPrice}</div>
            {handtag.showDiscount && handtag.discount > 0 && (
              <div style={{ fontSize: "11px", color: "#C026D3", fontWeight: "bold" }}>
                ({handtag.discount}% OFF)
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", fontSize: "9px", borderTop: "1px solid #ccc", paddingTop: "6px" }}>
            {handtag.showSKU && <div>SKU: {handtag.sku}</div>}
            <div style={{ fontSize: "8px", color: "#999" }}>Made in India</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandtagPreview;