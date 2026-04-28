import { formatPercent, formatPrice } from "../utils/format";

function StatCard({ label, value, tone = "neutral" }) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-red-600"
        : "text-slate-900";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${toneClass}`}>{value}</p>
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
