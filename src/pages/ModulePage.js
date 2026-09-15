const ModulePage = ({ title, description }) => (
  <section className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-[#071236]/60 p-8">
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    <p className="mt-2 text-sm text-[#94A3B8]">
      {description || `${title} management is ready to be connected to its API.`}
    </p>
  </section>
);

export default ModulePage;