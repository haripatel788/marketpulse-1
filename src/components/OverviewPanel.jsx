import { formatTime } from "../utils/format";

export default function OverviewPanel({ ticker, watchlistSize, lastUpdated }) {
  return (
    <section className="rounded-xl border border-[#2A2F39] bg-[#0F131A] p-4">
      <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-[#95A0B4]">Desk Status</h2>
      <div className="mt-3 space-y-2 font-mono text-xs text-[#B7C3D8]">
        <p>ACTIVE SYMBOL // {ticker}</p>
        <p>WATCHLIST COUNT // {watchlistSize}</p>
        <p>FEED MODE // LIVE SNAPSHOT</p>
        <p>LAST HEARTBEAT // {formatTime(lastUpdated)}</p>
      </div>
    </section>
  );
}
