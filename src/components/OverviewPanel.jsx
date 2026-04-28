import { formatTime } from "../utils/format";

export default function OverviewPanel({ ticker, watchlistSize, lastUpdated }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Market Overview</h2>
      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <p>Tracking: {ticker}</p>
        <p>Watchlist size: {watchlistSize}</p>
        <p>Feed mode: live market snapshot</p>
        <p>Last update: {formatTime(lastUpdated)}</p>
      </div>
    </section>
  );
}
