import { AlertCircle } from "lucide-react";

const ModuleUnavailable = ({ title, description }) => (
  <div className="max-w-3xl rounded-2xl border border-white/10 bg-[#071236]/50 p-8 text-center">
    <AlertCircle size={42} className="mx-auto mb-4 text-[#C026D3]" />
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    <p className="mt-3 text-[#94A3B8]">{description || "This screen is ready in navigation, but the current admin API does not expose the data or mutation endpoint required to display and save it."}</p>
    <p className="mt-4 text-sm text-[#94A3B8]">Connect the matching authenticated admin endpoint and response fields to enable this module. No placeholder records are shown.</p>
  </div>
);

export default ModuleUnavailable;
