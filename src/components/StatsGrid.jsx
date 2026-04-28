import { formatPercent, formatPrice } from "../utils/format";

function StatCard({ label, value, tone = "neutral" }) {
  const toneClass =
    tone === "positive"
      ? "text-[#39D98A]"
      : tone === "negative"
        ? "text-[#FF5D5D]"
        : "text-[#E8EDF8]";

  return (
    <div className="rounded border border-[#2A2F39] bg-[#0F131A] p-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#73819A]">{label}</p>
      <p className={`mt-1 font-mono text-2xl ${toneClass}`}>{value}</p>
    </div>
  );
}

export default function StatsGrid({ ticker, quote }) {
  const changeTone =
    typeof quote?.dp === "number"
      ? quote.dp >= 0
        ? "positive"
        : "negative"
      : "neutral";

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Ticker" value={ticker} />
      <StatCard label="Price" value={formatPrice(quote?.c)} />
      <StatCard label="Change" value={formatPercent(quote?.dp)} tone={changeTone} />
      <StatCard label="High" value={formatPrice(quote?.h)} tone="positive" />
      <StatCard label="Low" value={formatPrice(quote?.l)} tone="negative" />
    </section>
  );
}
