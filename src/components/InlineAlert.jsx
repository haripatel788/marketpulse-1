export default function InlineAlert({ message }) {
  if (!message) return null;

  return (
    <div className="rounded border border-[#3E4A5F] bg-[#111823] px-4 py-3 font-mono text-xs uppercase tracking-wide text-[#F9A826]">
      {message}
    </div>
  );
}
